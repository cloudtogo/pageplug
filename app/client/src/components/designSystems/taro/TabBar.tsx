import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { AppState } from "reducers";
import {
  getViewModePageList,
  getCurrentPageId,
  getShowTabBar,
} from "selectors/editorSelectors";
import { getAppMode } from "selectors/applicationSelectors";
import { APP_MODE } from "entities/App";
import {
  PageListPayload,
  ApplicationPayload,
} from "@appsmith/constants/ReduxActionConstants";
import { Tabbar } from "@taroify/core";
import { createVanIconComponent } from "@taroify/icons/van";
import history from "utils/history";
import { builderURL, viewerURL } from "RouteBuilder";

const TabBarContainer = styled.div<{
  mode?: APP_MODE;
}>`
  position: ${(props) => (props.mode === APP_MODE.EDIT ? "unset" : "fixed")};
  left: 0;
  right: 0;
  bottom: 0;
  height: ${(props) => props.theme.tabbarHeight};
  background: ${(props) =>
    props.mode === APP_MODE.EDIT ? "transparent" : "#ffec8f36"};
  overflow-y: scroll;
`;

const Center = styled.div`
  height: 100%;
  width: 450px;
  margin: 0 auto;
`;

export type TabbarProps = {
  pages: PageListPayload;
  currentApplicationDetails?: ApplicationPayload;
  currentPageId?: string;
  mode?: APP_MODE;
  showTabBar: boolean;
};

const TabBar = ({
  pages,
  currentApplicationDetails,
  currentPageId,
  mode,
  showTabBar,
}: TabbarProps) => {
  const jumpTo = (target: string) => {
    const urlBuilder = mode === APP_MODE.PUBLISHED ? viewerURL : builderURL;
    history.push(
      urlBuilder({
        applicationSlug: currentApplicationDetails?.slug,
        pageId: target,
      }),
    );
  };

  if (!showTabBar) {
    return null;
  }

  return (
    <TabBarContainer mode={mode}>
      <Center>
        <Tabbar value={currentPageId} onChange={jumpTo}>
          {pages.map((page) => {
            const { pageName, pageId, icon } = page;
            const Icon = createVanIconComponent(icon as any);
            return (
              <Tabbar.TabItem icon={<Icon />} key={pageId} value={pageId}>
                {pageName}
              </Tabbar.TabItem>
            );
          })}
        </Tabbar>
      </Center>
    </TabBarContainer>
  );
};

const mapStateToProps = (state: AppState) => ({
  pages: getViewModePageList(state)?.filter((p) => !!p.icon),
  currentApplicationDetails: state.ui.applications.currentApplication,
  currentPageId: getCurrentPageId(state),
  mode: getAppMode(state),
  showTabBar: getShowTabBar(state),
});

export default connect(mapStateToProps)(TabBar);
