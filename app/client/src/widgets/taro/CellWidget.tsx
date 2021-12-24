import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "../BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import ButtonComponent from "components/designSystems/taro/ButtonComponent";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import withMeta, { WithMeta } from "../MetaHOC";

class MCellWidget extends BaseWidget<MCellWidgetProps, CellWidgetState> {
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
            label: "按钮颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
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
    return (
      <ButtonComponent
        isDisabled={this.props.isDisabled}
        isLoading={this.props.isLoading || this.state.isLoading}
        onClick={!this.props.isDisabled ? this.onButtonClick : undefined}
        text={this.props.text}
        color={this.props.color}
        rounded={this.props.rounded}
      />
    );
  }

  getWidgetType(): WidgetType {
    return "TARO_BUTTON_WIDGET";
  }
}

export interface MCellWidgetProps extends WidgetProps, WithMeta {
  text?: string;
  color?: string;
  onClick?: string;
  rounded?: boolean;
  isDisabled?: boolean;
  isVisible?: boolean;
}

interface CellWidgetState extends WidgetState {
  isLoading: boolean;
}

export default MCellWidget;
export const MProfiledCellWidget = withMeta(MCellWidget);
