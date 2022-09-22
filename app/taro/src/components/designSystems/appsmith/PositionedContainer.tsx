import React, { CSSProperties, ReactNode, useMemo, useContext } from "react";
import { BaseStyle } from "widgets/BaseWidget";
import { WidgetType, WIDGET_PADDING } from "constants/WidgetConstants";
import { generateClassName } from "utils/generators";
import { styled } from "linaria/react";
import { usePositionedContainerZIndex } from "utils/hooks/usePositionedContainerZIndex";
import WidgetFactory from "utils/WidgetFactory";
import { isEqual, memoize } from "lodash";
import { getReflowSelector } from "selectors/widgetReflowSelectors";
import { AppState } from "reducers";
import { POSITIONED_WIDGET } from "constants/componentClassNameConstants";
import ReduxContext from "components/common/ReduxContext";

const PositionedWidget = styled.div<{ zIndexOnHover: number }>`
  &:hover {
    z-index: ${(props) => props.zIndexOnHover} !important;
  }
`;
export type PositionedContainerProps = {
  style: BaseStyle;
  children: ReactNode;
  parentId?: string;
  widgetId: string;
  widgetType: WidgetType;
  selected?: boolean;
  focused?: boolean;
  resizeDisabled?: boolean;
};

export const checkIsDropTarget = memoize(function isDropTarget(
  type: WidgetType,
) {
  return !!WidgetFactory.widgetConfigMap.get(type)?.isCanvas;
});

export function PositionedContainer(props: PositionedContainerProps) {
  const { useSelector } = useContext(ReduxContext);
  const x = props.style.xPosition + (props.style.xPositionUnit || "px");
  const y = props.style.yPosition + (props.style.yPositionUnit || "px");
  const padding = WIDGET_PADDING;
  // memoized classname
  const containerClassName = useMemo(() => {
    return (
      generateClassName(props.widgetId) +
      ` ${POSITIONED_WIDGET} t--widget-${props.widgetType
        .split("_")
        .join("")
        .toLowerCase()}`
    );
  }, [props.widgetType, props.widgetId]);
  const isDropTarget = checkIsDropTarget(props.widgetType);
  const { onHoverZIndex, zIndex } = usePositionedContainerZIndex(
    props,
    isDropTarget,
    useSelector,
  );

  const reflowSelector = getReflowSelector(props.widgetId);

  const reflowedPosition = useSelector(reflowSelector, isEqual);
  const dragDetails = useSelector(
    (state: AppState) => state.ui.widgetDragResize.dragDetails,
  );
  const isResizing = useSelector(
    (state: AppState) => state.ui.widgetDragResize.isResizing,
  );
  const isCurrentCanvasReflowing =
    (dragDetails && dragDetails.draggedOn === props.parentId) || isResizing;
  const containerStyle: CSSProperties = useMemo(() => {
    const reflowX = reflowedPosition?.X || 0;
    const reflowY = reflowedPosition?.Y || 0;
    const reflowWidth = reflowedPosition?.width;
    const reflowHeight = reflowedPosition?.height;
    const reflowEffected = isCurrentCanvasReflowing && reflowedPosition;
    const hasReflowedPosition =
      reflowEffected && (reflowX !== 0 || reflowY !== 0);
    const hasReflowedDimensions =
      reflowEffected &&
      ((reflowHeight && reflowHeight !== props.style.componentHeight) ||
        (reflowWidth && reflowWidth !== props.style.componentWidth));
    const effectedByReflow = hasReflowedPosition || hasReflowedDimensions;
    const dropTargetStyles: CSSProperties =
      isDropTarget && effectedByReflow ? { pointerEvents: "none" } : {};
    const reflowedPositionStyles: CSSProperties = hasReflowedPosition
      ? {
          transform: `translate(${reflowX}px,${reflowY}px)`,
          transition: `transform 100ms linear`,
          boxShadow: `0 0 0 1px rgba(104,113,239,0.5)`,
        }
      : {};
    const reflowDimensionsStyles = hasReflowedDimensions
      ? {
          transition: `width 0.1s, height 0.1s`,
          boxShadow: `0 0 0 1px rgba(104,113,239,0.5)`,
        }
      : {};
    const styles: CSSProperties = {
      position: "absolute",
      left: x,
      top: y,
      height:
        reflowHeight ||
        props.style.componentHeight + (props.style.heightUnit || "px"),
      width:
        reflowWidth ||
        props.style.componentWidth + (props.style.widthUnit || "px"),
      padding: padding + "px",
      zIndex,
      backgroundColor: "inherit",
      ...reflowedPositionStyles,
      ...reflowDimensionsStyles,
      ...dropTargetStyles,
    };
    return styles;
  }, [
    props.style,
    isCurrentCanvasReflowing,
    onHoverZIndex,
    zIndex,
    reflowSelector,
    reflowedPosition,
  ]);

  const stopEventPropagation = (e: any) => {
    e.stopPropagation();
  };

  return (
    <PositionedWidget
      className={containerClassName}
      data-testid="test-widget"
      id={props.widgetId}
      key={`positioned-container-${props.widgetId}`}
      // Positioned Widget is the top enclosure for all widgets and clicks on/inside the widget should not be propogated/bubbled out of this Container.
      onClick={stopEventPropagation}
      //Before you remove: This is used by property pane to reference the element
      style={containerStyle}
      zIndexOnHover={onHoverZIndex}
    >
      {props.children}
    </PositionedWidget>
  );
}

PositionedContainer.padding = WIDGET_PADDING;

export default PositionedContainer;
