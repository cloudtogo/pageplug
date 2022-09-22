import CanvasWidgetsNormalizer from "normalizers/CanvasWidgetsNormalizer";
import { AppState } from "reducers";
import {
  Page,
  PageListPayload,
  ReduxAction,
  ReduxActionErrorTypes,
  ReduxActionTypes,
  UpdateCanvasPayload,
} from "@appsmith/constants/ReduxActionConstants";
import {
  FetchPageListPayload,
  fetchPageSuccess,
  fetchPublishedPageSuccess,
  setUrlData,
  initCanvasLayout,
  updateCurrentPage,
  saveLayout,
  setLastUpdatedTime,
  fetchAllPageEntityCompletion,
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
import { extractCurrentDSL } from "utils/WidgetPropsUtils";
import { checkIfMigrationIsNeeded } from "utils/DSLMigrations";
import { validateResponse } from "./ErrorSagas";
import {
  getCurrentApplicationId,
  getCurrentPageName,
} from "selectors/editorSelectors";
import {
  executePageLoadActions,
  fetchActionsForPage,
} from "actions/pluginActionActions";
import { fetchJSCollectionsForPage } from "actions/jsActionActions";
import { UrlDataState } from "reducers/entityReducers/appReducer";
import { clearEvalCache } from "./EvaluationsSaga";

import Taro from "@tarojs/taro";
import log from "loglevel";
import DEFAULT_TEMPLATE from "templates/default";

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
        slug: page.slug,
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
          applicationId: applicationId,
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

export function* handleFetchedPage({
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
  const pageSlug = fetchPageResponse.data.slug;

  if (isValidResponse) {
    // Clear any existing caches
    yield call(clearEvalCache);
    // Set url params
    yield call(setDataUrl);
    // Get Canvas payload
    const canvasWidgetsPayload = getCanvasWidgetsPayload(fetchPageResponse);
    // Update the canvas
    yield put(initCanvasLayout(canvasWidgetsPayload));
    // set current page
    yield put(updateCurrentPage(pageId, pageSlug));
    // dispatch fetch page success
    yield put(fetchPageSuccess());

    /* Currently, All Actions are fetched in initSagas and on pageSwitch we only fetch page
     */
    // Hence, if is not isFirstLoad then trigger evaluation with execute pageLoad action
    if (!isFirstLoad) {
      yield put(fetchAllPageEntityCompletion([executePageLoadActions()]));
    }

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
    firstLoad: boolean;
    urlData: UrlDataState;
  }>
) {
  try {
    const { bustCache, firstLoad, pageId, urlData } = pageRequestAction.payload;
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
      // Set url params
      yield call(setDataUrl, urlData);
      // Get Canvas payload
      const canvasWidgetsPayload = getCanvasWidgetsPayload(response);
      // Update the canvas
      yield put(initCanvasLayout(canvasWidgetsPayload));
      // set current page
      yield put(updateCurrentPage(pageId, response.data.slug));

      // dispatch fetch page success
      yield put(fetchPublishedPageSuccess());

      /* Currently, All Actions are fetched in initSagas and on pageSwitch we only fetch page
       */
      // Hence, if is not isFirstLoad then trigger evaluation with execute pageLoad action
      if (!firstLoad) {
        yield put(fetchAllPageEntityCompletion([executePageLoadActions()]));
      }
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
  yield put(fetchJSCollectionsForPage(pageId));
}

export function* setDataUrl(inputData?: UrlDataState) {
  const queryParams: any = Taro.getCurrentInstance().router?.params || {};
  const urlData: UrlDataState = {
    queryParams,
    protocol: "",
    host: "",
    hostname: "",
    port: "",
    pathname: "",
    hash: "",
    fullPath: "",
  };
  yield put(setUrlData(inputData || urlData));
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

export default function* pageSagas() {
  yield all([
    takeLatest(ReduxActionTypes.FETCH_PAGE_INIT, fetchPageSaga),
    takeLatest(
      ReduxActionTypes.FETCH_PUBLISHED_PAGE_INIT,
      fetchPublishedPageSaga
    ),
  ]);
}
