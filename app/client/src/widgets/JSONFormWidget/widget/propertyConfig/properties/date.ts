import moment from "moment";

import { ValidationTypes } from "constants/WidgetValidation";
import { FieldType } from "widgets/JSONFormWidget/constants";
import {
  HiddenFnParams,
  getSchemaItem,
  getAutocompleteProperties,
} from "../helper";
import { TimePrecision } from "widgets/DatePickerWidget2/constants";

export const dateFormatOptions = [
  {
    label: moment().format("YYYY-MM-DDTHH:mm:ss.sssZ"),
    subText: "ISO 8601",
    value: "YYYY-MM-DDTHH:mm:ss.sssZ",
  },
  {
    label: moment().format("LLL"),
    subText: "LLL",
    value: "LLL",
  },
  {
    label: moment().format("LL"),
    subText: "LL",
    value: "LL",
  },
  {
    label: moment().format("YYYY-MM-DD HH:mm"),
    subText: "YYYY-MM-DD HH:mm",
    value: "YYYY-MM-DD HH:mm",
  },
  {
    label: moment().format("YYYY-MM-DDTHH:mm:ss"),
    subText: "YYYY-MM-DDTHH:mm:ss",
    value: "YYYY-MM-DDTHH:mm:ss",
  },
  {
    label: moment().format("YYYY-MM-DD hh:mm:ss A"),
    subText: "YYYY-MM-DD hh:mm:ss A",
    value: "YYYY-MM-DD hh:mm:ss A",
  },
  {
    label: moment().format("DD/MM/YYYY HH:mm"),
    subText: "DD/MM/YYYY HH:mm",
    value: "DD/MM/YYYY HH:mm",
  },
  {
    label: moment().format("D MMMM, YYYY"),
    subText: "D MMMM, YYYY",
    value: "D MMMM, YYYY",
  },
  {
    label: moment().format("H:mm A D MMMM, YYYY"),
    subText: "H:mm A D MMMM, YYYY",
    value: "H:mm A D MMMM, YYYY",
  },
  {
    label: moment().format("YYYY-MM-DD"),
    subText: "YYYY-MM-DD",
    value: "YYYY-MM-DD",
  },
  {
    label: moment().format("MM-DD-YYYY"),
    subText: "MM-DD-YYYY",
    value: "MM-DD-YYYY",
  },
  {
    label: moment().format("DD-MM-YYYY"),
    subText: "DD-MM-YYYY",
    value: "DD-MM-YYYY",
  },
  {
    label: moment().format("MM/DD/YYYY"),
    subText: "MM/DD/YYYY",
    value: "MM/DD/YYYY",
  },
  {
    label: moment().format("DD/MM/YYYY"),
    subText: "DD/MM/YYYY",
    value: "DD/MM/YYYY",
  },
  {
    label: moment().format("DD/MM/YY"),
    subText: "DD/MM/YY",
    value: "DD/MM/YY",
  },
  {
    label: moment().format("MM/DD/YY"),
    subText: "MM/DD/YY",
    value: "MM/DD/YY",
  },
];

const PROPERTIES = {
  general: [
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
  actions: [
    {
      propertyName: "onDateSelected",
      label: "onDateSelected",
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
