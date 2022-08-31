import { Alignment } from "@blueprintjs/core";

import generatePanelPropertyConfig from "./propertyConfig/generatePanelPropertyConfig";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { JSONFormWidgetProps } from ".";
import { ROOT_SCHEMA_KEY } from "../constants";
import { ValidationTypes } from "constants/WidgetValidation";
import { ButtonVariantTypes, ButtonPlacementTypes } from "components/constants";
import { ButtonWidgetProps } from "widgets/ButtonWidget/widget";
import { OnButtonClickProps } from "components/propertyControls/ButtonControl";
import { ComputedSchemaStatus, computeSchema } from "./helper";
import { EVALUATION_PATH } from "utils/DynamicBindingUtils";

const MAX_NESTING_LEVEL = 5;

const panelConfig = generatePanelPropertyConfig(MAX_NESTING_LEVEL);

export const sourceDataValidationFn = (
  value: any,
  props: JSONFormWidgetProps,
  _?: any,
) => {
  if (value === "") {
    return {
      isValid: false,
      parsed: {},
      messages: ["Source data cannot be empty."],
    };
  }

  if (_.isNil(value)) {
    return {
      isValid: true,
      parsed: {},
    };
  }

  if (_.isPlainObject(value)) {
    return {
      isValid: true,
      parsed: value,
    };
  }

  try {
    return {
      isValid: true,
      parsed: JSON.parse(value as string),
    };
  } catch (e) {
    return {
      isValid: false,
      parsed: {},
      messages: [(e as Error).message],
    };
  }
};

export const onGenerateFormClick = ({
  batchUpdateProperties,
  props,
}: OnButtonClickProps) => {
  const widgetProperties: JSONFormWidgetProps = props.widgetProperties;

  if (widgetProperties.autoGenerateForm) return;

  const currSourceData = widgetProperties[EVALUATION_PATH]?.evaluatedValues
    ?.sourceData as Record<string, any> | Record<string, any>[];

  const prevSourceData = widgetProperties.schema?.__root_schema__?.sourceData;

  const { dynamicPropertyPathList, schema, status } = computeSchema({
    currentDynamicPropertyPathList: widgetProperties.dynamicPropertyPathList,
    currSourceData,
    fieldThemeStylesheets: widgetProperties.childStylesheet,
    prevSchema: widgetProperties.schema,
    prevSourceData,
    widgetName: widgetProperties.widgetName,
  });

  if (status === ComputedSchemaStatus.LIMIT_EXCEEDED) {
    batchUpdateProperties({ fieldLimitExceeded: true });
    return;
  }

  if (status === ComputedSchemaStatus.UNCHANGED) {
    if (widgetProperties.fieldLimitExceeded) {
      batchUpdateProperties({ fieldLimitExceeded: false });
    }
    return;
  }

  if (status === ComputedSchemaStatus.UPDATED) {
    batchUpdateProperties({
      dynamicPropertyPathList,
      schema,
      fieldLimitExceeded: false,
    });
  }
};

const generateFormCTADisabled = (widgetProps: JSONFormWidgetProps) =>
  widgetProps.autoGenerateForm;

const generateButtonStyleControlsFor = (prefix: string) => [
  {
    propertyName: `${prefix}.buttonColor`,
    helpText: "修改按钮颜色",
    label: "按钮颜色",
    controlType: "COLOR_PICKER",
    isJSConvertible: true,
    isBindProperty: true,
    isTriggerProperty: false,
    validation: { type: ValidationTypes.TEXT },
  },
  {
    propertyName: `${prefix}.buttonVariant`,
    label: "按钮类型",
    controlType: "DROP_DOWN",
    helpText: "设置图标按钮类型",
    options: [
      {
        label: "主按钮",
        value: ButtonVariantTypes.PRIMARY,
      },
      {
        label: "次级按钮",
        value: ButtonVariantTypes.SECONDARY,
      },
      {
        label: "文本按钮",
        value: ButtonVariantTypes.TERTIARY,
      },
    ],
    isJSConvertible: true,
    isBindProperty: true,
    isTriggerProperty: false,
    validation: {
      type: ValidationTypes.TEXT,
      params: {
        allowedValues: [
          ButtonVariantTypes.PRIMARY,
          ButtonVariantTypes.SECONDARY,
          ButtonVariantTypes.TERTIARY,
        ],
        default: ButtonVariantTypes.PRIMARY,
      },
    },
  },
  {
    propertyName: `${prefix}.borderRadius`,
    label: "边框圆角",
    helpText: "边框圆角样式",
    controlType: "BORDER_RADIUS_OPTIONS",
    isJSConvertible: true,
    isBindProperty: true,
    isTriggerProperty: false,
    validation: { type: ValidationTypes.TEXT },
  },
  {
    propertyName: `${prefix}.boxShadow`,
    label: "阴影",
    helpText: "组件轮廓投影",
    controlType: "BOX_SHADOW_OPTIONS",
    isJSConvertible: true,
    isBindProperty: true,
    isTriggerProperty: false,
    validation: {
      type: ValidationTypes.TEXT,
    },
  },
  {
    propertyName: `${prefix}.iconName`,
    label: "图标",
    helpText: "设置按钮图标",
    controlType: "ICON_SELECT",
    isJSConvertible: true,
    isBindProperty: true,
    isTriggerProperty: false,
    updateHook: (
      props: ButtonWidgetProps,
      propertyPath: string,
      propertyValue: string,
    ) => {
      const propertiesToUpdate = [{ propertyPath, propertyValue }];
      if (!props.iconAlign) {
        propertiesToUpdate.push({
          propertyPath: `${prefix}.iconAlign`,
          propertyValue: Alignment.LEFT,
        });
      }
      return propertiesToUpdate;
    },
    validation: {
      type: ValidationTypes.TEXT,
    },
  },
  {
    propertyName: `${prefix}.placement`,
    label: "排列方式",
    controlType: "DROP_DOWN",
    helpText: "设置图标与标签的排列方式",
    options: [
      {
        label: "向前对齐",
        value: ButtonPlacementTypes.START,
      },
      {
        label: "两边对齐",
        value: ButtonPlacementTypes.BETWEEN,
      },
      {
        label: "居中对齐",
        value: ButtonPlacementTypes.CENTER,
      },
    ],
    defaultValue: ButtonPlacementTypes.CENTER,
    isJSConvertible: true,
    isBindProperty: true,
    isTriggerProperty: false,
    validation: {
      type: ValidationTypes.TEXT,
      params: {
        allowedValues: [
          ButtonPlacementTypes.START,
          ButtonPlacementTypes.BETWEEN,
          ButtonPlacementTypes.CENTER,
        ],
        default: ButtonPlacementTypes.CENTER,
      },
    },
  },
  {
    propertyName: `${prefix}.iconAlign`,
    label: "图标对齐",
    helpText: "设置按钮图标对齐方向",
    controlType: "ICON_TABS",
    options: [
      {
        icon: "VERTICAL_LEFT",
        value: "left",
      },
      {
        icon: "VERTICAL_RIGHT",
        value: "right",
      },
    ],
    isJSConvertible: true,
    isBindProperty: true,
    isTriggerProperty: false,
    validation: {
      type: ValidationTypes.TEXT,
      params: {
        allowedValues: ["center", "left", "right"],
      },
    },
  },
];

export const contentConfig = [
  {
    sectionName: "数据",
    children: [
      {
        propertyName: "sourceData",
        helpText: "样例 JSON 数据",
        label: "源数据",
        controlType: "INPUT_TEXT",
        placeholderText: '{ "name": "John", "age": 24 }',
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: sourceDataValidationFn,
            expected: {
              type: "JSON",
              example: `{ "name": "John Doe", "age": 29 }`,
              autocompleteDataType: AutocompleteDataType.OBJECT,
            },
          },
        },
        evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
      },
      {
        propertyName: "autoGenerateForm",
        helpText:
          "注意：如果开启了自动生成表单，在源数据发生改变的时候，所有的表单字段都会重新生成。",
        label: "自动生成表单",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        customJSControl: "INPUT_TEXT",
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "generateFormButton",
        label: "",
        controlType: "BUTTON",
        isJSConvertible: false,
        isBindProperty: false,
        buttonLabel: "生成表单",
        onClick: onGenerateFormClick,
        isDisabled: generateFormCTADisabled,
        isTriggerProperty: false,
        dependencies: [
          "autoGenerateForm",
          "schema",
          "fieldLimitExceeded",
          "childStylesheet",
        ],
        evaluatedDependencies: ["sourceData"],
      },
      {
        propertyName: `schema.${ROOT_SCHEMA_KEY}.children`,
        helpText: "字段配置",
        label: "字段配置",
        controlType: "FIELD_CONFIGURATION",
        isBindProperty: false,
        isTriggerProperty: false,
        panelConfig,
        dependencies: ["schema", "childStylesheet"],
      },
    ],
  },
  {
    sectionName: "属性",
    children: [
      {
        propertyName: "title",
        label: "标题",
        helpText: "表单标题",
        controlType: "INPUT_TEXT",
        placeholderText: "Update Order",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
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
      {
        propertyName: "disabledWhenInvalid",
        helpText: "父级表单校验不通过时禁用提交按钮",
        label: "表单校验不成功时禁用",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "fixedFooter",
        helpText: "让底部信息固定在表单底部",
        label: "固定底部",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "scrollContents",
        helpText: "允许表单的内容滚动",
        label: "允许内容滚动",
        controlType: "SWITCH",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "showReset",
        helpText: "显示或隐藏表单重置按钮",
        label: "显示重置按钮",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "submitButtonLabel",
        helpText: "修改提交按钮文案",
        label: "提交按钮文案",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "resetButtonLabel",
        helpText: "修改重置按钮文案",
        label: "重置按钮文案",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
    ],
  },
  {
    sectionName: "事件",
    children: [
      {
        propertyName: "onSubmit",
        helpText: "点击提交按钮时触发",
        label: "onSubmit",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
    ],
  },
];

const generateButtonStyleControlsV2For = (prefix: string) => [
  {
    sectionName: "属性",
    collapsible: false,
    children: [
      {
        propertyName: `${prefix}.buttonColor`,
        helpText: "修改按钮颜色",
        label: "按钮颜色",
        controlType: "COLOR_PICKER",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: `${prefix}.buttonVariant`,
        label: "按钮类型",
        controlType: "DROP_DOWN",
        helpText: "设置图标按钮类型",
        options: [
          {
            label: "主按钮",
            value: ButtonVariantTypes.PRIMARY,
          },
          {
            label: "次级按钮",
            value: ButtonVariantTypes.SECONDARY,
          },
          {
            label: "文本按钮",
            value: ButtonVariantTypes.TERTIARY,
          },
        ],
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: [
              ButtonVariantTypes.PRIMARY,
              ButtonVariantTypes.SECONDARY,
              ButtonVariantTypes.TERTIARY,
            ],
            default: ButtonVariantTypes.PRIMARY,
          },
        },
      },
      {
        propertyName: `${prefix}.borderRadius`,
        label: "边框圆角",
        helpText: "边框圆角样式",
        controlType: "BORDER_RADIUS_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: `${prefix}.boxShadow`,
        label: "阴影",
        helpText: "组件轮廓投影",
        controlType: "BOX_SHADOW_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
        },
      },
    ],
  },
  {
    sectionName: "图标配置",
    collapsible: false,
    children: [
      {
        propertyName: `${prefix}.iconName`,
        label: "图标",
        helpText: "设置按钮图标",
        controlType: "ICON_SELECT",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        updateHook: (
          props: ButtonWidgetProps,
          propertyPath: string,
          propertyValue: string,
        ) => {
          const propertiesToUpdate = [{ propertyPath, propertyValue }];
          if (!props.iconAlign) {
            propertiesToUpdate.push({
              propertyPath: `${prefix}.iconAlign`,
              propertyValue: Alignment.LEFT,
            });
          }
          return propertiesToUpdate;
        },
        validation: {
          type: ValidationTypes.TEXT,
        },
      },
      {
        propertyName: `${prefix}.iconAlign`,
        label: "位置",
        helpText: "设置按钮图标对齐方向",
        controlType: "ICON_TABS",
        options: [
          {
            icon: "VERTICAL_LEFT",
            value: "left",
          },
          {
            icon: "VERTICAL_RIGHT",
            value: "right",
          },
        ],
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: ["center", "left", "right"],
          },
        },
      },
      {
        propertyName: `${prefix}.placement`,
        label: "排列方式",
        controlType: "DROP_DOWN",
        helpText: "设置图标与标签的排列方式",
        options: [
          {
            label: "向前对齐",
            value: ButtonPlacementTypes.START,
          },
          {
            label: "两边对齐",
            value: ButtonPlacementTypes.BETWEEN,
          },
          {
            label: "居中对齐",
            value: ButtonPlacementTypes.CENTER,
          },
        ],
        defaultValue: ButtonPlacementTypes.CENTER,
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: [
              ButtonPlacementTypes.START,
              ButtonPlacementTypes.BETWEEN,
              ButtonPlacementTypes.CENTER,
            ],
            default: ButtonPlacementTypes.CENTER,
          },
        },
      },
    ],
  },
];

export const styleConfig = [
  {
    sectionName: "颜色配置",
    children: [
      {
        propertyName: "backgroundColor",
        helpText: "使用 html 颜色名称，HEX，RGB 或者 RGBA 值",
        placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
        label: "背景颜色",
        controlType: "COLOR_PICKER",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "borderColor",
        helpText: "使用 html 颜色名称，HEX，RGB 或者 RGBA 值",
        placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
        label: "边框颜色",
        controlType: "COLOR_PICKER",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
    ],
  },
  {
    sectionName: "轮廓样式",
    children: [
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
        helpText: "Enter value for border radius",
        label: "边框圆角",
        controlType: "BORDER_RADIUS_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "boxShadow",
        label: "阴影",
        helpText: "组件轮廓投影",
        controlType: "BOX_SHADOW_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
    ],
  },
  {
    sectionName: "提交按钮样式",
    children: generateButtonStyleControlsV2For("submitButtonStyles"),
  },
  {
    sectionName: "重置按钮样式",
    children: generateButtonStyleControlsV2For("resetButtonStyles"),
    dependencies: ["showReset"],
    hidden: (props: JSONFormWidgetProps) => !props.showReset,
  },
];

export default [
  {
    sectionName: "属性",
    children: [
      {
        propertyName: "title",
        label: "标题",
        helpText: "表单标题",
        controlType: "INPUT_TEXT",
        placeholderText: "Update Order",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "sourceData",
        helpText: "样例 JSON 数据",
        label: "源数据",
        controlType: "INPUT_TEXT",
        placeholderText: '{ "name": "John", "age": 24 }',
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: sourceDataValidationFn,
            expected: {
              type: "JSON",
              example: `{ "name": "John Doe", "age": 29 }`,
              autocompleteDataType: AutocompleteDataType.OBJECT,
            },
          },
        },
        evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
      },
      {
        propertyName: "autoGenerateForm",
        helpText:
          "注意：如果开启了自动生成表单，在源数据发生改变的时候，所有的表单字段都会重新生成。",
        label: "自动生成表单",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        customJSControl: "INPUT_TEXT",
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "generateFormButton",
        label: "",
        controlType: "BUTTON",
        isJSConvertible: false,
        isBindProperty: false,
        buttonLabel: "生成表单",
        onClick: onGenerateFormClick,
        isDisabled: generateFormCTADisabled,
        isTriggerProperty: false,
        dependencies: [
          "autoGenerateForm",
          "schema",
          "fieldLimitExceeded",
          "childStylesheet",
        ],
        evaluatedDependencies: ["sourceData"],
      },
      {
        propertyName: `schema.${ROOT_SCHEMA_KEY}.children`,
        helpText: "字段配置",
        label: "字段配置",
        controlType: "FIELD_CONFIGURATION",
        isBindProperty: false,
        isTriggerProperty: false,
        panelConfig,
        dependencies: ["schema", "childStylesheet"],
      },
      {
        propertyName: "disabledWhenInvalid",
        helpText: "父级表单校验不通过时禁用提交按钮",
        label: "表单校验不成功时禁用",
        controlType: "SWITCH",
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
      {
        propertyName: "fixedFooter",
        helpText: "让底部信息固定在表单底部",
        label: "固定底部",
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
        propertyName: "scrollContents",
        helpText: "允许表单的内容滚动",
        label: "允许内容滚动",
        controlType: "SWITCH",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "showReset",
        helpText: "显示或隐藏表单重置按钮",
        label: "显示重置按钮",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "submitButtonLabel",
        helpText: "修改提交按钮文案",
        label: "提交按钮文案",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "resetButtonLabel",
        helpText: "修改重置按钮文案",
        label: "重置按钮文案",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
    ],
  },
  {
    sectionName: "动作",
    children: [
      {
        propertyName: "onSubmit",
        helpText: "点击提交按钮时触发",
        label: "onSubmit",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
    ],
  },
  {
    sectionName: "表单样式",
    isDefaultOpen: false,
    children: [
      {
        propertyName: "backgroundColor",
        helpText: "使用 html 颜色名称，HEX，RGB 或者 RGBA 值",
        placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
        label: "背景颜色",
        controlType: "COLOR_PICKER",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "borderColor",
        helpText: "使用 html 颜色名称，HEX，RGB 或者 RGBA 值",
        placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
        label: "边框颜色",
        controlType: "COLOR_PICKER",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
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
        helpText: "Enter value for border radius",
        label: "边框圆角",
        controlType: "BORDER_RADIUS_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "boxShadow",
        label: "阴影",
        helpText: "组件轮廓投影",
        controlType: "BOX_SHADOW_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
    ],
  },
  {
    sectionName: "提交按钮样式",
    isDefaultOpen: false,
    children: generateButtonStyleControlsFor("submitButtonStyles"),
  },
  {
    sectionName: "重置按钮样式",
    isDefaultOpen: false,
    children: generateButtonStyleControlsFor("resetButtonStyles"),
    dependencies: ["showReset"],
    hidden: (props: JSONFormWidgetProps) => !props.showReset,
  },
];
