import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getAppMode } from "ee/selectors/applicationSelectors";
import { APP_MODE } from "entities/App";
import history from "utils/history";
import { builderURL, viewerURL } from "ee/RouteBuilder";
import { getCurrentPage } from "selectors/editorSelectors";
import type {
  ApplicationPayload,
  Page,
} from "ee/constants/ReduxActionConstants";
import { Icon } from "design-system";
import useThrottledRAF from "utils/hooks/useThrottledRAF";
import {
  get as _get,
  size as _size,
  head as _head,
  clone as _clone,
} from "lodash";
import { NAVIGATION_SETTINGS } from "constants/AppConstants";
import { useSelector } from "react-redux";
import { getSelectedAppTheme } from "selectors/appThemingSelectors";
import { getCurrentApplication } from "ee/selectors/applicationSelectors";
import { Menu, ConfigProvider } from "antd";
import { mapClearTree, filterHiddenTreeData } from "utils/treeUtils";
import { Container, ScrollBtnContainer } from "./TopStacked.styled";
import {
  getMenuItemTextColor,
  findPathNodes,
  getSecondMenuItemBackgroundColorOnHover,
  getMenuContainerBackgroundColor,
} from "../utils";
import styled from "styled-components";
import { View } from "@tarojs/components";

// TODO - @Dhruvik - ImprovedAppNav
// Replace with NavigationProps if nothing changes
// appsmith/app/client/src/pages/AppViewer/Navigation/constants.ts
interface TopStackedProps {
  currentApplicationDetails?: ApplicationPayload;
  pages: Page[];
}

const MyMenu = styled(Menu)<{
  theme: string;
  primaryColor: string;
  navColorStyle: any;
}>`
  color: "rgba(0,0,0,0.65)";
  max-width: 90%;
  .ant-menu-submenu {
    font-weight: 500;
  }
  .ant-menu-item {
    transition:
      border-color 0.1s,
      background 0.1s,
      color 0s !important;
  }
  .ant-menu-title-content {
    transition:
      opacity 0.1s,
      background 0.1s,
      color 0s !important;
  }
  .ant-menu-submenu-popup > .ant-menu .ant-menu-submenu-title {
    transition:
      opacity 0.1s,
      background 0.1s,
      color 0s !important;
  }
  .anticon {
    transition:
      opacity 0.1s,
      background 0.1s,
      color 0s !important;
  }
  .ant-menu .ant-menu-item .ant-menu-item-icon + span,
  .ant-menu .ant-menu-submenu-title .ant-menu-item-icon + span,
  .ant-menu .ant-menu-item .anticon + span,
  .ant-menu .ant-menu-submenu-title .anticon + span {
    transition:
      opacity 0s,
      margin 0s,
      color 0s;
  }
`;

const MenuContainer = styled.div<{
  isCenter?: boolean;
}>`
  max-width: 90%;
  padding: 0px 8px;
`;

export function TopStacked(props: TopStackedProps) {
  const { currentApplicationDetails, pages } = props;
  const selectedTheme = useSelector(getSelectedAppTheme);
  const appMode = useSelector(getAppMode);
  const navColorStyle =
    _get(
      currentApplicationDetails,
      "applicationDetail.navigationSetting.colorStyle",
      "",
    ) || NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT;
  const primaryColor = _get(
    selectedTheme,
    "properties.colors.primaryColor",
    "inherit",
  );
  const location = useLocation();
  const [query, setQuery] = useState("");
  const tabsRef = useRef<HTMLElement | null>(null);
  const [tabsScrollable, setTabsScrollable] = useState(false);
  const [shouldShowLeftArrow, setShouldShowLeftArrow] = useState(false);
  const [shouldShowRightArrow, setShouldShowRightArrow] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isScrollingLeft, setIsScrollingLeft] = useState(false);

  const currentApp = useSelector(getCurrentApplication);
  const currentPage = useSelector(getCurrentPage);

  const viewerLayout = currentApp?.viewerLayout;

  const getPath = (
    it: any,
    pagesMap: any,
    pageId: string,
    appMode: APP_MODE | undefined,
  ) => {
    if (!it.pageId || !pagesMap[pageId]) return "";
    const pageURL =
      appMode === APP_MODE.PUBLISHED
        ? viewerURL({
            basePageId: pagesMap[pageId].pageId,
          })
        : builderURL({
            basePageId: pagesMap[pageId].pageId,
          });
    return pageURL;
  };

  const gotToPath = (pId: string, path: string) => {
    history.push(path);
  };

  const initState = useMemo(() => {
    let menudata: any = [];
    const pagesMap = pages.reduce((a: any, c: any) => {
      a[c.pageId] = { ...c };
      return a;
    }, {});
    if (viewerLayout && pages.length) {
      try {
        const current = JSON.parse(viewerLayout);
        const _outsiderTree = current.outsiderTree || [];
        menudata = current?.treeData
          .map((itdata: any) => {
            return mapClearTree(itdata, (item: any) => {
              const path = getPath(item, pagesMap, item.pageId, appMode);
              const title = _get(
                pagesMap,
                [item.pageId, "pageName"],
                item.title,
              ); //用最新的 pageName
              if (_outsiderTree.find((n: any) => n.pageId === item.pageId)) {
                return false;
              }
              if (title && item.isPage && !pagesMap[item.pageId]) {
                // 不存在的 pageId, 删除掉
                return false;
              }
              // console.log(item?.icon, "icon");
              return {
                ...item,
                key: item.pageId || item.key,
                children: _size(item.children) ? item.children : null,
                label: item.pageId ? (
                  <a
                    key={item.pageId}
                    onClick={() => gotToPath(item.pageId, path)}
                  >
                    {title}
                  </a>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "5px",
                    }}
                  >
                    {title}
                    <span className="custom-expand-icon">
                      {_size(item.children) ? (
                        <Icon name="arrow-down-s-line" size={"md"} />
                      ) : (
                        ""
                      )}
                    </span>
                  </span>
                ),
                icon:
                  item.icon && item.icon !== "无" ? (
                    <View
                      className={`van-icon van-icon-${
                        item.icon ? item.icon : "orders-o"
                      } taroify-icon taroify-icon--inherit hydrated`}
                    />
                  ) : null,
              };
            });
          })
          .filter((i: any) => i);
      } catch (e) {
        console.log(e);
      }
    } else {
      menudata = pages.map((p) => {
        const path = getPath(p, pagesMap, p.pageId, appMode);
        return {
          title: p.pageName,
          pageId: p.pageId,
          isPage: true,
          key: p.pageId,
          label: p.pageId ? (
            <a key={p.pageId} onClick={() => gotToPath(p.pageId, path)}>
              {p.pageName}
            </a>
          ) : (
            p.pageName
          ),
          children: null,
        };
      });
    }
    return {
      menudata,
    };
  }, [viewerLayout, pages, currentApplicationDetails]);

  const activeMenuKeys = useMemo(() => {
    const currentPageId: any = currentPage?.pageId;
    const parentPaths = findPathNodes(initState.menudata, currentPageId);
    return { parentPaths };
  }, [currentPage?.pageId, initState.menudata]);

  useEffect(() => {
    setQuery(window.location.search);
  }, [location]);

  const setShowScrollArrows = useCallback(() => {
    if (tabsRef.current) {
      const { offsetWidth, scrollLeft, scrollWidth } = tabsRef.current;
      setShouldShowLeftArrow(scrollLeft > 0);
      setShouldShowRightArrow(scrollLeft + offsetWidth < scrollWidth);
    }
  }, [tabsRef.current]);

  const measuredTabsRef = useCallback((node) => {
    tabsRef.current = node;
    if (node !== null) {
      const { offsetWidth, scrollWidth } = node;
      setTabsScrollable(scrollWidth > offsetWidth);
      setShowScrollArrows();
    }
  }, []);

  const scroll = useCallback(() => {
    const currentOffset = tabsRef.current?.scrollLeft || 0;

    if (tabsRef.current) {
      tabsRef.current.scrollLeft = isScrollingLeft
        ? currentOffset - 5
        : currentOffset + 5;
      setShowScrollArrows();
    }
  }, [tabsRef.current, isScrollingLeft]);

  // eslint-disable-next-line
  const [_intervalRef, _rafRef, requestAF] = useThrottledRAF(scroll, 10);

  const stopScrolling = () => {
    setIsScrolling(false);
    setIsScrollingLeft(false);
  };

  const startScrolling = (isLeft: boolean) => {
    setIsScrolling(true);
    setIsScrollingLeft(isLeft);
  };

  useEffect(() => {
    let clear;
    if (isScrolling) {
      clear = requestAF();
    }
    return clear;
  }, [isScrolling, isScrollingLeft]);

  if (!_size(initState.menudata)) {
    return null;
  }
  const current_theme =
    _get(
      currentApplicationDetails,
      ["applicationDetail", "navigationSetting", "colorStyle"],
      "theme",
    ) === "theme"
      ? "dark"
      : "light";
  const isMenuPositionCenter =
    _get(
      currentApplicationDetails,
      ["applicationDetail", "navigationSetting", "position"],
      "",
    ) === "center";
  return (
    <Container
      className={`gap-x-2 flex items-center ${
        isMenuPositionCenter ? "justify-center" : ""
      } grow t--app-viewer-navigation-top-stack`}
      navColorStyle={navColorStyle}
      primaryColor={primaryColor}
    >
      {tabsScrollable && (
        <ScrollBtnContainer
          className="left-0 scroll-arrows"
          kind="tertiary"
          onMouseDown={() => startScrolling(true)}
          onMouseLeave={stopScrolling}
          onMouseUp={stopScrolling}
          onTouchEnd={stopScrolling}
          onTouchStart={() => startScrolling(true)}
          size="sm"
          startIcon="left-arrow-2"
          visible={shouldShowLeftArrow}
        />
      )}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: primaryColor,
          },
          components: {
            Menu: {
              darkItemSelectedColor: primaryColor,
              popupBg: "white",
              darkSubMenuItemBg: "white",
              darkItemColor: "rgba(255, 255, 255, 0.8)",
              darkItemHoverColor: getMenuItemTextColor(
                primaryColor,
                navColorStyle,
              ),
            },
          },
        }}
      >
        <MenuContainer className="menu-container">
          <MyMenu
            className="rootSideMenu pp-menu"
            // defaultSelectedKeys={activeMenuKeys.parentPaths}
            selectedKeys={activeMenuKeys.parentPaths}
            items={filterHiddenTreeData(initState.menudata)}
            mode="horizontal"
            navColorStyle={navColorStyle}
            overflowedIndicatorPopupClassName="menupop"
            primaryColor={primaryColor}
            style={{
              border: "none",
              backgroundColor: "transparent",
            }}
            theme={current_theme}
          />
        </MenuContainer>
      </ConfigProvider>
      {tabsScrollable && (
        <ScrollBtnContainer
          className="right-0 scroll-arrows"
          kind="tertiary"
          onMouseDown={() => startScrolling(false)}
          onMouseLeave={stopScrolling}
          onMouseUp={stopScrolling}
          onTouchEnd={stopScrolling}
          onTouchStart={() => startScrolling(false)}
          size="sm"
          startIcon="right-arrow-2"
          visible={shouldShowRightArrow}
        />
      )}
    </Container>
  );
}

export default TopStacked;
