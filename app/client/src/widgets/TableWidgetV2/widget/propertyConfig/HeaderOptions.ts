import { ValidationTypes } from "constants/WidgetValidation";
import { TableWidgetProps } from "widgets/TableWidgetV2/constants";

export default {
  sectionName: "标题配置",
  children: [
    {
      propertyName: "isVisibleSearch",
      helpText: "是否显示的搜索框",
      label: "搜索",
      controlType: "SWITCH",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.BOOLEAN },
    },
    {
      propertyName: "isVisibleFilters",
      helpText: "是否显示过滤器",
      label: "过滤",
      controlType: "SWITCH",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.BOOLEAN },
    },
    {
      propertyName: "isVisibleDownload",
      helpText: "是否显示下载按钮",
      label: "下载",
      controlType: "SWITCH",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.BOOLEAN },
    },
    {
      propertyName: "isVisiblePagination",
      helpText: "是否显示分页器",
      label: "分页",
      controlType: "SWITCH",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.BOOLEAN },
    },
    {
      propertyName: "delimiter",
      label: "CSV 分隔符",
      controlType: "INPUT_TEXT",
      placeholderText: "输入 CSV 分隔符",
      helpText: "用于分隔 CSV 下载文件的字符",
      isBindProperty: true,
      isTriggerProperty: false,
      defaultValue: ",",
      validation: {
        type: ValidationTypes.TEXT,
      },
      hidden: (props: TableWidgetProps) => !props.isVisibleDownload,
      dependencies: ["isVisibleDownload"],
    },
  ],
};
