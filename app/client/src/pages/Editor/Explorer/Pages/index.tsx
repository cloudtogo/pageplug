import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentApplication,
  getCurrentApplicationId,
  getCurrentPageId,
} from "selectors/editorSelectors";
import Entity, { EntityClassNames } from "../Entity";
import history, { NavigationMethod } from "utils/history";
import { createNewPageFromEntities, updatePage } from "actions/pageActions";
import { defaultPageIcon, pageIcon, appLayoutIcon } from "../ExplorerIcons";
import { ADD_PAGE_TOOLTIP, createMessage } from "@appsmith/constants/messages";
import type { Page } from "@appsmith/constants/ReduxActionConstants";
import { getNextEntityName } from "utils/AppsmithUtils";
import styled from "styled-components";
import PageContextMenu from "./PageContextMenu";
import { resolveAsSpaceChar } from "utils/helpers";
import { getExplorerPinned } from "selectors/explorerSelector";
import { setExplorerPinnedAction } from "actions/explorerActions";
import { selectAllPages } from "selectors/entitiesSelector";
import { builderURL, viewerLayoutEditorURL } from "RouteBuilder";
import {
  getExplorerStatus,
  saveExplorerStatus,
} from "@appsmith/pages/Editor/Explorer/helpers";
import { tailwindLayers } from "constants/Layers";
import type { CallbackResponseType } from "utils/hooks/useResize";
import useResize, { DIRECTION } from "utils/hooks/useResize";
import AddPageContextMenu from "./AddPageContextMenu";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { useLocation } from "react-router";
import { toggleInOnboardingWidgetSelection } from "actions/onboardingActions";
import {
  hasCreatePagePermission,
  hasManagePagePermission,
} from "@appsmith/utils/permissionHelpers";
import { isMobileLayout } from "selectors/applicationSelectors";
import type { AppState } from "@appsmith/reducers";
import { getCurrentWorkspaceId } from "@appsmith/selectors/workspaceSelectors";
import { getInstanceId } from "@appsmith//selectors/tenantSelectors";
import classNames from "classnames";
import { selectFeatureFlags } from "@appsmith/selectors/featureFlagsSelectors";
import { TooltipComponent } from "design-system-old";
import { Icon } from "@blueprintjs/core";
const ENTITY_HEIGHT = 36;
const MIN_PAGES_HEIGHT = 60;

const StyledEntity = styled(Entity)<{ pagesSize?: number }>`
  &.pages {
    & > div:not(.t--entity-item) > div > div {
      max-height: 40vh;
      min-height: ${(props) =>
        props.pagesSize && props.pagesSize > MIN_PAGES_HEIGHT
          ? MIN_PAGES_HEIGHT
          : props.pagesSize}px;
      height: ${(props) =>
        props.pagesSize && props.pagesSize > 128 ? 128 : props.pagesSize}px;
      overflow-y: auto;
    }
  }

  &.page .${EntityClassNames.PRE_RIGHT_ICON} {
    width: 20px;
    right: 0;
  }

  &.page:hover {
    & .${EntityClassNames.PRE_RIGHT_ICON} {
      display: none;
    }
  }
`;

const RelativeContainer = styled.div`
  position: relative;
`;

const ResizeHandler = styled.div`
  &:hover {
    background-color: var(--ads-v2-color-border);
  }
`;

function Pages() {
  const applicationId = useSelector(getCurrentApplicationId);
  const pages: Page[] = useSelector(selectAllPages);
  const currentPageId = useSelector(getCurrentPageId);
  const pinned = useSelector(getExplorerPinned);
  const dispatch = useDispatch();
  const isPagesOpen = getExplorerStatus(applicationId, "pages");
  const pageResizeRef = useRef<HTMLDivElement>(null);
  const storedHeightKey = "pagesContainerHeight_" + applicationId;
  const storedHeight = localStorage.getItem(storedHeightKey);
  const location = useLocation();
  const featureFlags = useSelector(selectFeatureFlags);
  const isMobile = useSelector(isMobileLayout);

  const resizeAfterCallback = (data: CallbackResponseType) => {
    localStorage.setItem(storedHeightKey, data.height.toString());
  };

  const { mouseDown, setMouseDown } = useResize(
    pageResizeRef,
    DIRECTION.vertical,
    resizeAfterCallback,
  );

  useEffect(() => {
    if ((isPagesOpen === null ? true : isPagesOpen) && pageResizeRef.current) {
      pageResizeRef.current.style.height = storedHeight + "px";
    }
  }, [pageResizeRef]);

  const switchPage = useCallback(
    (page: Page) => {
      const navigateToUrl = builderURL({
        pageId: page.pageId,
      });
      AnalyticsUtil.logEvent("PAGE_NAME_CLICK", {
        name: page.pageName,
        fromUrl: location.pathname,
        type: "PAGES",
        toUrl: navigateToUrl,
      });
      dispatch(toggleInOnboardingWidgetSelection(true));
      history.push(navigateToUrl, {
        invokedBy: NavigationMethod.EntityExplorer,
      });
    },
    [location.pathname],
  );

  const [isMenuOpen, openMenu] = useState(false);

  const workspaceId = useSelector(getCurrentWorkspaceId);
  const instanceId = useSelector(getInstanceId);

  const createPageCallback = useCallback(() => {
    const name = getNextEntityName(
      "页面",
      pages.map((page: Page) => page.pageName),
    );

    dispatch(
      createNewPageFromEntities(
        applicationId,
        name,
        workspaceId,
        false,
        instanceId,
      ),
    );
  }, [dispatch, pages, applicationId]);

  const onMenuClose = useCallback(() => openMenu(false), [openMenu]);

  const viewerMenuEditIcon = (
    <TooltipComponent
      className="flex-grow"
      boundary="viewport"
      content={`设计项目菜单`}
      position="bottom"
    >
      {/* {appLayoutIcon} */}
      <Icon color="#000000" icon="page-layout" iconSize={16} />
    </TooltipComponent>
  );
  const navToLayoutEditor = useCallback(() => {
    history.push(viewerLayoutEditorURL({ pageId: currentPageId }));
  }, [currentPageId]);

  /**
   * toggles the pinned state of sidebar
   */
  const onPin = useCallback(() => {
    dispatch(setExplorerPinnedAction(!pinned));
  }, [pinned, dispatch, setExplorerPinnedAction]);

  const onPageToggle = useCallback(
    (isOpen: boolean) => {
      saveExplorerStatus(applicationId, "pages", isOpen);
    },
    [applicationId],
  );

  const userAppPermissions = useSelector(
    (state: AppState) => getCurrentApplication(state)?.userPermissions ?? [],
  );

  const canCreatePages = hasCreatePagePermission(userAppPermissions);

  const pageElements = useMemo(
    () =>
      pages.map((page) => {
        const icon = page.isDefault ? defaultPageIcon : pageIcon;
        const isCurrentPage = currentPageId === page.pageId;
        const pagePermissions = page.userPermissions;
        const canManagePages = hasManagePagePermission(pagePermissions);
        const contextMenu = (
          <PageContextMenu
            applicationId={applicationId as string}
            className={EntityClassNames.CONTEXT_MENU}
            isDefaultPage={page.isDefault}
            isHidden={!!page.isHidden}
            key={page.pageId + "_context-menu"}
            name={page.pageName}
            pageId={page.pageId}
          />
        );

        return (
          <StyledEntity
            action={() => switchPage(page)}
            active={isCurrentPage}
            canEditEntityName={canManagePages}
            className={`page ${isCurrentPage && "activePage"}`}
            contextMenu={contextMenu}
            disabled={page.isHidden}
            entityId={page.pageId}
            icon={icon}
            isDefaultExpanded={isCurrentPage}
            key={page.pageId}
            name={page.pageName}
            onNameEdit={resolveAsSpaceChar}
            searchKeyword={""}
            step={1}
            updateEntityName={(id, name) =>
              updatePage({ id, name, isHidden: !!page.isHidden })
            }
          />
        );
      }),
    [pages, currentPageId, applicationId, location.pathname],
  );

  // console.log(isMobile, "isMobile", viewerMenuEditIcon)

  return (
    <RelativeContainer>
      <StyledEntity
        addButtonHelptext={createMessage(ADD_PAGE_TOOLTIP)}
        alwaysShowRightIcon
        className={classNames({
          "group pages": true,
          "p-3 pb-0": featureFlags.release_widgetdiscovery_enabled,
        })}
        collapseRef={pageResizeRef}
        customAddButton={
          <AddPageContextMenu
            className={`${EntityClassNames.ADD_BUTTON} group pages`}
            createPageCallback={createPageCallback}
            onMenuClose={onMenuClose}
            openMenu={isMenuOpen}
          />
        }
        entityId="Pages"
        icon={""}
        isDefaultExpanded={
          isPagesOpen === null || isPagesOpen === undefined ? true : isPagesOpen
        }
        name="页面"
        onToggle={onPageToggle}
        pagesSize={ENTITY_HEIGHT * pages.length}
        onClickPreRightIcon={navToLayoutEditor}
        preRightIcon={isMobile ? null : viewerMenuEditIcon}
        searchKeyword={""}
        showAddButton={canCreatePages}
        step={0}
      >
        {pageElements}
      </StyledEntity>
      <div
        className={`absolute -bottom-2 left-0 w-full h-2 group cursor-ns-resize ${tailwindLayers.resizer}`}
        onMouseDown={() => setMouseDown(true)}
      >
        <ResizeHandler
          className={`w-full h-1 bg-transparent hover:bg-transparent transform transition
          ${mouseDown ? "" : ""}
          `}
        />
      </div>
    </RelativeContainer>
  );
}

Pages.displayName = "Pages";

export default React.memo(Pages);
