import {
  EvaluationReduxAction,
  ReduxAction,
  ReduxActionErrorTypes,
  ReduxActionTypes,
} from "@appsmith/constants/ReduxActionConstants";
import {
  all,
  call,
  put,
  race,
  take,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import ActionAPI from "api/ActionAPI";
import { GenericApiResponse } from "api/ApiResponses";
import {
  fetchActionsForPageSuccess,
  FetchActionsPayload,
} from "actions/pluginActionActions";
import { validateResponse } from "./ErrorSagas";
import {
  Action,
  ActionViewMode,
} from "entities/Action";

export function* fetchActionsSaga(
  action: EvaluationReduxAction<FetchActionsPayload>,
) {
  const { applicationId } = action.payload;
  try {
    const response: GenericApiResponse<Action[]> = yield ActionAPI.fetchActions(
      applicationId,
    );
    const isValidResponse = yield validateResponse(response);
    if (isValidResponse) {
      yield put({
        type: ReduxActionTypes.FETCH_ACTIONS_SUCCESS,
        payload: response.data,
        postEvalActions: action.postEvalActions,
      });
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_ACTIONS_ERROR,
      payload: { error },
    });
  }
}

export function* fetchActionsForViewModeSaga(
  action: ReduxAction<FetchActionsPayload>,
) {
  const { applicationId } = action.payload;
  try {
    const response: GenericApiResponse<ActionViewMode[]> = yield ActionAPI.fetchActionsForViewMode(
      applicationId,
    );
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      const correctFormatResponse = response.data.map((action) => {
        return {
          ...action,
          actionConfiguration: {
            timeoutInMillisecond: action.timeoutInMillisecond,
          },
        };
      });
      yield put({
        type: ReduxActionTypes.FETCH_ACTIONS_VIEW_MODE_SUCCESS,
        payload: correctFormatResponse,
      });
    } else {
      yield put({
        type: ReduxActionErrorTypes.FETCH_ACTIONS_VIEW_MODE_ERROR,
        payload: response.responseMeta.error,
      });
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_ACTIONS_VIEW_MODE_ERROR,
      payload: { error },
    });
  }
}

export function* fetchActionsForPageSaga(
  action: EvaluationReduxAction<{ pageId: string }>,
) {
  const { pageId } = action.payload;
  try {
    const response: GenericApiResponse<Action[]> = yield call(
      ActionAPI.fetchActionsByPageId,
      pageId,
    );
    const isValidResponse = yield validateResponse(response);
    if (isValidResponse) {
      yield put(fetchActionsForPageSuccess(response.data));
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_ACTIONS_FOR_PAGE_ERROR,
      payload: { error },
    });
  }
}

function* updateEntitySavingStatus() {
  yield race([
    take(ReduxActionTypes.UPDATE_ACTION_SUCCESS),
    take(ReduxActionTypes.SAVE_PAGE_SUCCESS),
    take(ReduxActionTypes.UPDATE_JS_ACTION_BODY_SUCCESS),
  ]);

  yield put({
    type: ReduxActionTypes.ENTITY_UPDATE_SUCCESS,
  });
}

export function* watchActionSagas() {
  yield all([
    takeEvery(ReduxActionTypes.FETCH_ACTIONS_INIT, fetchActionsSaga),
    takeEvery(
      ReduxActionTypes.FETCH_ACTIONS_VIEW_MODE_INIT,
      fetchActionsForViewModeSaga,
    ),
    takeLatest(
      ReduxActionTypes.FETCH_ACTIONS_FOR_PAGE_INIT,
      fetchActionsForPageSaga,
    ),
    takeLatest(
      ReduxActionTypes.ENTITY_UPDATE_STARTED,
      updateEntitySavingStatus,
    ),
  ]);
}
