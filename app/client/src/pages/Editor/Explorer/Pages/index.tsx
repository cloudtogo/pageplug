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
import { EntityClassNames } from "../Entity";
import { createNewPageFromEntities } from "actions/pageActions";
import { ADD_PAGE_TOOLTIP, createMessage } from "@appsmith/constants/messages";
import type { Page } from "@appsmith/constants/ReduxActionConstants";
import { getNextEntityName } from "utils/AppsmithUtils";
import PageContextMenu from "./PageContextMenu";
import { resolveAsSpaceChar } from "utils/helpers";
import { builderURL, viewerLayoutEditorURL } from "@appsmith/RouteBuilder";
import { getExplorerPinned } from "selectors/explorerSelector";
import { setExplorerPinnedAction } from "actions/explorerActions";
import { selectAllPages } from "@appsmith/selectors/entitiesSelector";
import {
  getExplorerStatus,
  saveExplorerStatus,
} from "@appsmith/pages/Editor/Explorer/helpers";
import AddPageContextMenu from "./AddPageContextMenu";
import { useLocation } from "react-router";
import { toggleInOnboardingWidgetSelection } from "actions/onboardingActions";
import { isMobileLayout } from "selectors/applicationSelectors";
import { TooltipComponent } from "design-system-old";
import { Icon } from "@blueprintjs/core";
import type { AppState } from "@appsmith/reducers";
import { getCurrentWorkspaceId } from "@appsmith/selectors/selectedWorkspaceSelectors";
import { getInstanceId } from "@appsmith//selectors/tenantSelectors";
import { useFeatureFlag } from "utils/hooks/useFeatureFlag";
import { FEATURE_FLAG } from "@appsmith/entities/FeatureFlag";
import { getHasCreatePagePermission } from "@appsmith/utils/BusinessFeatures/permissionPageHelpers";
import {
  ENTITY_HEIGHT,
  RelativeContainer,
  StyledEntity,
} from "../Common/components";
import { EntityExplorerResizeHandler } from "../Common/EntityExplorerResizeHandler";
import { PageElement } from "pages/Editor/IDE/EditorPane/components/PageElement";
import history from "utils/history";

function Pages() {
  const applicationId = useSelector(getCurrentApplicationId);
  const pages: Page[] = useSelector(selectAllPages);
  const currentPageId = useSelector(getCurrentPageId);
  const dispatch = useDispatch();
  const isPagesOpen = getExplorerStatus(applicationId, "pages");
  const pageResizeRef = useRef<HTMLDivElement>(null);
  const storedHeightKey = "pagesContainerHeight_" + applicationId;
  const storedHeight = localStorage.getItem(storedHeightKey);
  const location = useLocation();
  const isMobile = useSelector(isMobileLayout);

  useEffect(() => {
    if ((isPagesOpen === null ? true : isPagesOpen) && pageResizeRef.current) {
      pageResizeRef.current.style.height = storedHeight + "px";
    }
  }, [pageResizeRef]);

  useEffect(() => {
    // scroll to the current page
    const currentPage = document.getElementById("entity-" + currentPageId);
    if (currentPage) {
      setTimeout(() => currentPage.scrollIntoView(), 0);
    }
  }, [currentPageId]);

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
      boundary="viewport"
      className="flex-grow"
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

  const onPageToggle = useCallback(
    (isOpen: boolean) => {
      saveExplorerStatus(applicationId, "pages", isOpen);
    },
    [applicationId],
  );

  const userAppPermissions = useSelector(
    (state: AppState) => getCurrentApplication(state)?.userPermissions ?? [],
  );

  const isFeatureEnabled = useFeatureFlag(FEATURE_FLAG.license_gac_enabled);

  const canCreatePages = getHasCreatePagePermission(
    isFeatureEnabled,
    userAppPermissions,
  );

  const pageElements = useMemo(
    () => pages.map((page) => <PageElement key={page.pageId} page={page} />),
    [pages, location.pathname],
  );

  // console.log(isMobile, "isMobile", viewerMenuEditIcon)

  return (
    <RelativeContainer className="border-b pb-1">
      <StyledEntity
        addButtonHelptext={createMessage(ADD_PAGE_TOOLTIP)}
        alwaysShowRightIcon
        className="pb-0 group pages"
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
        entitySize={ENTITY_HEIGHT * pages.length}
        icon={""}
        isDefaultExpanded={
          isPagesOpen === null || isPagesOpen === undefined ? true : isPagesOpen
        }
        name="页面"
        onClickPreRightIcon={navToLayoutEditor}
        onToggle={onPageToggle}
        preRightIcon={isMobile ? null : viewerMenuEditIcon}
        searchKeyword={""}
        showAddButton={canCreatePages}
        step={0}
      >
        {pageElements}
      </StyledEntity>
      <EntityExplorerResizeHandler
        resizeRef={pageResizeRef}
        storedHeightKey={storedHeightKey}
      />
    </RelativeContainer>
  );
}

Pages.displayName = "Pages";

export default React.memo(Pages);
