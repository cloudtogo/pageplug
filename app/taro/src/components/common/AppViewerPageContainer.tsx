import React, { useContext } from "react";
import { getIsFetchingPage } from "selectors/appViewSelectors";
import { styled } from "linaria/react";
import { Loading, SafeArea } from "@taroify/core";
import AppPage from "./AppPage";
import {
  getCanvasWidgetDsl,
  getCurrentPageName,
} from "selectors/editorSelectors";
import { getCurrentApplication } from "selectors/applicationSelectors";
import ReduxContext from "./ReduxContext";

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  .taroify-loading {
    color: var(--primary-color);

    .taroify-loading__text {
      color: var(--primary-color);
    }
  }
`;

const Section = styled.section`
  background: #f6f6f6;
  height: max-content;
  min-height: 100%;
  margin: 0 auto;
  position: relative;
  overflow-x: auto;
  overflow-y: auto;
`;

const SafeFixedArea = styled.div<{
  height: number;
}>`
  margin-bottom: ${(props) => props.height}px;
`;

const AppViewerPageContainer: any = () => {
  const { useSelector } = useContext(ReduxContext);
  const currentApp = useSelector(getCurrentApplication);
  const widgets = useSelector(getCanvasWidgetDsl);
  const isFetchingPage = useSelector(getIsFetchingPage);
  const currentPageName = useSelector(getCurrentPageName);
  const currentAppName = currentApp?.name;
  const hasFixedWidget = widgets.children?.find(
    (w) => w.type === "TARO_BOTTOM_BAR_WIDGET"
  );

  const pageNotFound = <div>页面空空如也😅</div>;
  if (isFetchingPage) {
    return (
      <LoadingContainer>
        <Loading size="48px" />
      </LoadingContainer>
    );
  } else if (
    !isFetchingPage &&
    !(widgets && widgets.children && widgets.children.length > 0)
  ) {
    return pageNotFound;
  } else if (!isFetchingPage && widgets) {
    return (
      <Section>
        <AppPage
          appName={currentAppName}
          dsl={widgets}
          pageName={currentPageName}
        />
        {hasFixedWidget ? (
          <SafeFixedArea height={hasFixedWidget?.height || 0} />
        ) : null}
        <SafeArea position="bottom" />
      </Section>
    );
  }
};

export default AppViewerPageContainer;
