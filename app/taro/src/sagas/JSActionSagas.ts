import {
  ReduxAction,
  EvaluationReduxAction,
  ReduxActionTypes,
  ReduxActionErrorTypes,
} from "@appsmith/constants/ReduxActionConstants";
import { all, put, takeEvery, takeLatest, call } from "redux-saga/effects";
import { FetchActionsPayload } from "actions/pluginActionActions";
import { JSCollection } from "entities/JSCollection";
import { fetchJSCollectionsForPageSuccess } from "actions/jsActionActions";
import JSActionAPI from "api/JSActionAPI";
import { validateResponse } from "./ErrorSagas";
import { GenericApiResponse } from "api/ApiResponses";

export function* fetchJSCollectionsSaga(
  action: EvaluationReduxAction<FetchActionsPayload>
) {
  const { applicationId } = action.payload;
  try {
    const response = yield JSActionAPI.fetchJSCollections(applicationId);
    yield put({
      type: ReduxActionTypes.FETCH_JS_ACTIONS_SUCCESS,
      payload: response.data || [],
    });
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_JS_ACTIONS_ERROR,
      payload: { error },
    });
  }
}

export function* fetchJSCollectionsForPageSaga(
  action: ReduxAction<{ pageId: string }>
) {
  const { pageId } = action.payload;
  try {
    const response: GenericApiResponse<JSCollection[]> = yield call(
      JSActionAPI.fetchJSCollectionsByPageId,
      pageId
    );
    const isValidResponse = yield validateResponse(response);
    if (isValidResponse) {
      yield put(fetchJSCollectionsForPageSuccess(response.data));
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_JS_ACTIONS_FOR_PAGE_ERROR,
      payload: { error },
    });
  }
}

export function* fetchJSCollectionsForViewModeSaga(
  action: ReduxAction<FetchActionsPayload>
) {
  const { applicationId } = action.payload;
  try {
    const response: GenericApiResponse<JSCollection[]> =
      yield JSActionAPI.fetchJSCollectionsForViewMode(applicationId);
    const resultJSCollections = response.data;
    const isValidResponse = yield validateResponse(response);
    if (isValidResponse) {
      yield put({
        type: ReduxActionTypes.FETCH_JS_ACTIONS_VIEW_MODE_SUCCESS,
        payload: resultJSCollections,
      });
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_JS_ACTIONS_VIEW_MODE_ERROR,
      payload: { error },
    });
  }
}

export function* watchJSActionSagas() {
  yield all([
    takeEvery(ReduxActionTypes.FETCH_JS_ACTIONS_INIT, fetchJSCollectionsSaga),
    takeLatest(
      ReduxActionTypes.FETCH_JS_ACTIONS_FOR_PAGE_INIT,
      fetchJSCollectionsForPageSaga
    ),
    takeEvery(
      ReduxActionTypes.FETCH_JS_ACTIONS_VIEW_MODE_INIT,
      fetchJSCollectionsForViewModeSaga
    ),
  ]);
}
