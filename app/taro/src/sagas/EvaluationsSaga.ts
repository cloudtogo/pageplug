import {
  actionChannel,
  call,
  fork,
  put,
  select,
  take,
  spawn,
  all,
} from "redux-saga/effects";
import { Channel } from "redux-saga";
import {
  EvaluationReduxAction,
  AnyReduxAction,
  ReduxActionType,
  ReduxActionTypes,
} from "@appsmith/constants/ReduxActionConstants";
import { ActionDescription } from "entities/DataTree/actionTriggers";
import { EvaluationVersion } from "api/ApplicationApi";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import {
  executeActionTriggers,
  TriggerMeta,
} from "./ActionExecution/ActionExecutionSagas";
import { JSAction } from "entities/JSCollection";
import {
  getDataTree,
  getUnevaluatedDataTree,
} from "selectors/dataTreeSelectors";
import WidgetFactory, { WidgetTypeConfigMap } from "../utils/WidgetFactory";
import { GracefulWorkerService } from "utils/WorkerUtil";
import { EVAL_WORKER_ACTIONS } from "utils/DynamicBindingUtils";
import log from "loglevel";
import { Action } from "redux";
import {
  EVALUATE_REDUX_ACTIONS,
  FIRST_EVAL_REDUX_ACTIONS,
  setDependencyMap,
  setEvaluatedTree,
  shouldProcessBatchedAction,
} from "actions/evaluationActions";
import {
  logActionExecutionError,
  UncaughtPromiseError,
} from "sagas/ActionExecution/errorUtils";
import {
  evalErrorHandler,
  postEvalActionDispatcher,
} from "./PostEvaluationSagas";
import { diff } from "deep-diff";
import { get } from "lodash";

import { getWidgets } from "sagas/selectors";
import { getSelectedAppTheme } from "selectors/appThemingSelectors";
import { updateMetaState } from "actions/metaActions";
import { getAllActionValidationConfig } from "selectors/entitiesSelector";
import { DataTree } from "entities/DataTree/dataTreeFactory";
import { EvalMetaUpdates } from "workers/DataTreeEvaluator/types";
import { JSUpdate } from "utils/JSPaneUtils";

let widgetTypeConfigMap: WidgetTypeConfigMap;

const worker = new GracefulWorkerService();

function* evaluateTreeSaga(
  postEvalActions?: Array<AnyReduxAction>,
  shouldReplay?: boolean
) {
  const allActionValidationConfig = yield select(getAllActionValidationConfig);
  const unevalTree = yield select(getUnevaluatedDataTree);
  const widgets = yield select(getWidgets);
  const theme = yield select(getSelectedAppTheme);

  log.debug({ unevalTree });
  const workerResponse = yield call(
    worker.request,
    EVAL_WORKER_ACTIONS.EVAL_TREE,
    {
      unevalTree,
      widgetTypeConfigMap,
      widgets,
      theme,
      shouldReplay,
      allActionValidationConfig,
    }
  );

  const {
    dataTree,
    dependencies,
    errors,
    evalMetaUpdates = [],
    evaluationOrder,
    jsUpdates,
    logs,
  }: {
    dataTree: DataTree;
    dependencies: Record<string, string[]>;
    errors: EvalError[];
    evalMetaUpdates: EvalMetaUpdates;
    evaluationOrder: string[];
    jsUpdates: Record<string, JSUpdate>;
    logs: any[];
    unEvalUpdates: any[];
  } = workerResponse;
  const oldDataTree = yield select(getDataTree);

  const updates = diff(oldDataTree, dataTree) || [];
  yield put(setEvaluatedTree(updates));

  // if evalMetaUpdates are present only then dispatch updateMetaState
  if (evalMetaUpdates.length) {
    yield put(updateMetaState(evalMetaUpdates));
  }
  log.debug({ evalMetaUpdates });

  const updatedDataTree: DataTree = yield select(getDataTree);
  log.debug({ jsUpdates: jsUpdates });
  log.debug({ dataTree: updatedDataTree });
  logs?.forEach((evalLog: any) => log.debug(evalLog));
  // Added type as any due to https://github.com/redux-saga/redux-saga/issues/1482
  yield call(evalErrorHandler as any, errors, updatedDataTree, evaluationOrder);

  yield put(setDependencyMap(dependencies));
  if (postEvalActions && postEvalActions.length) {
    yield call(postEvalActionDispatcher, postEvalActions);
  }
}

export function* evaluateActionBindings(
  bindings: string[],
  executionParams: Record<string, any> | string = {}
) {
  const workerResponse = yield call(
    worker.request,
    EVAL_WORKER_ACTIONS.EVAL_ACTION_BINDINGS,
    {
      bindings,
      executionParams,
    }
  );

  const { errors, values } = workerResponse;

  yield call(evalErrorHandler, errors);
  return values;
}

export function* clearEvalCache() {
  yield call(worker.request, EVAL_WORKER_ACTIONS.CLEAR_CACHE);

  return true;
}

export function* executeFunction(collectionName: string, action: JSAction) {
  const functionCall = `${collectionName}.${action.name}()`;
  const { isAsync } = action.actionConfiguration;
  let response: {
    errors: any[];
    result: any;
  };

  if (isAsync) {
    try {
      response = yield call(
        evaluateAndExecuteDynamicTrigger,
        functionCall,
        EventType.ON_JS_FUNCTION_EXECUTE,
        {}
      );
    } catch (e) {
      if (e instanceof UncaughtPromiseError) {
        logActionExecutionError(e.message);
      }
      response = { errors: [e], result: undefined };
    }
  } else {
    response = yield call(worker.request, EVAL_WORKER_ACTIONS.EXECUTE_SYNC_JS, {
      functionCall,
    });
  }

  const { errors, result } = response;
  const isDirty = !!errors.length;

  yield call(evalErrorHandler, errors);
  return { result, isDirty };
}

function evalQueueBuffer() {
  let canTake = false;
  let collectedPostEvalActions: any = [];
  const take = () => {
    if (canTake) {
      const resp = collectedPostEvalActions;
      collectedPostEvalActions = [];
      canTake = false;
      return { postEvalActions: resp, type: "BUFFERED_ACTION" };
    }
  };
  const flush = () => {
    if (canTake) {
      return [take() as Action];
    }

    return [];
  };

  const put = (action: EvaluationReduxAction<unknown | unknown[]>) => {
    if (!shouldProcessBatchedAction(action)) {
      return;
    }
    canTake = true;

    const postEvalActions = getPostEvalActions(action);
    collectedPostEvalActions.push(...postEvalActions);
  };

  return {
    take,
    put,
    isEmpty: () => {
      return !canTake;
    },
    flush,
  };
}

/**
 * Extract the post eval actions from an evaluation action
 * Batched actions have post eval actions inside them, extract that
 *
 * **/
function getPostEvalActions(
  action: EvaluationReduxAction<unknown | unknown[]>
): AnyReduxAction[] {
  const postEvalActions: AnyReduxAction[] = [];
  if (action.postEvalActions) {
    postEvalActions.push(...action.postEvalActions);
  }
  if (
    action.type === ReduxActionTypes.BATCH_UPDATES_SUCCESS &&
    Array.isArray(action.payload)
  ) {
    action.payload.forEach((batchedAction) => {
      if (batchedAction.postEvalActions) {
        postEvalActions.push(
          ...(batchedAction.postEvalActions as AnyReduxAction[])
        );
      }
    });
  }
  return postEvalActions;
}

function* evaluationChangeListenerSaga() {
  // Explicitly shutdown old worker if present
  yield call(worker.shutdown);
  yield call(worker.start);
  yield call(worker.request, EVAL_WORKER_ACTIONS.SETUP);
  widgetTypeConfigMap = WidgetFactory.getWidgetTypeConfigMap();
  const initAction = yield take(FIRST_EVAL_REDUX_ACTIONS);
  yield fork(evaluateTreeSaga, initAction.postEvalActions);
  const evtActionChannel = yield actionChannel(
    EVALUATE_REDUX_ACTIONS,
    evalQueueBuffer()
  );
  while (true) {
    const action: EvaluationReduxAction<unknown | unknown[]> = yield take(
      evtActionChannel
    );

    if (shouldProcessBatchedAction(action)) {
      const postEvalActions = getPostEvalActions(action);
      yield call(
        evaluateTreeSaga,
        postEvalActions,
        get(action, "payload.shouldReplay")
      );
    }
  }
}

export function* setAppVersionOnWorkerSaga(action: {
  type: ReduxActionType;
  payload: EvaluationVersion;
}) {
  const version: EvaluationVersion = action.payload;
  yield call(worker.request, EVAL_WORKER_ACTIONS.SET_EVALUATION_VERSION, {
    version,
  });
}

/*
 * Used to evaluate and execute dynamic trigger end to end
 * Widget action fields and JS Object run triggers this flow
 *
 * We start a duplex request with the worker and wait till the time we get a 'finished' event from the
 * worker. Worker will evaluate a block of code and ask the main thread to execute it. The result of this
 * execution is returned to the worker where it can resolve/reject the current promise.
 */
export function* evaluateAndExecuteDynamicTrigger(
  dynamicTrigger: string,
  eventType: EventType,
  triggerMeta: TriggerMeta,
  callbackData?: Array<any>,
  globalContext?: Record<string, unknown>
) {
  const unEvalTree = yield select(getUnevaluatedDataTree);
  log.debug({ execute: dynamicTrigger });

  const { requestChannel, responseChannel } = yield call(
    worker.duplexRequest,
    EVAL_WORKER_ACTIONS.EVAL_TRIGGER,
    { dataTree: unEvalTree, dynamicTrigger, callbackData, globalContext }
  );
  let keepAlive = true;

  while (keepAlive) {
    const { requestData } = yield take(requestChannel);
    log.debug({ requestData });
    if (requestData.finished) {
      keepAlive = false;
      /* Handle errors during evaluation
       * A finish event with errors means that the error was not caught by the user code.
       * We raise an error telling the user that an uncaught error has occurred
       * */
      if (requestData.result.errors.length) {
        if (
          requestData.result.errors[0].errorMessage !==
          "UncaughtPromiseRejection: User cancelled action execution"
        ) {
          throw new UncaughtPromiseError(
            requestData.result.errors[0].errorMessage
          );
        }
      }
      // It is possible to get a few triggers here if the user
      // still uses the old way of action runs and not promises. For that we
      // need to manually execute these triggers outside the promise flow
      const { triggers } = requestData.result;
      if (triggers && triggers.length) {
        log.debug({ triggers });
        yield all(
          triggers.map((trigger: ActionDescription) =>
            call(executeActionTriggers, trigger, eventType, triggerMeta)
          )
        );
      }
      // Return value of a promise is returned
      return requestData.result;
    }
    yield call(evalErrorHandler, requestData.errors);
    if (requestData.trigger) {
      // if we have found a trigger, we need to execute it and respond back
      log.debug({ trigger: requestData.trigger });
      yield spawn(
        executeTriggerRequestSaga,
        requestData,
        eventType,
        responseChannel,
        triggerMeta
      );
    }
  }
}

interface ResponsePayload {
  data: {
    subRequestId: string;
    reason?: string;
    resolve?: unknown;
  };
  success: boolean;
}

/*
 * It is necessary to respond back as the worker is waiting with a pending promise and wanting to know if it should
 * resolve or reject it with the data the execution has provided
 */
function* executeTriggerRequestSaga(
  requestData: { trigger: ActionDescription; subRequestId: string },
  eventType: EventType,
  responseChannel: Channel<unknown>,
  triggerMeta: TriggerMeta
) {
  const responsePayload: ResponsePayload = {
    data: {
      resolve: undefined,
      reason: undefined,
      subRequestId: requestData.subRequestId,
    },
    success: false,
  };
  try {
    responsePayload.data.resolve = yield call(
      executeActionTriggers,
      requestData.trigger,
      eventType,
      triggerMeta
    );
    responsePayload.success = true;
  } catch (e) {
    // When error occurs in execution of triggers,
    // a success: false is sent to reject the promise
    responsePayload.data.reason = e;
    responsePayload.success = false;
  }
  responseChannel.put({
    method: EVAL_WORKER_ACTIONS.PROCESS_TRIGGER,
    ...responsePayload,
    // 奇观：小程序给 worker 发消息 success 字段有概率会丢失！！！只能用其他字段传输！
    backSuccess: responsePayload.success,
  });
}

export default function* evaluationSagaListeners() {
  yield take(ReduxActionTypes.START_EVALUATION);
  while (true) {
    try {
      yield call(evaluationChangeListenerSaga);
    } catch (e) {
      log.error(e);
    }
  }
}
