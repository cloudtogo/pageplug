import React, { CSSProperties, ReactNode, useMemo } from "react";
import { BaseStyle } from "widgets/BaseWidget";
import { WIDGET_PADDING } from "constants/WidgetConstants";
import { generateClassName } from "utils/generators";
import { styled } from 'linaria/react';
import { Layers } from "constants/Layers";

const PositionedWidget = styled.div`
  &:hover {
    z-index: 2 !important;
  }
`;
type PositionedContainerProps = {
  style: BaseStyle;
  children: ReactNode;
  widgetId: string;
  widgetType: string;
  selected?: boolean;
  focused?: boolean;
  resizeDisabled?: boolean;
};

export function PositionedContainer(props: PositionedContainerProps) {
  const x = props.style.xPosition + (props.style.xPositionUnit || "px");
  const y = props.style.yPosition + (props.style.yPositionUnit || "px");
  const padding = WIDGET_PADDING;
  // memoized classname
  const containerClassName = useMemo(() => {
    return (
      generateClassName(props.widgetId) +
      " positioned-widget " +
      `t--widget-${props.widgetType
        .split("_")
        .join("")
        .toLowerCase()}`
    );
  }, [props.widgetType, props.widgetId]);
  const containerStyle: CSSProperties = useMemo(() => {
    return {
      position: "absolute",
      left: x,
      top: y,
      height: props.style.componentHeight + (props.style.heightUnit || "px"),
      width: props.style.componentWidth + (props.style.widthUnit || "px"),
      padding: padding + "px",
      zIndex:
        props.selected || props.focused
          ? Layers.selectedWidget
          : Layers.positionedWidget,
      backgroundColor: "inherit",
    };
  }, [props.style]);

  const stopEventPropagation = (e: any) => {
    e.stopPropagation();
  };

  return (
    <PositionedWidget
      className={containerClassName}
      data-testid="test-widget"
      id={props.widgetId}
      key={`positioned-container-${props.widgetId}`}
      onClick={stopEventPropagation}
      //Before you remove: This is used by property pane to reference the element
      style={containerStyle}
    >
      {props.children}
    </PositionedWidget>
  );
}

PositionedContainer.padding = WIDGET_PADDING;

export default PositionedContainer;
