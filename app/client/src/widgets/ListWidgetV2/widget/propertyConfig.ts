import { get, isPlainObject } from "lodash";
import log from "loglevel";

import { EVALUATION_PATH, EVAL_VALUE_PATH } from "utils/DynamicBindingUtils";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import type { ValidationResponse } from "constants/WidgetValidation";
import { ValidationTypes } from "constants/WidgetValidation";
import type { WidgetProps } from "widgets/BaseWidget";
import type { ListWidgetProps } from ".";
import { getBindingTemplate } from "../constants";
import { AutocompleteDataType } from "utils/autocomplete/AutocompleteDataType";
import {
  LIST_WIDGET_V2_TOTAL_RECORD_TOOLTIP,
  createMessage,
} from "@appsmith/constants/messages";

const MIN_ITEM_SPACING = 0;
const MAX_ITEM_SPACING = 16;
const MIN_TOTAL_RECORD_COUNT = 0;
const MAX_TOTAL_RECORD_COUNT = Number.MAX_SAFE_INTEGER;

const isValidListData = (
  value: unknown,
): value is Exclude<ListWidgetProps["listData"], undefined> => {
  return Array.isArray(value) && value.length > 0 && isPlainObject(value[0]);
};

export const primaryColumnValidation = (
  inputValue: unknown,
  props: ListWidgetProps,
  _: any,
) => {
  const { listData = [], dynamicPropertyPathList = [] } = props;
  const isArray = Array.isArray(inputValue);
  const isJSModeEnabled = Boolean(
    dynamicPropertyPathList.find((d) => d.key === "primaryKeys"),
  );

  // For not valid entries an empty array is parsed as the inputValue is an array type
  if (isArray) {
    if (inputValue.length === 0) {
      return {
        isValid: false,
        parsed: [],
        messages: [
          {
            name: "ValidationError",
            message: "数据标识符解析为空数组，请使用有效的标识符",
          },
        ],
      };
    }

    // when PrimaryKey is {{ currentItem["img"] }} and img doesn't exist in the data.
    if (inputValue.every((value) => _.isNil(value))) {
      return {
        isValid: false,
        parsed: [],
        messages: [
          {
            name: "ValidationError",
            message: "当前数据标识符不是数据字段，请使用真实存在的数据字段",
          },
        ],
      };
    }

    //  PrimaryKey evaluation has null or undefined values.
    if (inputValue.some((value) => _.isNil(value))) {
      return {
        isValid: false,
        parsed: [],
        messages: [
          {
            name: "ValidationError",
            message: "数据标识符解析为空，请使用有效的标识符",
          },
        ],
      };
    }

    const areKeysUnique = _.uniq(inputValue).length === listData.length;

    const isDataTypeUnique =
      _.uniqBy(inputValue, (item: any) => item.toString()).length ===
      listData.length;

    if (!areKeysUnique || !isDataTypeUnique) {
      return {
        isValid: false,
        parsed: [],
        messages: [
          {
            name: "ValidationError",
            message: "使用当前标识符解析出了重复的值，请使用解析值唯一的标识符",
          },
        ],
      };
    }
  } else {
    const message = isJSModeEnabled
      ? "使用 currentItem 或 currentIndex 查找合适的数据标识符，你也可以合并多个数据字段"
      : "在下拉框中选择一项，或切换成 JS 输入数据标识符";

    return {
      isValid: false,
      parsed: undefined, // undefined as we do not know what the data type of inputValue is so "[]" is not an appropriate value to return
      messages: [{ name: "ValidationError", message }],
    };
  }

  return {
    isValid: true,
    parsed: inputValue,
    messages: [{ name: "", message: "" }],
  };
};

export function defaultSelectedItemValidation(
  value: any,
  props: ListWidgetProps,
  _?: any,
): ValidationResponse {
  const TYPE_ERROR_MESSAGE = {
    name: "TypeError",
    message: "This value must be string or number",
  };

  const EMPTY_ERROR_MESSAGE = { name: "", message: "" };

  if (value === undefined) {
    return {
      isValid: true,
      parsed: value,
      messages: [EMPTY_ERROR_MESSAGE],
    };
  }

  if (!_.isFinite(value) && !_.isString(value)) {
    return {
      isValid: false,
      parsed: value,
      messages: [TYPE_ERROR_MESSAGE],
    };
  }

  return {
    isValid: true,
    parsed: String(value),
    messages: [EMPTY_ERROR_MESSAGE],
  };
}

const getPrimaryKeyFromDynamicValue = (
  prefixTemplate: string,
  suffixTemplate: string,
  dynamicValue?: string,
) => {
  if (!dynamicValue) return "";

  const updatedPrefix = `${prefixTemplate} currentItem[`;
  const updatedSuffix = `] ${suffixTemplate}`;
  const suffixLength = dynamicValue.length - updatedSuffix.length;

  const value = dynamicValue.substring(updatedPrefix.length, suffixLength);

  try {
    return JSON.parse(value);
  } catch (error) {
    log.error(error);
    return "";
  }
};

export const primaryKeyOptions = (props: ListWidgetProps) => {
  const { widgetName } = props;
  // Since this is uneval value, coercing it to primitive type
  const primaryKeys = props.primaryKeys as unknown as string | undefined;
  const listData = props[EVALUATION_PATH]?.evaluatedValues?.listData || [];
  const { prefixTemplate, suffixTemplate } = getBindingTemplate(widgetName);

  const prevSelectedKey = getPrimaryKeyFromDynamicValue(
    prefixTemplate,
    suffixTemplate,
    primaryKeys,
  );
  const options: {
    label: string;
    value: string;
  }[] = [];

  // Add previously selected key to options
  if (prevSelectedKey) {
    options.push({
      label: prevSelectedKey,
      value: `${prefixTemplate} currentItem[${JSON.stringify(
        prevSelectedKey,
      )}] ${suffixTemplate}`,
    });
  }

  if (isValidListData(listData)) {
    Object.keys(listData[0]).forEach((key) => {
      if (key !== prevSelectedKey) {
        options.push({
          label: key,
          value: `${prefixTemplate} currentItem[${JSON.stringify(
            key,
          )}] ${suffixTemplate}`,
        });
      }
    });
  }
  return options;
};

export const PropertyPaneContentConfig = [
  {
    sectionName: "数据",
    children: [
      {
        propertyName: "listData",
        helpText: "列表展示的数据对象",
        label: "数据项",
        controlType: "INPUT_TEXT",
        placeholderText: '[{ "name": "John" }]',
        inputType: "ARRAY",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.ARRAY },
        evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
      },
      {
        propertyName: "primaryKeys",
        helperText:
          "标识数据行唯一的字段，让数据可以相互区分。如果没有值唯一的字段，你可以将多个字段混合成一个新字段。",
        label: "数据标识符",
        controlType: "DROP_DOWN",
        dropdownUsePropertyValue: true,
        customJSControl: "LIST_COMPUTE_CONTROL",
        isBindProperty: true,
        isTriggerProperty: false,
        isJSConvertible: true,
        dependencies: ["listData"],
        evaluatedDependencies: ["listData"],
        options: primaryKeyOptions,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: primaryColumnValidation,
            expected: {
              type: "Array<string | number>",
              example: `["1", "2", "3"]`,
              autocompleteDataType: AutocompleteDataType.ARRAY,
            },
          },
        },
      },
    ],
  },
  {
    sectionName: "分页",
    children: [
      // Disabling till List V2.1
      // {
      //   propertyName: "infiniteScroll",
      //   label: "Infinite scroll",
      //   helpText: "Scrolls vertically, removes pagination",
      //   controlType: "SWITCH",
      //   isJSConvertible: true,
      //   isBindProperty: true,
      //   isTriggerProperty: false,
      //   validation: {
      //     type: ValidationTypes.BOOLEAN,
      //   },
      // },
      {
        propertyName: "serverSidePagination",
        helpText:
          "通过 onPageChange 触发，每次只拉取需要展示的那部分数据，让页面有更好的性能",
        label: "服务端分页",
        controlType: "SWITCH",
        isBindProperty: false,
        isTriggerProperty: false,
      },
      {
        propertyName: "totalRecordsCount",
        helpText: createMessage(LIST_WIDGET_V2_TOTAL_RECORD_TOOLTIP),
        label: "总数据行数",
        controlType: "INPUT_TEXT",
        inputType: "INTEGER",
        isBindProperty: true,
        isTriggerProperty: false,
        placeholderText: "请输入总数据行数",
        validation: {
          type: ValidationTypes.NUMBER,
          params: {
            min: MIN_TOTAL_RECORD_COUNT,
            max: MAX_TOTAL_RECORD_COUNT,
          },
        },
        hidden: (props: ListWidgetProps<WidgetProps>) =>
          !props.serverSidePagination,
        dependencies: ["serverSidePagination"],
      },
      {
        propertyName: "onPageChange",
        helpText: "页面切换时触发",
        label: "onPageChange",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
        hidden: (props: ListWidgetProps<WidgetProps>) =>
          !props.serverSidePagination,
        dependencies: ["serverSidePagination"],
      },
    ],
  },
  {
    sectionName: "Item Selection",
    children: [
      {
        propertyName: "defaultSelectedItem",
        helpText: "Selects Item by default by using a valid data identifier",
        label: "Default Selected Item",
        controlType: "INPUT_TEXT",
        placeholderText: "001",
        isBindProperty: true,
        isTriggerProperty: false,
        hidden: (props: ListWidgetProps<WidgetProps>) =>
          !!props.serverSidePagination,
        dependencies: ["serverSidePagination"],
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: defaultSelectedItemValidation,
            expected: {
              type: "string or number",
              example: `John | 123`,
              autocompleteDataType: AutocompleteDataType.STRING,
            },
          },
        },
      },
      {
        propertyName: "onItemClick",
        helpText: "Triggers an action when an item in this List is clicked",
        label: "onItemClick",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
        additionalAutoComplete: (props: ListWidgetProps<WidgetProps>) => {
          let items = get(props, `${EVAL_VALUE_PATH}.listData`, []);

          if (Array.isArray(items)) {
            items = items.filter(Boolean);
          } else {
            items = [];
          }

          return {
            currentItem: Object.assign(
              {},
              ...Object.keys(get(items, "0", {})).map((key) => ({
                [key]: "",
              })),
            ),
            currentIndex: 0,
          };
        },
        dependencies: ["listData"],
      },
    ],
  },
  {
    sectionName: "General",
    children: [
      {
        propertyName: "isVisible",
        label: "是否显示",
        helpText: "控制组件的显示/隐藏",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.BOOLEAN,
        },
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
        propertyName: "onItemClick",
        helpText: "点击列表项时触发",
        label: "onItemClick",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
        additionalAutoComplete: (props: ListWidgetProps<WidgetProps>) => {
          let items = get(props, `${EVAL_VALUE_PATH}.listData`, []);

          if (Array.isArray(items)) {
            items = items.filter(Boolean);
          } else {
            items = [];
          }

          return {
            currentItem: Object.assign(
              {},
              ...Object.keys(get(items, "0", {})).map((key) => ({
                [key]: "",
              })),
            ),
            currentIndex: 0,
          };
        },
        dependencies: ["listData"],
      },
    ],
  },
];

export const PropertyPaneStyleConfig = [
  {
    sectionName: "属性",
    children: [
      {
        propertyName: "itemSpacing",
        helpText: "列表项之间的像素距离，最大 16px",
        placeholderText: "0",
        label: "列表项间距 (px)",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        inputType: "INTEGER",
        validation: {
          type: ValidationTypes.NUMBER,
          params: { min: MIN_ITEM_SPACING, max: MAX_ITEM_SPACING },
        },
      },
    ],
  },
  {
    sectionName: "颜色",
    children: [
      {
        propertyName: "backgroundColor",
        label: "背景颜色",
        helpText: "列表项的背景颜色",
        controlType: "COLOR_PICKER",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            expected: {
              type: "Color name | hex code",
              example: "#FFFFFF",
              autocompleteDataType: AutocompleteDataType.STRING,
            },
          },
        },
      },
    ],
  },
  {
    sectionName: "轮廓样式",
    children: [
      {
        propertyName: "borderRadius",
        label: "边框圆角",
        helpText: "边框圆角样式",
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
];
