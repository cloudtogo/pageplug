import { useEffect, useContext } from "react";
import { styled } from "linaria/react";
import { ReduxActionTypes } from "constants/ReduxActionConstants";
import { getIsInitialized } from "selectors/appViewSelectors";
import { executeAction } from "actions/widgetActions";
import { ExecuteActionPayload } from "constants/AppsmithActionConstants/ActionConstants";
import {
  resetChildrenMetaProperty,
  updateWidgetMetaProperty,
} from "actions/metaActions";
import { getShowTabBar } from "selectors/editorSelectors";
import { EditorContext } from "components/editorComponents/EditorContextProvider";
import AppViewerPageContainer from "./AppViewerPageContainer";
import { ConfigProvider } from "@taroify/core";
import { taroifyTheme } from "constants/DefaultTheme";
import TabBar from "components/designSystems/taro/TabBar";
import Taro from "@tarojs/taro";
import ReduxContext from "./ReduxContext";
import { editorInitializer } from "utils/EditorUtils";

const AppViewerBody = styled.section<{
  showTabBar: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  height: calc(
    100vh -
      ${(props) =>
        props.showTabBar ? "100rpx - constant(safe-area-inset-bottom)" : "0px"}
  );
  height: calc(
    100vh -
      ${(props) =>
        props.showTabBar ? "100rpx - env(safe-area-inset-bottom)" : "0px"}
  );
`;

const ContainerWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  transform: translate(0, 0);
`;

const AppViewerBodyContainer = styled.div`
  flex: 1;
  overflow: auto;
  margin: 0 auto;
`;

const LATEST_SCENE_APP_ID = "PAGEPLUG_LATEST_SCENE_APP_ID";

const AppViewer = () => {
  const { useDispatch, useSelector } = useContext(ReduxContext);
  const dispatch = useDispatch();
  const initializeAppViewer = (applicationId: string, pageId?: string) => {
    dispatch({
      type: ReduxActionTypes.INITIALIZE_PAGE_VIEWER,
      payload: { applicationId, pageId },
    });
  };
  const isInitialized = useSelector(getIsInitialized);
  const showTabBar = useSelector(getShowTabBar);

  useEffect(() => {
    const { applicationId, pageId, scene } =
      Taro.getCurrentInstance().router?.params || {};
    editorInitializer();
    if (scene) {
      Taro.setStorageSync(LATEST_SCENE_APP_ID, scene);
      initializeAppViewer(scene);
    } else if (applicationId) {
      initializeAppViewer(applicationId, pageId);
    } else {
      const lastScene = Taro.getStorageSync(LATEST_SCENE_APP_ID);
      initializeAppViewer(lastScene || DEFAULT_APP);
    }
  }, [dispatch]);

  return (
    <EditorContext.Provider
      value={{
        executeAction: (actionPayload: ExecuteActionPayload) =>
          dispatch(executeAction(actionPayload)),
        updateWidgetMetaProperty: (
          widgetId: string,
          propertyName: string,
          propertyValue: any
        ) =>
          dispatch(
            updateWidgetMetaProperty(widgetId, propertyName, propertyValue)
          ),
        resetChildrenMetaProperty: (widgetId: string) =>
          dispatch(resetChildrenMetaProperty(widgetId)),
      }}
    >
      <ConfigProvider theme={taroifyTheme}>
        <ContainerWrapper>
          <AppViewerBodyContainer>
            <AppViewerBody showTabBar={showTabBar}>
              {isInitialized && <AppViewerPageContainer />}
            </AppViewerBody>
          </AppViewerBodyContainer>
        </ContainerWrapper>
        <TabBar />
      </ConfigProvider>
    </EditorContext.Provider>
  );
};

export default AppViewer;
