import { useEffect, useContext, useCallback } from "react";
import { styled } from "linaria/react";
import { getIsInitialized } from "selectors/appViewSelectors";
import { executeTrigger } from "actions/widgetActions";
import { ExecuteTriggerPayload } from "constants/AppsmithActionConstants/ActionConstants";
import {
  resetChildrenMetaProperty,
  syncUpdateWidgetMetaProperty,
  triggerEvalOnMetaUpdate,
} from "actions/metaActions";
import {
  BatchPropertyUpdatePayload,
  batchUpdateWidgetProperty,
} from "actions/controlActions";
import { getShowTabBar } from "selectors/editorSelectors";
import { EditorContext } from "components/editorComponents/EditorContextProvider";
import AppViewerPageContainer from "./AppViewerPageContainer";
import { ConfigProvider } from "@taroify/core";
import { taroifyTheme } from "constants/DefaultTheme";
import TabBar from "components/designSystems/taro/TabBar";
import Taro from "@tarojs/taro";
import ReduxContext from "./ReduxContext";
import { editorInitializer } from "utils/EditorUtils";
import { APP_MODE } from "entities/App";
import { initAppViewer } from "actions/initActions";

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
  const isInitialized = useSelector(getIsInitialized);
  const showTabBar = useSelector(getShowTabBar);

  useEffect(() => {
    const { applicationId, pageId, branch, scene } =
      Taro.getCurrentInstance().router?.params || {};
    editorInitializer();
    let appId: string;
    if (scene) {
      Taro.setStorageSync(LATEST_SCENE_APP_ID, scene);
      appId = scene;
    } else if (applicationId) {
      appId = applicationId || "";
    } else {
      const lastScene = Taro.getStorageSync(LATEST_SCENE_APP_ID);
      appId = lastScene || DEFAULT_APP;
    }
    dispatch(
      initAppViewer({
        applicationId: appId,
        pageId: pageId || "",
        branch: branch || "",
        mode: APP_MODE.PUBLISHED,
      })
    );
  }, [dispatch]);

  /**
   * callback for executing an action
   */
  const executeActionCallback = useCallback(
    (actionPayload: ExecuteTriggerPayload) =>
      dispatch(executeTrigger(actionPayload)),
    [executeTrigger, dispatch]
  );

  /**
   * callback for initializing app
   */
  const resetChildrenMetaPropertyCallback = useCallback(
    (widgetId: string) => dispatch(resetChildrenMetaProperty(widgetId)),
    [resetChildrenMetaProperty, dispatch]
  );

  /**
   * callback for updating widget meta property in batch
   */
  const batchUpdateWidgetPropertyCallback = useCallback(
    (widgetId: string, updates: BatchPropertyUpdatePayload) =>
      dispatch(batchUpdateWidgetProperty(widgetId, updates)),
    [batchUpdateWidgetProperty, dispatch]
  );

  /**
   * callback for updating widget meta property
   */
  const syncUpdateWidgetMetaPropertyCallback = useCallback(
    (widgetId: string, propertyName: string, propertyValue: unknown) =>
      dispatch(
        syncUpdateWidgetMetaProperty(widgetId, propertyName, propertyValue)
      ),
    [syncUpdateWidgetMetaProperty, dispatch]
  );

  /**
   * callback for triggering evaluation
   */
  const triggerEvalOnMetaUpdateCallback = useCallback(
    () => dispatch(triggerEvalOnMetaUpdate()),
    [triggerEvalOnMetaUpdate, dispatch]
  );

  return (
    <EditorContext.Provider
      value={{
        executeAction: executeActionCallback,
        resetChildrenMetaProperty: resetChildrenMetaPropertyCallback,
        batchUpdateWidgetProperty: batchUpdateWidgetPropertyCallback,
        syncUpdateWidgetMetaProperty: syncUpdateWidgetMetaPropertyCallback,
        triggerEvalOnMetaUpdate: triggerEvalOnMetaUpdateCallback,
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
