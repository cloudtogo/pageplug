import { get } from "lodash";
import {
  all,
  call,
  put,
  race,
  select,
  take,
  takeLatest,
} from "redux-saga/effects";
import {
  ReduxAction,
  ReduxActionErrorTypes,
  ReduxActionTypes,
} from "constants/ReduxActionConstants";
import { ERROR_CODES } from "constants/ApiConstants";

import {
  fetchPageList,
  fetchPublishedPage,
  setAppMode,
  updateAppPersistentStore,
} from "actions/pageActions";
import { fetchActionsForView } from "actions/actionActions";
import { fetchApplication } from "actions/applicationActions";
import { APP_MODE } from "entities/App";
import { getPersistentAppStore } from "constants/AppConstants";
import { getDefaultPageId } from "./selectors";

export function* initializeAppViewerSaga(
  action: ReduxAction<{ applicationId: string; pageId?: string }>,
) {
  const { applicationId, pageId } = action.payload;
  yield put(setAppMode(APP_MODE.PUBLISHED));
  yield put(updateAppPersistentStore(getPersistentAppStore(applicationId)));
  yield put({ type: ReduxActionTypes.START_EVALUATION });
  yield all([
    put(fetchActionsForView(applicationId)),
    put(fetchPageList(applicationId, APP_MODE.PUBLISHED)),
    put(fetchApplication(applicationId, APP_MODE.PUBLISHED)),
  ]);

  const resultOfPrimaryCalls = yield race({
    success: all([
      take(ReduxActionTypes.FETCH_ACTIONS_VIEW_MODE_SUCCESS),
      take(ReduxActionTypes.FETCH_PAGE_LIST_SUCCESS),
      take(ReduxActionTypes.FETCH_APPLICATION_SUCCESS),
    ]),
    failure: take([
      ReduxActionErrorTypes.FETCH_ACTIONS_VIEW_MODE_ERROR,
      ReduxActionErrorTypes.FETCH_PAGE_LIST_ERROR,
      ReduxActionErrorTypes.FETCH_APPLICATION_ERROR,
    ]),
  });

  if (resultOfPrimaryCalls.failure) {
    yield put({
      type: ReduxActionTypes.SAFE_CRASH_APPSMITH_REQUEST,
      payload: {
        code: get(
          resultOfPrimaryCalls,
          "failure.payload.error.code",
          ERROR_CODES.SERVER_ERROR,
        ),
      },
    });
    return;
  }

  const defaultPageId = yield select(getDefaultPageId);
  const toLoadPageId = pageId || defaultPageId;

  if (toLoadPageId) {
    yield put(fetchPublishedPage(toLoadPageId, true));

    const resultOfFetchPage = yield race({
      success: take(ReduxActionTypes.FETCH_PUBLISHED_PAGE_SUCCESS),
      failure: take(ReduxActionErrorTypes.FETCH_PUBLISHED_PAGE_ERROR),
    });

    if (resultOfFetchPage.failure) {
      yield put({
        type: ReduxActionTypes.SAFE_CRASH_APPSMITH_REQUEST,
        payload: {
          code: get(
            resultOfFetchPage,
            "failure.payload.error.code",
            ERROR_CODES.SERVER_ERROR,
          ),
        },
      });
      return;
    }

    yield put({
      type: ReduxActionTypes.INITIALIZE_PAGE_VIEWER_SUCCESS,
    });

    // if ("serviceWorker" in navigator) {
    //   yield put({
    //     type: ReduxActionTypes.FETCH_ALL_PUBLISHED_PAGES,
    //   });
    // }
  }
}

export default function* watchInitSagas() {
  yield all([
    takeLatest(
      ReduxActionTypes.INITIALIZE_PAGE_VIEWER,
      initializeAppViewerSaga,
    ),
  ]);
}
