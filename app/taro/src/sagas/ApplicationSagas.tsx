import {
  ReduxAction,
  ReduxActionErrorTypes,
  ReduxActionTypes,
} from "@appsmith/constants/ReduxActionConstants";
import {
  FetchApplicationPayload,
  FetchApplicationResponse,
} from "api/ApplicationApi";
import PageApi from "api/PageApi";
import { validateResponse } from "./ErrorSagas";

import { all, call, put, takeLatest } from "redux-saga/effects";
import { identity, pickBy } from "lodash";

function* handleFetchApplicationError(error: unknown) {
  yield put({
    type: ReduxActionErrorTypes.FETCH_APPLICATION_ERROR,
    payload: {
      error,
    },
  });
  yield put({
    type: ReduxActionErrorTypes.FETCH_PAGE_LIST_ERROR,
    payload: {
      error,
    },
  });
}

export function* fetchAppAndPagesSaga(
  action: ReduxAction<FetchApplicationPayload>
) {
  try {
    const params = pickBy(action.payload, identity);
    if (params.pageId && params.applicationId) {
      delete params.applicationId;
    }

    const response: FetchApplicationResponse = yield call(
      PageApi.fetchAppAndPages,
      params
    );
    const isValidResponse: boolean = yield call(validateResponse, response);
    if (isValidResponse) {
      yield put({
        type: ReduxActionTypes.FETCH_APPLICATION_SUCCESS,
        payload: { ...response.data.application, pages: response.data.pages },
      });

      yield put({
        type: ReduxActionTypes.FETCH_PAGE_LIST_SUCCESS,
        payload: {
          pages: response.data.pages.map((page) => ({
            pageName: page.name,
            pageId: page.id,
            isDefault: page.isDefault,
            isHidden: !!page.isHidden,
            slug: page.slug,
            icon: page.icon,
          })),
          applicationId: response.data.application?.id,
        },
      });

      yield put({
        type: ReduxActionTypes.SET_CURRENT_ORG_ID,
        payload: {
          orgId: response.data.organizationId,
        },
      });

      yield put({
        type: ReduxActionTypes.SET_APP_VERSION_ON_WORKER,
        payload: response.data.application?.evaluationVersion,
      });
    } else {
      yield call(handleFetchApplicationError, response.responseMeta?.error);
    }
  } catch (error) {
    yield call(handleFetchApplicationError, error);
  }
}

export default function* applicationSagas() {
  yield all([
    takeLatest(ReduxActionTypes.FETCH_APPLICATION_INIT, fetchAppAndPagesSaga),
  ]);
}
