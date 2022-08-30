import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { TextSize, WidgetType } from "constants/WidgetConstants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import DatePickerComponent from "../component";

import { ValidationTypes } from "constants/WidgetValidation";
import { DerivedPropertiesMap } from "utils/WidgetFactory";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";

import derivedProperties from "./parseDerivedProperties";
import { DatePickerType, TimePrecision } from "../constants";
import { LabelPosition } from "components/constants";
import { Alignment } from "@blueprintjs/core";
import { GRID_DENSITY_MIGRATION_V1 } from "widgets/constants";
import { DateFormatOptions } from "./constants";

function allowedRange(value: any) {
  const allowedValues = [0, 1, 2, 3, 4, 5, 6];
  const isValid = allowedValues.includes(Number(value));
  return {
    isValid: isValid,
    parsed: isValid ? Number(value) : 0,
    messages: isValid ? [] : ["Number should be between 0-6."],
  };
}
class DatePickerWidget extends BaseWidget<DatePickerWidget2Props, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "defaultDate",
            label: "默认日期",
            controlType: "DATE_PICKER",
            placeholderText: "输入默认日期",
            useValidationMessage: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.DATE_ISO_STRING },
          },
          {
            propertyName: "dateFormat",
            label: "日期格式",
            controlType: "DROP_DOWN",
            isJSConvertible: true,
            optionWidth: "340px",
            options: DateFormatOptions,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            hideSubText: true,
          },
          {
            propertyName: "timePrecision",
            label: "时间精度",
            controlType: "DROP_DOWN",
            helpText: "显示时间的精度",
            defaultValue: TimePrecision.MINUTE,
            options: [
              {
                label: "无",
                value: TimePrecision.NONE,
              },
              {
                label: "分钟",
                value: TimePrecision.MINUTE,
              },
              {
                label: "秒",
                value: TimePrecision.SECOND,
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [
                  TimePrecision.NONE,
                  TimePrecision.MINUTE,
                  TimePrecision.SECOND,
                ],
                default: TimePrecision.MINUTE,
              },
            },
          },
          {
            propertyName: "isRequired",
            label: "是否必须",
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
          {
            propertyName: "closeOnSelection",
            label: "选中日期后关闭",
            controlType: "SWITCH",
            defaultValue: true,
            isJSConvertible: false,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "shortcuts",
            label: "显示快捷菜单",
            controlType: "SWITCH",
            isJSConvertible: false,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "minDate",
            label: "最小日期",
            controlType: "DATE_PICKER",
            useValidationMessage: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.DATE_ISO_STRING },
          },
          {
            propertyName: "maxDate",
            label: "最大日期",
            controlType: "DATE_PICKER",
            useValidationMessage: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.DATE_ISO_STRING },
          },
          {
            propertyName: "firstDayOfWeek",
            label: "每周第一天",
            helpText: "设置每周的第一天是星期几",
            controlType: "INPUT_TEXT",
            defaultValue: "0",
            inputType: "INTEGER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: allowedRange,
                expected: {
                  type:
                    "0 : 星期天\n1 : 星期一\n2 : 星期二\n3 : 星期三\n4 : 星期四\n5 : 星期五\n6 : 星期六",
                  example: "0",
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
            hidden: (props: DatePickerWidget2Props) =>
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
            hidden: (props: DatePickerWidget2Props) =>
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
        ],
      },
      {
        sectionName: "事件",
        children: [
          {
            propertyName: "onDateSelected",
            label: "onDateSelected",
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
            propertyName: "accentColor",
            label: "强调色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            invisible: true,
          },
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText: "边框圆角样式",
            controlType: "BORDER_RADIUS_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
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
            helpText: "设置所选日期的格式",
            propertyName: "dateFormat",
            label: "日期格式",
            controlType: "DROP_DOWN",
            isJSConvertible: true,
            optionWidth: "340px",
            options: DateFormatOptions,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            hideSubText: true,
          },
          {
            propertyName: "defaultDate",
            label: "默认日期",
            helpText: "设置默认日期，默认日期修改后，组件当前日期会自动更新",
            controlType: "DATE_PICKER",
            placeholderText: "Enter Default Date",
            useValidationMessage: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.DATE_ISO_STRING },
          },
          {
            propertyName: "firstDayOfWeek",
            label: "每周第一天",
            helpText: "设置每周的第一天是星期几",
            controlType: "INPUT_TEXT",
            defaultValue: "0",
            inputType: "INTEGER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: allowedRange,
                expected: {
                  type:
                    "0 : 星期天\n1 : 星期一\n2 : 星期二\n3 : 星期三\n4 : 星期四\n5 : 星期五\n6 : 星期六",
                  example: "0",
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
          },
          {
            propertyName: "timePrecision",
            label: "时间精度",
            controlType: "DROP_DOWN",
            helpText: "显示时间的精度",
            defaultValue: TimePrecision.MINUTE,
            options: [
              {
                label: "无",
                value: TimePrecision.NONE,
              },
              {
                label: "分钟",
                value: TimePrecision.MINUTE,
              },
              {
                label: "秒",
                value: TimePrecision.SECOND,
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [
                  TimePrecision.NONE,
                  TimePrecision.MINUTE,
                  TimePrecision.SECOND,
                ],
                default: TimePrecision.MINUTE,
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
            hidden: (props: DatePickerWidget2Props) =>
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
            hidden: (props: DatePickerWidget2Props) =>
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
          {
            propertyName: "minDate",
            label: "最小日期",
            helpText: "设置组件最小日期",
            controlType: "DATE_PICKER",
            useValidationMessage: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.DATE_ISO_STRING },
          },
          {
            propertyName: "maxDate",
            label: "最大日期",
            helpText: "设置组件最大日期",
            controlType: "DATE_PICKER",
            useValidationMessage: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.DATE_ISO_STRING },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "isVisible",
            label: "是否显示",
            helpText: "控制组件的显示/隐藏",
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
            propertyName: "shortcuts",
            label: "显示快捷菜单",
            helpText: "是否在日期选择器中显示快捷菜单",
            controlType: "SWITCH",
            isJSConvertible: false,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "closeOnSelection",
            label: "选中后关闭",
            helpText: "选中日期后自动关闭日期选择器",
            controlType: "SWITCH",
            defaultValue: true,
            isJSConvertible: false,
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
            propertyName: "onDateSelected",
            label: "onDateSelected",
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
        sectionName: "轮廓样式",
        children: [
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
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText: "边框圆角样式",
            controlType: "BORDER_RADIUS_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
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
        ],
      },
    ];
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      isValid: `{{(()=>{${derivedProperties.isValidDate}})()}}`,
      selectedDate: `{{ this.value ? moment(this.value).toISOString() : "" }}`,
      formattedDate: `{{ this.value ? moment(this.value).format(this.dateFormat) : "" }}`,
    };
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      value: "defaultDate",
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      value: undefined,
      isDirty: false,
    };
  }

  componentDidUpdate(prevProps: DatePickerWidget2Props): void {
    if (
      this.props.defaultDate !== prevProps.defaultDate &&
      this.props.isDirty
    ) {
      this.props.updateWidgetMetaProperty("isDirty", false);
    }
  }

  getPageView() {
    return (
      <DatePickerComponent
        accentColor={this.props.accentColor}
        backgroundColor={this.props.backgroundColor}
        borderRadius={this.props.borderRadius}
        boxShadow={this.props.boxShadow}
        closeOnSelection={this.props.closeOnSelection}
        compactMode={
          !(
            (this.props.bottomRow - this.props.topRow) /
              GRID_DENSITY_MIGRATION_V1 >
            1
          )
        }
        dateFormat={this.props.dateFormat}
        datePickerType={"DATE_PICKER"}
        firstDayOfWeek={this.props.firstDayOfWeek}
        isDisabled={this.props.isDisabled}
        isLoading={this.props.isLoading}
        labelAlignment={this.props.labelAlignment}
        labelPosition={this.props.labelPosition}
        labelStyle={this.props.labelStyle}
        labelText={this.props.label}
        labelTextColor={this.props.labelTextColor}
        labelTextSize={this.props.labelTextSize}
        labelWidth={this.getLabelWidth()}
        maxDate={this.props.maxDate}
        minDate={this.props.minDate}
        onDateSelected={this.onDateSelected}
        selectedDate={this.props.value}
        shortcuts={this.props.shortcuts}
        timePrecision={this.props.timePrecision}
        widgetId={this.props.widgetId}
      />
    );
  }

  onDateSelected = (selectedDate: string) => {
    if (!this.props.isDirty) {
      this.props.updateWidgetMetaProperty("isDirty", true);
    }

    this.props.updateWidgetMetaProperty("value", selectedDate, {
      triggerPropertyName: "onDateSelected",
      dynamicString: this.props.onDateSelected,
      event: {
        type: EventType.ON_DATE_SELECTED,
      },
    });
  };

  static getWidgetType(): WidgetType {
    return "DATE_PICKER_WIDGET2";
  }
}

export interface DatePickerWidget2Props extends WidgetProps {
  defaultDate: string;
  selectedDate: string;
  formattedDate: string;
  isDisabled: boolean;
  dateFormat: string;
  label: string;
  labelPosition?: LabelPosition;
  labelAlignment?: Alignment;
  labelWidth?: number;
  labelTextColor?: string;
  labelTextSize?: TextSize;
  labelStyle?: string;
  datePickerType: DatePickerType;
  onDateSelected?: string;
  onDateRangeSelected?: string;
  maxDate: string;
  minDate: string;
  isRequired?: boolean;
  closeOnSelection: boolean;
  shortcuts: boolean;
  backgroundColor: string;
  borderRadius: string;
  boxShadow?: string;
  accentColor: string;
  firstDayOfWeek?: number;
  timePrecision: TimePrecision;
}

export default DatePickerWidget;
