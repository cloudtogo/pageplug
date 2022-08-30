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
      helpText: "Toggle visibility of the data download",
      label: "Download",
      controlType: "SWITCH",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.BOOLEAN },
    },
    {
      propertyName: "isVisiblePagination",
      helpText: "Toggle visibility of the pagination",
      label: "Pagination",
      controlType: "SWITCH",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.BOOLEAN },
    },
    {
      propertyName: "delimiter",
      label: "CSV Separator",
      controlType: "INPUT_TEXT",
      placeholderText: "Enter CSV separator",
      helpText: "The character used for separating the CSV download file.",
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
