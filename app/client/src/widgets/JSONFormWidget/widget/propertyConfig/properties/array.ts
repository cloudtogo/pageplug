import { get } from "lodash";

import { ValidationTypes } from "constants/WidgetValidation";
import { FieldType, SchemaItem } from "widgets/JSONFormWidget/constants";
import { JSONFormWidgetProps } from "../..";
import { HiddenFnParams, getSchemaItem, getStylesheetValue } from "../helper";

const PROPERTIES = {
  general: [
    {
      helpText: "字段默认值，默认值修改后会自动更新字段当前值",
      propertyName: "defaultValue",
      label: "默认值",
      controlType: "JSON_FORM_COMPUTE_VALUE",
      placeholderText: "[]",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.ARRAY,
      },
      hidden: (...args: HiddenFnParams) =>
        getSchemaItem(...args).fieldTypeNotMatches(FieldType.ARRAY),
      dependencies: ["schema"],
    },
  ],
  accessibility: [
    {
      propertyName: "isCollapsible",
      label: "可折叠",
      helpText: "让数组元素可折叠",
      controlType: "SWITCH",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      customJSControl: "JSON_FORM_COMPUTE_VALUE",
      validation: { type: ValidationTypes.BOOLEAN },
      hidden: (...args: HiddenFnParams) =>
        getSchemaItem(...args).fieldTypeNotMatches(FieldType.ARRAY),
      dependencies: ["schema"],
    },
  ],

  sections: [
    {
      sectionName: "数组样式",
      isDefaultOpen: false,
      children: [
        {
          propertyName: "backgroundColor",
          label: "背景颜色",
          controlType: "COLOR_PICKER",
          helpText: "修改背景颜色",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: false,
          customJSControl: "JSON_FORM_COMPUTE_VALUE",
          validation: {
            type: ValidationTypes.TEXT,
            params: {
              regex: /^(?![<|{{]).+/,
            },
          },
          dependencies: ["schema"],
        },
        {
          propertyName: "borderWidth",
          helpText: "输入边框宽度",
          label: "边框宽度",
          placeholderText: "以 px 为单位",
          controlType: "INPUT_TEXT",
          isBindProperty: true,
          isTriggerProperty: false,
          validation: { type: ValidationTypes.NUMBER },
        },
        {
          propertyName: "borderColor",
          label: "边框颜色",
          helpText: "修改边框颜色",
          controlType: "COLOR_PICKER",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: false,
          customJSControl: "JSON_FORM_COMPUTE_VALUE",
          validation: {
            type: ValidationTypes.TEXT,
            params: {
              regex: /^(?![<|{{]).+/,
            },
          },
          dependencies: ["schema"],
        },
        {
          propertyName: "borderRadius",
          label: "边框圆角",
          helpText: "边框圆角样式",
          controlType: "BORDER_RADIUS_OPTIONS",
          customJSControl: "JSON_FORM_COMPUTE_VALUE",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: false,
          getStylesheetValue,
          validation: { type: ValidationTypes.TEXT },
          dependencies: ["schema"],
        },
        {
          propertyName: "boxShadow",
          label: "阴影",
          helpText: "组件轮廓投影",
          controlType: "BOX_SHADOW_OPTIONS",
          customJSControl: "JSON_FORM_COMPUTE_VALUE",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: false,
          getStylesheetValue,
          validation: { type: ValidationTypes.TEXT },
          dependencies: ["schema"],
        },
      ],
      hidden: (props: JSONFormWidgetProps, propertyPath: string) => {
        const schemaItem: SchemaItem = get(props, propertyPath, {});

        // Hidden if not ARRAY
        return schemaItem.fieldType !== FieldType.ARRAY;
      },
    },
    {
      sectionName: "数组项样式",
      isDefaultOpen: false,
      children: [
        {
          propertyName: "cellBackgroundColor",
          label: "背景颜色",
          controlType: "COLOR_PICKER",
          helpText: "修改数组项背景颜色",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: false,
          customJSControl: "JSON_FORM_COMPUTE_VALUE",
          validation: {
            type: ValidationTypes.TEXT,
            params: {
              regex: /^(?![<|{{]).+/,
            },
          },
          dependencies: ["schema"],
        },
        {
          propertyName: "cellBorderWidth",
          helpText: "修改数组项边框宽度",
          label: "边框宽度",
          placeholderText: "以 px 为单位",
          controlType: "INPUT_TEXT",
          isBindProperty: true,
          isTriggerProperty: false,
          validation: { type: ValidationTypes.NUMBER },
        },
        {
          propertyName: "cellBorderColor",
          label: "边框颜色",
          helpText: "修改数组项边框颜色",
          controlType: "COLOR_PICKER",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: false,
          customJSControl: "JSON_FORM_COMPUTE_VALUE",
          validation: {
            type: ValidationTypes.TEXT,
            params: {
              regex: /^(?![<|{{]).+/,
            },
          },
          dependencies: ["schema"],
        },
        {
          propertyName: "cellBorderRadius",
          label: "边框圆角",
          helpText: "边框圆角样式",
          controlType: "BORDER_RADIUS_OPTIONS",
          customJSControl: "JSON_FORM_COMPUTE_VALUE",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: false,
          getStylesheetValue,
          validation: { type: ValidationTypes.TEXT },
          dependencies: ["schema"],
        },
        {
          propertyName: "cellBoxShadow",
          label: "阴影",
          helpText: "组件轮廓投影",
          controlType: "BOX_SHADOW_OPTIONS",
          customJSControl: "JSON_FORM_COMPUTE_VALUE",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: false,
          getStylesheetValue,
          validation: { type: ValidationTypes.TEXT },
          dependencies: ["schema"],
        },
      ],
      hidden: (props: JSONFormWidgetProps, propertyPath: string) => {
        const schemaItem: SchemaItem = get(props, propertyPath, {});

        // Hidden if not ARRAY
        return schemaItem.fieldType !== FieldType.ARRAY;
      },
    },
  ],

  content: {
    data: [
      {
        helpText: "字段默认值，默认值修改后会自动更新字段当前值",
        propertyName: "defaultValue",
        label: "默认值",
        controlType: "JSON_FORM_COMPUTE_VALUE",
        placeholderText: "[]",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.ARRAY,
        },
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.ARRAY),
        dependencies: ["schema"],
      },
    ],
    general: [
      {
        propertyName: "isCollapsible",
        label: "可折叠",
        helpText: "让数组元素可折叠",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        customJSControl: "JSON_FORM_COMPUTE_VALUE",
        validation: { type: ValidationTypes.BOOLEAN },
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.ARRAY),
        dependencies: ["schema"],
      },
    ],
  },
};

export default PROPERTIES;
