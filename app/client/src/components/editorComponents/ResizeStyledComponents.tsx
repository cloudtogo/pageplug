import { invisible, theme, transparenten } from "constants/DefaultTheme";
import { WIDGET_PADDING } from "constants/WidgetConstants";
import styled, { css } from "styled-components";

const EDGE_RESIZE_HANDLE_WIDTH = 12;
const EDGE_RESIZE_BAR_LONG = 20;
const EDGE_RESIZE_BAR_SHORT = 5;
const CORNER_RESIZE_HANDLE_WIDTH = 7;

const CORNER_OFFSET = -WIDGET_PADDING - CORNER_RESIZE_HANDLE_WIDTH / 2;
const HANDLE_OFFSET = -EDGE_RESIZE_HANDLE_WIDTH / 2 - WIDGET_PADDING;

export const VisibilityContainer = styled.div<{
  visible: boolean;
  padding: number;
  isWidgetActive: boolean;
}>`
  ${(props) => (!props.visible ? invisible : "")}
  ${(props) =>
    props.isWidgetActive
      ? css`
          box-shadow: 0 0 32px 0px ${transparenten(theme.colors.primary, 0.25)};
        `
      : ""}
  height: 100%;
  width: 100%;
`;

const ResizeIndicatorStyle = css<{
  showLightBorder: boolean;
}>`
  &::after {
    position: absolute;
    content: "";
    width: ${EDGE_RESIZE_BAR_SHORT}px;
    height: ${EDGE_RESIZE_BAR_LONG}px;
    border-radius: 3px;
    background: ${theme.colors.widgetResizeBarBG};
    border: 1px solid ${theme.colors.widgetBorder};
    top: calc(50% - ${EDGE_RESIZE_BAR_LONG / 2}px);
    left: calc(50% - 2px);
  }
`;

export const EdgeHandleStyles = css<{
  showAsBorder: boolean;
  showLightBorder: boolean;
}>`
  position: absolute;
  width: ${EDGE_RESIZE_HANDLE_WIDTH}px;
  height: ${EDGE_RESIZE_HANDLE_WIDTH}px;
  &::before {
    position: absolute;
    background: ${(props) => {
      if (props.showLightBorder) return theme.colors.widgetLightBorder;

      if (props.showAsBorder) return theme.colors.widgetMultiSelectBorder;

      return theme.colors.widgetBorder;
    }};
    content: "";
  }
  ${(props) => (!props.showAsBorder ? ResizeIndicatorStyle : "")}
`;

export const VerticalHandleStyles = css<{
  showAsBorder: boolean;
  showLightBorder: boolean;
}>`
  ${EdgeHandleStyles}
  top:${~(WIDGET_PADDING - 1) + 1}px;
  height: calc(100% + ${2 * WIDGET_PADDING - 1}px);
  ${(props) => (!props.showAsBorder ? "cursor: col-resize;" : "")}
  cursor: col-resize;
  &:before {
    left: 50%;
    bottom: 0px;
    top: 0;
    width: 1px;
  }
`;

export const HorizontalHandleStyles = css<{
  showAsBorder: boolean;
  showLightBorder: boolean;
}>`
  ${EdgeHandleStyles}
  left: ${~WIDGET_PADDING + 1}px;
  width: calc(100% + ${2 * WIDGET_PADDING}px);
  ${(props) => (!props.showAsBorder ? "cursor: row-resize;" : "")}
  cursor: row-resize;
  &:before {
    top: 50%;
    right: 0px;
    left: 0px;
    height: 1px;
  }
  &::after {
    width: ${EDGE_RESIZE_BAR_LONG}px;
    height: ${EDGE_RESIZE_BAR_SHORT}px;
    top: calc(50% - 2px);
    left: calc(50% - ${EDGE_RESIZE_BAR_LONG / 2}px);
  }
`;

export const LeftHandleStyles = styled.div`
  ${VerticalHandleStyles}
  left: ${HANDLE_OFFSET}px;
`;

export const RightHandleStyles = styled.div`
  ${VerticalHandleStyles};
  right: ${HANDLE_OFFSET}px;
`;

export const TopHandleStyles = styled.div`
  ${HorizontalHandleStyles};
  top: ${HANDLE_OFFSET}px;
`;

export const BottomHandleStyles = styled.div`
  ${HorizontalHandleStyles};
  bottom: ${HANDLE_OFFSET}px;
`;

export const CornerHandleStyles = css`
  position: absolute;
  z-index: 3;
  width: ${CORNER_RESIZE_HANDLE_WIDTH}px;
  height: ${CORNER_RESIZE_HANDLE_WIDTH}px;
  background: ${theme.colors.widgetResizeBarBG};
  border: 1px solid ${theme.colors.widgetBorder};
  border-radius: 2px;
`;

export const BottomRightHandleStyles = styled.div<{
  showAsBorder: boolean;
}>`
  ${CornerHandleStyles};
  bottom: ${CORNER_OFFSET}px;
  right: ${CORNER_OFFSET}px;
  cursor: se-resize;
`;
export const BottomLeftHandleStyles = styled.div`
  ${CornerHandleStyles};
  left: ${CORNER_OFFSET}px;
  bottom: ${CORNER_OFFSET}px;
  cursor: sw-resize;
`;
export const TopLeftHandleStyles = styled.div<{
  showAsBorder: boolean;
}>`
  ${CornerHandleStyles};
  left: ${CORNER_OFFSET}px;
  top: ${CORNER_OFFSET}px;
  cursor: nw-resize;
`;
export const TopRightHandleStyles = styled.div<{
  showAsBorder: boolean;
}>`
  ${CornerHandleStyles};
  right: ${CORNER_OFFSET}px;
  top: ${CORNER_OFFSET}px;
  cursor: ne-resize;
`;
