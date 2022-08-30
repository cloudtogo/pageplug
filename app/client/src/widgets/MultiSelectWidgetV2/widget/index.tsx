import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import derivedProperties from "./parseDerivedProperties";
import {
  isArray,
  isEqual,
  isFinite,
  isString,
  LoDashStatic,
  xorWith,
} from "lodash";
import {
  ValidationResponse,
  ValidationTypes,
} from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import MultiSelectComponent from "../component";
import {
  DefaultValueType,
  LabelValueType,
} from "rc-select/lib/interface/generator";
import { Layers } from "constants/Layers";
import { MinimumPopupRows, GRID_DENSITY_MIGRATION_V1 } from "widgets/constants";
import { LabelPosition } from "components/constants";
import { Alignment } from "@blueprintjs/core";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";

export function defaultOptionValueValidation(
  value: unknown,
  props: MultiSelectWidgetProps,
  _: LoDashStatic,
): ValidationResponse {
  let isValid = false;
  let parsed: any[] = [];
  let message = "";
  const isServerSideFiltered = props.serverSideFiltering;
  // TODO: options shouldn't get un-eval values;
  let options = props.options;

  const DEFAULT_ERROR_MESSAGE =
    "value should match: Array<string | number> | Array<{label: string, value: string | number}>";
  const MISSING_FROM_OPTIONS =
    "Some or all default values are missing from options. Please update the values.";
  const MISSING_FROM_OPTIONS_AND_WRONG_FORMAT =
    "Default value is missing in options. Please use [{label : <string | num>, value : < string | num>}] format to show default for server side data";
  /*
   * Function to check if the object has `label` and `value`
   */
  const hasLabelValue = (obj: any) => {
    return (
      _.isPlainObject(obj) &&
      obj.hasOwnProperty("label") &&
      obj.hasOwnProperty("value") &&
      _.isString(obj.label) &&
      (_.isString(obj.value) || _.isFinite(obj.value))
    );
  };

  /*
   * Function to check for duplicate values in array
   */
  const hasUniqueValues = (arr: Array<string>) => {
    const uniqueValues = new Set(arr);

    return uniqueValues.size === arr.length;
  };

  /*
   * When value is "['green', 'red']", "[{label: 'green', value: 'green'}]" and "green, red"
   */
  if (_.isString(value) && value.trim() !== "") {
    try {
      /*
       * when value is "['green', 'red']", "[{label: 'green', value: 'green'}]"
       */
      const parsedValue = JSON.parse(value);
      // Only parse value if resulting value is an array or string
      if (Array.isArray(parsedValue) || _.isString(parsedValue)) {
        value = parsedValue;
      }
    } catch (e) {
      /*
       * when value is "green, red", JSON.parse throws error
       */
      const splitByComma = (value as string).split(",") || [];

      value = splitByComma.map((s) => s.trim());
    }
  }

  /*
   * When value is "['green', 'red']", "[{label: 'green', value: 'green'}]" and "green, red"
   */
  if (Array.isArray(value)) {
    if (value.every((val) => _.isString(val) || _.isFinite(val))) {
      /*
       * When value is ["green", "red"]
       */
      if (hasUniqueValues(value)) {
        isValid = true;
        parsed = value;
      } else {
        parsed = [];
        message = "values must be unique. Duplicate values found";
      }
    } else if (value.every(hasLabelValue)) {
      /*
       * When value is [{label: "green", value: "red"}]
       */
      if (hasUniqueValues(value.map((val) => val.value))) {
        isValid = true;
        parsed = value;
      } else {
        parsed = [];
        message = "path:value must be unique. Duplicate values found";
      }
    } else {
      /*
       * When value is [true, false], [undefined, undefined] etc.
       */
      parsed = [];
      message = DEFAULT_ERROR_MESSAGE;
    }
  } else if (_.isString(value) && value.trim() === "") {
    /*
     * When value is an empty string
     */
    isValid = true;
    parsed = [];
  } else if (_.isNumber(value) || _.isString(value)) {
    /*
     * When value is a number or just a single string e.g "Blue"
     */
    isValid = true;
    parsed = [value];
  } else {
    /*
     * When value is undefined, null, {} etc.
     */
    parsed = [];
    message = DEFAULT_ERROR_MESSAGE;
  }

  if (isValid && !_.isNil(parsed) && !_.isEmpty(parsed)) {
    if (!Array.isArray(options) && typeof options === "string") {
      try {
        const parsedOptions = JSON.parse(options);
        if (Array.isArray(parsedOptions)) {
          options = parsedOptions;
        } else {
          options = [];
        }
      } catch (e) {
        options = [];
      }
    }

    const parsedValue = parsed;
    const areValuesPresent = parsedValue.every((value) => {
      const index = _.findIndex(
        options,
        (option) => option.value === value || option.value === value.value,
      );
      return index !== -1;
    });

    if (!areValuesPresent) {
      isValid = false;
      if (!isServerSideFiltered) {
        message = MISSING_FROM_OPTIONS;
      } else {
        if (!parsed.every(hasLabelValue)) {
          message = MISSING_FROM_OPTIONS_AND_WRONG_FORMAT;
        } else {
          message = MISSING_FROM_OPTIONS;
        }
      }
    }
  }
  return {
    isValid,
    parsed,
    messages: [message],
  };
}

class MultiSelectWidget extends BaseWidget<
  MultiSelectWidgetProps,
  WidgetState
> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "允许用户多选，每个选项的值必须唯一",
            propertyName: "options",
            label: "选项",
            controlType: "INPUT_TEXT",
            placeholderText: '[{ "label": "选项1", "value": "选项2" }]',
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                unique: ["value"],
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    required: true,
                    allowedKeys: [
                      {
                        name: "label",
                        type: ValidationTypes.TEXT,
                        params: {
                          default: "",
                          requiredKey: true,
                        },
                      },
                      {
                        name: "value",
                        type: ValidationTypes.TEXT,
                        params: {
                          default: "",
                          requiredKey: true,
                        },
                      },
                    ],
                  },
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            helpText: "设置默认选中的选项值",
            propertyName: "defaultOptionValue",
            label: "默认值",
            controlType: "INPUT_TEXT",
            placeholderText: "[GREEN]",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: defaultOptionValueValidation,
                expected: {
                  type: "Array of values",
                  example: ` "option1, option2" | ['option1', 'option2'] | [{ "label": "label1", "value": "value1" }]`,
                  autocompleteDataType: AutocompleteDataType.ARRAY,
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            helpText: "设置占位文本",
            propertyName: "placeholderText",
            label: "占位符",
            controlType: "INPUT_TEXT",
            placeholderText: "Search",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "isRequired",
            label: "必填",
            helpText: "强制用户填写",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "控制组件的显示/隐藏",
            propertyName: "isVisible",
            label: "是否显示",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            label: "禁用",
            helpText: "让组件不可交互",
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
          {
            propertyName: "isFilterable",
            label: "支持过滤",
            helpText: "让下拉列表支持数据过滤",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "开启服务端数据过滤",
            propertyName: "serverSideFiltering",
            label: "服务端过滤",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "是否下拉列表中展示全选选项",
            propertyName: "allowSelectAll",
            label: "允许全选",
            controlType: "SWITCH",
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
            helpText: "用户选中一个选项时触发",
            propertyName: "onOptionChange",
            label: "onOptionChange",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "过滤关键字更改时触发",
            hidden: (props: MultiSelectWidgetProps) =>
              !props.serverSideFiltering,
            dependencies: ["serverSideFiltering"],
            propertyName: "onFilterUpdate",
            label: "onFilterUpdate",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
      {
        sectionName: "标签",
        children: [
          {
            helpText: "设置组件标签文本",
            propertyName: "labelText",
            label: "文本",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入文本内容",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "设置组件标签位置",
            propertyName: "labelPosition",
            label: "位置",
            controlType: "DROP_DOWN",
            options: [
              { label: "左", value: LabelPosition.Left },
              { label: "上", value: LabelPosition.Top },
              { label: "自动", value: LabelPosition.Auto },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "设置组件标签的对齐方式",
            propertyName: "labelAlignment",
            label: "对齐",
            controlType: "LABEL_ALIGNMENT_OPTIONS",
            options: [
              {
                icon: "LEFT_ALIGN",
                value: Alignment.LEFT,
              },
              {
                icon: "RIGHT_ALIGN",
                value: Alignment.RIGHT,
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            hidden: (props: MultiSelectWidgetProps) =>
              props.labelPosition !== LabelPosition.Left,
            dependencies: ["labelPosition"],
          },
          {
            helpText: "设置组件标签占用的列数",
            propertyName: "labelWidth",
            label: "宽度（所占列数）",
            controlType: "NUMERIC_INPUT",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            min: 0,
            validation: {
              type: ValidationTypes.NUMBER,
              params: {
                natural: true,
              },
            },
            hidden: (props: MultiSelectWidgetProps) =>
              props.labelPosition !== LabelPosition.Left,
            dependencies: ["labelPosition"],
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "labelTextColor",
            label: "标签文本颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "labelTextSize",
            label: "标签文本大小",
            controlType: "DROP_DOWN",
            defaultValue: "0.875rem",
            options: [
              {
                label: "S",
                value: "0.875rem",
                subText: "0.875rem",
              },
              {
                label: "M",
                value: "1rem",
                subText: "1rem",
              },
              {
                label: "L",
                value: "1.25rem",
                subText: "1.25rem",
              },
              {
                label: "XL",
                value: "1.875rem",
                subText: "1.875rem",
              },
              {
                label: "2xl",
                value: "3rem",
                subText: "3rem",
              },
              {
                label: "3xl",
                value: "3.75rem",
                subText: "3.75rem",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "labelStyle",
            label: "字体样式",
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
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText: "边框圆角样式",
            controlType: "BORDER_RADIUS_OPTIONS",
            isBindProperty: true,
            isJSConvertible: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
            },
          },
          {
            propertyName: "boxShadow",
            label: "阴影",
            helpText: "组件轮廓投影",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "accentColor",
            label: "强调色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            invisible: true,
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
            helpText: "允许用户多选，每个选项的值必须唯一",
            propertyName: "options",
            label: "选项",
            controlType: "INPUT_TEXT",
            placeholderText: '[{ "label": "选项1", "value": "选项2" }]',
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                unique: ["value"],
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    required: true,
                    allowedKeys: [
                      {
                        name: "label",
                        type: ValidationTypes.TEXT,
                        params: {
                          default: "",
                          requiredKey: true,
                        },
                      },
                      {
                        name: "value",
                        type: ValidationTypes.TEXT,
                        params: {
                          default: "",
                          requiredKey: true,
                        },
                      },
                    ],
                  },
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            helpText: "设置默认选中的选项值",
            propertyName: "defaultOptionValue",
            label: "默认选中值",
            controlType: "INPUT_TEXT",
            placeholderText: "[GREEN]",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: defaultOptionValueValidation,
                expected: {
                  type: "Array of values",
                  example: ` "option1, option2" | ['option1', 'option2'] | [{ "label": "label1", "value": "value1" }]`,
                  autocompleteDataType: AutocompleteDataType.ARRAY,
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
        ],
      },
      {
        sectionName: "标签",
        children: [
          {
            helpText: "设置组件标签文本",
            propertyName: "labelText",
            label: "文本",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入文本内容",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "设置组件标签位置",
            propertyName: "labelPosition",
            label: "位置",
            controlType: "DROP_DOWN",
            options: [
              { label: "左", value: LabelPosition.Left },
              { label: "上", value: LabelPosition.Top },
              { label: "自动", value: LabelPosition.Auto },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "设置组件标签的对齐方式",
            propertyName: "labelAlignment",
            label: "对齐",
            controlType: "LABEL_ALIGNMENT_OPTIONS",
            options: [
              {
                icon: "LEFT_ALIGN",
                value: Alignment.LEFT,
              },
              {
                icon: "RIGHT_ALIGN",
                value: Alignment.RIGHT,
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            hidden: (props: MultiSelectWidgetProps) =>
              props.labelPosition !== LabelPosition.Left,
            dependencies: ["labelPosition"],
          },
          {
            helpText: "设置组件标签占用的列数",
            propertyName: "labelWidth",
            label: "宽度（所占列数）",
            controlType: "NUMERIC_INPUT",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            min: 0,
            validation: {
              type: ValidationTypes.NUMBER,
              params: {
                natural: true,
              },
            },
            hidden: (props: MultiSelectWidgetProps) =>
              props.labelPosition !== LabelPosition.Left,
            dependencies: ["labelPosition"],
          },
        ],
      },
      {
        sectionName: "搜索过滤",
        children: [
          {
            propertyName: "isFilterable",
            label: "允许搜索",
            helpText: "让下拉列表支持数据过滤",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "开启服务端数据过滤",
            propertyName: "serverSideFiltering",
            label: "服务端过滤",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "过滤关键字更改时触发",
            hidden: (props: MultiSelectWidgetProps) =>
              !props.serverSideFiltering,
            dependencies: ["serverSideFiltering"],
            propertyName: "onFilterUpdate",
            label: "onFilterUpdate",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
      {
        sectionName: "校验",
        children: [
          {
            propertyName: "isRequired",
            label: "必填",
            helpText: "强制用户填写",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            helpText: "设置占位文本",
            propertyName: "placeholderText",
            label: "占位符",
            controlType: "INPUT_TEXT",
            placeholderText: "Search",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "控制组件的显示/隐藏",
            propertyName: "isVisible",
            label: "是否显示",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            label: "禁用",
            helpText: "让组件不可交互",
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
          {
            helpText: "是否下拉列表中展示全选选项",
            propertyName: "allowSelectAll",
            label: "允许全选",
            controlType: "SWITCH",
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
            helpText: "用户选中一个选项时触发",
            propertyName: "onOptionChange",
            label: "onOptionChange",
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
        sectionName: "标签样式",
        children: [
          {
            propertyName: "labelTextColor",
            label: "字体颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "labelTextSize",
            label: "字体大小",
            controlType: "DROP_DOWN",
            defaultValue: "0.875rem",
            options: [
              {
                label: "S",
                value: "0.875rem",
                subText: "0.875rem",
              },
              {
                label: "M",
                value: "1rem",
                subText: "1rem",
              },
              {
                label: "L",
                value: "1.25rem",
                subText: "1.25rem",
              },
              {
                label: "XL",
                value: "1.875rem",
                subText: "1.875rem",
              },
              {
                label: "2xl",
                value: "3rem",
                subText: "3rem",
              },
              {
                label: "3xl",
                value: "3.75rem",
                subText: "3.75rem",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "labelStyle",
            label: "强调",
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
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "轮廓样式",
        children: [
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText: "边框圆角样式",
            controlType: "BORDER_RADIUS_OPTIONS",
            isBindProperty: true,
            isJSConvertible: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
            },
          },
          {
            propertyName: "boxShadow",
            label: "阴影",
            helpText: "组件轮廓投影",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "accentColor",
            label: "强调色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            invisible: true,
          },
        ],
      },
    ];
  }

  static getDerivedPropertiesMap() {
    return {
      value: `{{this.selectedOptionValues}}`,
      isValid: `{{(()=>{${derivedProperties.getIsValid}})()}}`,
      selectedOptionValues: `{{(()=>{${derivedProperties.getSelectedOptionValues}})()}}`,
      selectedOptionLabels: `{{(()=>{${derivedProperties.getSelectedOptionLabels}})()}}`,
    };
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      selectedOptions: "defaultOptionValue",
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      selectedOptions: undefined,
      filterText: "",
      isDirty: false,
    };
  }

  componentDidUpdate(prevProps: MultiSelectWidgetProps): void {
    // Check if defaultOptionValue is string
    let isStringArray = false;
    if (
      this.props.defaultOptionValue.some(
        (value: any) => isString(value) || isFinite(value),
      )
    ) {
      isStringArray = true;
    }

    const hasChanges = isStringArray
      ? xorWith(
          this.props.defaultOptionValue as string[],
          prevProps.defaultOptionValue as string[],
          isEqual,
        ).length > 0
      : xorWith(
          this.props.defaultOptionValue as OptionValue[],
          prevProps.defaultOptionValue as OptionValue[],
          isEqual,
        ).length > 0;

    if (hasChanges && this.props.isDirty) {
      this.props.updateWidgetMetaProperty("isDirty", false);
    }
  }

  getPageView() {
    const options = isArray(this.props.options) ? this.props.options : [];
    const minDropDownWidth = MinimumPopupRows * this.props.parentColumnSpace;
    const { componentWidth } = this.getComponentDimensions();
    const values = this.mergeLabelAndValue();
    const isInvalid =
      "isValid" in this.props && !this.props.isValid && !!this.props.isDirty;
    return (
      <MultiSelectComponent
        accentColor={this.props.accentColor}
        allowSelectAll={this.props.allowSelectAll}
        borderRadius={this.props.borderRadius}
        boxShadow={this.props.boxShadow}
        compactMode={
          !(
            (this.props.bottomRow - this.props.topRow) /
              GRID_DENSITY_MIGRATION_V1 >
            1
          )
        }
        disabled={this.props.isDisabled ?? false}
        dropDownWidth={minDropDownWidth}
        dropdownStyle={{
          zIndex: Layers.dropdownModalWidget,
        }}
        filterText={this.props.filterText}
        isFilterable={this.props.isFilterable}
        isValid={!isInvalid}
        labelAlignment={this.props.labelAlignment}
        labelPosition={this.props.labelPosition}
        labelStyle={this.props.labelStyle}
        labelText={this.props.labelText}
        labelTextColor={this.props.labelTextColor}
        labelTextSize={this.props.labelTextSize}
        labelWidth={this.getLabelWidth()}
        loading={this.props.isLoading}
        onChange={this.onOptionChange}
        onFilterChange={this.onFilterChange}
        options={options}
        placeholder={this.props.placeholderText as string}
        renderMode={this.props.renderMode}
        serverSideFiltering={this.props.serverSideFiltering}
        value={values}
        widgetId={this.props.widgetId}
        width={componentWidth}
      />
    );
  }

  onOptionChange = (value: DefaultValueType) => {
    this.props.updateWidgetMetaProperty("selectedOptions", value, {
      triggerPropertyName: "onOptionChange",
      dynamicString: this.props.onOptionChange,
      event: {
        type: EventType.ON_OPTION_CHANGE,
      },
    });
    if (!this.props.isDirty) {
      this.props.updateWidgetMetaProperty("isDirty", true);
    }
  };

  // { label , value } is needed in the widget
  mergeLabelAndValue = (): LabelValueType[] => {
    const labels = [...this.props.selectedOptionLabels];
    const values = [...this.props.selectedOptionValues];
    return values.map((value, index) => ({
      value,
      label: labels[index],
    }));
  };

  onFilterChange = (value: string) => {
    this.props.updateWidgetMetaProperty("filterText", value);

    if (this.props.onFilterUpdate && this.props.serverSideFiltering) {
      super.executeAction({
        triggerPropertyName: "onFilterUpdate",
        dynamicString: this.props.onFilterUpdate,
        event: {
          type: EventType.ON_FILTER_UPDATE,
        },
      });
    }
  };

  static getWidgetType(): WidgetType {
    return "MULTI_SELECT_WIDGET_V2";
  }
}
export interface OptionValue {
  label: string;
  value: string;
}
export interface DropdownOption extends OptionValue {
  disabled?: boolean;
}

export interface MultiSelectWidgetProps extends WidgetProps {
  placeholderText?: string;
  selectedIndex?: number;
  selectedIndexArr?: number[];
  selectedOption: DropdownOption;
  options?: DropdownOption[];
  onOptionChange: string;
  onFilterChange: string;
  defaultOptionValue: string[] | OptionValue[];
  isRequired: boolean;
  isLoading: boolean;
  selectedOptions: LabelValueType[];
  filterText: string;
  selectedOptionValues: string[];
  selectedOptionLabels: string[];
  serverSideFiltering: boolean;
  onFilterUpdate: string;
  allowSelectAll?: boolean;
  isFilterable: boolean;
  labelText: string;
  labelPosition?: LabelPosition;
  labelAlignment?: Alignment;
  labelWidth?: number;
  isDirty?: boolean;
}

export default MultiSelectWidget;
