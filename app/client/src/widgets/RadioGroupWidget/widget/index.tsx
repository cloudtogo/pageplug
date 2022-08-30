import React from "react";
import { Alignment } from "@blueprintjs/core";
import { isArray, compact, isNumber } from "lodash";

import BaseWidget, { WidgetProps, WidgetState } from "../../BaseWidget";
import { TextSize, WidgetType } from "constants/WidgetConstants";
import { GRID_DENSITY_MIGRATION_V1 } from "widgets/constants";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import {
  ValidationResponse,
  ValidationTypes,
} from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { RadioOption } from "../constants";
import { LabelPosition } from "components/constants";
import RadioGroupComponent from "../component";

/**
 * Validation rules:
 * 1. This property will take the value in the following format: Array<{ "label": "string", "value": "string" | number}>
 * 2. The `value` property should consists of unique values only.
 * 3. Data types of all the value props should be the same.
 */
export function optionsCustomValidation(
  options: unknown,
  props: any,
  _: any,
): ValidationResponse {
  const validationUtil = (
    options: { label: string; value: string | number }[],
    _: any,
  ) => {
    let _isValid = true;
    let message = "";
    let valueType = "";
    const uniqueLabels: Record<string | number, string> = {};

    for (let i = 0; i < options.length; i++) {
      const { label, value } = options[i];
      if (!valueType) {
        valueType = typeof value;
      }
      //Checks the uniqueness all the values in the options
      if (!uniqueLabels.hasOwnProperty(value)) {
        uniqueLabels[value] = "";
      } else {
        _isValid = false;
        message = "path:value must be unique. Duplicate values found";
        break;
      }

      //Check if the required field "label" is present:
      if (!label) {
        _isValid = false;
        message =
          "Invalid entry at index: " + i + ". Missing required key: label";
        break;
      }

      //Validation checks for the the label.
      if (
        _.isNil(label) ||
        label === "" ||
        (typeof label !== "string" && typeof label !== "number")
      ) {
        _isValid = false;
        message =
          "Invalid entry at index: " +
          i +
          ". Value of key: label is invalid: This value does not evaluate to type string";
        break;
      }

      //Check if all the data types for the value prop is the same.
      if (typeof value !== valueType) {
        _isValid = false;
        message = "All value properties in options must have the same type";
        break;
      }

      //Check if the each object has value property.
      if (_.isNil(value)) {
        _isValid = false;
        message =
          'This value does not evaluate to type Array<{ "label": "string", "value": "string" | number }>';
        break;
      }
    }

    return {
      isValid: _isValid,
      parsed: _isValid ? options : [],
      messages: [message],
    };
  };

  const invalidResponse = {
    isValid: false,
    parsed: [],
    messages: [
      'This value does not evaluate to type Array<{ "label": "string", "value": "string" | number }>',
    ],
  };
  try {
    if (_.isString(options)) {
      options = JSON.parse(options as string);
    }

    if (Array.isArray(options)) {
      return validationUtil(options, _);
    } else {
      return invalidResponse;
    }
  } catch (e) {
    return invalidResponse;
  }
}
function defaultOptionValidation(
  value: unknown,
  props: any,
  _: any,
): ValidationResponse {
  //Checks if the value is not of object type in {{}}
  if (_.isObject(value)) {
    return {
      isValid: false,
      parsed: JSON.stringify(value, null, 2),
      messages: ["This value does not evaluate to type: string or number"],
    };
  }

  //Checks if the value is not of boolean type in {{}}
  if (_.isBoolean(value)) {
    return {
      isValid: false,
      parsed: value,
      messages: ["This value does not evaluate to type: string or number"],
    };
  }

  return {
    isValid: true,
    parsed: value,
  };
}

class RadioGroupWidget extends BaseWidget<RadioGroupWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "选项值唯一的数组",
            propertyName: "options",
            label: "选项",
            controlType: "OPTION_INPUT",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: optionsCustomValidation,
                expected: {
                  type:
                    'Array<{ "label": "string", "value": "string" | number}>',
                  example: `[{"label": "One", "value": "one"}]`,
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            helpText: "设置默认选中的选项",
            propertyName: "defaultOptionValue",
            label: "默认选中值",
            placeholderText: "Y",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            /**
             * Changing the validation to FUNCTION.
             * If the user enters Integer inside {{}} e.g. {{1}} then value should evalute to integer.
             * If user enters 1 e.g. then it should evaluate as string.
             */
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: defaultOptionValidation,
                expected: {
                  type: `string |\nnumber (only works in mustache syntax)`,
                  example: `abc | {{1}}`,
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
          },
          {
            propertyName: "isInline",
            helpText: "单向框是否水平排列",
            label: "行排列",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
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
            propertyName: "alignment",
            helpText: "设置组件对齐方式",
            label: "对齐",
            controlType: "DROP_DOWN",
            isBindProperty: true,
            isTriggerProperty: false,
            options: [
              {
                label: "左对齐",
                value: Alignment.LEFT,
              },
              {
                label: "右对齐",
                value: Alignment.RIGHT,
              },
            ],
          },
        ],
      },
      {
        sectionName: "标签",
        children: [
          {
            helpText: "设置组件标签文本",
            propertyName: "label",
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
            hidden: (props: RadioGroupWidgetProps) =>
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
            hidden: (props: RadioGroupWidgetProps) =>
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
                label: "XXL",
                value: "3rem",
                subText: "3rem",
              },
              {
                label: "3XL",
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
            propertyName: "accentColor",
            helpText: "设置单选框选中态的颜色",
            label: "强调色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "事件",
        children: [
          {
            helpText: "选中项改变时触发",
            propertyName: "onSelectionChange",
            label: "onSelectionChange",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
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
            helpText: "选项值唯一的数组",
            propertyName: "options",
            label: "选项",
            controlType: "OPTION_INPUT",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: optionsCustomValidation,
                expected: {
                  type:
                    'Array<{ "label": "string", "value": "string" | number}>',
                  example: `[{"label": "One", "value": "one"}]`,
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            helpText: "设置默认选中的选项",
            propertyName: "defaultOptionValue",
            label: "默认选中值",
            placeholderText: "Y",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            /**
             * Changing the validation to FUNCTION.
             * If the user enters Integer inside {{}} e.g. {{1}} then value should evalute to integer.
             * If user enters 1 e.g. then it should evaluate as string.
             */
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: defaultOptionValidation,
                expected: {
                  type: `string |\nnumber (only works in mustache syntax)`,
                  example: `abc | {{1}}`,
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
          },
        ],
      },
      {
        sectionName: "标签",
        children: [
          {
            helpText: "设置组件标签文本",
            propertyName: "label",
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
            hidden: (props: RadioGroupWidgetProps) =>
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
            hidden: (props: RadioGroupWidgetProps) =>
              props.labelPosition !== LabelPosition.Left,
            dependencies: ["labelPosition"],
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
            propertyName: "isInline",
            helpText: "单向框是否水平排列",
            label: "行排列",
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
            helpText: "选中项改变时触发",
            propertyName: "onSelectionChange",
            label: "onSelectionChange",
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
                label: "XXL",
                value: "3rem",
                subText: "3rem",
              },
              {
                label: "3XL",
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
        sectionName: "属性",
        children: [
          {
            propertyName: "alignment",
            helpText: "设置组件对齐方式",
            label: "对齐",
            controlType: "DROP_DOWN",
            isBindProperty: true,
            isTriggerProperty: false,
            options: [
              {
                label: "左对齐",
                value: Alignment.LEFT,
              },
              {
                label: "右对齐",
                value: Alignment.RIGHT,
              },
            ],
          },
        ],
      },
      {
        sectionName: "颜色配置",
        children: [
          {
            propertyName: "accentColor",
            helpText: "设置单选框选中态的颜色",
            label: "强调色",
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

  static getDerivedPropertiesMap() {
    return {
      selectedOption:
        "{{_.find(this.options, { value: this.selectedOptionValue })}}",
      isValid: `{{ this.isRequired ? !!this.selectedOptionValue : true }}`,
      value: `{{this.selectedOptionValue}}`,
    };
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      selectedOptionValue: "defaultOptionValue",
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      selectedOptionValue: undefined,
      isDirty: false,
    };
  }

  componentDidUpdate(prevProps: RadioGroupWidgetProps): void {
    if (
      this.props.defaultOptionValue !== prevProps.defaultOptionValue &&
      this.props.isDirty
    ) {
      this.props.updateWidgetMetaProperty("isDirty", false);
    }
  }

  getPageView() {
    const {
      alignment,
      bottomRow,
      isDisabled,
      isInline,
      isLoading,
      label,
      labelAlignment,
      labelPosition,
      labelStyle,
      labelTextColor,
      labelTextSize,
      options,
      selectedOptionValue,
      topRow,
      widgetId,
    } = this.props;

    const { componentHeight } = this.getComponentDimensions();

    return (
      <RadioGroupComponent
        accentColor={this.props.accentColor}
        alignment={alignment}
        compactMode={!((bottomRow - topRow) / GRID_DENSITY_MIGRATION_V1 > 1)}
        disabled={isDisabled}
        height={componentHeight}
        inline={Boolean(isInline)}
        key={widgetId}
        labelAlignment={labelAlignment}
        labelPosition={labelPosition}
        labelStyle={labelStyle}
        labelText={label}
        labelTextColor={labelTextColor}
        labelTextSize={labelTextSize}
        labelWidth={this.getLabelWidth()}
        loading={isLoading}
        onRadioSelectionChange={this.onRadioSelectionChange}
        options={isArray(options) ? compact(options) : []}
        required={this.props.isRequired}
        selectedOptionValue={selectedOptionValue}
        widgetId={widgetId}
      />
    );
  }

  onRadioSelectionChange = (updatedValue: string) => {
    let newVal;
    if (isNumber(this.props.options[0].value)) {
      newVal = parseFloat(updatedValue);
    } else {
      newVal = updatedValue;
    }
    // Set isDirty to true when the selection changes
    if (!this.props.isDirty) {
      this.props.updateWidgetMetaProperty("isDirty", true);
    }

    this.props.updateWidgetMetaProperty("selectedOptionValue", newVal, {
      triggerPropertyName: "onSelectionChange",
      dynamicString: this.props.onSelectionChange,
      event: {
        type: EventType.ON_OPTION_CHANGE,
      },
    });
  };

  static getWidgetType(): WidgetType {
    return "RADIO_GROUP_WIDGET";
  }
}

export interface RadioGroupWidgetProps extends WidgetProps {
  options: RadioOption[];
  selectedOptionValue: string;
  onSelectionChange: string;
  defaultOptionValue: string;
  isRequired?: boolean;
  isDisabled: boolean;
  isInline?: boolean;
  alignment: Alignment;
  label: string;
  labelPosition?: LabelPosition;
  labelAlignment?: Alignment;
  labelWidth?: number;
  labelTextColor?: string;
  labelTextSize?: TextSize;
  labelStyle?: string;
  isDirty: boolean;
  accentColor: string;
}

export default RadioGroupWidget;
