/* eslint-disable react/react-in-jsx-scope */
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { View } from "@tarojs/components";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getAppMode } from "@appsmith/selectors/applicationSelectors";
import { APP_MODE } from "entities/App";
import history from "utils/history";
import { builderURL, viewerURL } from "RouteBuilder";
// import MenuItemContainer from "./components/MenuItemContainer";
// import MenuItem from "./components/MenuItem";
import type {
  ApplicationPayload,
  Page,
} from "@appsmith/constants/ReduxActionConstants";
import { Icon, IconSize } from "design-system-old";
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
import { getCurrentApplication } from "@appsmith/selectors/applicationSelectors";
import { Menu } from "antd";
import { mapClearTree } from "utils/treeUtils";
import { Container, ScrollBtnContainer } from "./TopStacked.styled";
import { makeRouteNode } from "../utils";

// TODO - @Dhruvik - ImprovedAppNav
// Replace with NavigationProps if nothing changes
// appsmith/app/client/src/pages/AppViewer/Navigation/constants.ts
type TopStackedProps = {
  currentApplicationDetails?: ApplicationPayload;
  pages: Page[];
};

export function TopStacked(props: TopStackedProps) {
  const { currentApplicationDetails, pages } = props;
  const selectedTheme = useSelector(getSelectedAppTheme);
  const appMode = useSelector(getAppMode);
  const navColorStyle =
    currentApplicationDetails?.applicationDetail?.navigationSetting
      ?.colorStyle || NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT;
  const primaryColor = _get(
    selectedTheme,
    "properties.colors.primaryColor",
    "inherit",
  );
  const location = useLocation();
  const { pathname } = location;
  const [query, setQuery] = useState("");
  const tabsRef = useRef<HTMLElement | null>(null);
  const [tabsScrollable, setTabsScrollable] = useState(false);
  const [shouldShowLeftArrow, setShouldShowLeftArrow] = useState(false);
  const [shouldShowRightArrow, setShouldShowRightArrow] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isScrollingLeft, setIsScrollingLeft] = useState(false);

  const currentApp = useSelector(getCurrentApplication);

  const viewerLayout = currentApp?.viewerLayout;
  const getPath = (it: any, pagesMap: any, title: string) => {
    if (!it.pageId) return "";
    const pageURL =
      appMode === APP_MODE.PUBLISHED
        ? viewerURL({
            pageId: pagesMap[title]?.pageId,
          })
        : builderURL({
            pageId: pagesMap[title]?.pageId,
          });
    return pageURL;
  };

  const gotToPath = (pId: string, path: string) => {
    history.push(path);
  };

  const initState = useMemo(() => {
    let menudata: any = [];
    if (viewerLayout && pages.length) {
      try {
        const current = JSON.parse(viewerLayout);
        const pagesMap = pages.reduce((a: any, c: any) => {
          a[c.pageName] = { ...c };
          return a;
        }, {});
        const newMenuTree: any = [];
        current?.treeData.forEach(
          makeRouteNode(pagesMap, newMenuTree, current.outsiderTree),
        );
        menudata = current?.treeData.map((itdata: any) => {
          return mapClearTree(itdata, (item: any) => {
            const path = getPath(item, pagesMap, item.title);
            if (
              current.outsiderTree.find((n: any) => n.pageId === item.pageId)
            ) {
              return false;
            }
            return {
              ...item,
              children: _size(item.children) ? item.children : null,
              label: item.pageId ? (
                <a
                  key={item.pageId}
                  onClick={() => gotToPath(item.pageId, path)}
                >
                  {item.title}
                </a>
              ) : (
                item.title
              ),
              icon: (
                <View
                  className={`van-icon van-icon-${item.icon} taroify-icon taroify-icon--inherit hydrated`}
                />
              ),
            };
          });
        });
        const newPages = Object.values(pagesMap)
          .filter(
            (p: any) =>
              !p.visited &&
              !current.outsiderTree.find((n: any) => n.pageId === p.pageId),
          )
          .map((p: any) => {
            const path = getPath(p, pagesMap, p.pageName);
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
        menudata = menudata.concat(newPages);
      } catch (e) {
        console.log(e);
      }
    } else {
      const pagesMap = pages.reduce((a: any, c: any) => {
        a[c.pageName] = { ...c };
        return a;
      }, {});
      menudata = pages.map((p) => {
        const path = getPath(p, pagesMap, p.pageName);
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
  useEffect(() => {
    setQuery(window.location.search);
  }, [location]);
  // Mark default page as first page
  const appPages = useMemo(() => {
    const list = _clone(pages);
    if (list.length > 1) {
      list.forEach((item, i) => {
        if (item.isDefault) {
          list.splice(i, 1);
          list.unshift(item);
        }
      });
    }
    return list;
  }, [pages]);

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

  if (
    !_size(initState.menudata) ||
    (_size(initState.menudata) === 1 &&
      !_get(initState.menudata, ["0", "children"], ""))
  ) {
    return null;
  }
  // console.log(initState.menudata, "menudata");
  const current_theme =
    _get(
      currentApplicationDetails,
      ["applicationDetail", "navigationSetting", "colorStyle"],
      "theme",
    ) === "theme"
      ? "dark"
      : "light";
  return (
    <Container
      className="relative px-6 py-1 t--app-viewer-navigation-top-stacked"
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

      <div
        className="w-full hidden-scrollbar gap-x-2  items-center"
        onScroll={() => setShowScrollArrows()}
        ref={measuredTabsRef}
      >
        <Menu
          defaultSelectedKeys={_get(_head(initState.menudata), "key")}
          mode="horizontal"
          theme={current_theme}
          items={initState.menudata}
          className="rootSideMenu"
          style={{
            border: "none",
          }}
        />
        {/* {appPages.map((page) => {
          return (
            <MenuItemContainer
              isTabActive={pathname.indexOf(page.pageId) > -1}
              key={page.pageId}
              setShowScrollArrows={setShowScrollArrows}
              tabsScrollable={tabsScrollable}
            >
              <MenuItem
                navigationSetting={
                  currentApplicationDetails?.applicationDetail
                    ?.navigationSetting
                }
                page={page}
                query={query}
              />
            </MenuItemContainer>
          );
        })} */}
      </div>
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
