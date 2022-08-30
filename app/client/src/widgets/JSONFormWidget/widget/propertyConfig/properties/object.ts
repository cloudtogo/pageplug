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
      sectionName: "对象样式",
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
      sectionName: "数据项样式",
      isDefaultOpen: false,
      children: [
        {
          propertyName: "cellBackgroundColor",
          label: "背景颜色",
          controlType: "COLOR_PICKER",
          helpText: "修改数据项背景颜色",
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
          helpText: "修改数据项边框颜色",
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
          helpText: "修改数据项边框宽度",
          label: "边框宽度",
          placeholderText: "以 px 为单位",
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
