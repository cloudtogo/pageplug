import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import ButtonComponent from "../component";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";

class MButtonWidget extends BaseWidget<MButtonWidgetProps, ButtonWidgetState> {
  state = {
    isLoading: false,
  };

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "text",
            label: "按钮文字",
            controlType: "INPUT_TEXT",
            placeholderText: "输入按钮文字",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "color",
            label: "背景颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: true,
            isTriggerProperty: false,
          },
          {
            propertyName: "textColor",
            label: "文本颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: true,
            isTriggerProperty: false,
          },
          {
            propertyName: "fontSize",
            label: "字体大小",
            controlType: "RADIO",
            options: [
              {
                label: "小",
                value: "14px",
              },
              {
                label: "适中",
                value: "16px",
              },
              {
                label: "大",
                value: "18px",
              },
              {
                label: "超大",
                value: "20px",
              },
            ],
            columns: 4,
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "isBold",
            label: "字体加粗",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "rounded",
            label: "是否圆角",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            helpText: "控制按钮显示/隐藏",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            label: "禁用",
            controlType: "SWITCH",
            helpText: "禁止按钮交互",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "showLoading",
            label: "显示加载动画",
            helpText: "数据加载或触发动作时，是否显示加载动画",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            helpText: "点击按钮时触发动作",
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

  onButtonClick = () => {
    if (this.props.onClick) {
      this.setState({
        isLoading: true,
      });
      super.executeAction({
        triggerPropertyName: "onClick",
        dynamicString: this.props.onClick,
        event: {
          type: EventType.ON_CLICK,
          callback: this.handleActionComplete,
        },
      });
    }
  };

  handleActionComplete = () => {
    this.setState({
      isLoading: false,
    });
  };

  getPageView() {
    const { isLoading, showLoading, isDisabled, ...others } = this.props;
    const loading = showLoading && (isLoading || this.state.isLoading);
    return (
      <ButtonComponent
        {...others}
        isLoading={loading}
        onClick={this.onButtonClick}
      />
    );
  }

  static getWidgetType(): WidgetType {
    return "TARO_BUTTON_WIDGET";
  }
}

export interface MButtonWidgetProps extends WidgetProps {
  text?: string;
  color?: string;
  textColor?: string;
  fontSize?: string;
  onClick?: string;
  rounded?: boolean;
  isDisabled?: boolean;
  isVisible?: boolean;
}

interface ButtonWidgetState extends WidgetState {
  isLoading: boolean;
}

export default MButtonWidget;
