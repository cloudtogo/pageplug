import { Colors } from "constants/Colors";
import { invisible } from "constants/DefaultTheme";
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
  reduceOpacity: boolean;
}>`
  ${(props) => (!props.visible ? invisible : "")}
  ${(props) =>
    props.isWidgetActive
      ? css`
          box-shadow: 0 0 32px -16px var(--ads-color-brand);
        `
      : ""}
  height: 100%;
  width: 100%;
  ${({ reduceOpacity }) =>
    reduceOpacity &&
    css`
      opacity: 0.25;
    `}
`;

const VerticalResizeIndicators = css<{
  showLightBorder: boolean;
  isHovered: boolean;
}>`
  &::after {
    position: absolute;
    content: "";
<<<<<<< HEAD
    width: ${EDGE_RESIZE_BAR_SHORT}px;
    height: ${EDGE_RESIZE_BAR_LONG}px;
    border-radius: 3px;
    background: ${theme.colors.widgetResizeBarBG};
    border: 1px solid ${theme.colors.widgetBorder};
    top: calc(50% - ${EDGE_RESIZE_BAR_LONG / 2}px);
    left: calc(50% - 2px);
=======
    width: 7px;
    height: 16px;
    border-radius: 50%/16%;
    background: ${Colors.GREY_1};
    top: calc(50% - 8px);
    left: calc(50% - 2.5px);
    border: ${(props) => {
      return `1px solid ${props.isHovered ? Colors.WATUSI : "#F86A2B"}`;
    }};
    outline: 1px solid ${Colors.GREY_1};
  }
  &:hover::after {
    background: #f86a2b;
  }
`;

const HorizontalResizeIndicators = css<{
  showLightBorder: boolean;
  isHovered: boolean;
}>`
  &::after {
    position: absolute;
    content: "";
    width: 16px;
    height: 7px;
    border-radius: 16%/50%;
    border: ${(props) => {
      return `1px solid ${props.isHovered ? Colors.WATUSI : "#F86A2B"}`;
    }};
    background: ${Colors.GREY_1};
    top: calc(50% - 2.5px);
    left: calc(50% - 8px);
    outline: 1px solid ${Colors.GREY_1};
  }
  &:hover::after {
    background: #f86a2b;
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
  }
`;

export const EdgeHandleStyles = css<{
  showAsBorder: boolean;
  showLightBorder: boolean;
  disableDot: boolean;
  isHovered: boolean;
}>`
  position: absolute;
  width: ${EDGE_RESIZE_HANDLE_WIDTH}px;
  height: ${EDGE_RESIZE_HANDLE_WIDTH}px;
  &::before {
    position: absolute;
    background: "transparent";
    content: "";
  }
`;

export const VerticalHandleStyles = css<{
  showAsBorder: boolean;
  showLightBorder: boolean;
  disableDot: boolean;
  isHovered: boolean;
}>`
  ${EdgeHandleStyles}
  ${(props) =>
    props.showAsBorder || props.disableDot ? "" : VerticalResizeIndicators}
  top:${~(WIDGET_PADDING - 1) + 1}px;
  height: calc(100% + ${2 * WIDGET_PADDING - 1}px);
  ${(props) =>
    props.showAsBorder || props.disableDot ? "" : "cursor: col-resize;"}
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
  disableDot: boolean;
  isHovered: boolean;
}>`
  ${EdgeHandleStyles}
  ${(props) =>
    props.showAsBorder || props.disableDot ? "" : HorizontalResizeIndicators}
  left: ${~WIDGET_PADDING + 1}px;
  width: calc(100% + ${2 * WIDGET_PADDING}px);
  ${(props) =>
    props.showAsBorder || props.disableDot ? "" : "cursor: row-resize;"}
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
<<<<<<< HEAD
  left: ${HANDLE_OFFSET}px;
=======
  left: ${-EDGE_RESIZE_HANDLE_WIDTH / 2 - WIDGET_PADDING + 1.5}px;
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
`;

export const RightHandleStyles = styled.div`
  ${VerticalHandleStyles};
<<<<<<< HEAD
  right: ${HANDLE_OFFSET}px;
=======
  right: ${-EDGE_RESIZE_HANDLE_WIDTH / 2 - WIDGET_PADDING + 3.5}px;
  height: calc(100% + ${2 * WIDGET_PADDING}px);
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
`;

export const TopHandleStyles = styled.div`
  ${HorizontalHandleStyles};
<<<<<<< HEAD
  top: ${HANDLE_OFFSET}px;
=======
  top: ${-EDGE_RESIZE_HANDLE_WIDTH / 2 - WIDGET_PADDING + 1.5}px;
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
`;

export const BottomHandleStyles = styled.div`
  ${HorizontalHandleStyles};
<<<<<<< HEAD
  bottom: ${HANDLE_OFFSET}px;
=======
  bottom: ${-EDGE_RESIZE_HANDLE_WIDTH / 2 - WIDGET_PADDING + 3.5}px;
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
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
