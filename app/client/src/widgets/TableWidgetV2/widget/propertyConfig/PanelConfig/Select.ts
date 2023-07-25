import { ValidationTypes } from "constants/WidgetValidation";
import { get } from "lodash";
import type { TableWidgetProps } from "widgets/TableWidgetV2/constants";
import { ColumnTypes } from "widgets/TableWidgetV2/constants";
import {
  getBasePropertyPath,
  hideByColumnType,
  selectColumnOptionsValidation,
} from "../../propertyUtils";

export default {
  sectionName: "选择器配置",
  hidden: (props: TableWidgetProps, propertyPath: string) => {
    return hideByColumnType(props, propertyPath, [ColumnTypes.SELECT], true);
  },
  children: [
    {
      propertyName: "selectOptions",
      helpText: "可供选择的选项列表",
      label: "选项",
      controlType: "TABLE_COMPUTE_VALUE",
      isJSConvertible: false,
      isBindProperty: true,
      validation: {
        type: ValidationTypes.FUNCTION,
        params: {
          expected: {
            type: 'Array<{ "label": string | number, "value": string | number}>',
            example: '[{"label": "abc", "value": "abc"}]',
          },
          fnString: selectColumnOptionsValidation.toString(),
        },
      },
      isTriggerProperty: false,
      dependencies: ["primaryColumns"],
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [ColumnTypes.SELECT]);
      },
    },
    {
      propertyName: "allowSameOptionsInNewRow",
      defaultValue: true,
      helpText: "切换以显示新行和编辑列中现有行的相同选项",
      label: "新增行使用相同可选项",
      controlType: "SWITCH",
      isBindProperty: true,
      isJSConvertible: true,
      isTriggerProperty: false,
      hidden: (props: TableWidgetProps) => {
        return !props.allowAddNewRow;
      },
      dependencies: ["primaryColumns", "allowAddNewRow"],
      validation: { type: ValidationTypes.BOOLEAN },
    },
    {
      propertyName: "newRowSelectOptions",
      helpText: "新增一行的方式显示在列中用于添加新行的选项",
      label: "新增行的可选项",
      controlType: "INPUT_TEXT",
      isJSConvertible: false,
      isBindProperty: true,
      validation: {
        type: ValidationTypes.FUNCTION,
        params: {
          expected: {
            type: 'Array<{ "label": string | number, "value": string | number}>',
            example: '[{"label": "abc", "value": "abc"}]',
          },
          fnString: selectColumnOptionsValidation.toString(),
        },
      },
      isTriggerProperty: false,
      dependencies: ["primaryColumns", "allowAddNewRow"],
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);

        if (baseProperty) {
          const columnType = get(props, `${baseProperty}.columnType`, "");
          const allowSameOptionsInNewRow = get(
            props,
            `${baseProperty}.allowSameOptionsInNewRow`,
          );

          if (
            columnType === ColumnTypes.SELECT &&
            props.allowAddNewRow &&
            !allowSameOptionsInNewRow
          ) {
            return false;
          } else {
            return true;
          }
        }
      },
    },
    {
      propertyName: "placeholderText",
      helpText: "未选中时显示的背景提示文本",
      label: "占位文本",
      controlType: "INPUT_TEXT",
      placeholderText: "输入占位文本",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.TEXT },
    },
    {
      propertyName: "isFilterable",
      label: "支持过滤",
      helpText: "支持搜索过滤下拉列表",
      controlType: "SWITCH",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.BOOLEAN },
    },
    {
      propertyName: "resetFilterTextOnClose",
      label: "关闭后清空过滤",
      helpText: "关闭选择器后清空过滤关键字",
      controlType: "SWITCH",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.BOOLEAN },
    },
    {
      propertyName: "serverSideFiltering",
      helpText: "支持服务端过滤数据",
      label: "服务端过滤",
      controlType: "SWITCH",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.BOOLEAN },
    },
  ],
};
