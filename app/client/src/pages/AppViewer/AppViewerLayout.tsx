import type { ReactNode } from "react";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import styled from "styled-components";
import type { ProSettings } from "@ant-design/pro-components";
import {
  PageContainer,
  // ProCard,
  // ProConfigProvider,
  ProLayout,
  // ProBreadcrumb,
} from "@ant-design/pro-components";
// import { ConfigProvider } from "antd";
import history from "utils/history";
import type { RouteComponentProps } from "react-router";
import { withRouter } from "react-router";
import { getIsInitialized } from "selectors/appViewSelectors";
import { getViewModePageList, getCurrentPage } from "selectors/editorSelectors";
import {
  getCurrentApplication,
  isMobileLayout,
} from "selectors/applicationSelectors";
import { DEFAULT_VIEWER_LOGO } from "constants/AppConstants";
import { viewerURL } from "RouteBuilder";

const ColorfulLayout = styled.div<{
  color: string;
}>`
  --layout-header-bg-color: ${(props) =>
    props.color || props.theme.colors.primary};
`;

const getIconType = (icon: any) => (icon ? `icon-${icon}` : undefined);

const makeRouteNode =
  (pagesMap: any, newTree: any[], hideRow: any[]) => (node: any) => {
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
      node.children.forEach(makeRouteNode(pagesMap, routes, hideRow));
      item = {
        name: node.title,
        icon,
        path: "/",
        routes,
      };
    } else {
      item = {
        name: node.title,
        icon,
        path: "/",
      };
    }
    if (item) {
      if (!hideRow.find((hn) => hn.pageId === node.pageId)) {
        newTree.push(item);
      }
    }
  };

const StyledIcon = styled(Icon)`
  text-align: center;
  &.open-collapse {
    transform: rotate(180deg);
  }
`;

type AppViewerLayoutType = {
  children: ReactNode;
} & RouteComponentProps;

function AppViewerLayout({ children, location }: AppViewerLayoutType) {
  const isInitialized = useSelector(getIsInitialized);
  const isMobile = useSelector(isMobileLayout);
  const currentApp = useSelector(getCurrentApplication);
  const currentPage = useSelector(getCurrentPage);
  const pages = useSelector(getViewModePageList);
  const [collapsed, setCollapsed] = useState(true);
  const appName = currentApp?.name;
  const viewerLayout = currentApp?.viewerLayout;
  const isHidden = !!currentPage?.isHidden;
  const queryParams = new URLSearchParams(window.location.search);
  const isEmbed = !!queryParams.get("embed") || isHidden;

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
        current.treeData.forEach(
          makeRouteNode(pagesMap, newMenuTree, current.outsiderTree),
        );
        current.outsiderTree.forEach(
          makeRouteNode(pagesMap, newOuterTree, current.outsiderTree),
        );
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
  console.log(initState.treeData);

  if (isMobile || isEmbed) {
    return <div className="mobile-viewLayout">{children}</div>;
  }

  return (
    <ColorfulLayout color={initState.color}>
      <ProLayout
        title={appName}
        logo={initState.logoUrl || DEFAULT_VIEWER_LOGO}
        layout="mix"
        menuItemRender={(item: any, dom: any) => {
          return (
            <a
              onClick={() => {
                history.push(item.path);
              }}
            >
              {dom}
            </a>
          );
        }}
        route={{
          routes: initState.treeData,
        }}
        token={{
          header: {
            colorBgHeader: "var(--layout-header-bg-color)",
            colorHeaderTitle: "#fff",
            colorTextMenu: "#dfdfdf",
            colorTextMenuSecondary: "#dfdfdf",
            colorTextMenuSelected: "#fff",
            colorBgMenuItemSelected: "#22272b",
            colorTextRightActionsItem: "#dfdfdf",
          },
          sider: {
            colorMenuBackground: "#fff",
            colorMenuItemDivider: "#dfdfdf",
            colorTextMenu: "#595959",
            colorTextMenuSelected: "rgba(42,122,251,1)",
            colorBgMenuItemSelected: "rgba(230,243,254,1)",
          },
          // pageContainer: {
          //   paddingInlinePageContainerContent: 0,
          // },
        }}
      >
        <PageContainer>{children}</PageContainer>
      </ProLayout>
    </ColorfulLayout>
  );
}

export default withRouter(AppViewerLayout);
