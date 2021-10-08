import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "../BaseWidget";
import { WidgetType, RateSize } from "constants/WidgetConstants";
import RateComponent from "components/designSystems/blueprint/RateComponent";
import { ValidationTypes } from "constants/WidgetValidation";
import { DerivedPropertiesMap } from "utils/WidgetFactory";
import * as Sentry from "@sentry/react";
import withMeta, { WithMeta } from "widgets/MetaHOC";
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
        return {
          isValid: false,
          parsed: 0,
          message: `Value must be a number`,
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
        message: `This value must be less than or equal to max count`,
      };
    }

    // default rate can be a decimal only if Allow half property is true
    if (!props.isAllowHalf && !Number.isInteger(parsed)) {
      return {
        isValid: false,
        parsed,
        message: `This value can be a decimal only if 'Allow half' is true`,
      };
    }

    return { isValid, parsed };
  } catch (e) {
    return {
      isValid: false,
      parsed: value,
      message: `Could not validate `,
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
            label: "最大星星数",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入最大星星数",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { natural: true },
            },
          },
          {
            propertyName: "defaultRate",
            label: "默认评分",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入默认评分",
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
            propertyName: "activeColor",
            label: "激活颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "inactiveColor",
            label: "失效颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "tooltips",
            label: "提示气泡",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入提示气泡内容",
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
        ],
      },
      {
        sectionName: "动作",
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
          key={this.props.widgetId}
          onValueChanged={this.valueChangedHandler}
          readonly={this.props.isDisabled}
          value={this.props.rate}
          {...this.props}
        />
      )
    );
  }

  getWidgetType(): WidgetType {
    return "RATE_WIDGET";
  }
}

export interface RateWidgetProps extends WidgetProps, WithMeta {
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
export const ProfiledRateWidget = Sentry.withProfiler(withMeta(RateWidget));
