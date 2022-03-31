import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "../../BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import { SwitchComponent } from "../component";

import { ValidationTypes } from "constants/WidgetValidation";

import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { DerivedPropertiesMap } from "utils/WidgetFactory";
import { AlignWidget } from "widgets/constants";

class SwitchWidget extends BaseWidget<SwitchWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "label",
            label: "文本",
            controlType: "INPUT_TEXT",
            helpText: "Displays a label next to the widget",
            placeholderText: "Enable Option",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "defaultSwitchState",
            label: "默认打开",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
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
          {
            propertyName: "isDisabled",
            label: "是否禁用",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "animateLoading",
            label: "Animate Loading",
            controlType: "SWITCH",
            helpText: "Controls the loading of the widget",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "alignWidget",
            label: "对齐方式",
            controlType: "DROP_DOWN",
            isBindProperty: true,
            isTriggerProperty: false,
            options: [
              {
                label: "左对齐",
                value: "LEFT",
              },
              {
                label: "右对齐",
                value: "RIGHT",
              },
            ],
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            helpText: "开关变化时触发",
            propertyName: "onChange",
            label: "onChange",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }
  getPageView() {
    return (
      <SwitchComponent
        alignWidget={this.props.alignWidget ? this.props.alignWidget : "LEFT"}
        isDisabled={this.props.isDisabled}
        isLoading={this.props.isLoading}
        isSwitchedOn={!!this.props.isSwitchedOn}
        key={this.props.widgetId}
        label={this.props.label}
        onChange={this.onChange}
        widgetId={this.props.widgetId}
      />
    );
  }

  static getWidgetType(): WidgetType {
    return "SWITCH_WIDGET";
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      isSwitchedOn: "defaultSwitchState",
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      isSwitchedOn: undefined,
    };
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      value: `{{!!this.isSwitchedOn}}`,
    };
  }

  onChange = (isSwitchedOn: boolean) => {
    this.props.updateWidgetMetaProperty("isSwitchedOn", isSwitchedOn, {
      triggerPropertyName: "onChange",
      dynamicString: this.props.onChange,
      event: {
        type: EventType.ON_SWITCH_CHANGE,
      },
    });
  };
}

export interface SwitchWidgetProps extends WidgetProps {
  isSwitchedOn: boolean;
  defaultSwitchState: boolean;
  alignWidget: AlignWidget;
  label: string;
}

export default SwitchWidget;
