import React from "react";
import {
  FetchAppThemesAction,
  FetchSelectedAppThemeAction,
} from "actions/appThemingActions";
import {
  ReduxAction,
  ReduxActionErrorTypes,
  ReduxActionTypes,
} from "@appsmith/constants/ReduxActionConstants";
import ThemingApi from "api/AppThemingApi";
import { all, takeLatest, put, select } from "redux-saga/effects";
import { getAppMode } from "selectors/applicationSelectors";
import { APP_MODE } from "entities/App";

/**
 * fetches all themes of the application
 *
 * @param action
 */
// eslint-disable-next-line
export function* fetchAppThemes(action: ReduxAction<FetchAppThemesAction>) {
  try {
    const { applicationId } = action.payload;
    const response = yield ThemingApi.fetchThemes(applicationId);

    yield put({
      type: ReduxActionTypes.FETCH_APP_THEMES_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_APP_THEMES_ERROR,
      payload: { error },
    });
  }
}

/**
 * fetches the selected theme of the application
 *
 * @param action
 */

export function* fetchAppSelectedTheme(
  // eslint-disable-next-line
  action: ReduxAction<FetchSelectedAppThemeAction>
) {
  const { applicationId } = action.payload;
  const mode: APP_MODE = yield select(getAppMode);

  try {
    // eslint-disable-next-line
    const response = yield ThemingApi.fetchSelected(applicationId, mode);

    yield put({
      type: ReduxActionTypes.FETCH_SELECTED_APP_THEME_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_SELECTED_APP_THEME_ERROR,
      payload: { error },
    });
  }
}

export default function* appThemingSaga() {
  yield all([
    takeLatest(ReduxActionTypes.FETCH_APP_THEMES_INIT, fetchAppThemes),
    takeLatest(
      ReduxActionTypes.FETCH_SELECTED_APP_THEME_INIT,
      fetchAppSelectedTheme
    ),
  ]);
}
