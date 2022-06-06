import { call, all, spawn } from "redux-saga/effects";
import initSagas from "./InitSagas";
import pageSagas from "sagas/PageSagas";
import { watchActionSagas } from "./ActionSagas";
import { watchActionExecutionSagas } from "sagas/ActionExecutionSagas";
import errorSagas from "./ErrorSagas";
import applicationSagas from "./ApplicationSagas";
import batchSagas from "./BatchSagas";
import evaluationsSaga from "./EvaluationsSaga";
import actionExecutionChangeListeners from "./WidgetLoadingSaga";
import modalSagas from "./ModalSagas";
// import debuggerSagas from "./DebuggerSagas";
import log from "loglevel";

const sagas = [
  initSagas,
  pageSagas,
  watchActionSagas,
  applicationSagas,
  errorSagas,
  evaluationsSaga,
  batchSagas,
  actionExecutionChangeListeners,
  watchActionExecutionSagas,
  modalSagas,
  // debuggerSagas,
];

export function* rootSaga(sagasToRun = sagas) {
  yield all(
    sagasToRun.map((saga) =>
      spawn(function*() {
        while (true) {
          try {
            yield call(saga);
            break;
          } catch (e) {
            log.error(e);
          }
        }
      }),
    ),
  );
}
