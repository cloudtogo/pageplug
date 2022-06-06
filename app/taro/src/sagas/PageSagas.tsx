import CanvasWidgetsNormalizer from "normalizers/CanvasWidgetsNormalizer";
import { AppState } from "reducers";
import {
  Page,
  PageListPayload,
  ReduxAction,
  ReduxActionErrorTypes,
  ReduxActionTypes,
  UpdateCanvasPayload,
} from "constants/ReduxActionConstants";
import {
  FetchPageListPayload,
  fetchPageSuccess,
  fetchPublishedPageSuccess,
  setUrlData,
  initCanvasLayout,
  updateCurrentPage,
  saveLayout,
  setLastUpdatedTime,
} from "actions/pageActions";
import PageApi, {
  FetchPageListResponse,
  FetchPageRequest,
  FetchPageResponse,
  FetchPublishedPageRequest,
  FetchPublishedPageResponse,
  PageLayout,
} from "api/PageApi";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import {
  checkIfMigrationIsNeeded,
  extractCurrentDSL,
} from "utils/WidgetPropsUtils";
import { getAllPageIds } from "./selectors";
import { validateResponse } from "./ErrorSagas";
import { executePageLoadActions } from "actions/widgetActions";
import {
  getCurrentApplicationId,
  getCurrentPageId,
  getCurrentPageName,
} from "selectors/editorSelectors";
import { fetchActionsForPage } from "actions/actionActions";
import { clearEvalCache } from "./EvaluationsSaga";
import log from "loglevel";
import DEFAULT_TEMPLATE from "templates/default";
import Taro from "@tarojs/taro";
import { UrlDataState } from "reducers/entityReducers/appReducer";

export function* fetchPageListSaga(
  fetchPageListAction: ReduxAction<FetchPageListPayload>
) {
  try {
    const { applicationId } = fetchPageListAction.payload;
    const apiCall = PageApi.fetchPageListViewMode;
    const response: FetchPageListResponse = yield call(apiCall, applicationId);
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      const orgId = response.data.organizationId;
      const pages: PageListPayload = response.data.pages.map((page) => ({
        pageName: page.name,
        pageId: page.id,
        isDefault: page.isDefault,
        isHidden: !!page.isHidden,
        icon: page.icon,
      }));
      yield put({
        type: ReduxActionTypes.SET_CURRENT_ORG_ID,
        payload: {
          orgId,
        },
      });
      yield put({
        type: ReduxActionTypes.FETCH_PAGE_LIST_SUCCESS,
        payload: {
          pages,
          applicationId,
        },
      });
    } else {
      yield put({
        type: ReduxActionErrorTypes.FETCH_PAGE_LIST_ERROR,
        payload: {
          error: response.responseMeta.error,
        },
      });
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_PAGE_LIST_ERROR,
      payload: {
        error,
      },
    });
  }
}

export const getCanvasWidgetsPayload = (
  pageResponse: FetchPageResponse
): UpdateCanvasPayload => {
  const normalizedResponse = CanvasWidgetsNormalizer.normalize(
    extractCurrentDSL(pageResponse)
  );
  return {
    pageWidgetId: normalizedResponse.result,
    currentPageName: pageResponse.data.name,
    currentPageId: pageResponse.data.id,
    widgets: normalizedResponse.entities.canvasWidgets,
    currentLayoutId: pageResponse.data.layouts[0].id, // TODO(abhinav): Handle for multiple layouts
    currentApplicationId: pageResponse.data.applicationId,
    pageActions: pageResponse.data.layouts[0].layoutOnLoadActions || [],
  };
};

function* handleFetchedPage({
  fetchPageResponse,
  isFirstLoad = false,
  pageId,
}: {
  fetchPageResponse: FetchPageResponse;
  pageId: string;
  isFirstLoad?: boolean;
}) {
  const isValidResponse = yield validateResponse(fetchPageResponse);
  const willPageBeMigrated = checkIfMigrationIsNeeded(fetchPageResponse);
  const lastUpdatedTime = getLastUpdateTime(fetchPageResponse);

  if (isValidResponse) {
    // Clear any existing caches
    yield call(clearEvalCache);
    // Get Canvas payload
    const canvasWidgetsPayload = getCanvasWidgetsPayload(fetchPageResponse);
    // Update the canvas
    yield put(initCanvasLayout(canvasWidgetsPayload));
    // set current page
    yield put(updateCurrentPage(pageId));
    // Set url params
    yield call(setDataUrl);
    // dispatch fetch page success
    yield put(
      fetchPageSuccess(
        // Execute page load actions post page load
        isFirstLoad ? [] : [executePageLoadActions()]
      )
    );
    // Sets last updated time
    yield put(setLastUpdatedTime(lastUpdatedTime));
    const extractedDSL = extractCurrentDSL(fetchPageResponse);
    yield put({
      type: ReduxActionTypes.UPDATE_CANVAS_STRUCTURE,
      payload: extractedDSL,
    });

    if (willPageBeMigrated) {
      yield put(saveLayout());
    }
  }
}
const getLastUpdateTime = (pageResponse: FetchPageResponse): number =>
  pageResponse.data.lastUpdatedTime;

export function* fetchPageSaga(
  pageRequestAction: ReduxAction<FetchPageRequest>
) {
  try {
    const { id, isFirstLoad } = pageRequestAction.payload;
    const fetchPageResponse: FetchPageResponse = yield call(PageApi.fetchPage, {
      id,
    });
    yield handleFetchedPage({
      fetchPageResponse,
      pageId: id,
      isFirstLoad,
    });
  } catch (error) {
    log.error(error);
    yield put({
      type: ReduxActionErrorTypes.FETCH_PAGE_ERROR,
      payload: {
        error,
      },
    });
  }
}

export function* fetchPublishedPageSaga(
  pageRequestAction: ReduxAction<{
    pageId: string;
    bustCache: boolean;
    urlData?: UrlDataState;
  }>
) {
  try {
    const { bustCache, pageId, urlData } = pageRequestAction.payload;
    const request: FetchPublishedPageRequest = {
      pageId,
      bustCache,
    };
    const response: FetchPublishedPageResponse = yield call(
      PageApi.fetchPublishedPage,
      request
    );
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      // update navigator title
      if (response.data?.name) {
        Taro.setNavigationBarTitle({
          title: response.data?.name,
        });
      }
      // Clear any existing caches
      yield call(clearEvalCache);
      // Get Canvas payload
      const canvasWidgetsPayload = getCanvasWidgetsPayload(response);
      // Update the canvas
      yield put(initCanvasLayout(canvasWidgetsPayload));
      // set current page
      yield put(updateCurrentPage(pageId));
      // Set url params
      yield call(setDataUrl, urlData);
      // dispatch fetch page success
      yield put(
        fetchPublishedPageSuccess(
          // Execute page load actions post published page eval
          [executePageLoadActions()]
        )
      );
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_PUBLISHED_PAGE_ERROR,
      payload: {
        error,
      },
    });
  }
}

export function* fetchAllPublishedPagesSaga() {
  try {
    const pageIds = yield select(getAllPageIds);
    yield all(
      pageIds.map((pageId: string) => {
        return call(PageApi.fetchPublishedPage, { pageId });
      })
    );
  } catch (error) {
    log.error({ error });
  }
}

export function* updateCanvasWithDSL(
  data: PageLayout,
  pageId: string,
  layoutId: string
) {
  const normalizedWidgets = CanvasWidgetsNormalizer.normalize(data.dsl);
  const currentPageName = yield select(getCurrentPageName);
  const applicationId = yield select(getCurrentApplicationId);
  const canvasWidgetsPayload: UpdateCanvasPayload = {
    pageWidgetId: normalizedWidgets.result,
    currentPageName,
    currentPageId: pageId,
    currentLayoutId: layoutId,
    currentApplicationId: applicationId,
    pageActions: data.layoutOnLoadActions,
    widgets: normalizedWidgets.entities.canvasWidgets,
  };
  yield put(initCanvasLayout(canvasWidgetsPayload));
  yield put(fetchActionsForPage(pageId));
}

function* fetchPageDSLSaga(pageId: string) {
  try {
    const fetchPageResponse: FetchPageResponse = yield call(PageApi.fetchPage, {
      id: pageId,
    });
    const isValidResponse: boolean = yield validateResponse(fetchPageResponse);
    if (isValidResponse) {
      return {
        pageId: pageId,
        dsl: extractCurrentDSL(fetchPageResponse),
      };
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_PAGE_DSL_ERROR,
      payload: {
        pageId: pageId,
        error,
        show: true,
      },
    });
    return {
      pageId: pageId,
      dsl: DEFAULT_TEMPLATE,
    };
  }
}

export function* populatePageDSLsSaga() {
  try {
    yield put({
      type: ReduxActionTypes.POPULATE_PAGEDSLS_INIT,
    });
    const pageIds: string[] = yield select((state: AppState) =>
      state.entities.pageList.pages.map((page: Page) => page.pageId)
    );
    const pageDSLs = yield all(
      pageIds.map((pageId: string) => {
        return call(fetchPageDSLSaga, pageId);
      })
    );
    yield put({
      type: ReduxActionTypes.FETCH_PAGE_DSLS_SUCCESS,
      payload: pageDSLs,
    });
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.POPULATE_PAGEDSLS_ERROR,
      payload: {
        error,
      },
    });
  }
}

export function* setDataUrl(inputData?: UrlDataState) {
  const queryParams: any = Taro.getCurrentInstance().router?.params || {};
  const applicationId = yield select(getCurrentApplicationId);
  const pageId = yield select(getCurrentPageId);
  const urlData: UrlDataState = {
    queryParams,
    applicationId,
    pageId,
  };
  yield put(setUrlData(inputData || urlData));
}

export default function* pageSagas() {
  yield all([
    takeLatest(ReduxActionTypes.FETCH_PAGE_INIT, fetchPageSaga),
    takeLatest(
      ReduxActionTypes.FETCH_PUBLISHED_PAGE_INIT,
      fetchPublishedPageSaga
    ),
    takeLatest(ReduxActionTypes.FETCH_PAGE_LIST_INIT, fetchPageListSaga),
    takeLatest(
      ReduxActionTypes.FETCH_ALL_PUBLISHED_PAGES,
      fetchAllPublishedPagesSaga
    ),
  ]);
}
