import {
  ReduxAction,
  ReduxActionErrorTypes,
  ReduxActionTypes,
} from "constants/ReduxActionConstants";
import ApplicationApi, { FetchApplicationResponse } from "api/ApplicationApi";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { FetchApplicationPayload } from "actions/applicationActions";

export function* fetchApplicationSaga(
  action: ReduxAction<FetchApplicationPayload>
) {
  try {
    const { applicationId } = action.payload;
    const response: FetchApplicationResponse = yield call(
      ApplicationApi.fetchApplicationForViewMode,
      applicationId
    );
    yield put({
      type: ReduxActionTypes.FETCH_APPLICATION_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_APPLICATION_ERROR,
      payload: {
        error,
      },
    });
  }
}

export default function* applicationSagas() {
  yield all([
    takeLatest(ReduxActionTypes.FETCH_APPLICATION_INIT, fetchApplicationSaga),
  ]);
}
