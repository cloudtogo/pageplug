import React, { useEffect, useState, useMemo } from "react";
import type {
  ApplicationPayload,
  Page,
} from "@appsmith/constants/ReduxActionConstants";
import { NAVIGATION_SETTINGS, SIDEBAR_WIDTH } from "constants/AppConstants";
import { get, head as _head, size } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { getSelectedAppTheme } from "selectors/appThemingSelectors";
import ApplicationName from "./components/ApplicationName";
import MenuItem from "./components/MenuItem";
import ShareButton from "./components/ShareButton";
import PrimaryCTA from "../PrimaryCTA";
import { useHref } from "pages/Editor/utils";
import { builderURL, viewerURL } from "RouteBuilder";
import {
  getCurrentPageId,
  previewModeSelector,
} from "selectors/editorSelectors";
import type { User } from "constants/userConstants";
import { ANONYMOUS_USERNAME } from "constants/userConstants";
import SidebarProfileComponent from "./components/SidebarProfileComponent";
import CollapseButton from "./components/CollapseButton";
import classNames from "classnames";
import { useMouse } from "@mantine/hooks";
import {
  getAppSidebarPinned,
  getCurrentApplication,
  getAppMode,
} from "@appsmith/selectors/applicationSelectors";
import { setIsAppSidebarPinned } from "@appsmith/actions/applicationActions";
import {
  StyledCtaContainer,
  StyledFooter,
  StyledHeader,
  StyledMenuContainer,
  StyledSidebar,
} from "./Sidebar.styled";
import { View } from "@tarojs/components";
import { getCurrentThemeDetails } from "selectors/themeSelectors";
import { getIsAppSettingsPaneWithNavigationTabOpen } from "selectors/appSettingsPaneSelectors";
import BackToHomeButton from "@appsmith/pages/AppViewer/BackToHomeButton";
import MenuItemContainer from "./components/MenuItemContainer";
import BackToAppsButton from "./components/BackToAppsButton";
import history from "utils/history";
import { APP_MODE } from "entities/App";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { filterHiddenTreeData, mapClearTree } from "utils/treeUtils";
type MenuItem = Required<MenuProps>["items"][number];
import { NavLink } from "react-router-dom";
import { makeRouteNode } from "../utils";
import NavigationLogo from "@appsmith/pages/AppViewer/NavigationLogo";

type SidebarProps = {
  currentApplicationDetails?: ApplicationPayload;
  pages: Page[];
  currentWorkspaceId: string;
  currentUser: User | undefined;
  showUserSettings: boolean;
};

export function Sidebar(props: SidebarProps) {
  const selectedTheme = useSelector(getSelectedAppTheme);
  const appMode = useSelector(getAppMode);
  const { currentApplicationDetails, currentUser, currentWorkspaceId, pages } =
    props;
  const navColorStyle =
    currentApplicationDetails?.applicationDetail?.navigationSetting
      ?.colorStyle || NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT;
  const navStyle =
    currentApplicationDetails?.applicationDetail?.navigationSetting?.navStyle ||
    NAVIGATION_SETTINGS.NAV_STYLE.STACKED;
  const isMinimal =
    currentApplicationDetails?.applicationDetail?.navigationSetting
      ?.navStyle === NAVIGATION_SETTINGS.NAV_STYLE.MINIMAL;
  const logoConfiguration =
    currentApplicationDetails?.applicationDetail?.navigationSetting
      ?.logoConfiguration ||
    NAVIGATION_SETTINGS.LOGO_CONFIGURATION.LOGO_AND_APPLICATION_TITLE;
  const primaryColor = get(
    selectedTheme,
    "properties.colors.primaryColor",
    "inherit",
  );
  const borderRadius = get(
    selectedTheme,
    "properties.borderRadius.appBorderRadius",
    "inherit",
  );
  const location = useLocation();
  const { pathname } = location;
  const [query, setQuery] = useState("");
  const pageId = useSelector(getCurrentPageId);
  const editorURL = useHref(builderURL, { pageId });
  const dispatch = useDispatch();
  const isPinned = useSelector(getAppSidebarPinned);
  const [isOpen, setIsOpen] = useState(true);
  const { x } = useMouse();
  const theme = useSelector(getCurrentThemeDetails);
  const isPreviewMode = useSelector(previewModeSelector);
  const isAppSettingsPaneWithNavigationTabOpen = useSelector(
    getIsAppSettingsPaneWithNavigationTabOpen,
  );
  const [isLogoVisible, setIsLogoVisible] = useState(false);

  const currentApp = useSelector(getCurrentApplication);

  const viewerLayout = currentApp?.viewerLayout;

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
        current.treeData.forEach(
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
              children: size(item.children) ? item.children : null,
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
                  className={`van-icon van-icon-${
                    item.icon ? item.icon : "orders-o"
                  } taroify-icon taroify-icon--inherit hydrated`}
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
        // console.log(newPages, "newPages");
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
              {p.pageName}{" "}
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

  useEffect(() => {
    setIsOpen(isPinned);
  }, [isPinned]);

  useEffect(() => {
    // When the sidebar is unpinned -
    if (!isPinned) {
      if (x <= 20) {
        // 1. Open the sidebar when hovering on the left edge of the screen
        setIsOpen(true);
      } else if (x > SIDEBAR_WIDTH.REGULAR) {
        // 2. Close the sidebar when the mouse moves out of it
        setIsOpen(false);
      }
    }
  }, [x]);

  const setIsPinned = (isPinned: boolean) => {
    dispatch(setIsAppSidebarPinned(isPinned));
  };

  const calculateSidebarHeight = () => {
    let prefix = `calc( 100vh - `;
    const suffix = ")";

    if (isPreviewMode) {
      prefix += `${theme.smallHeaderHeight} - ${theme.bottomBarHeight}`;
    } else if (isAppSettingsPaneWithNavigationTabOpen) {
      prefix += `${theme.smallHeaderHeight} - ${theme.bottomBarHeight}`;
    } else {
      prefix += "0px";
    }

    return prefix + suffix;
  };

  const current_theme =
    get(
      currentApplicationDetails,
      ["applicationDetail", "navigationSetting", "colorStyle"],
      "theme",
    ) === "theme"
      ? "dark"
      : "light";

  return (
    <StyledSidebar
      className={classNames({
        "t--app-viewer-navigation-sidebar": true,
        "is-open": isOpen,
        "shadow-xl": !isPinned,
      })}
      isMinimal={isMinimal}
      navColorStyle={navColorStyle}
      primaryColor={primaryColor}
      sidebarHeight={calculateSidebarHeight()}
    >
      <StyledHeader>
        <div
          className={classNames({
            flex: true,
            "flex-col": isLogoVisible,
          })}
        >
          <NavigationLogo logoConfiguration={logoConfiguration} />
          {currentUser?.username !== ANONYMOUS_USERNAME && (
            <BackToHomeButton
              forSidebar
              isLogoVisible={isLogoVisible}
              navColorStyle={navColorStyle}
              primaryColor={primaryColor}
              setIsLogoVisible={setIsLogoVisible}
            />
          )}

          {!isMinimal &&
            (logoConfiguration ===
              NAVIGATION_SETTINGS.LOGO_CONFIGURATION
                .LOGO_AND_APPLICATION_TITLE ||
              logoConfiguration ===
                NAVIGATION_SETTINGS.LOGO_CONFIGURATION
                  .APPLICATION_TITLE_ONLY) && (
              <ApplicationName
                appName={currentApplicationDetails?.name}
                forSidebar
                navColorStyle={navColorStyle}
                navStyle={navStyle}
                primaryColor={primaryColor}
              />
            )}
        </div>

        {!isMinimal && (
          <CollapseButton
            borderRadius={borderRadius}
            isOpen={isOpen}
            isPinned={isPinned}
            navColorStyle={navColorStyle}
            primaryColor={primaryColor}
            setIsPinned={setIsPinned}
          />
        )}
      </StyledHeader>

      <StyledMenuContainer
        navColorStyle={navColorStyle}
        primaryColor={primaryColor}
      >
        <Menu
          defaultSelectedKeys={get(_head(initState.menudata), "key")}
          mode="inline"
          theme={current_theme}
          inlineCollapsed={!isOpen}
          items={filterHiddenTreeData(initState.menudata)}
          className="rootSideMenu"
          style={{
            border: "none",
            backgroundColor: "transparent",
          }}
        />
        {/* {appPages.map((page) => {
          return (
            <MenuItemContainer
              forSidebar
              isTabActive={pathname.indexOf(page.pageId) > -1}
              key={page.pageId}
            >
              <MenuItem
                isMinimal={isMinimal}
                key={page.pageId}
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
      </StyledMenuContainer>

      {props.showUserSettings && (
        <StyledFooter navColorStyle={navColorStyle} primaryColor={primaryColor}>
          {/* {currentApplicationDetails && (
            <StyledCtaContainer>
              <ShareButton
                currentApplicationDetails={currentApplicationDetails}
                currentWorkspaceId={currentWorkspaceId}
                insideSidebar
                isMinimal={isMinimal}
              />

              <PrimaryCTA
                className="t--back-to-editor"
                insideSidebar
                isMinimal={isMinimal}
                navColorStyle={navColorStyle}
                primaryColor={primaryColor}
                url={editorURL}
              />

              <BackToAppsButton
                currentApplicationDetails={currentApplicationDetails}
                insideSidebar
                isMinimal={isMinimal}
              />
            </StyledCtaContainer>
          )} */}

          <SidebarProfileComponent
            currentUser={currentUser}
            isMinimal={isMinimal}
            navColorStyle={navColorStyle}
            primaryColor={primaryColor}
          />
        </StyledFooter>
      )}
    </StyledSidebar>
  );
}

export default Sidebar;
