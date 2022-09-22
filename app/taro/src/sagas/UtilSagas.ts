import { race, put, take } from "redux-saga/effects";
import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import { showActionConfirmationModal } from "actions/pluginActionActions";
import { ModalInfo } from "reducers/uiReducers/modalActionReducer";

export function* requestModalConfirmationSaga(payload: ModalInfo) {
  yield put(showActionConfirmationModal(payload));

  const { accept } = yield race({
    cancel: take(ReduxActionTypes.CANCEL_ACTION_MODAL + `_FOR_${payload.name}`),
    accept: take(
      ReduxActionTypes.CONFIRM_ACTION_MODAL + `_FOR_${payload.name}`
    ),
  });

  return !!accept;
}
