import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Flex } from "design-system";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { animated, useSpring } from "react-spring";

import { selectAllPages } from "@appsmith/selectors/entitiesSelector";
import type { Page } from "@appsmith/constants/ReduxActionConstants";
import { getHasCreatePagePermission } from "@appsmith/utils/BusinessFeatures/permissionPageHelpers";
import { useFeatureFlag } from "utils/hooks/useFeatureFlag";
import { FEATURE_FLAG } from "@appsmith/entities/FeatureFlag";
import { getCurrentApplicationId, getCurrentPageId } from "selectors/editorSelectors";
import { EntityClassNames } from "pages/Editor/Explorer/Entity";
import { getCurrentApplication } from "@appsmith/selectors/applicationSelectors";
import type { AppState } from "@appsmith/reducers";
import { createNewPageFromEntities } from "actions/pageActions";
import AddPageContextMenu from "pages/Editor/Explorer/Pages/AddPageContextMenu";
import { getNextEntityName } from "utils/AppsmithUtils";
import { getCurrentWorkspaceId } from "@appsmith/selectors/selectedWorkspaceSelectors";
import { getInstanceId } from "@appsmith/selectors/tenantSelectors";
import { PageElement } from "pages/Editor/IDE/EditorPane/components/PageElement";
import { builderURL, viewerLayoutEditorURL } from "@appsmith/RouteBuilder";
import { getPagesActiveStatus } from "selectors/ideSelectors";
import { TooltipComponent } from "design-system-old";
import { Icon } from "@blueprintjs/core";
import history from "utils/history";
import PaneHeader from "../LeftPane/PaneHeader";
import styled from "styled-components";
import type { ButtonSizes } from "design-system";
import { Button } from "design-system";

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

const AnimatedFlex = animated(Flex);
const defaultAnimationState = { height: "0%" };
const expandedAnimationState = { height: "21.5%" };

const PagesSection = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const pages: Page[] = useSelector(selectAllPages);
  const applicationId = useSelector(getCurrentApplicationId);
  const userAppPermissions = useSelector(
    (state: AppState) => getCurrentApplication(state)?.userPermissions ?? [],
  );
  const workspaceId = useSelector(getCurrentWorkspaceId);
  const instanceId = useSelector(getInstanceId);
  const pagesActive = useSelector(getPagesActiveStatus);
  const currentPageId = useSelector(getCurrentPageId);

  const [springs, api] = useSpring(() => ({
    from: defaultAnimationState,
    config: {
      duration: 200,
    },
  }));

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isFeatureEnabled = useFeatureFlag(FEATURE_FLAG.license_gac_enabled);

  const canCreatePages = getHasCreatePagePermission(
    isFeatureEnabled,
    userAppPermissions,
  );

  useEffect(() => {
    if (pagesActive) {
      api.start({
        to: expandedAnimationState,
      });
    } else {
      api.start({
        to: defaultAnimationState,
      });
    }

    return () => {
      api.stop();
    };
  }, [pagesActive, api]);

  const createPageCallback = useCallback(() => {
    const name = getNextEntityName(
      "Page",
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

  const onMenuClose = useCallback(() => setIsMenuOpen(false), [setIsMenuOpen]);

  const pageElements = useMemo(
    () => pages.map((page) => <PageElement key={page.pageId} page={page} />),
    [pages, location.pathname],
  );

  // Menu Editor
  const navToLayoutEditor = useCallback(() => {
    history.push(viewerLayoutEditorURL({ pageId: currentPageId }));
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
    <AnimatedFlex
      flexDirection={"column"}
      height={"21.5%"}
      justifyContent={"center"}
      overflow={"hidden"}
      style={springs}
    >
      <PaneHeader
        className="pages"
        rightIcon={
          canCreatePages ? (
            <div className="flex items-baseline">
              {viewerMenuEditIcon}
              <AddPageContextMenu
                buttonSize="sm"
                className={`${EntityClassNames.ADD_BUTTON} group pages`}
                createPageCallback={createPageCallback}
                onMenuClose={onMenuClose}
                openMenu={isMenuOpen}
              />
            </div>
          ) : null
        }
        title={`All Pages (${pages.length})`}
      />
      <Flex
        alignItems={"center"}
        flex={"1"}
        flexDirection={"column"}
        overflow={"auto"}
        width={"100%"}
      >
        {pageElements}
      </Flex>
    </AnimatedFlex>
  );
};

export { PagesSection };
