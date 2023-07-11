import { ValidationTypes } from "constants/WidgetValidation";
import { FieldType } from "widgets/JSONFormWidget/constants";
import type { HiddenFnParams } from "../helper";
import { getSchemaItem, getAutocompleteProperties } from "../helper";

const PROPERTIES = {
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
    events: [
      {
<<<<<<< HEAD
<<<<<<< HEAD
        helpText: "选中态改变时触发",
=======
        helpText: "when the check state is changed",
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
=======
        helpText: "when the check state is changed",
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
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
    label: [
      {
        propertyName: "alignWidget",
        helpText: "设置字段对齐方式",
        label: "对齐",
        controlType: "ICON_TABS",
        fullWidth: true,
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
