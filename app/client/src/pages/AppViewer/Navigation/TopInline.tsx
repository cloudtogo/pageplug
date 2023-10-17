import { useLocation } from "react-router-dom";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import type {
  ApplicationPayload,
  Page,
} from "@appsmith/constants/ReduxActionConstants";
import history from "utils/history";
// import { NAVIGATION_SETTINGS } from "constants/AppConstants";
import { useWindowSizeHooks } from "utils/hooks/dragResizeHooks";
import { NavLink } from "react-router-dom";
import { getAppMode } from "@appsmith/selectors/applicationSelectors";
import { APP_MODE } from "entities/App";
import { builderURL, viewerURL } from "RouteBuilder";
import MenuItem from "./components/MenuItem";
import { Container } from "./TopInline.styled";
import MenuItemContainer from "./components/MenuItemContainer";
import MoreDropdownButton from "./components/MoreDropdownButton";
import { getCanvasWidth, previewModeSelector } from "selectors/editorSelectors";
import { useSelector } from "react-redux";
import { getIsAppSettingsPaneWithNavigationTabOpen } from "selectors/appSettingsPaneSelectors";
import { throttle, get as _get, size as _size, head as _head } from "lodash";
import { getCurrentApplication } from "@appsmith/selectors/applicationSelectors";
import { Menu } from "antd";
import { makeRouteNode } from "../utils";
import { mapClearTree } from "utils/treeUtils";
// TODO - @Dhruvik - ImprovedAppNav
// Replace with NavigationProps if nothing changes
// appsmith/app/client/src/pages/AppViewer/Navigation/constants.ts
type TopInlineProps = {
  currentApplicationDetails?: ApplicationPayload;
  pages: Page[];
};

export function TopInline(props: TopInlineProps) {
  const { currentApplicationDetails, pages } = props;
  // const selectedTheme = useSelector(getSelectedAppTheme);
  // const navColorStyle =
  //   currentApplicationDetails?.applicationDetail?.navigationSetting?.colorStyle ||
  //   NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT;
  // const primaryColor = get(
  //   selectedTheme,
  //   "properties.colors.primaryColor",
  //   "inherit",
  // );
  const location = useLocation();
  const { pathname } = location;
  const [query, setQuery] = useState("");
  const navRef = useRef<HTMLDivElement>(null);
  const maxMenuItemWidth = 220;
  const [maxMenuItemsThatCanFit, setMaxMenuItemsThatCanFit] = useState(0);
  const { width: screenWidth } = useWindowSizeHooks();
  const isPreviewMode = useSelector(previewModeSelector);
  const isAppSettingsPaneWithNavigationTabOpen = useSelector(
    getIsAppSettingsPaneWithNavigationTabOpen,
  );
  const isPreviewing = isPreviewMode || isAppSettingsPaneWithNavigationTabOpen;
  const appMode = useSelector(getAppMode);
  const canvasWidth = useSelector(getCanvasWidth);
  const THROTTLE_TIMEOUT = 50;
  const currentApp = useSelector(getCurrentApplication);
  const getPath = (it: any, pagesMap: any, title: string) => {
    if (!it.pageId) return "";
    const pageURL =
      appMode === APP_MODE.PUBLISHED
        ? viewerURL({
            pageId: pagesMap[title].pageId,
          })
        : builderURL({
            pageId: pagesMap[title].pageId,
          });
    return pageURL;
  };

  const gotToPath = (pId: string, path: string) => {
    history.push(path);
  };
  const viewerLayout = currentApp?.viewerLayout;

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
  const appPages = pages;
  if (appPages.length > 1) {
    appPages.forEach((item, i) => {
      if (item.isDefault) {
        appPages.splice(i, 1);
        appPages.unshift(item);
      }
    });
  }

  useLayoutEffect(() => {
    const onResize = throttle(() => {
      if (navRef?.current) {
        const { offsetWidth } = navRef.current;

        // using max menu item width for simpler calculation
        setMaxMenuItemsThatCanFit(Math.floor(offsetWidth / maxMenuItemWidth));
      }
    }, THROTTLE_TIMEOUT);

    if (navRef.current) {
      const resizeObserver = new ResizeObserver(onResize);

      resizeObserver.observe(navRef.current);
      navRef.current.addEventListener("resize", onResize);
    }

    return () => {
      if (navRef.current) {
        navRef.current.removeEventListener("resize", onResize);
      }
    };
  }, [
    navRef,
    maxMenuItemWidth,
    appPages,
    screenWidth,
    isPreviewing,
    canvasWidth,
  ]);

  if (
    !_size(initState.menudata) ||
    (_size(initState.menudata) === 1 &&
      !_get(initState.menudata, ["0", "children"], ""))
  )
    return null;
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
      className="gap-x-2 flex items-center grow t--app-viewer-navigation-top-inline"
      ref={navRef}
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
      {/* {appPages.map(
        (page, index) =>
          index < maxMenuItemsThatCanFit && (
            <MenuItemContainer
              isTabActive={pathname.indexOf(page.pageId) > -1}
              key={page.pageId}
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
          ),
      )}

      {appPages.length > maxMenuItemsThatCanFit && (
        <MoreDropdownButton
          key="more-button"
          navigationSetting={
            currentApplicationDetails?.applicationDetail?.navigationSetting
          }
          pages={appPages.slice(maxMenuItemsThatCanFit, appPages.length)}
        />
      )} */}
    </Container>
  );
}

export default TopInline;
