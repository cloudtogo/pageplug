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
  ReduxActionWithoutPayload,
} from "@appsmith/constants/ReduxActionConstants";
import { ERROR_CODES } from "@appsmith/constants/ApiConstants";
import { APP_MODE } from "entities/App";
import { getPersistentAppStore } from "constants/AppConstants";
import { getDefaultPageId } from "./selectors";

import { InitAppViewerPayload } from "actions/initActions";
import { updateBranchLocally } from "actions/gitSyncActions";
import {
  fetchPublishedPage,
  fetchPublishedPageSuccess,
  setAppMode,
  updateAppPersistentStore,
  fetchAllPageEntityCompletion,
} from "actions/pageActions";
import {
  executePageLoadActions,
  fetchActionsForView,
} from "actions/pluginActionActions";
import { fetchApplication } from "actions/applicationActions";
import { fetchJSCollectionsForView } from "actions/jsActionActions";
import {
  fetchSelectedAppThemeAction,
  fetchAppThemesAction,
} from "actions/appThemingActions";

export function* failFastApiCalls(
  triggerActions: Array<ReduxAction<unknown> | ReduxActionWithoutPayload>,
  successActions: string[],
  failureActions: string[]
) {
  yield all(triggerActions.map((triggerAction) => put(triggerAction)));
  const effectRaceResult = yield race({
    success: all(successActions.map((successAction) => take(successAction))),
    failure: take(failureActions),
  });
  if (effectRaceResult.failure) {
    yield put({
      type: ReduxActionTypes.SAFE_CRASH_APPSMITH_REQUEST,
      payload: {
        code: get(
          effectRaceResult,
          "failure.payload.error.code",
          ERROR_CODES.SERVER_ERROR
        ),
      },
    });
    return false;
  }
  return true;
}

function* initiateApplication(payload: InitAppViewerPayload) {
  const { applicationId, mode, pageId } = payload;

  const applicationCall: boolean = yield failFastApiCalls(
    [fetchApplication({ pageId, applicationId, mode })],
    [
      ReduxActionTypes.FETCH_APPLICATION_SUCCESS,
      ReduxActionTypes.FETCH_PAGE_LIST_SUCCESS,
    ],
    [
      ReduxActionErrorTypes.FETCH_APPLICATION_ERROR,
      ReduxActionErrorTypes.FETCH_PAGE_LIST_ERROR,
    ]
  );

  if (!applicationCall) return;

  let toLoadPageId = pageId;
  const defaultPageId: string = yield select(getDefaultPageId);
  toLoadPageId = toLoadPageId || defaultPageId;

  return toLoadPageId;
}

function* initiatePageAndAllActions(
  toLoadPageId: string,
  applicationId: string,
  mode: APP_MODE
) {
  let initActionsCalls: any = [];
  let successActionEffects: any = [];
  let failureActionEffects: any = [];
  switch (mode) {
    case APP_MODE.PUBLISHED:
      {
        initActionsCalls = [
          fetchPublishedPage(toLoadPageId, true, true),
          fetchActionsForView({ applicationId }),
          fetchJSCollectionsForView({ applicationId }),
          fetchSelectedAppThemeAction(applicationId),
          fetchAppThemesAction(applicationId),
        ];
        successActionEffects = [
          fetchPublishedPageSuccess().type,
          ReduxActionTypes.FETCH_ACTIONS_VIEW_MODE_SUCCESS,
          ReduxActionTypes.FETCH_JS_ACTIONS_VIEW_MODE_SUCCESS,
          ReduxActionTypes.FETCH_SELECTED_APP_THEME_SUCCESS,
          ReduxActionTypes.FETCH_APP_THEMES_SUCCESS,
        ];
        failureActionEffects = [
          ReduxActionErrorTypes.FETCH_PUBLISHED_PAGE_ERROR,
          ReduxActionErrorTypes.FETCH_ACTIONS_VIEW_MODE_ERROR,
          ReduxActionErrorTypes.FETCH_JS_ACTIONS_VIEW_MODE_ERROR,
          ReduxActionErrorTypes.FETCH_SELECTED_APP_THEME_ERROR,
          ReduxActionErrorTypes.FETCH_APP_THEMES_ERROR,
        ];
      }
      break;
    default:
      return false;
  }
  const allActionCalls: boolean = yield failFastApiCalls(
    initActionsCalls,
    successActionEffects,
    failureActionEffects
  );

  if (!allActionCalls) {
    return false;
  } else {
    yield put(fetchAllPageEntityCompletion([executePageLoadActions()]));
    return true;
  }
}

export function* initializeAppViewerSaga(
  action: ReduxAction<InitAppViewerPayload>
) {
  const { applicationId, branch } = action.payload;
  yield put(updateBranchLocally(branch));
  yield put(setAppMode(APP_MODE.PUBLISHED));
  yield put({ type: ReduxActionTypes.START_EVALUATION });

  const toLoadPageId = yield call(initiateApplication, action.payload);

  yield put(
    updateAppPersistentStore(getPersistentAppStore(applicationId, branch))
  );

  const pageAndActionsFetch = yield call(
    initiatePageAndAllActions,
    toLoadPageId,
    applicationId,
    APP_MODE.PUBLISHED
  );

  if (!pageAndActionsFetch) return;

  yield put({
    type: ReduxActionTypes.INITIALIZE_PAGE_VIEWER_SUCCESS,
  });
}

export default function* watchInitSagas() {
  yield all([
    takeLatest(
      ReduxActionTypes.INITIALIZE_PAGE_VIEWER,
      initializeAppViewerSaga
    ),
  ]);
}
