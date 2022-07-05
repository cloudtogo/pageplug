import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { View } from "@tarojs/components";
import { Search } from "@taroify/core";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { WidgetType } from "constants/WidgetConstants";
import { ValidationTypes } from "constants/WidgetValidation";

class MSearchWidget extends BaseWidget<MSearchWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "placeholder",
            label: "占位提示",
            controlType: "INPUT_TEXT",
            placeholderText: "输入为空时显示提示信息",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "rounded",
            label: "圆角风格",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "showButton",
            label: "显示搜索按钮",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "readonly",
            label: "只读模式",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "inputAlign",
            label: "文本对齐",
            controlType: "RADIO",
            options: [
              {
                label: "左对齐",
                value: "left",
              },
              {
                label: "居中",
                value: "center",
              },
              {
                label: "右对齐",
                value: "right",
              },
            ],
            columns: 3,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            helpText: "输入内容变化时触发",
            propertyName: "onTextChanged",
            label: "onTextChanged",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "确定搜索时触发 (点击键盘上的搜索/回车按钮)",
            propertyName: "onSearch",
            label: "onSearch",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "点击搜索框时触发",
            propertyName: "onClick",
            label: "onClick",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      text: undefined,
    };
  }

  onValueChange = (value: string) => {
    this.props.updateWidgetMetaProperty("text", value, {
      triggerPropertyName: "onTextChanged",
      dynamicString: this.props.onTextChanged,
      event: {
        type: EventType.ON_TEXT_CHANGE,
      },
    });
  };

  onSearch = () => {
    if (this.props.onSearch) {
      super.executeAction({
        triggerPropertyName: "onSearch",
        dynamicString: this.props.onSearch,
        event: {
          type: EventType.ON_SEARCH,
        },
      });
    }
  };

  onClick = () => {
    if (this.props.onClick) {
      super.executeAction({
        triggerPropertyName: "onClick",
        dynamicString: this.props.onClick,
        event: {
          type: EventType.ON_CLICK,
        },
      });
    }
  };

  getPageView() {
    const {
      text,
      placeholder,
      rounded,
      inputAlign,
      readonly,
      showButton,
    } = this.props;
    const actionButton = showButton ? (
      <View onClick={this.onSearch}>搜索</View>
    ) : null;

    return (
      <View onClick={this.onClick}>
        <Search
          value={text}
          placeholder={placeholder}
          shape={rounded ? "round" : "square"}
          inputAlign={inputAlign}
          readonly={readonly}
          action={actionButton}
          clearTrigger="always"
          onClear={() => this.onValueChange("")}
          onChange={(e) => this.onValueChange(e.detail.value)}
          onSearch={this.onSearch}
        />
      </View>
    );
  }

  static getWidgetType(): WidgetType {
    return "TARO_SEARCH_WIDGET";
  }
}

export interface MSearchWidgetProps extends WidgetProps {
  text: string;
  rounded?: boolean;
  showButton?: boolean;
  readonly?: boolean;
  placeholder?: string;
  inputAlign?: "left" | "center" | "right";
  onTextChanged?: string;
  onSearch?: string;
  onClick?: string;
}

export default MSearchWidget;
