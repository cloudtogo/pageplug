import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import { RateSize } from "../constants";
import RateComponent from "../component";

import { ValidationTypes } from "constants/WidgetValidation";
import { DerivedPropertiesMap } from "utils/WidgetFactory";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";

function validateDefaultRate(value: unknown, props: any, _: any) {
  try {
    let parsed = value;
    let isValid = false;

    if (_.isString(value as string)) {
      if (/^\d+\.?\d*$/.test(value as string)) {
        parsed = Number(value);
        isValid = true;
      } else {
        if (value === "") {
          return {
            isValid: true,
            parsed: 0,
          };
        }

        return {
          isValid: false,
          parsed: 0,
          messages: [`Value must be a number`],
        };
      }
    }

    if (Number.isFinite(parsed)) {
      isValid = true;
    }

    // default rate must be less than max count
    if (!_.isNaN(props.maxCount) && Number(value) > Number(props.maxCount)) {
      return {
        isValid: false,
        parsed,
        messages: [`This value must be less than or equal to max count`],
      };
    }

    // default rate can be a decimal only if Allow half property is true
    if (!props.isAllowHalf && !Number.isInteger(parsed)) {
      return {
        isValid: false,
        parsed,
        messages: [`This value can be a decimal only if 'Allow half' is true`],
      };
    }

    return { isValid, parsed };
  } catch (e) {
    return {
      isValid: false,
      parsed: value,
      messages: [`Could not validate `],
    };
  }
}

class RateWidget extends BaseWidget<RateWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "maxCount",
            helpText: "设置总分",
            label: "最大星星数",
            controlType: "INPUT_TEXT",
            placeholderText: "5",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { natural: true },
            },
          },
          {
            propertyName: "defaultRate",
            helpText: "设置默认评分",
            label: "默认评分",
            controlType: "INPUT_TEXT",
            placeholderText: "2.5",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: validateDefaultRate,
                expected: {
                  type: "number",
                  example: 5,
                  autocompleteDataType: AutocompleteDataType.NUMBER,
                },
              },
            },
            dependencies: ["maxCount", "isAllowHalf"],
          },
          {
            propertyName: "tooltips",
            label: "提示气泡",
            controlType: "INPUT_TEXT",
            placeholderText: '["糟糕", "普通", "非常棒"]',
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: { children: { type: ValidationTypes.TEXT } },
            },
          },
          {
            propertyName: "size",
            label: "尺寸",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "小",
                value: "SMALL",
              },
              {
                label: "中",
                value: "MEDIUM",
              },
              {
                label: "大",
                value: "LARGE",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "isAllowHalf",
            helpText: "是否允许打半星",
            label: "允许半星",
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
            label: "加载时显示动画",
            controlType: "SWITCH",
            helpText: "组件依赖的数据加载时显示加载动画",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "事件",
        children: [
          {
            helpText: "评分变化时触发",
            propertyName: "onRateChanged",
            label: "onChange",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "activeColor",
            label: "评分颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "inactiveColor",
            label: "评分背景颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "数据",
        children: [
          {
            propertyName: "maxCount",
            helpText: "设置总分",
            label: "最大星星数",
            controlType: "INPUT_TEXT",
            placeholderText: "5",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { natural: true },
            },
          },
          {
            propertyName: "defaultRate",
            helpText: "设置默认评分",
            label: "默认评分",
            controlType: "INPUT_TEXT",
            placeholderText: "2.5",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: validateDefaultRate,
                expected: {
                  type: "number",
                  example: 5,
                  autocompleteDataType: AutocompleteDataType.NUMBER,
                },
              },
            },
            dependencies: ["maxCount", "isAllowHalf"],
          },
          {
            propertyName: "tooltips",
            helpText: "提示气泡",
            label: "提示气泡",
            controlType: "INPUT_TEXT",
            placeholderText: '["糟糕", "普通", "非常棒"]',
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: { children: { type: ValidationTypes.TEXT } },
            },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "isAllowHalf",
            helpText: "是否允许打半星",
            label: "允许半星",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isVisible",
            helpText: "控制组件的显示/隐藏",
            label: "是否显示",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            helpText: "让组件不可交互",
            label: "禁用",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "animateLoading",
            label: "加载时显示动画",
            controlType: "SWITCH",
            helpText: "组件依赖的数据加载时显示加载动画",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "事件",
        children: [
          {
            helpText: "评分变化时触发",
            propertyName: "onRateChanged",
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

  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "size",
            label: "尺寸",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "小",
                value: "SMALL",
              },
              {
                label: "中",
                value: "MEDIUM",
              },
              {
                label: "大",
                value: "LARGE",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
      {
        sectionName: "颜色配置",
        children: [
          {
            propertyName: "activeColor",
            label: "评分颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "inactiveColor",
            label: "评分背景颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      rate: "defaultRate",
    };
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      value: `{{ this.rate }}`,
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      rate: undefined,
    };
  }

  valueChangedHandler = (value: number) => {
    this.props.updateWidgetMetaProperty("rate", value, {
      triggerPropertyName: "onRateChanged",
      dynamicString: this.props.onRateChanged,
      event: {
        type: EventType.ON_RATE_CHANGED,
      },
    });
  };

  getPageView() {
    return (
      (this.props.rate || this.props.rate === 0) && (
        <RateComponent
          activeColor={this.props.activeColor}
          bottomRow={this.props.bottomRow}
          inactiveColor={this.props.inactiveColor}
          isAllowHalf={this.props.isAllowHalf}
          isDisabled={this.props.isDisabled}
          isLoading={this.props.isLoading}
          key={this.props.widgetId}
          leftColumn={this.props.leftColumn}
          maxCount={this.props.maxCount}
          onValueChanged={this.valueChangedHandler}
          readonly={this.props.isDisabled}
          rightColumn={this.props.rightColumn}
          size={this.props.size}
          tooltips={this.props.tooltips}
          topRow={this.props.topRow}
          value={this.props.rate}
          widgetId={this.props.widgetId}
        />
      )
    );
  }

  static getWidgetType(): WidgetType {
    return "RATE_WIDGET";
  }
}

export interface RateWidgetProps extends WidgetProps {
  maxCount: number;
  size: RateSize;
  defaultRate?: number;
  rate?: number;
  activeColor?: string;
  inactiveColor?: string;
  isAllowHalf?: boolean;
  onRateChanged?: string;
  tooltips?: Array<string>;
}

export default RateWidget;
