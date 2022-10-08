import React, { useMemo } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { getIsFetchingPage } from "selectors/appViewSelectors";
import styled from "styled-components";
import { AppViewerRouteParams } from "constants/routes";
import { theme } from "constants/DefaultTheme";
import { Icon, NonIdealState, Spinner } from "@blueprintjs/core";
import Centered from "components/designSystems/appsmith/CenteredWrapper";
import AppPage from "./AppPage";
import {
  getCanvasWidth,
  getCurrentPageName,
  isMobileLayout,
} from "selectors/editorSelectors";
import RequestConfirmationModal from "pages/Editor/RequestConfirmationModal";
import { getCurrentApplication } from "selectors/applicationSelectors";
import {
  isPermitted,
  PERMISSION_TYPE,
} from "../Applications/permissionHelpers";
import { builderURL } from "RouteBuilder";
import {
  getCanvasWidgetsStructure,
  getCanvasWidgets,
} from "selectors/entitiesSelector";
import equal from "fast-deep-equal/es6";

const Section = styled.section<{
  height: number;
  isMobile: boolean;
}>`
  background: ${({ isMobile }) => (isMobile ? "#fff" : "transparent")};
  height: 100%;
  min-height: ${({ height }) => height}px;
  margin: 0 auto;
  position: relative;
  overflow-x: auto;
  overflow-y: auto;
`;

type AppViewerPageContainerProps = RouteComponentProps<AppViewerRouteParams>;

function AppViewerPageContainer(props: AppViewerPageContainerProps) {
  const currentPageName = useSelector(getCurrentPageName);
  const widgetsStructure = useSelector(getCanvasWidgetsStructure, equal);
  const widgetsConfig = useSelector(getCanvasWidgets);
  const canvasWidth = useSelector(getCanvasWidth);
  const isFetchingPage = useSelector(getIsFetchingPage);
  const currentApplication = useSelector(getCurrentApplication);
  const { match } = props;
  const hasFixedWidget = widgetsStructure.children?.find(
    (w) => w.type === "TARO_BOTTOM_BAR_WIDGET",
  );
  let fixedHeight = 0;
  if (hasFixedWidget) {
    fixedHeight = parseInt(widgetsConfig[hasFixedWidget?.widgetId]?.height);
  }
  const isMobile = useSelector(isMobileLayout);

  // get appsmith editr link
  const appsmithEditorLink = useMemo(() => {
    if (
      currentApplication?.userPermissions &&
      isPermitted(
        currentApplication?.userPermissions,
        PERMISSION_TYPE.MANAGE_APPLICATION,
      )
    ) {
      return (
        <p>
          想给页面添加组件？立即前往&nbsp;
          <Link
            to={builderURL({
              pageId: props.match.params.pageId as string,
            })}
          >
            页面编辑
          </Link>
        </p>
      );
    }
  }, [currentApplication?.userPermissions]);

  const pageNotFound = (
    <Centered>
      <NonIdealState
        description={appsmithEditorLink}
        icon={
          <Icon
            color={theme.colors.primaryOld}
            icon="page-layout"
            iconSize={theme.fontSizes[9]}
          />
        }
        title="页面空空如也😅"
      />
    </Centered>
  );

  const pageLoading = (
    <Centered>
      <Spinner />
    </Centered>
  );

  if (isFetchingPage) return pageLoading;

  if (!(widgetsStructure.children && widgetsStructure.children.length > 0))
    return pageNotFound;

  return (
    <Section
      height={widgetsStructure.bottomRow + fixedHeight}
      isMobile={isMobile}
      id="art-board"
    >
      <AppPage
        appName={currentApplication?.name}
        canvasWidth={canvasWidth}
        pageId={match.params.pageId}
        pageName={currentPageName}
        widgetsStructure={widgetsStructure}
      />
      <RequestConfirmationModal />
    </Section>
  );
}

export default withRouter(AppViewerPageContainer);
