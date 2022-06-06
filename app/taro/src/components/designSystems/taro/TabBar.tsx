import React, { useContext } from "react";
import { styled } from "linaria/react";
import {
  getViewModePageList,
  getCurrentPageId,
  getShowTabBar,
} from "selectors/editorSelectors";
import { PageListPayload } from "constants/ReduxActionConstants";
import { Tabbar, SafeArea } from "@taroify/core";
import { createVanIconComponent } from "@taroify/icons/van";
import { fetchPublishedPage } from "actions/pageActions";
import ReduxContext from "components/common/ReduxContext";

const TabBarContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;

const TabBar = () => {
  const { useDispatch, useSelector } = useContext(ReduxContext);
  const dispatch = useDispatch();
  const pages: PageListPayload = useSelector(getViewModePageList)?.filter(
    (p: any) => !!p.icon
  );
  const currentPageId = useSelector(getCurrentPageId);
  const showTabBar = useSelector(getShowTabBar);

  const jumpTo = (target: string) => {
    dispatch(fetchPublishedPage(target, false));
  };

  if (!showTabBar) {
    return null;
  }

  return (
    <TabBarContainer>
      <Tabbar value={currentPageId} onChange={jumpTo}>
        {pages.map((page: any) => {
          const { pageName, pageId, icon } = page;
          const Icon = createVanIconComponent(icon as any);
          return (
            <Tabbar.TabItem icon={<Icon />} key={pageId} value={pageId}>
              {pageName}
            </Tabbar.TabItem>
          );
        })}
      </Tabbar>
      <SafeArea position="bottom" />
    </TabBarContainer>
  );
};

export default TabBar;
