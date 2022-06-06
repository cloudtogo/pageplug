import { createSelector } from "reselect";
import { AppState } from "reducers";
import { WIDGET_STATIC_PROPS, WidgetProps } from "widgets/BaseWidget";
import CanvasWidgetsNormalizer from "normalizers/CanvasWidgetsNormalizer";
import {
  CanvasWidgetsReduxState,
  FlattenedWidgetProps,
} from "reducers/entityReducers/canvasWidgetsReducer";
import { PageListReduxState } from "reducers/entityReducers/pageListReducer";

import { OccupiedSpace } from "constants/editorConstants";
import { getDataTree, getLoadingEntities } from "selectors/dataTreeSelectors";
import _ from "lodash";
import { ContainerWidgetProps } from "widgets/ContainerWidget";
import { DataTreeWidget, ENTITY_TYPE } from "entities/DataTree/dataTreeFactory";
import { getActions } from "selectors/entitiesSelector";

import { getCanvasWidgets } from "./entitiesSelector";
import { WidgetTypes } from "../constants/WidgetConstants";

const getPageListState = (state: AppState) => state.entities.pageList;

export const getProviderCategories = (state: AppState) =>
  state.ui.providers.providerCategories;

const getWidgets = (state: AppState): CanvasWidgetsReduxState =>
  state.entities.canvasWidgets;

export const getPageList = (state: AppState) => state.entities.pageList.pages;

export const getCurrentPageId = (state: AppState) =>
  state.entities.pageList.currentPageId;

export const getCurrentApplicationId = (state: AppState) =>
  state.entities.pageList.applicationId;

export const getLayoutOnLoadActions = (state: AppState) =>
  state.ui.editor.pageActions || [];

export const getViewModePageList = createSelector(
  getPageList,
  getCurrentPageId,
  (pageList: PageListReduxState["pages"], currentPageId?: string) => {
    if (currentPageId) {
      const currentPage = pageList.find(
        (page) => page.pageId === currentPageId
      );
      if (!!currentPage?.isHidden) {
        return [currentPage];
      }

      const visiblePages = pageList.filter((page) => !page.isHidden);
      return visiblePages;
    }

    return [];
  }
);

export const getCurrentPage = createSelector(
  getPageList,
  getCurrentPageId,
  (pageList: PageListReduxState["pages"], currentPageId?: string) => {
    if (currentPageId) {
      return pageList.find((page) => page.pageId === currentPageId);
    }
    return null;
  }
);

export const getShowTabBar = createSelector(
  getCurrentPage,
  getPageList,
  (page: any) => !!page?.icon
);

export const getCurrentApplicationLayout = (state: AppState) =>
  state.ui.applications.currentApplication?.appLayout;

export const getCurrentPageName = createSelector(
  getPageListState,
  (pageList: PageListReduxState) =>
    pageList.pages.find((page) => page.pageId === pageList.currentPageId)
      ?.pageName
);

export const getCanvasWidgetDsl = createSelector(
  getCanvasWidgets,
  getDataTree,
  getLoadingEntities,
  (
    canvasWidgets: CanvasWidgetsReduxState,
    evaluatedDataTree,
    loadingEntities
  ): ContainerWidgetProps<WidgetProps> => {
    const widgets: Record<string, DataTreeWidget> = {};
    Object.keys(canvasWidgets).forEach((widgetKey) => {
      const canvasWidget = canvasWidgets[widgetKey];
      const evaluatedWidget = _.find(evaluatedDataTree, {
        widgetId: widgetKey,
      }) as DataTreeWidget;
      if (evaluatedWidget) {
        widgets[widgetKey] = createCanvasWidget(canvasWidget, evaluatedWidget);
      } else {
        widgets[widgetKey] = createLoadingWidget(canvasWidget);
      }
      widgets[widgetKey].isLoading = loadingEntities.has(
        canvasWidget.widgetName
      );
    });

    return CanvasWidgetsNormalizer.denormalize("0", {
      canvasWidgets: widgets,
    });
  }
);

const getOccupiedSpacesForContainer = (
  containerWidgetId: string,
  widgets: FlattenedWidgetProps[]
): OccupiedSpace[] => {
  return widgets.map((widget) => {
    const occupiedSpace: OccupiedSpace = {
      id: widget.widgetId,
      parentId: containerWidgetId,
      left: widget.leftColumn,
      top: widget.topRow,
      bottom: widget.bottomRow,
      right: widget.rightColumn,
    };
    return occupiedSpace;
  });
};

export const getOccupiedSpaces = createSelector(
  getWidgets,
  (
    widgets: CanvasWidgetsReduxState
  ): { [containerWidgetId: string]: OccupiedSpace[] } | undefined => {
    const occupiedSpaces: {
      [containerWidgetId: string]: OccupiedSpace[];
    } = {};
    // Get all widgets with type "CONTAINER_WIDGET" and has children
    const containerWidgets: FlattenedWidgetProps[] = Object.values(
      widgets
    ).filter((widget) => widget.children && widget.children.length > 0);

    // If we have any container widgets
    if (containerWidgets) {
      containerWidgets.forEach((containerWidget: FlattenedWidgetProps) => {
        const containerWidgetId = containerWidget.widgetId;
        // Get child widgets for the container
        const childWidgets = Object.keys(widgets).filter(
          (widgetId) =>
            containerWidget.children &&
            containerWidget.children.indexOf(widgetId) > -1 &&
            !widgets[widgetId].detachFromLayout
        );
        // Get the occupied spaces in this container
        // Assign it to the containerWidgetId key in occupiedSpaces
        occupiedSpaces[containerWidgetId] = getOccupiedSpacesForContainer(
          containerWidgetId,
          childWidgets.map((widgetId) => widgets[widgetId])
        );
      });
    }
    // Return undefined if there are no occupiedSpaces.
    return Object.keys(occupiedSpaces).length > 0 ? occupiedSpaces : undefined;
  }
);

// same as getOccupiedSpaces but gets only the container specific ocupied Spaces
export function getOccupiedSpacesSelectorForContainer(
  containerId: string | undefined
) {
  return createSelector(
    getWidgets,
    (widgets: CanvasWidgetsReduxState): OccupiedSpace[] | undefined => {
      if (containerId === null || containerId === undefined) return undefined;

      const containerWidget: FlattenedWidgetProps = widgets[containerId];

      if (!containerWidget || !containerWidget.children) return undefined;

      // Get child widgets for the container
      const childWidgets = Object.keys(widgets).filter(
        (widgetId) =>
          containerWidget.children &&
          containerWidget.children.indexOf(widgetId) > -1 &&
          !widgets[widgetId].detachFromLayout
      );

      const occupiedSpaces = getOccupiedSpacesForContainer(
        containerId,
        childWidgets.map((widgetId) => widgets[widgetId])
      );
      return occupiedSpaces;
    }
  );
}

export const getActionById = createSelector(
  [getActions, (state: any, props: any) => props.match.params.apiId],
  (actions, id) => {
    const action = actions.find((action) => action.config.id === id);
    if (action) {
      return action.config;
    } else {
      return undefined;
    }
  }
);

export const getActionTabsInitialIndex = (state: AppState) =>
  state.ui.actionTabs.index;

const createCanvasWidget = (
  canvasWidget: FlattenedWidgetProps,
  evaluatedWidget: DataTreeWidget
) => {
  const widgetStaticProps = _.pick(
    canvasWidget,
    Object.keys(WIDGET_STATIC_PROPS)
  );
  return {
    ...evaluatedWidget,
    ...widgetStaticProps,
  };
};

const createLoadingWidget = (
  canvasWidget: FlattenedWidgetProps
): DataTreeWidget => {
  const widgetStaticProps = _.pick(
    canvasWidget,
    Object.keys(WIDGET_STATIC_PROPS)
  ) as WidgetProps;
  return {
    ...widgetStaticProps,
    type: WidgetTypes.SKELETON_WIDGET,
    ENTITY_TYPE: ENTITY_TYPE.WIDGET,
    bindingPaths: {},
    triggerPaths: {},
    validationPaths: {},
    logBlackList: {},
    isLoading: true,
  };
};
