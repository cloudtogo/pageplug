import { get } from "lodash";

import { ValidationTypes } from "constants/WidgetValidation";
import { FieldType, SchemaItem } from "widgets/JSONFormWidget/constants";
import { JSONFormWidgetProps } from "../..";
import { HiddenFnParams, getSchemaItem, getStylesheetValue } from "../helper";

const PROPERTIES = {
  general: [
    {
      helpText:
        "Sets the default value of the field. The array is updated when the default value changes",
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
      label: "Collapsible",
      helpText: "Makes the array items collapsible",
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
      sectionName: "Array Styles",
      isDefaultOpen: false,
      children: [
        {
          propertyName: "backgroundColor",
          label: "背景颜色",
          controlType: "COLOR_PICKER",
          helpText: "Changes the background color",
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
          helpText: "输入边框厚度",
          label: "Border Width",
          placeholderText: "输入值以 px 为单位",
          controlType: "INPUT_TEXT",
          isBindProperty: true,
          isTriggerProperty: false,
          validation: { type: ValidationTypes.NUMBER },
        },
        {
          propertyName: "borderColor",
          label: "Border Color",
          helpText: "Changes the border color of Object",
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
          helpText:
            "组件轮廓投影",
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
      sectionName: "Item Styles",
      isDefaultOpen: false,
      children: [
        {
          propertyName: "cellBackgroundColor",
          label: "背景颜色",
          controlType: "COLOR_PICKER",
          helpText: "Changes the background color of the item",
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
          helpText: "Enter value for border width of the item",
          label: "Border Width",
          placeholderText: "输入值以 px 为单位",
          controlType: "INPUT_TEXT",
          isBindProperty: true,
          isTriggerProperty: false,
          validation: { type: ValidationTypes.NUMBER },
        },
        {
          propertyName: "cellBorderColor",
          label: "Border Color",
          helpText: "Changes the border color of the item",
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
          helpText:
            "组件轮廓投影",
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
        helpText:
          "Sets the default value of the field. The array is updated when the default value changes",
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
        label: "Collapsible",
        helpText: "Makes the array items collapsible",
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
