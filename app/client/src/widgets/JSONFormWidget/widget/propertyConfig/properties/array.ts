import { get } from "lodash";

import { ValidationTypes } from "constants/WidgetValidation";
import { FieldType, SchemaItem } from "widgets/JSONFormWidget/constants";
import { JSONFormWidgetProps } from "../..";
import { HiddenFnParams, getSchemaItem, getStylesheetValue } from "../helper";

const PROPERTIES = {
  style: {
    root: [
      {
        sectionName: "Array Styles",
        children: [
          {
            propertyName: "backgroundColor",
            label: "Background Color",
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
            helpText: "Enter value for border width",
            label: "Border Width",
            placeholderText: "Enter value in px",
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
            label: "Border Radius",
            helpText:
              "Rounds the corners of the icon button's outer border edge",
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
            label: "Box Shadow",
            helpText:
              "Enables you to cast a drop shadow from the frame of the widget",
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
        children: [
          {
            propertyName: "cellBackgroundColor",
            label: "Background Color",
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
            placeholderText: "Enter value in px",
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
            label: "Border Radius",
            helpText:
              "Rounds the corners of the icon button's outer border edge",
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
            label: "Box Shadow",
            helpText:
              "Enables you to cast a drop shadow from the frame of the widget",
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
  },
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
