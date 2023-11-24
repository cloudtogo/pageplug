import { ValidationTypes } from "constants/WidgetValidation";
import type { TableWidgetProps } from "widgets/TableWidgetV2/constants";
import { ColumnTypes } from "widgets/TableWidgetV2/constants";
import {
  showByColumnType,
  getColumnPath,
} from "widgets/TableWidgetV2/widget/propertyUtils";

export default [
  {
    propertyName: "validation.regex",
    helpText: "对输入进行正则校验，校验失败时显示错误",
    label: "正则校验",
    controlType: "TABLE_INLINE_EDIT_VALIDATION_CONTROL",
    placeholderText: "^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$",
    isBindProperty: true,
    isTriggerProperty: false,
    validation: { type: ValidationTypes.REGEX },
    hidden: (props: TableWidgetProps, propertyPath: string) => {
      const path = getColumnPath(propertyPath);

      return showByColumnType(props, path, [ColumnTypes.DATE], true);
    },
  },
  {
    propertyName: "validation.isColumnEditableCellValid",
    helpText: "使用 JS 表达式来校验输入的是否合法",
    label: "普通校验",
    controlType: "TABLE_INLINE_EDIT_VALID_PROPERTY_CONTROL",
    isJSConvertible: false,
    dependencies: ["primaryColumns", "columnOrder"],
    isBindProperty: true,
    isTriggerProperty: false,
    validation: {
      type: ValidationTypes.BOOLEAN,
      params: {
        default: true,
      },
    },
    hidden: (props: TableWidgetProps, propertyPath: string) => {
      const path = getColumnPath(propertyPath);
      return showByColumnType(props, path, [ColumnTypes.DATE], true);
    },
  },
  {
    propertyName: "validation.errorMessage",
    helpText: "普通校验或正则校验失败后显示的错误信息",
    label: "错误信息",
    controlType: "TABLE_INLINE_EDIT_VALIDATION_CONTROL",
    placeholderText: "校验失败！",
    isBindProperty: true,
    isTriggerProperty: false,
    validation: { type: ValidationTypes.TEXT },
    hidden: (props: TableWidgetProps, propertyPath: string) => {
      const path = getColumnPath(propertyPath);
      return showByColumnType(props, path, [ColumnTypes.DATE], true);
    },
  },
  {
    propertyName: "validation.isColumnEditableCellRequired",
    helpText: "强制用户填写",
    label: "必填",
    controlType: "SWITCH",
    customJSControl: "TABLE_INLINE_EDIT_VALIDATION_CONTROL",
    isJSConvertible: true,
    isBindProperty: true,
    isTriggerProperty: false,
    validation: { type: ValidationTypes.BOOLEAN },
  },
];
