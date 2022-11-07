import { ValidationTypes } from "constants/WidgetValidation";
import { FieldType } from "widgets/JSONFormWidget/constants";
import {
  HiddenFnParams,
  getSchemaItem,
  getAutocompleteProperties,
} from "../helper";
import { TimePrecision } from "widgets/DatePickerWidget2/constants";
import { dateFormatOptions } from "widgets/constants";

const PROPERTIES = {
  content: {
    data: [
      {
        helpText: "设置所选日期的格式",
        propertyName: "dateFormat",
        label: "日期格式",
        controlType: "DROP_DOWN",
        isJSConvertible: true,
        customJSControl: "JSON_FORM_COMPUTE_VALUE",
        optionWidth: "340px",
        options: dateFormatOptions,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        hideSubText: true,
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.DATEPICKER),
        dependencies: ["schema"],
      },
      {
        propertyName: "defaultValue",
        label: "默认日期",
        helpText: "设置默认日期，默认日期修改后，组件当前日期会自动更新",
        controlType: "DATE_PICKER",
        placeholderText: "Enter Default Date",
        useValidationMessage: true,
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        customJSControl: "JSON_FORM_COMPUTE_VALUE",
        validation: { type: ValidationTypes.DATE_ISO_STRING },
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.DATEPICKER),
        dependencies: ["schema"],
      },
      {
        propertyName: "timePrecision",
        label: "时间精度",
        controlType: "ICON_TABS",
        fullWidth: true,
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
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.DATEPICKER),
        dependencies: ["schema"],
      },
    ],
    validation: [
      {
        propertyName: "minDate",
        label: "最小日期",
        helpText: "字段最小日期",
        controlType: "DATE_PICKER",
        useValidationMessage: true,
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        customJSControl: "JSON_FORM_COMPUTE_VALUE",
        validation: { type: ValidationTypes.DATE_ISO_STRING },
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.DATEPICKER),
        dependencies: ["schema"],
      },
      {
        propertyName: "maxDate",
        label: "最大日期",
        helpText: "字段最大日期",
        controlType: "DATE_PICKER",
        useValidationMessage: true,
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        customJSControl: "JSON_FORM_COMPUTE_VALUE",
        validation: { type: ValidationTypes.DATE_ISO_STRING },
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.DATEPICKER),
        dependencies: ["schema"],
      },
    ],
    general: [
      {
        propertyName: "convertToISO",
        label: "转换成 ISO 格式",
        helpText: "开启后日期都会转换成 ISO 格式",
        controlType: "SWITCH",
        isJSConvertible: false,
        isBindProperty: true,
        isTriggerProperty: false,
        customJSControl: "JSON_FORM_COMPUTE_VALUE",
        validation: { type: ValidationTypes.BOOLEAN },
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.DATEPICKER),
        dependencies: ["schema"],
      },
      {
        propertyName: "shortcuts",
        label: "显示快捷菜单",
        helpText: "是否在日期选择器中显示快捷菜单",
        controlType: "SWITCH",
        isJSConvertible: false,
        isBindProperty: true,
        isTriggerProperty: false,
        customJSControl: "JSON_FORM_COMPUTE_VALUE",
        validation: { type: ValidationTypes.BOOLEAN },
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.DATEPICKER),
        dependencies: ["schema"],
      },
      {
        propertyName: "closeOnSelection",
        label: "选中后关闭",
        helpText: "选中日期后自动关闭日期选择器",
        controlType: "SWITCH",
        isJSConvertible: false,
        isBindProperty: true,
        isTriggerProperty: false,
        customJSControl: "JSON_FORM_COMPUTE_VALUE",
        validation: { type: ValidationTypes.BOOLEAN },
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.DATEPICKER),
        dependencies: ["schema"],
      },
    ],
    events: [
      {
        propertyName: "onDateSelected",
        label: "onDateSelected",
        helpText: "Triggers an action when a date is selected in the calendar",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
        additionalAutoComplete: getAutocompleteProperties,
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.DATEPICKER),
        dependencies: ["schema"],
      },
    ],
  },
};

export default PROPERTIES;
