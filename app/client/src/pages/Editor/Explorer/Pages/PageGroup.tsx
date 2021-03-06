import React, { memo, useCallback } from "react";
import Entity from "../Entity";
import { pageGroupIcon } from "../ExplorerIcons";
import { useDispatch, useSelector } from "react-redux";
import { getNextEntityName } from "utils/AppsmithUtils";
import { createPage } from "actions/pageActions";
import { useParams } from "react-router";
import { ExplorerURLParams } from "../helpers";
import { Page } from "constants/ReduxActionConstants";
import ExplorerPageEntity from "./PageEntity";
import { AppState } from "reducers";
import { CanvasStructure } from "reducers/uiReducers/pageCanvasStructureReducer";
import { Datasource } from "entities/Datasource";
import { Plugin } from "api/PluginApi";
import { extractCurrentDSL } from "utils/WidgetPropsUtils";
import Button, { Category, Size } from "components/ads/Button";
import styled from "styled-components";

type ExplorerPageGroupProps = {
  searchKeyword?: string;
  step: number;
  widgets?: Record<string, CanvasStructure>;
  actions: Record<string, any[]>;
  datasources: Record<string, Datasource[]>;
  plugins: Plugin[];
  showWidgetsSidebar: (pageId: string) => void;
};

const PageList = styled.div`
  margin: 8px;

  & .newpage {
    height: 32px;
    & svg path {
      stroke: ${(props) => props.theme.colors.tertiary.main};
    }
  }
`;

const pageGroupEqualityCheck = (
  prev: ExplorerPageGroupProps,
  next: ExplorerPageGroupProps,
) => {
  return (
    prev.widgets === next.widgets &&
    prev.actions === next.actions &&
    prev.datasources === next.datasources &&
    prev.searchKeyword === next.searchKeyword
  );
};

export const ExplorerPageGroup = memo((props: ExplorerPageGroupProps) => {
  const dispatch = useDispatch();
  const params = useParams<ExplorerURLParams>();

  const pages = useSelector((state: AppState) => {
    return state.entities.pageList.pages;
  });
  const createPageCallback = useCallback(() => {
    const name = getNextEntityName(
      "页面",
      pages.map((page: Page) => page.pageName),
    );
    // Default layout is extracted by adding dynamically computed properties like min-height.
    const defaultPageLayouts = [
      { dsl: extractCurrentDSL(), layoutOnLoadActions: [] },
    ];
    dispatch(createPage(params.applicationId, name, defaultPageLayouts));
  }, [dispatch, pages, params.applicationId]);

  const pageEntities = pages.map((page) => {
    const pageWidgets = props.widgets && props.widgets[page.pageId];
    const pageActions = props.actions[page.pageId] || [];
    const datasources = props.datasources[page.pageId] || [];
    if (!pageWidgets && pageActions.length === 0 && datasources.length === 0)
      return null;
    return (
      <ExplorerPageEntity
        actions={pageActions}
        datasources={datasources}
        key={page.pageId}
        page={page}
        plugins={props.plugins}
        searchKeyword={props.searchKeyword}
        showWidgetsSidebar={props.showWidgetsSidebar}
        step={props.step + 1}
        widgets={pageWidgets}
      />
    );
  });

  if (pageEntities.filter(Boolean).length === 0) return null;

  // quincy hack: no need to collapse all items
  return (
    <PageList>
      <Button
        fill
        onClick={createPageCallback}
        icon={"plus"}
        size={Size.medium}
        category={Category.tertiary}
        text="新建页面"
        className="newpage"
      />
      {pageEntities}
    </PageList>
  );

  return (
    <Entity
      className="group pages"
      entityId="Pages"
      icon={pageGroupIcon}
      isDefaultExpanded
      name="页面"
      onCreate={createPageCallback}
      searchKeyword={props.searchKeyword}
      step={props.step}
    >
      {pageEntities}
    </Entity>
  );
}, pageGroupEqualityCheck);

ExplorerPageGroup.displayName = "ExplorerPageGroup";

(ExplorerPageGroup as any).whyDidYouRender = {
  logOnDifferentValues: false,
};

export default ExplorerPageGroup;
