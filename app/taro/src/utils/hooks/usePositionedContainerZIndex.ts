import { PositionedContainerProps } from "components/designSystems/appsmith/PositionedContainer";
import { Layers } from "constants/Layers";

import { useMemo } from "react";
import { AppState } from "reducers";

import { getSelectedWidgets } from "selectors/ui";

export const usePositionedContainerZIndex = (
  props: PositionedContainerProps,
  droppableWidget: boolean,
  useSelector,
) => {
  const isDragging = useSelector(
    (state: AppState) => state.ui.widgetDragResize.isDragging
  );
  const selectedWidgets = useSelector(getSelectedWidgets);
  const isThisWidgetDragging =
    isDragging && selectedWidgets.includes(props.widgetId);

  const zIndex = useMemo(() => {
    return props.focused
      ? Layers.focusedWidget
      : props.selected
      ? Layers.selectedWidget
      : Layers.positionedWidget;
  }, [
    isDragging,
    isThisWidgetDragging,
    droppableWidget,
    props.selected,
    props.focused,
  ]);

  const zIndicesObj = useMemo(() => {
    const onHoverZIndex = isDragging ? zIndex : Layers.positionedWidget + 1;
    return { zIndex, onHoverZIndex };
  }, [isDragging, zIndex]);

  return zIndicesObj;
};
