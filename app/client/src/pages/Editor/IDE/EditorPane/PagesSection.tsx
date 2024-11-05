import React, { useCallback, useMemo, useState } from "react";
import { Text } from "@appsmith/ads";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { selectAllPages } from "ee/selectors/entitiesSelector";
import type { Page } from "ee/constants/ReduxActionConstants";
import { getHasCreatePagePermission } from "ee/utils/BusinessFeatures/permissionPageHelpers";
import { useFeatureFlag } from "utils/hooks/useFeatureFlag";
import { FEATURE_FLAG } from "ee/entities/FeatureFlag";
import {
  getCurrentApplicationId,
  getCurrentPageId,
} from "selectors/editorSelectors";
import { EntityClassNames } from "pages/Editor/Explorer/Entity";
import { getCurrentApplication } from "ee/selectors/applicationSelectors";
import type { AppState } from "ee/reducers";
import { createNewPageFromEntities } from "actions/pageActions";
import AddPageContextMenu from "pages/Editor/Explorer/Pages/AddPageContextMenu";
import { getNextEntityName } from "utils/AppsmithUtils";
import { getCurrentWorkspaceId } from "ee/selectors/selectedWorkspaceSelectors";
import { getInstanceId } from "ee/selectors/tenantSelectors";
import { PageElement } from "pages/Editor/IDE/EditorPane/components/PageElement";
import { IDEHeaderDropdown } from "IDE";
import { PAGE_ENTITY_NAME } from "ee/constants/messages";
import { TooltipComponent } from "design-system-old";
import styled from "styled-components";
import { Button } from "design-system";
import { viewerLayoutEditorURL } from "ee/RouteBuilder";
import history from "utils/history";

const StyledButton = styled(Button) <{ isSizePassed?: boolean }>`
  ${({ isSizePassed }) =>
    !isSizePassed &&
    `
  && {
    height: 100%;
    width: 100%;
  }
  `}
`;

const PagesSection = ({ onItemSelected }: { onItemSelected: () => void }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const pages: Page[] = useSelector(selectAllPages);
  const applicationId = useSelector(getCurrentApplicationId);
  const userAppPermissions = useSelector(
    (state: AppState) => getCurrentApplication(state)?.userPermissions ?? [],
  );
  const workspaceId = useSelector(getCurrentWorkspaceId);
  const instanceId = useSelector(getInstanceId);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isFeatureEnabled = useFeatureFlag(FEATURE_FLAG.license_gac_enabled);

  const canCreatePages = getHasCreatePagePermission(
    isFeatureEnabled,
    userAppPermissions,
  );
  const currentPageId = useSelector(getCurrentPageId);

  const createPageCallback = useCallback(() => {
    const name = getNextEntityName(
      PAGE_ENTITY_NAME,
      pages.map((page: Page) => page.pageName),
    );
    dispatch(
      createNewPageFromEntities(applicationId, name, workspaceId, instanceId),
    );
  }, [dispatch, pages, applicationId]);

  const onMenuClose = useCallback(() => setIsMenuOpen(false), [setIsMenuOpen]);

  const pageElements = useMemo(
    () =>
      pages.map((page) => (
        <PageElement key={page.pageId} onClick={onItemSelected} page={page} />
      )),
    [pages, location.pathname],
  );

  const navToLayoutEditor = useCallback(() => {
    history.push(viewerLayoutEditorURL({ basePageId: currentPageId }));
  }, [currentPageId]);

  const viewerMenuEditIcon = (
    <TooltipComponent
      boundary="viewport"
      className="flex-grow"
      content={`设计项目菜单`}
      position="bottom"
    >
      <StyledButton
        isIconButton
        isSizePassed={false}
        kind="tertiary"
        onClick={navToLayoutEditor}
        size={"sm"}
        startIcon="layout-5-line"
      />
    </TooltipComponent>
  );

  return (
    <IDEHeaderDropdown>
      <IDEHeaderDropdown.Header className="pages">
        <Text kind="heading-xs">{`All Pages (${pages.length})`}</Text>
        {canCreatePages ? (
          <div className="flex items-baseline">
            {viewerMenuEditIcon}
            <AddPageContextMenu
              buttonSize="sm"
              className={`${EntityClassNames.ADD_BUTTON} group pages`}
              createPageCallback={createPageCallback}
              onItemSelected={onItemSelected}
              onMenuClose={onMenuClose}
              openMenu={isMenuOpen}
            />
          </div>
        ) : null}
      </IDEHeaderDropdown.Header>
      <IDEHeaderDropdown.Body>{pageElements}</IDEHeaderDropdown.Body>
    </IDEHeaderDropdown>
  );
};

export { PagesSection };
