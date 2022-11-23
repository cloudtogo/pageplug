import { ValidationTypes } from "constants/WidgetValidation";
import { ColumnTypes, TableWidgetProps } from "widgets/TableWidgetV2/constants";
import { hideByColumnType } from "widgets/TableWidgetV2/widget/propertyUtils";

export default [
  {
    helpText: "设置允许输入的最小值",
    propertyName: "validation.min",
    label: "最小值",
    controlType: "TABLE_INLINE_EDIT_VALIDATION_CONTROL",
    placeholderText: "1",
    isBindProperty: true,
    isTriggerProperty: false,
    validation: {
      type: ValidationTypes.NUMBER,
      params: { default: -Infinity },
    },
    hidden: (props: TableWidgetProps, propertyPath: string) => {
      const path = propertyPath
        .split(".")
        .slice(0, 2)
        .join(".");

      return hideByColumnType(props, path, [ColumnTypes.NUMBER], true);
    },
    dependencies: ["primaryColumns"],
  },
  {
    helpText: "设置允许输入的最大值",
    propertyName: "validation.max",
    label: "最大值",
    controlType: "TABLE_INLINE_EDIT_VALIDATION_CONTROL",
    placeholderText: "100",
    isBindProperty: true,
    isTriggerProperty: false,
    validation: {
      type: ValidationTypes.NUMBER,
      params: { default: Infinity },
    },
    hidden: (props: TableWidgetProps, propertyPath: string) => {
      const path = propertyPath
        .split(".")
        .slice(0, 2)
        .join(".");

      return hideByColumnType(props, path, [ColumnTypes.NUMBER], true);
    },
    dependencies: ["primaryColumns"],
  },
];
