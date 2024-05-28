import React, { useCallback, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import type { Page } from "@appsmith/constants/ReduxActionConstants";
import { defaultPageIcon, pageIcon } from "pages/Editor/Explorer/ExplorerIcons";
import { getCurrentPageId } from "@appsmith/selectors/entitiesSelector";
import { getHasManagePagePermission } from "@appsmith/utils/BusinessFeatures/permissionPageHelpers";
import { useFeatureFlag } from "utils/hooks/useFeatureFlag";
import { FEATURE_FLAG } from "@appsmith/entities/FeatureFlag";
import PageContextMenu from "pages/Editor/Explorer/Pages/PageContextMenu";
import { getCurrentApplicationId } from "selectors/editorSelectors";
import { EntityClassNames } from "pages/Editor/Explorer/Entity";
import {
  PERMISSION_TYPE,
  isPermitted,
} from "@appsmith/utils/permissionHelpers";
import { getCurrentApplication } from "@appsmith/selectors/applicationSelectors";
import type { AppState } from "@appsmith/reducers";
import { StyledEntity } from "pages/Editor/Explorer/Common/components";
import { resolveAsSpaceChar } from "utils/helpers";
import { updatePage } from "actions/pageActions";
import { useGetPageFocusUrl, useCurrentAppState } from "pages/Editor/IDE/hooks";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { toggleInOnboardingWidgetSelection } from "actions/onboardingActions";
import history, { NavigationMethod } from "utils/history";
import { mapTree } from "utils/treeUtils";
const PageElement = ({ page }: { page: Page }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const appState = useCurrentAppState();
  const currentLayout = useSelector(getCurrentApplication)?.viewerLayout;
  const navigateToUrl = useGetPageFocusUrl(page.pageId, appState);
  const ref = useRef<null | HTMLDivElement>(null);

  const currentPageId = useSelector(getCurrentPageId);
  const isFeatureEnabled = useFeatureFlag(FEATURE_FLAG.license_gac_enabled);
  const applicationId = useSelector(getCurrentApplicationId);
  const userAppPermissions = useSelector(
    (state: AppState) => getCurrentApplication(state)?.userPermissions ?? [],
  );

  const icon = page.isDefault ? defaultPageIcon : pageIcon;
  const isCurrentPage = currentPageId === page.pageId;
  const pagePermissions = page.userPermissions;

  const canManagePages = getHasManagePagePermission(
    isFeatureEnabled,
    pagePermissions,
  );
  const hasExportPermission = isPermitted(
    userAppPermissions ?? [],
    PERMISSION_TYPE.EXPORT_APPLICATION,
  );

  const isHiddenPage = useMemo(() => {
    if (currentLayout) {
      try {
        const current = JSON.parse(currentLayout);
        const pagesTree = current?.treeData || []
        let hiddenPages:any =[]
        pagesTree?.map((pItem:any) => {
          mapTree(pItem, (p: any) => {
            if (p?.isHidden) {
              hiddenPages.push(p.key)
            }
          })
        })
        return hiddenPages.includes(page.pageId);
      } catch (e) {
        console.log(e);
      }
    }
    return false;
  }, [currentLayout, page]);

  useEffect(() => {
    if (ref.current && isCurrentPage) {
      ref.current.scrollIntoView({
        inline: "nearest",
        block: "nearest",
      });
    }
  }, [ref, isCurrentPage]);

  const switchPage = useCallback(
    (page: Page) => {
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
    [location.pathname, currentPageId, navigateToUrl],
  );

  const contextMenu = (
    <PageContextMenu
      applicationId={applicationId as string}
      className={EntityClassNames.CONTEXT_MENU}
      hasExportPermission={hasExportPermission}
      isCurrentPage={isCurrentPage}
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
      className={`page fullWidth ${isCurrentPage && "activePage"}`}
      contextMenu={contextMenu}
      disabled={isHiddenPage}
      entityId={page.pageId}
      icon={icon}
      isDefaultExpanded={isCurrentPage}
      key={page.pageId}
      name={page.pageName}
      onNameEdit={resolveAsSpaceChar}
      ref={ref}
      searchKeyword={""}
      step={1}
      updateEntityName={(id, name) =>
        updatePage({ id, name, isHidden: !!page.isHidden })
      }
    />
  );
};

export { PageElement };
