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
        helpText: "设置默认打开/关闭",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        customJSControl: "JSON_FORM_COMPUTE_VALUE",
        validation: { type: ValidationTypes.BOOLEAN },
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.SWITCH),
        dependencies: ["schema", "sourceData"],
      },
    ],
    label: [
      {
        propertyName: "alignWidget",
        helpText: "设置字段对齐方式",
        label: "对齐",
        controlType: "ICON_TABS",
        fullWidth: true,
        isBindProperty: true,
        isTriggerProperty: false,
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
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.SWITCH),
        dependencies: ["schema"],
      },
    ],
    events: [
      {
<<<<<<< HEAD
        helpText: "开关状态改变时触发",
=======
        helpText: "when the switch state is changed",
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
        propertyName: "onChange",
        label: "onChange",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
        additionalAutoComplete: getAutocompleteProperties,
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.SWITCH),
        dependencies: ["schema", "sourceData"],
      },
    ],
  },
};

export default PROPERTIES;
