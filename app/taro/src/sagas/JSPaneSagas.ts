import { all, select, put, takeEvery, call, take } from "redux-saga/effects";
import {
  ReduxAction,
  ReduxActionTypes,
} from "@appsmith/constants/ReduxActionConstants";
import { getIsSavingEntity } from "selectors/editorSelectors";
import { JSAction } from "entities/JSCollection";
import { executeFunction } from "./EvaluationsSaga";
import {
  executeJSFunctionInit,
} from "actions/jsPaneActions";
import Taro from "@tarojs/taro";
import {
  createMessage,
  JS_EXECUTION_SUCCESS,
  JS_EXECUTION_FAILURE,
  JS_EXECUTION_FAILURE_TOASTER,
} from "@appsmith/constants/messages";
import AppsmithConsole from "utils/AppsmithConsole";
import { ENTITY_TYPE, PLATFORM_ERROR } from "entities/AppsmithConsole";
import LOG_TYPE from "entities/AppsmithConsole/logtype";
export const JS_PLUGIN_PACKAGE_NAME = "js-plugin";
import { ModalType } from "reducers/uiReducers/modalActionReducer";
import { requestModalConfirmationSaga } from "sagas/UtilSagas";
import { UserCancelledActionExecutionError } from "sagas/ActionExecution/errorUtils";

export function* handleExecuteJSFunctionSaga(data: {
  collectionName: string;
  action: JSAction;
  collectionId: string;
}): any {
  const { action, collectionId, collectionName } = data;
  const actionId = action.id;
  yield put(
    executeJSFunctionInit({
      collectionName,
      action,
      collectionId,
    })
  );

  const isEntitySaving = yield select(getIsSavingEntity);

  /**
   * Only start executing when no entity in the application is saving
   * This ensures that execution doesn't get carried out on stale values
   * This includes other entities which might be bound in the JS Function
   */
  if (isEntitySaving) {
    yield take(ReduxActionTypes.ENTITY_UPDATE_SUCCESS);
  }

  try {
    const { isDirty, result } = yield call(
      executeFunction,
      collectionName,
      action
    );
    yield put({
      type: ReduxActionTypes.EXECUTE_JS_FUNCTION_SUCCESS,
      payload: {
        results: result,
        collectionId,
        actionId,
        isDirty,
      },
    });
    AppsmithConsole.info({
      text: createMessage(JS_EXECUTION_SUCCESS),
      source: {
        type: ENTITY_TYPE.JSACTION,
        name: collectionName + "." + action.name,
        id: collectionId,
      },
      state: { response: result },
    });
  } catch (e) {
    AppsmithConsole.addError({
      id: actionId,
      logType: LOG_TYPE.ACTION_EXECUTION_ERROR,
      text: createMessage(JS_EXECUTION_FAILURE),
      source: {
        type: ENTITY_TYPE.JSACTION,
        name: collectionName + "." + action.name,
        id: collectionId,
      },
      messages: [
        {
          message: e.message,
          type: PLATFORM_ERROR.PLUGIN_EXECUTION,
        },
      ],
    });
    Taro.showModal({
      title: "错误",
      content: e.message || createMessage(JS_EXECUTION_FAILURE_TOASTER),
    });
  }
}

export function* handleStartExecuteJSFunctionSaga(
  data: ReduxAction<{
    collectionName: string;
    action: JSAction;
    collectionId: string;
  }>
): any {
  const { action, collectionId, collectionName } = data.payload;
  const actionId = action.id;
  if (action.confirmBeforeExecute) {
    const modalPayload = {
      name: collectionName + "." + action.name,
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
  yield call(handleExecuteJSFunctionSaga, {
    collectionName: collectionName,
    action: action,
    collectionId: collectionId,
  });
}

export default function* root() {
  yield all([
    takeEvery(
      ReduxActionTypes.START_EXECUTE_JS_FUNCTION,
      handleStartExecuteJSFunctionSaga
    ),
  ]);
}
