import {
  ValidationResponse,
  ValidationTypes,
} from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";
import { FieldType } from "widgets/JSONFormWidget/constants";
import { optionsCustomValidation } from "widgets/RadioGroupWidget/widget";
import {
  HiddenFnParams,
  getSchemaItem,
  getAutocompleteProperties,
} from "../helper";

/**
 * Alias function is used to test the optionsCustomValidation separately
 * to ensure that any changes in the validation function in RadioGroupWidget
 * does not break when used here.
 */
export const optionsValidation = optionsCustomValidation;

function defaultOptionValidation(
  value: unknown,
  props: any,
  _: any,
): ValidationResponse {
  //Checks if the value is not of object type in {{}}
  if (_.isObject(value)) {
    return {
      isValid: false,
      parsed: JSON.stringify(value, null, 2),
      messages: ["This value does not evaluate to type: string or number"],
    };
  }

  //Checks if the value is not of boolean type in {{}}
  if (_.isBoolean(value)) {
    return {
      isValid: false,
      parsed: value,
      messages: ["This value does not evaluate to type: string or number"],
    };
  }

  return {
    isValid: true,
    parsed: value,
  };
}

const PROPERTIES = {
  general: [
    {
      propertyName: "options",
      helpText: "用户可选项，选项值必须唯一",
      label: "选项",
      controlType: "INPUT_TEXT",
      placeholderText: '[{ "label": "选项1", "value": "选项2" }]',
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.FUNCTION,
        params: {
          fn: optionsValidation,
          expected: {
            type: 'Array<{ "label": "string", "value": "string" | number}>',
            example: `[{"label": "One", "value": "one"}]`,
            autocompleteDataType: AutocompleteDataType.STRING,
          },
        },
      },
      evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
      hidden: (...args: HiddenFnParams) =>
        getSchemaItem(...args).fieldTypeNotMatches(FieldType.RADIO_GROUP),
      dependencies: ["schema"],
    },
    {
      propertyName: "defaultValue",
      helpText: "设置默认选中的选项",
      label: "默认选中值",
      placeholderText: "Y",
      controlType: "JSON_FORM_COMPUTE_VALUE",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.FUNCTION,
        params: {
          fn: defaultOptionValidation,
          expected: {
            type: `string |\nnumber (only works in mustache syntax)`,
            example: `abc | {{1}}`,
            autocompleteDataType: AutocompleteDataType.STRING,
          },
        },
      },
      hidden: (...args: HiddenFnParams) =>
        getSchemaItem(...args).fieldTypeNotMatches(FieldType.RADIO_GROUP),
      dependencies: ["schema", "sourceData"],
    },
  ],
  actions: [
    {
      propertyName: "onSelectionChange",
      helpText: "选中项改变时触发",
      label: "onSelectionChange",
      controlType: "ACTION_SELECTOR",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: true,
      additionalAutoComplete: getAutocompleteProperties,
      hidden: (...args: HiddenFnParams) =>
        getSchemaItem(...args).fieldTypeNotMatches(FieldType.RADIO_GROUP),
      dependencies: ["schema", "sourceData"],
    },
  ],
  content: {
    data: [
      {
        propertyName: "options",
        helpText: "用户可选项，选项值必须唯一",
        label: "选项",
        controlType: "INPUT_TEXT",
        placeholderText: '[{ "label": "选项1", "value": "选项2" }]',
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: optionsValidation,
            expected: {
              type: 'Array<{ "label": "string", "value": "string" | number}>',
              example: `[{"label": "One", "value": "one"}]`,
              autocompleteDataType: AutocompleteDataType.STRING,
            },
          },
        },
        evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.RADIO_GROUP),
        dependencies: ["schema"],
      },
      {
        propertyName: "defaultValue",
        helpText: "设置默认选中的选项",
        label: "默认选中值",
        placeholderText: "Y",
        controlType: "JSON_FORM_COMPUTE_VALUE",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: defaultOptionValidation,
            expected: {
              type: `string |\nnumber (only works in mustache syntax)`,
              example: `abc | {{1}}`,
              autocompleteDataType: AutocompleteDataType.STRING,
            },
          },
        },
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.RADIO_GROUP),
        dependencies: ["schema", "sourceData"],
      },
    ],
    events: [
      {
        propertyName: "onSelectionChange",
        helpText: "选中项改变时触发",
        label: "onSelectionChange",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
        additionalAutoComplete: getAutocompleteProperties,
        hidden: (...args: HiddenFnParams) =>
          getSchemaItem(...args).fieldTypeNotMatches(FieldType.RADIO_GROUP),
        dependencies: ["schema", "sourceData"],
      },
    ],
  },
};

export default PROPERTIES;
