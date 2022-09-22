import { all, call, put, select, take, takeLatest } from "redux-saga/effects";
import {
  executePluginActionError,
  executePluginActionRequest,
  executePluginActionSuccess,
  runAction,
  updateAction,
} from "actions/pluginActionActions";
import {
  ApplicationPayload,
  ReduxAction,
  ReduxActionErrorTypes,
  ReduxActionTypes,
} from "@appsmith/constants/ReduxActionConstants";
import ActionAPI, {
  ActionExecutionResponse,
  ActionResponse,
  ExecuteActionRequest,
  PaginationField,
} from "api/ActionAPI";
import {
  getAction,
  getPlugin,
  isActionDirty,
  isActionSaving,
  getJSCollection,
} from "selectors/entitiesSelector";
import {
  getAppMode,
  getCurrentApplication,
} from "selectors/applicationSelectors";
import _, { get, isString, set } from "lodash";
import AppsmithConsole from "utils/AppsmithConsole";
import { ENTITY_TYPE, PLATFORM_ERROR } from "entities/AppsmithConsole";
import { validateResponse } from "sagas/ErrorSagas";
import { Action, PluginType } from "entities/Action";
import LOG_TYPE from "entities/AppsmithConsole/logtype";
import {
  createMessage,
  ERROR_ACTION_EXECUTE_FAIL,
  ERROR_FAIL_ON_PAGE_LOAD_ACTIONS,
  ERROR_PLUGIN_ACTION_EXECUTE,
} from "@appsmith/constants/messages";
import {
  EventType,
  PageAction,
  RESP_HEADER_DATATYPE,
} from "constants/AppsmithActionConstants/ActionConstants";
import {
  getCurrentPageId,
  getIsSavingEntity,
  getLayoutOnLoadActions,
} from "selectors/editorSelectors";
import * as log from "loglevel";
import { AppState } from "reducers";
import { DEFAULT_EXECUTE_ACTION_TIMEOUT_MS } from "@appsmith/constants/ApiConstants";
import { evaluateActionBindings } from "sagas/EvaluationsSaga";
import { getType, Types } from "utils/TypeHelpers";
import {
  ActionTriggerType,
  RunPluginActionDescription,
} from "entities/DataTree/actionTriggers";
import { APP_MODE } from "entities/App";
import { hideDebuggerErrors } from "actions/debuggerActions";
import {
  ActionValidationError,
  getErrorAsString,
  PluginActionExecutionError,
  PluginTriggerFailureError,
  UserCancelledActionExecutionError,
} from "sagas/ActionExecution/errorUtils";
import { JSCollection } from "entities/JSCollection";
import {
  executeAppAction,
  TriggerMeta,
} from "sagas/ActionExecution/ActionExecutionSagas";
import { requestModalConfirmationSaga } from "sagas/UtilSagas";
import { ModalType } from "reducers/uiReducers/modalActionReducer";
import { handleExecuteJSFunctionSaga } from "sagas/JSPaneSagas";
import { Plugin } from "api/PluginApi";
import { setDefaultActionDisplayFormat, FormData, FormDataProps } from "./PluginActionSagaUtils";
import Taro from "@tarojs/taro";

enum ActionResponseDataTypes {
  BINARY = "BINARY",
}

const EMPTY_RESPONSE: ActionResponse = {
  statusCode: "",
  duration: "",
  body: {},
  headers: {},
  request: {
    headers: {},
    body: {},
    httpMethod: "",
    url: "",
  },
  size: "",
  responseDisplayFormat: "",
  dataTypes: [],
};

export const getActionTimeout = (
  state: AppState,
  actionId: string
): number | undefined => {
  const action = _.find(
    state.entities.actions,
    (a) => a.config.id === actionId
  );
  if (action) {
    const timeout = _.get(
      action,
      "config.actionConfiguration.timeoutInMillisecond",
      DEFAULT_EXECUTE_ACTION_TIMEOUT_MS
    );
    if (timeout) {
      // Extra timeout padding to account for network calls
      return timeout + 5000;
    }
    return undefined;
  }
  return undefined;
};

const createActionExecutionResponse = (
  response: ActionExecutionResponse
): ActionResponse => {
  const payload = response.data;
  if (payload.statusCode === "200 OK" && payload.hasOwnProperty("headers")) {
    const respHeaders = payload.headers;
    if (
      respHeaders.hasOwnProperty(RESP_HEADER_DATATYPE) &&
      respHeaders[RESP_HEADER_DATATYPE].length > 0 &&
      respHeaders[RESP_HEADER_DATATYPE][0] === ActionResponseDataTypes.BINARY &&
      getType(payload.body) === Types.STRING
    ) {
      // Decoding from base64 to handle the binary files because direct
      // conversion of binary files to string causes corruption in the final output
      // this is to only handle the download of binary files
      payload.body = atob(payload.body as string);
    }
  }
  return {
    ...payload,
    ...response.clientMeta,
  };
};
const isErrorResponse = (response: ActionExecutionResponse) => {
  return !response.data.isExecutionSuccess;
};

/**
 * Api1
 * URL: https://example.com/{{Text1.text}}
 * Body: {
 *     "name": "{{this.params.name}}",
 *     "age": {{this.params.age}},
 *     "gender": {{Dropdown1.selectedOptionValue}}
 * }
 *
 * If you call
 * Api1.run(undefined, undefined, { name: "Hetu", age: Input1.text });
 *
 * executionParams is { name: "Hetu", age: Input1.text }
 * bindings is [
 *   "Text1.text",
 *   "Dropdown1.selectedOptionValue",
 *   "this.params.name",
 *   "this.params.age",
 * ]
 *
 * Return will be [
 *   { key: "Text1.text", value: "updateUser" },
 *   { key: "Dropdown1.selectedOptionValue", value: "M" },
 *   { key: "this.params.name", value: "Hetu" },
 *   { key: "this.params.age", value: 26 },
 * ]
 * @param bindings
 * @param executionParams
 */
function* evaluateActionParams(
  bindings: string[] | undefined,
  formData: FormDataProps,
  executionParams?: Record<string, any> | string
) {
  if (_.isNil(bindings) || bindings.length === 0) return [];

  // Evaluated all bindings of the actions. Pass executionParams if any
  const values: any = yield call(
    evaluateActionBindings,
    bindings,
    executionParams
  );

  // Add keys values to formData for the multipart submission
  for (let i = 0; i < bindings.length; i++) {
    const key = bindings[i];
    let value = values[i];
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    value = Buffer.from(value + '');
    formData.appendFile(encodeURIComponent(key), value, "text/plain");
  }
}

export default function* executePluginActionTriggerSaga(
  pluginAction: RunPluginActionDescription["payload"],
  eventType: EventType,
  triggerMeta: TriggerMeta
) {
  const { actionId, onError, onSuccess, params } = pluginAction;
  if (getType(params) !== Types.OBJECT) {
    throw new ActionValidationError(
      ActionTriggerType.RUN_PLUGIN_ACTION,
      "params",
      Types.OBJECT,
      getType(params)
    );
  }

  const action: Action = yield select(getAction, actionId);
  const pagination =
    eventType === EventType.ON_NEXT_PAGE
      ? "NEXT"
      : eventType === EventType.ON_PREV_PAGE
      ? "PREV"
      : undefined;
  AppsmithConsole.info({
    text: "Execution started from widget request",
    source: {
      type: ENTITY_TYPE.ACTION,
      name: action.name,
      id: actionId,
    },
    state: action.actionConfiguration,
  });
  const executePluginActionResponse: ExecutePluginActionResponse = yield call(
    executePluginActionSaga,
    action.id,
    pagination,
    params
  );
  const { isError, payload } = executePluginActionResponse;

  if (isError) {
    AppsmithConsole.addError({
      id: actionId,
      logType: LOG_TYPE.ACTION_EXECUTION_ERROR,
      text: `Execution failed with status ${payload.statusCode}`,
      source: {
        type: ENTITY_TYPE.ACTION,
        name: action.name,
        id: actionId,
      },
      state: payload.request,
      messages: [
        {
          // Need to stringify cause this gets rendered directly
          // and rendering objects can crash the app
          message: !isString(payload.body)
            ? JSON.stringify(payload.body)
            : payload.body,
          type: PLATFORM_ERROR.PLUGIN_EXECUTION,
          subType: payload.errorType,
        },
      ],
    });
    if (onError) {
      yield call(executeAppAction, {
        event: { type: eventType },
        dynamicString: onError,
        callbackData: [payload.body, params],
        ...triggerMeta,
      });
    } else {
      throw new PluginTriggerFailureError(
        createMessage(ERROR_PLUGIN_ACTION_EXECUTE, action.name),
        [payload.body, params]
      );
    }
  } else {
    AppsmithConsole.info({
      logType: LOG_TYPE.ACTION_EXECUTION_SUCCESS,
      text: "Executed successfully from widget request",
      timeTaken: payload.duration,
      source: {
        type: ENTITY_TYPE.ACTION,
        name: action.name,
        id: actionId,
      },
      state: {
        response: payload.body,
        request: payload.request,
      },
    });
    if (onSuccess) {
      yield call(executeAppAction, {
        event: { type: eventType },
        dynamicString: onSuccess,
        callbackData: [payload.body, params],
        ...triggerMeta,
      });
    }
  }
  return [payload.body, params];
}

function* runActionSaga(
  reduxAction: ReduxAction<{
    id: string;
    paginationField: PaginationField;
  }>
) {
  const actionId = reduxAction.payload.id;
  const isSaving = yield select(isActionSaving(actionId));
  const isDirty = yield select(isActionDirty(actionId));
  const isSavingEntity = yield select(getIsSavingEntity);
  if (isSaving || isDirty || isSavingEntity) {
    if (isDirty && !isSaving) {
      yield put(updateAction({ id: actionId }));
    }
    yield take(ReduxActionTypes.UPDATE_ACTION_SUCCESS);
  }
  const actionObject = yield select(getAction, actionId);
  const datasourceUrl = get(
    actionObject,
    "datasource.datasourceConfiguration.url"
  );
  AppsmithConsole.info({
    text: "Execution started from user request",
    source: {
      type: ENTITY_TYPE.ACTION,
      name: actionObject.name,
      id: actionId,
    },
    state: {
      ...actionObject.actionConfiguration,
      ...(datasourceUrl && {
        url: datasourceUrl,
      }),
    },
  });

  const { id, paginationField } = reduxAction.payload;

  let payload = EMPTY_RESPONSE;
  let isError = true;
  let error = "";
  try {
    const executePluginActionResponse: ExecutePluginActionResponse = yield call(
      executePluginActionSaga,
      id,
      paginationField
    );
    payload = executePluginActionResponse.payload;
    isError = executePluginActionResponse.isError;
  } catch (e) {
    // When running from the pane, we just want to end the saga if the user has
    // cancelled the call. No need to log any errors
    if (e instanceof UserCancelledActionExecutionError) {
      return;
    }
    log.error(e);
    error = e.message;
  }

  // Error should be readable error if present.
  // Otherwise, payload's body.
  // Default to "An unexpected error occurred" if none is available

  const readableError = payload.readableError
    ? getErrorAsString(payload.readableError)
    : undefined;

  const payloadBodyError = payload.body
    ? getErrorAsString(payload.body)
    : undefined;

  const defaultError = "An unexpected error occurred";

  if (isError) {
    error = readableError || payloadBodyError || defaultError;

    // In case of debugger, both the current error message
    // and the readableError needs to be present,
    // since the readableError may be malformed for certain errors.

    const appsmithConsoleErrorMessageList = [
      {
        message: error,
        type: PLATFORM_ERROR.PLUGIN_EXECUTION,
        subType: payload.errorType,
      },
    ];

    if (error === readableError && !!payloadBodyError) {
      appsmithConsoleErrorMessageList.push({
        message: payloadBodyError,
        type: PLATFORM_ERROR.PLUGIN_EXECUTION,
        subType: payload.errorType,
      });
    }

    AppsmithConsole.addError({
      id: actionId,
      logType: LOG_TYPE.ACTION_EXECUTION_ERROR,
      text: `Execution failed${
        payload.statusCode ? ` with status ${payload.statusCode}` : ""
      }`,
      source: {
        type: ENTITY_TYPE.ACTION,
        name: actionObject.name,
        id: actionId,
      },
      messages: appsmithConsoleErrorMessageList,
      state: payload.request,
    });

    Taro.showModal({
      title: "错误",
      content: createMessage(ERROR_ACTION_EXECUTE_FAIL, actionObject.name),
    });

    yield put({
      type: ReduxActionErrorTypes.RUN_ACTION_ERROR,
      payload: {
        error: appsmithConsoleErrorMessageList[0],
        id: reduxAction.payload.id,
      },
    });
    return;
  }

  yield put({
    type: ReduxActionTypes.RUN_ACTION_SUCCESS,
    payload: { [actionId]: payload },
  });
  if (payload.isExecutionSuccess) {
    AppsmithConsole.info({
      logType: LOG_TYPE.ACTION_EXECUTION_SUCCESS,
      text: "Executed successfully from user request",
      timeTaken: payload.duration,
      source: {
        type: ENTITY_TYPE.ACTION,
        name: actionObject.name,
        id: actionId,
      },
      state: {
        response: payload.body,
        request: payload.request,
      },
    });
  }
}

function* executeOnPageLoadJSAction(pageAction: PageAction) {
  const collectionId = pageAction.collectionId;
  if (collectionId) {
    const collection: JSCollection = yield select(
      getJSCollection,
      collectionId
    );
    const jsAction = collection.actions.find((d) => d.id === pageAction.id);
    if (!!jsAction) {
      if (jsAction.confirmBeforeExecute) {
        const modalPayload = {
          name: pageAction.name,
          modalOpen: true,
          modalType: ModalType.RUN_ACTION,
        };

        const confirmed = yield call(
          requestModalConfirmationSaga,
          modalPayload
        );
        if (!confirmed) {
          yield put({
            type: ReduxActionTypes.RUN_ACTION_CANCELLED,
            payload: { id: pageAction.id },
          });
          throw new UserCancelledActionExecutionError();
        }
      }
      const data = {
        collectionName: collection.name,
        action: jsAction,
        collectionId: collectionId,
      };
      yield call(handleExecuteJSFunctionSaga, data);
    }
  }
}

function* executePageLoadAction(pageAction: PageAction) {
  if (pageAction.hasOwnProperty("collectionId")) {
    yield call(executeOnPageLoadJSAction, pageAction);
  } else {
    const pageId = yield select(getCurrentPageId);
    let currentApp: ApplicationPayload = yield select(getCurrentApplication);
    currentApp = currentApp || {};

    let payload = EMPTY_RESPONSE;
    let isError = true;
    const error = `The action "${pageAction.name}" has failed.`;
    try {
      const executePluginActionResponse: ExecutePluginActionResponse =
        yield call(executePluginActionSaga, pageAction);
      payload = executePluginActionResponse.payload;
      isError = executePluginActionResponse.isError;
    } catch (e) {
      log.error(e);
    }

    if (isError) {
      AppsmithConsole.addError({
        id: pageAction.id,
        logType: LOG_TYPE.ACTION_EXECUTION_ERROR,
        text: `Execution failed with status ${payload.statusCode}`,
        source: {
          type: ENTITY_TYPE.ACTION,
          name: pageAction.name,
          id: pageAction.id,
        },
        state: payload.request,
        messages: [
          {
            message: error,
            type: PLATFORM_ERROR.PLUGIN_EXECUTION,
            subType: payload.errorType,
          },
        ],
      });

      yield put(
        executePluginActionError({
          actionId: pageAction.id,
          isPageLoad: true,
          error: { message: error },
          data: payload,
        })
      );
    } else {
      yield put(
        executePluginActionSuccess({
          id: pageAction.id,
          response: payload,
          isPageLoad: true,
        })
      );
      yield take(ReduxActionTypes.SET_EVALUATED_TREE);
    }
  }
}

function* executePageLoadActionsSaga() {
  try {
    const pageActions: PageAction[][] = yield select(getLayoutOnLoadActions);
    const actionCount = _.flatten(pageActions).length;
    for (const actionSet of pageActions) {
      // Load all sets in parallel
      yield* yield all(
        actionSet.map((apiAction) => call(executePageLoadAction, apiAction))
      );
    }

    // We show errors in the debugger once onPageLoad actions
    // are executed
    yield put(hideDebuggerErrors(false));
  } catch (e) {
    log.error(e);

    Taro.showModal({
      title: "错误",
      content: createMessage(ERROR_FAIL_ON_PAGE_LOAD_ACTIONS),
    });
  }
}

type ExecutePluginActionResponse = {
  payload: ActionResponse;
  isError: boolean;
};
/*
 * This saga handles the complete plugin action execution flow. It will respond with a
 * payload and isError property which indicates if the response is of an error type.
 * In case of the execution was not completed, it will throw errors of type
 * PluginActionExecutionError which needs to be handled by any saga that calls this.
 * */
function* executePluginActionSaga(
  actionOrActionId: PageAction | string,
  paginationField?: PaginationField,
  params?: Record<string, unknown>
) {
  let pluginAction;
  let actionId;
  if (isString(actionOrActionId)) {
    pluginAction = yield select(getAction, actionOrActionId);
    actionId = actionOrActionId;
  } else {
    pluginAction = yield select(getAction, actionOrActionId.id);
    actionId = actionOrActionId.id;
  }

  if (pluginAction.confirmBeforeExecute) {
    const modalPayload = {
      name: pluginAction.name,
      modalOpen: true,
      modalType: ModalType.RUN_ACTION,
    };

    const confirmed = yield call(requestModalConfirmationSaga, modalPayload);

    if (!confirmed) {
      yield put({
        type: ReduxActionTypes.RUN_ACTION_CANCELLED,
        payload: { id: actionId },
      });
      throw new UserCancelledActionExecutionError();
    }
  }
  yield put(executePluginActionRequest({ id: actionId }));

  const appMode = yield select(getAppMode);
  const timeout = yield select(getActionTimeout, actionId);

  const executeActionRequest: ExecuteActionRequest = {
    actionId: actionId,
    viewMode: appMode === APP_MODE.PUBLISHED,
  };

  if (paginationField) {
    executeActionRequest.paginationField = paginationField;
  }

  const formData = new FormData();
  formData.append("executeActionDTO", JSON.stringify(executeActionRequest));
  yield call(evaluateActionParams, pluginAction.jsonPathKeys, formData, params);

  const response: ActionExecutionResponse = yield ActionAPI.executeAction(
    formData,
    timeout
  );
  try {
    yield validateResponse(response);
    const payload = createActionExecutionResponse(response);

    yield put(
      executePluginActionSuccess({
        id: actionId,
        response: payload,
      })
    );
    let plugin: Plugin | undefined;
    if (!!pluginAction.pluginId) {
      plugin = yield select(getPlugin, pluginAction.pluginId);
    }

    // sets the default display format for action response e.g Raw, Json or Table
    yield setDefaultActionDisplayFormat(actionId, plugin, payload);

    return {
      payload,
      isError: isErrorResponse(response),
    };
  } catch (e) {
    yield put(
      executePluginActionSuccess({
        id: actionId,
        response: EMPTY_RESPONSE,
      })
    );
    throw new PluginActionExecutionError("Response not valid", false, response);
  }
}

export function* watchPluginActionExecutionSagas() {
  yield all([
    takeLatest(ReduxActionTypes.RUN_ACTION_REQUEST, runActionSaga),
    takeLatest(
      ReduxActionTypes.EXECUTE_PAGE_LOAD_ACTIONS,
      executePageLoadActionsSaga
    ),
  ]);
}
