import * as React from "react";
import { Text, View } from "@tarojs/components";
import styled from "styled-components";
import { ComponentProps } from "widgets/BaseComponent";
import { TextAlign } from "../widget";
import {
  FontStyleTypes,
  TextSize,
  DEFAULT_FONT_SIZE,
} from "constants/WidgetConstants";
import { fontSizeUtility } from "widgets/WidgetUtils";

export const TextContainer = styled(View)`
  height: 100%;
  width: 100%;
`;

export const StyledText = styled(Text)<{
  scroll: boolean;
  textAlign: string;
  backgroundColor?: string;
  textColor?: string;
  fontStyle?: string;
  fontSize?: TextSize;
}>`
  height: 100%;
  overflow-y: ${(props) => (props.scroll ? "auto" : "hidden")};
  text-overflow: ellipsis;
  text-align: ${(props) => props.textAlign.toLowerCase()};
  display: flex;
  width: 100%;
  justify-content: ${(props) =>
    props.textAlign === "LEFT"
      ? "flex-start"
      : props.textAlign === "RIGHT"
      ? "flex-end"
      : "center"};
  align-items: ${(props) => (props.scroll ? "flex-start" : "center")};
  background: ${(props) => props?.backgroundColor};
  color: ${(props) => props?.textColor};
  font-style: ${(props) =>
    props?.fontStyle?.includes(FontStyleTypes.ITALIC) ? "italic" : ""};
  text-decoration: ${(props) =>
    props?.fontStyle?.includes(FontStyleTypes.LINETHROUGH)
      ? "line-through"
      : ""};
  font-weight: ${(props) =>
    props?.fontStyle?.includes(FontStyleTypes.BOLD) ? "bold" : "normal"};
  font-size: ${({ fontSize }) =>
    fontSizeUtility(fontSize) || DEFAULT_FONT_SIZE};
`;

export interface TextComponentProps extends ComponentProps {
  text?: string;
  textAlign: TextAlign;
  fontSize?: TextSize;
  isLoading: boolean;
  shouldScroll?: boolean;
  backgroundColor?: string;
  textColor?: string;
  fontStyle?: string;
}

class TextComponent extends React.Component<TextComponentProps> {
  render() {
    const {
      backgroundColor,
      fontSize,
      fontStyle,
      text,
      textAlign,
      textColor,
    } = this.props;
    return (
      <TextContainer>
        <StyledText
          backgroundColor={backgroundColor}
          fontSize={fontSize}
          fontStyle={fontStyle}
          scroll={!!this.props.shouldScroll}
          textAlign={textAlign}
          textColor={textColor}
        >
          {text}
        </StyledText>
      </TextContainer>
    );
  }
}

export default TextComponent;
