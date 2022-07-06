import React, { Component } from "react";
import styled, { ThemeProvider } from "styled-components";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, Route } from "react-router";
import { Switch } from "react-router-dom";
import { AppState } from "reducers";
import {
  AppViewerRouteParams,
  BuilderRouteParams,
  getApplicationViewerPageURL,
} from "constants/routes";
import {
  PageListPayload,
  ReduxActionTypes,
} from "constants/ReduxActionConstants";
import { getIsInitialized } from "selectors/appViewSelectors";
import { executeAction } from "actions/widgetActions";
import { ExecuteActionPayload } from "constants/AppsmithActionConstants/ActionConstants";
import { updateWidgetPropertyRequest } from "actions/controlActions";
import { RenderModes } from "constants/WidgetConstants";
import { EditorContext } from "components/editorComponents/EditorContextProvider";
import AppViewerPageContainer from "./AppViewerPageContainer";
import {
  resetChildrenMetaProperty,
  updateWidgetMetaProperty,
} from "actions/metaActions";
import { editorInitializer } from "utils/EditorUtils";
import * as Sentry from "@sentry/react";
import log from "loglevel";
import {
  getViewModePageList,
  getShowTabBar,
  isMobileLayout,
} from "selectors/editorSelectors";
import AppComments from "comments/AppComments/AppComments";
import AddCommentTourComponent from "comments/tour/AddCommentTourComponent";
import CommentShowCaseCarousel from "comments/CommentsShowcaseCarousel";
import { getThemeDetails, ThemeMode } from "selectors/themeSelectors";
import { Theme } from "constants/DefaultTheme";
import GlobalHotKeys from "./GlobalHotKeys";
import TabBar from "components/designSystems/taro/TabBar";
import PreviewQRCode from "./PreviewQRCode";
import AppViewerLayout from "./viewer/AppViewerLayout";

const SentryRoute = Sentry.withSentryRouting(Route);

const AppViewerBody = styled.section<{
  showTabBar: boolean;
  isMobile: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  height: calc(
    100vh - ${(props) => (props.isMobile ? "0px" : "168px")} -
      ${(props) => (props.showTabBar ? "60px" : "0px")}
  );
`;

const ContainerWithComments = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  transform: translate(0, 0);
`;

const AppViewerBodyContainer = styled.div<{ width?: string }>`
  flex: 1;
  overflow: auto;
  margin: 0 auto;
`;

const StableContainer = styled.div<{
  isMobile: boolean;
}>`
  position: relative;
  overflow: hidden;
  background: ${(props) =>
    props.isMobile ? "radial-gradient(#2cbba633, #ffec8f36)" : "#fff"};
`;

export type AppViewerProps = {
  initializeAppViewer: (applicationId: string, pageId?: string) => void;
  isInitialized: boolean;
  isInitializeError: boolean;
  executeAction: (actionPayload: ExecuteActionPayload) => void;
  updateWidgetProperty: (
    widgetId: string,
    propertyName: string,
    propertyValue: any,
  ) => void;
  updateWidgetMetaProperty: (
    widgetId: string,
    propertyName: string,
    propertyValue: any,
  ) => void;
  resetChildrenMetaProperty: (widgetId: string) => void;
  pages: PageListPayload;
  lightTheme: Theme;
  showTabBar: boolean;
  isMobile: boolean;
  isEmbed: boolean;
} & RouteComponentProps<BuilderRouteParams>;

class AppViewer extends Component<
  AppViewerProps & RouteComponentProps<AppViewerRouteParams>
> {
  public state = {
    registered: false,
    isSideNavOpen: true,
  };
  componentDidMount() {
    editorInitializer().then(() => {
      this.setState({ registered: true });
    });
    const { applicationId, pageId } = this.props.match.params;
    log.debug({ applicationId, pageId });
    if (applicationId) {
      this.props.initializeAppViewer(applicationId, pageId);
    }
  }

  toggleCollapse = (open: boolean) => {
    this.setState({ isSideNavOpen: open });
  };

  public render() {
    const { isInitialized, isMobile, showTabBar, isEmbed } = this.props;
    return (
      <ThemeProvider theme={this.props.lightTheme}>
        <GlobalHotKeys>
          <EditorContext.Provider
            value={{
              executeAction: this.props.executeAction,
              updateWidgetMetaProperty: this.props.updateWidgetMetaProperty,
              resetChildrenMetaProperty: this.props.resetChildrenMetaProperty,
            }}
          >
            <AppViewerLayout>
              <StableContainer isMobile={isMobile}>
                <ContainerWithComments>
                  <AppComments isInline />
                  <AppViewerBodyContainer>
                    <AppViewerBody
                      showTabBar={showTabBar}
                      isMobile={isMobile || isEmbed}
                    >
                      {isInitialized && this.state.registered && (
                        <Switch>
                          <SentryRoute
                            component={AppViewerPageContainer}
                            exact
                            path={getApplicationViewerPageURL()}
                          />
                          <SentryRoute
                            component={AppViewerPageContainer}
                            exact
                            path={`${getApplicationViewerPageURL()}/fork`}
                          />
                        </Switch>
                      )}
                    </AppViewerBody>
                  </AppViewerBodyContainer>
                </ContainerWithComments>
                <AddCommentTourComponent />
                <CommentShowCaseCarousel />
                <TabBar />
                <PreviewQRCode />
              </StableContainer>
            </AppViewerLayout>
          </EditorContext.Provider>
        </GlobalHotKeys>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  isInitialized: getIsInitialized(state),
  pages: getViewModePageList(state),
  lightTheme: getThemeDetails(state, ThemeMode.LIGHT),
  showTabBar: getShowTabBar(state),
  isMobile: isMobileLayout(state),
  isEmbed: !!new URLSearchParams(window.location.search).get("embed"),
});

const mapDispatchToProps = (dispatch: any) => ({
  executeAction: (actionPayload: ExecuteActionPayload) =>
    dispatch(executeAction(actionPayload)),
  updateWidgetProperty: (
    widgetId: string,
    propertyName: string,
    propertyValue: any,
  ) =>
    dispatch(
      updateWidgetPropertyRequest(
        widgetId,
        propertyName,
        propertyValue,
        RenderModes.PAGE,
      ),
    ),
  updateWidgetMetaProperty: (
    widgetId: string,
    propertyName: string,
    propertyValue: any,
  ) =>
    dispatch(updateWidgetMetaProperty(widgetId, propertyName, propertyValue)),
  resetChildrenMetaProperty: (widgetId: string) =>
    dispatch(resetChildrenMetaProperty(widgetId)),
  initializeAppViewer: (applicationId: string, pageId?: string) => {
    dispatch({
      type: ReduxActionTypes.INITIALIZE_PAGE_VIEWER,
      payload: { applicationId, pageId },
    });
  },
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Sentry.withProfiler(AppViewer)),
);
