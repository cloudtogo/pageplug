import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "./BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import CheckboxComponent from "components/designSystems/blueprint/CheckboxComponent";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { DerivedPropertiesMap } from "utils/WidgetFactory";
import * as Sentry from "@sentry/react";
import withMeta, { WithMeta } from "./MetaHOC";
import { AlignWidget } from "./SwitchWidget";

class CheckboxWidget extends BaseWidget<CheckboxWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "label",
            label: "文本",
            controlType: "INPUT_TEXT",
            placeholderText: "输入文本内容",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "alignWidget",
            label: "对齐方式",
            controlType: "DROP_DOWN",
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
            isBindProperty: true,
            isTriggerProperty: false,
          },
          {
            propertyName: "defaultCheckedState",
            label: "默认选中",
            helpText: "修改它会刷新组件状态",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isRequired",
            label: "必须",
            helpText: "是否必须填写",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            helpText: "控制组件是否可见",
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
            helpText: "是否禁止用户操作",
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
            helpText: "当选中状态变化时触发",
            propertyName: "onCheckChange",
            label: "onCheckChange",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      isChecked: "defaultCheckedState",
    };
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      value: `{{!!this.isChecked}}`,
      isValid: `{{ this.isRequired ? !!this.isChecked : true }}`,
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      isChecked: undefined,
    };
  }

  getPageView() {
    return (
      <CheckboxComponent
        alignWidget={this.props.alignWidget}
        isChecked={!!this.props.isChecked}
        isDisabled={this.props.isDisabled}
        isLoading={this.props.isLoading}
        isRequired={this.props.isRequired}
        key={this.props.widgetId}
        label={this.props.label}
        onCheckChange={this.onCheckChange}
        widgetId={this.props.widgetId}
      />
    );
  }

  onCheckChange = (isChecked: boolean) => {
    this.props.updateWidgetMetaProperty("isChecked", isChecked, {
      triggerPropertyName: "onCheckChange",
      dynamicString: this.props.onCheckChange,
      event: {
        type: EventType.ON_CHECK_CHANGE,
      },
    });
  };

  getWidgetType(): WidgetType {
    return "CHECKBOX_WIDGET";
  }
}

export interface CheckboxWidgetProps extends WidgetProps, WithMeta {
  label: string;
  defaultCheckedState: boolean;
  isChecked?: boolean;
  isDisabled?: boolean;
  onCheckChange?: string;
  isRequired?: boolean;
  alignWidget: AlignWidget;
}

export default CheckboxWidget;
export const ProfiledCheckboxWidget = Sentry.withProfiler(
  withMeta(CheckboxWidget),
);
