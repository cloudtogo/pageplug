import { LabelPosition } from "components/constants";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { Alignment } from "@blueprintjs/core";
import { ValidationTypes } from "constants/WidgetValidation";
import {
  defaultOptionValidation,
  optionsCustomValidation,
} from "../../validations";
import { CategorySliderWidgetProps } from "..";

export default [
  {
    sectionName: "数据",
    children: [
      {
        helpText: "一列值唯一的选项",
        propertyName: "options",
        label: "选项",
        controlType: "OPTION_INPUT",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: optionsCustomValidation,
            expected: {
              type: 'Array<{ "label": "string", "value": "string" | number}>',
              example: `[{"label": "One", "value": "one"}]`,
              autocompleteDataType: AutocompleteDataType.STRING,
            },
          },
        },
        evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
      },
      {
        helpText: "设置默认选中项",
        propertyName: "defaultOptionValue",
        label: "默认值",
        placeholderText: "Y",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        /**
         * Changing the validation to FUNCTION.
         * If the user enters Integer inside {{}} e.g. {{1}} then value should evalute to integer.
         * If user enters 1 e.g. then it should evaluate as string.
         */
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
      },
    ],
  },
  {
    sectionName: "标签",
    children: [
      {
        helpText: "设置组件标签文本",
        propertyName: "labelText",
        label: "文本",
        controlType: "INPUT_TEXT",
        placeholderText: "请输入标签文本",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        helpText: "设置组件标签位置",
        propertyName: "labelPosition",
        label: "位置",
        controlType: "ICON_TABS",
        fullWidth: true,
        options: [
          { label: "Left", value: LabelPosition.Left },
          { label: "Top", value: LabelPosition.Top },
        ],
        isBindProperty: false,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        helpText: "设置组件标签对齐方式",
        propertyName: "labelAlignment",
        label: "对齐",
        controlType: "LABEL_ALIGNMENT_OPTIONS",
        options: [
          {
            icon: "LEFT_ALIGN",
            value: Alignment.LEFT,
          },
          {
            icon: "RIGHT_ALIGN",
            value: Alignment.RIGHT,
          },
        ],
        isBindProperty: false,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        hidden: (props: CategorySliderWidgetProps) =>
          props.labelPosition !== LabelPosition.Left,
        dependencies: ["labelPosition"],
      },
      {
        helpText: "设置组件标签宽度占多少列",
        propertyName: "labelWidth",
        label: "宽度（所占列数）",
        controlType: "NUMERIC_INPUT",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        min: 0,
        validation: {
          type: ValidationTypes.NUMBER,
          params: {
            natural: true,
          },
        },
        hidden: (props: CategorySliderWidgetProps) =>
          props.labelPosition !== LabelPosition.Left,
        dependencies: ["labelPosition"],
      },
    ],
  },
  {
    sectionName: "属性",
    children: [
      {
        propertyName: "showMarksLabel",
        helpText: "控制是否显示下标文字",
        label: "显示下标",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "isVisible",
        helpText: "控制组件的显示/隐藏",
        label: "是否显示",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "isDisabled",
        label: "禁用",
        controlType: "SWITCH",
        helpText: "禁用组件交互",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "animateLoading",
        label: "加载时显示动画",
        controlType: "SWITCH",
        helpText: "组件依赖的数据加载时显示加载动画",
        defaultValue: true,
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
    ],
  },
  {
    sectionName: "事件",
    children: [
      {
        helpText: "滑动条值变化时触发",
        propertyName: "onChange",
        label: "onChange",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
    ],
  },
];
