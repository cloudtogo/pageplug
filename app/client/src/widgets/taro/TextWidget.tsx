import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "../BaseWidget";
import { WidgetType, TextSize } from "constants/WidgetConstants";
import TextComponent from "components/designSystems/taro/TextComponent";
import { ValidationTypes } from "constants/WidgetValidation";
import { DerivedPropertiesMap } from "utils/WidgetFactory";
import LoadingWrapper from "./LoadingWrapper";

class TextWidget extends BaseWidget<MTextWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "text",
            label: "文本",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入文本内容",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "shouldScroll",
            label: "允许滚动",
            helpText: "内容超长时允许滚动，不然文本会被截断",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "backgroundColor",
            label: "背景颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
          },
          {
            propertyName: "textColor",
            label: "文本颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
          },
          {
            propertyName: "fontSize",
            label: "字体大小",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "一级标题",
                value: "HEADING1",
                subText: "24px",
                icon: "HEADING_ONE",
              },
              {
                label: "二级标题",
                value: "HEADING2",
                subText: "18px",
                icon: "HEADING_TWO",
              },
              {
                label: "三级标题",
                value: "HEADING3",
                subText: "16px",
                icon: "HEADING_THREE",
              },
              {
                label: "一级段落",
                value: "PARAGRAPH",
                subText: "14px",
                icon: "PARAGRAPH",
              },
              {
                label: "二级段落",
                value: "PARAGRAPH2",
                subText: "12px",
                icon: "PARAGRAPH_TWO",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "fontStyle",
            label: "字体风格",
            controlType: "BUTTON_TABS",
            options: [
              {
                icon: "BOLD_FONT",
                value: "BOLD",
              },
              {
                icon: "ITALICS_FONT",
                value: "ITALIC",
              },
              {
                icon: "LINETHROUGH_FONT",
                value: "LINETHROUGH",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "textAlign",
            label: "文字对齐",
            controlType: "ICON_TABS",
            options: [
              {
                icon: "LEFT_ALIGN",
                value: "LEFT",
              },
              {
                icon: "CENTER_ALIGN",
                value: "CENTER",
              },
              {
                icon: "RIGHT_ALIGN",
                value: "RIGHT",
              },
            ],
            defaultValue: "LEFT",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  getPageView() {
    return (
      <LoadingWrapper isLoading={this.props.isLoading}>
        <TextComponent
          backgroundColor={this.props.backgroundColor}
          fontSize={this.props.fontSize}
          fontStyle={this.props.fontStyle}
          isLoading={this.props.isLoading}
          key={this.props.widgetId}
          shouldScroll={this.props.shouldScroll}
          text={this.props.text}
          textAlign={this.props.textAlign ? this.props.textAlign : "LEFT"}
          textColor={this.props.textColor}
          widgetId={this.props.widgetId}
        />
      </LoadingWrapper>
    );
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      value: `{{ this.text }}`,
    };
  }

  getWidgetType(): WidgetType {
    return "TARO_TEXT_WIDGET";
  }
}

export type TextAlign = "LEFT" | "CENTER" | "RIGHT" | "JUSTIFY";

export interface TextStyles {
  backgroundColor?: string;
  textColor?: string;
  fontStyle?: string;
  fontSize?: TextSize;
  textAlign?: TextAlign;
}

export interface MTextWidgetProps extends WidgetProps, TextStyles {
  text?: string;
  isLoading: boolean;
  shouldScroll: boolean;
}

export default TextWidget;
export const MProfiledTextWidget = TextWidget;
