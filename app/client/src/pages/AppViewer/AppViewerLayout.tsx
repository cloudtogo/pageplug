import React, { ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import ProLayout, { PageContainer } from "@ant-design/pro-layout";
import history from "utils/history";
import { withRouter, RouteComponentProps } from "react-router";
import { getIsInitialized } from "selectors/appViewSelectors";
import { isMobileLayout, getViewModePageList } from "selectors/editorSelectors";
import { getCurrentApplication } from "selectors/applicationSelectors";
import { DEFAULT_VIEWER_LOGO } from "constants/AppConstants";
import { viewerURL } from "RouteBuilder";

const StaticHeader = styled.div`
  background: var(--layout-header-bg-color);
  height: 100%;
  margin: 0 -16px;
`;

const ColorfulLayout = styled.div<{
  color: string;
}>`
  --layout-header-bg-color: ${(props) =>
    props.color || props.theme.colors.primary};
`;

const getIconType = (icon: any) => (icon ? `icon-${icon}` : undefined);

const makeRouteNode = (pagesMap: any, newTree: any[]) => (node: any) => {
  let item: any;
  const icon = getIconType(node.icon);
  if (node.isPage) {
    if (pagesMap[node.title]) {
      item = {
        name: node.title,
        icon,
        path: viewerURL({
          pageId: pagesMap[node.title].pageId,
        }),
      };
      pagesMap[node.title].visited = true;
    }
  } else if (node.children) {
    const routes: any = [];
    node.children.forEach(makeRouteNode(pagesMap, routes));
    item = {
      name: node.title,
      icon,
      routes,
    };
  } else {
    item = {
      name: node.title,
      icon,
    };
  }
  if (item) {
    newTree.push(item);
  }
};

type AppViewerLayoutType = {
  children: ReactNode;
} & RouteComponentProps;

function AppViewerLayout({ children, location }: AppViewerLayoutType) {
  const isInitialized = useSelector(getIsInitialized);
  const isMobile = useSelector(isMobileLayout);
  const currentApp = useSelector(getCurrentApplication);
  const pages = useSelector(getViewModePageList);
  const appName = currentApp?.name;
  const viewerLayout = currentApp?.viewerLayout;
  const queryParams = new URLSearchParams(window.location.search);
  const isEmbed = !!queryParams.get("embed");

  const initState = useMemo(() => {
    let init = {
      logoUrl: "",
      color: "",
      treeData: pages.map((p) => ({
        name: p.pageName,
        icon: getIconType(p.icon),
        path: viewerURL({
          pageId: p.pageId,
        }),
      })),
    };
    if (viewerLayout && pages.length) {
      try {
        const current = JSON.parse(viewerLayout);
        const pagesMap = pages.reduce((a: any, c: any) => {
          a[c.pageName] = { ...c };
          return a;
        }, {});
        const newMenuTree: any = [];
        const newOuterTree: any = [];
        current.treeData.forEach(makeRouteNode(pagesMap, newMenuTree));
        current.outsiderTree.forEach(makeRouteNode(pagesMap, newOuterTree));
        const newPages = Object.values(pagesMap)
          .filter((p: any) => !p.visited)
          .map((p: any) => ({
            name: p.pageName,
            icon: getIconType(p.icon),
            path: viewerURL({
              pageId: p.pageId,
            }),
          }));

        init = {
          logoUrl: current.logoUrl,
          color: current.color,
          treeData: newMenuTree.concat(newPages),
        };
      } catch (e) {
        console.log(e);
      }
    }
    return init;
  }, [viewerLayout, pages]);

  if (!isInitialized) {
    return null;
  }

  if (isMobile || isEmbed) {
    return <div>{children}</div>;
  }

  return (
    <ColorfulLayout color={initState.color}>
      <ProLayout
        navTheme="light"
        title={appName}
        logo={initState.logoUrl || DEFAULT_VIEWER_LOGO}
        // waterMarkProps={{
        //   content: appName,
        // }}
        headerContentRender={() => <StaticHeader />}
        location={location}
        collapsedButtonRender={false}
        menuItemRender={(item: any, dom: any) => (
          <a
            onClick={() => {
              history.push(item.path);
            }}
          >
            {dom}
          </a>
        )}
        iconfontUrl="//at.alicdn.com/t/font_3399269_yx9ykuzs72.js"
        route={{
          routes: initState.treeData,
        }}
      >
        <PageContainer>{children}</PageContainer>
      </ProLayout>
    </ColorfulLayout>
  );
}

export default withRouter(AppViewerLayout);
