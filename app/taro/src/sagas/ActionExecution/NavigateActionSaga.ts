import { select, put } from "redux-saga/effects";
import {
  getPageList,
  getCurrentApplicationId,
  getCurrentPage,
} from "selectors/editorSelectors";
import _ from "lodash";
import { Page } from "@appsmith/constants/ReduxActionConstants";
import { convertToQueryParams } from "RouteBuilder";
import { NavigateActionDescription } from "entities/DataTree/actionTriggers";
import { fetchPublishedPage } from "actions/pageActions";
import { UrlDataState } from "reducers/entityReducers/appReducer";
import Taro from "@tarojs/taro";

const MAIN_PAGE_PATH = "/pages/index/index";
const LV1_PAGE_PATH = "/pages/page1/index";

export default function* navigateActionSaga(
  action: NavigateActionDescription["payload"]
) {
  const pageList: Page[] = yield select(getPageList);
  const applicationId = yield select(getCurrentApplicationId);
  const { pageNameOrUrl, params } = action;
  const page = _.find(
    pageList,
    (page: Page) => page.pageName === pageNameOrUrl
  );

  if (page) {
    const currentPage = yield select(getCurrentPage);
    const currentPageStacks = Taro.getCurrentPages();
    const onMainPage = currentPageStacks.length === 1;
    const currentIsTab = !!currentPage.icon;
    const targetIsTab = !!page.icon;
    const queryParams = {
      ...params,
      applicationId,
      pageId: page.pageId,
    };
    const query = convertToQueryParams(queryParams);

    if (currentIsTab === targetIsTab) {
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
      yield put(fetchPublishedPage(page.pageId, false, false, urlData));
    } else if (onMainPage) {
      Taro.navigateTo({
        url: `${LV1_PAGE_PATH}${query}`,
      });
    } else {
      Taro.reLaunch({
        url: `${MAIN_PAGE_PATH}${query}`,
      });
    }
  }
}
