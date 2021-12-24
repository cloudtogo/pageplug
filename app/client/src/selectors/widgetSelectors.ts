import { createSelector } from "reselect";
import { AppState } from "reducers";
import { FlattenedWidgetProps } from "reducers/entityReducers/canvasWidgetsReducer";
import { WidgetTypes } from "constants/WidgetConstants";
import { getExistingWidgetNames, getWidgetNamePrefix } from "sagas/selectors";
import { getNextEntityName } from "utils/AppsmithUtils";
import { isMobileLayout } from "selectors/editorSelectors";

const getCanvasWidgets = (state: AppState) => state.entities.canvasWidgets;
export const getModalDropdownList = createSelector(
  getCanvasWidgets,
  (widgets) => {
    const modalWidgets = Object.values(widgets).filter(
      (widget: FlattenedWidgetProps) =>
        widget.type === WidgetTypes.MODAL_WIDGET ||
        widget.type === WidgetTypes.TARO_POPUP_WIDGET,
    );
    if (modalWidgets.length === 0) return undefined;

    return modalWidgets.map((widget: FlattenedWidgetProps) => ({
      id: widget.widgetId,
      label: widget.widgetName,
      value: `${widget.widgetName}`,
    }));
  },
);

const getModalNamePrefix = (state: AppState) => {
  const type = isMobileLayout(state)
    ? WidgetTypes.TARO_POPUP_WIDGET
    : WidgetTypes.MODAL_WIDGET;
  return getWidgetNamePrefix(state, type);
};

export const getNextModalName = createSelector(
  getExistingWidgetNames,
  getModalNamePrefix,
  (names, prefix) => getNextEntityName(prefix, names),
);
