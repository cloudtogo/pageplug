import { call, all, spawn, race, take } from "redux-saga/effects";
import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import initSagas from "./InitSagas";
import pageSagas from "sagas/PageSagas";
import { watchJSActionSagas } from "./JSActionSagas";
import { watchActionSagas } from "./ActionSagas";
import { watchActionExecutionSagas } from "sagas/ActionExecution/ActionExecutionSagas";
import { watchPluginActionExecutionSagas } from "sagas/ActionExecution/PluginActionSaga";
import errorSagas from "./ErrorSagas";
import applicationSagas from "./ApplicationSagas";
import batchSagas from "./BatchSagas";
import evaluationsSaga from "./EvaluationsSaga";
import actionExecutionChangeListeners from "./WidgetLoadingSaga";
import appThemingSaga from "./AppThemingSaga";
import modalSagas from "./ModalSagas";
import log from "loglevel";

const sagas = [
  initSagas,
  pageSagas,
  watchActionSagas,
  watchJSActionSagas,
  applicationSagas,
  errorSagas,
  evaluationsSaga,
  batchSagas,
  actionExecutionChangeListeners,
  watchActionExecutionSagas,
  watchPluginActionExecutionSagas,
  modalSagas,
  appThemingSaga,
];

export function* rootSaga(sagasToRun = sagas): any {
  // This race effect ensures that we fail as soon as the first safe crash is dispatched.
  // Without this, all the subsequent safe crash failures would be shown in the toast messages as well.
  const result = yield race({
    running: all(
      sagasToRun.map((saga) =>
        spawn(function* () {
          while (true) {
            try {
              yield call(saga);
              break;
            } catch (e) {
              log.error(e);
            }
          }
        })
      )
    ),
    crashed: take(ReduxActionTypes.SAFE_CRASH_APPSMITH),
  });
  if (result.crashed) yield call(rootSaga);
}
