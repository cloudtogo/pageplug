import { ValidationTypes } from "constants/WidgetValidation";
import { FieldType } from "widgets/JSONFormWidget/constants";
import {
  HiddenFnParams,
  getSchemaItem,
  getAutocompleteProperties,
} from "../helper";

const PROPERTIES = {
  general: [
    {
      propertyName: "defaultValue",
      label: "默认选中",
      helpText: "设置默认选中状态",
      controlType: "SWITCH",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      customJSControl: "JSON_FORM_COMPUTE_VALUE",
      validation: { type: ValidationTypes.BOOLEAN },
      hidden: (...args: HiddenFnParams) =>
        getSchemaItem(...args).fieldTypeNotMatches(FieldType.CHECKBOX),
      dependencies: ["schema", "sourceData"],
    },
    {
      propertyName: "alignWidget",
      helpText: "设置对齐方式",
      label: "对齐",
      controlType: "DROP_DOWN",
      options: [
        {
          label: "左对齐",
          value: "LEFT",
        },
        {
          label: "右对齐",
          value: "RIGHT",
        },
      ],
      isBindProperty: true,
      isTriggerProperty: false,
      hidden: (...args: HiddenFnParams) =>
        getSchemaItem(...args).fieldTypeNotMatches(FieldType.CHECKBOX),
      dependencies: ["schema"],
    },
  ],
  actions: [
    {
      helpText: "选中态改变时触发",
      propertyName: "onCheckChange",
      label: "onCheckChange",
      controlType: "ACTION_SELECTOR",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: true,
      additionalAutoComplete: getAutocompleteProperties,
      hidden: (...args: HiddenFnParams) =>
        getSchemaItem(...args).fieldTypeNotMatches(FieldType.CHECKBOX),
      dependencies: ["schema"],
    },
  ],
  content: {
    data: [
      {
        propertyName: "defaultValue",
        label: "默认选中",
        helpText: "设置默认选中状态",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        customJSControl: "JSON_FORM_COMPUTE_VALUE",
        validation: { type: ValidationTypes.BOOLEAN },
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.CHECKBOX),
        dependencies: ["schema", "sourceData"],
      },
    ],
    label: [
      {
        propertyName: "alignWidget",
        helpText: "设置字段对齐方式",
        label: "对齐",
        controlType: "DROP_DOWN",
        options: [
          {
            label: "左对齐",
            value: "LEFT",
          },
          {
            label: "右对齐",
            value: "RIGHT",
          },
        ],
        isBindProperty: true,
        isTriggerProperty: false,
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.CHECKBOX),
        dependencies: ["schema"],
      },
    ],
  },
};

export default PROPERTIES;
