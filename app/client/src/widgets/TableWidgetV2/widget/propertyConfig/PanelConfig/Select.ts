import { ValidationTypes } from "constants/WidgetValidation";
import { ColumnTypes, TableWidgetProps } from "widgets/TableWidgetV2/constants";
import { hideByColumnType } from "../../propertyUtils";

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
      controlType: "INPUT_TEXT",
      isJSConvertible: false,
      isBindProperty: true,
      validation: {
        type: ValidationTypes.ARRAY,
        params: {
          unique: ["value"],
          children: {
            type: ValidationTypes.OBJECT,
            params: {
              required: true,
              allowedKeys: [
                {
                  name: "label",
                  type: ValidationTypes.TEXT,
                  params: {
                    default: "",
                    requiredKey: true,
                  },
                },
                {
                  name: "value",
                  type: ValidationTypes.TEXT,
                  params: {
                    default: "",
                    requiredKey: true,
                  },
                },
              ],
            },
          },
        },
      },
      isTriggerProperty: false,
      dependencies: ["primaryColumns"],
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [ColumnTypes.SELECT]);
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
