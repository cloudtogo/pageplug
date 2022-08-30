import { get } from "lodash";

import { ValidationTypes } from "constants/WidgetValidation";
import {
  ARRAY_ITEM_KEY,
  FieldType,
  SchemaItem,
} from "widgets/JSONFormWidget/constants";
import { JSONFormWidgetProps } from "../..";
import { getStylesheetValue } from "../helper";

const objectStyleProperties = [
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
    propertyName: "borderColor",
    label: "边框颜色",
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
];

const PROPERTIES = {
  sections: [
    {
      sectionName: "Object Styles",
      isDefaultOpen: false,
      children: objectStyleProperties,
      hidden: (props: JSONFormWidgetProps, propertyPath: string) => {
        const schemaItem: SchemaItem = get(props, propertyPath, {});

        if (schemaItem.fieldType !== FieldType.OBJECT) return true;

        // Hide if array item is object
        return schemaItem.identifier === ARRAY_ITEM_KEY;
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
          propertyName: "cellBorderColor",
          label: "边框颜色",
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

        if (schemaItem.fieldType !== FieldType.OBJECT) return true;

        // Hide if array item is object
        return schemaItem.identifier === ARRAY_ITEM_KEY;
      },
    },
    {
      /**
       * This is for an edge case where an array item is an object
       * Here we only want to change the cell** styles
       */
      sectionName: "样式",
      children: objectStyleProperties,
      hidden: (props: JSONFormWidgetProps, propertyPath: string) => {
        const schemaItem: SchemaItem = get(props, propertyPath, {});

        if (schemaItem.fieldType !== FieldType.OBJECT) return true;

        // Hide if array item is not object
        return schemaItem.identifier !== ARRAY_ITEM_KEY;
      },
    },
  ],
};

export default PROPERTIES;
