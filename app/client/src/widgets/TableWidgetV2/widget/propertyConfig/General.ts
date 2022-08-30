import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";
import {
  InlineEditingSaveOptions,
  TableWidgetProps,
} from "widgets/TableWidgetV2/constants";
import {
  totalRecordsCountValidation,
  uniqueColumnNameValidation,
  updateColumnOrderHook,
  updateInlineEditingSaveOptionHook,
  updateInlineEditingOptionDropdownVisibilityHook,
} from "../propertyUtils";
import {
  createMessage,
  TABLE_WIDGET_TOTAL_RECORD_TOOLTIP,
} from "@appsmith/constants/messages";
import panelConfig from "./PanelConfig";
import { composePropertyUpdateHook } from "widgets/WidgetUtils";

export default {
  sectionName: "属性",
  children: [
    {
      helpText: "表格数组数据",
      propertyName: "tableData",
      label: "数据",
      controlType: "INPUT_TEXT",
      placeholderText: '[{ "name": "John" }]',
      inputType: "ARRAY",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.OBJECT_ARRAY,
        params: {
          default: [],
        },
      },
      evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
    },
    {
      helpText: "表格数据列定义",
      propertyName: "primaryColumns",
      controlType: "PRIMARY_COLUMNS_V2",
      label: "数据列",
      updateHook: composePropertyUpdateHook([
        updateColumnOrderHook,
        updateInlineEditingOptionDropdownVisibilityHook,
      ]),
      dependencies: [
        "columnOrder",
        "childStylesheet",
        "inlineEditingSaveOption",
        "textColor",
        "textSize",
        "fontStyle",
        "cellBackground",
        "verticalAlignment",
        "horizontalAlignment",
      ],
      isBindProperty: false,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.FUNCTION,
        params: {
          fn: uniqueColumnNameValidation,
          expected: {
            type: "唯一列名",
            example: "abc",
            autocompleteDataType: AutocompleteDataType.STRING,
          },
        },
      },
      panelConfig,
    },
    {
      propertyName: "inlineEditingSaveOption",
      helpText: "选择如何保存编辑的单元格数据",
      label: "更新模式",
      controlType: "DROP_DOWN",
      isBindProperty: true,
      isTriggerProperty: false,
      hidden: (props: TableWidgetProps) => {
        return (
          !props.showInlineEditingOptionDropdown &&
          !Object.values(props.primaryColumns).find(
            (column) => column.isEditable,
          )
        );
      },
      dependencies: [
        "primaryColumns",
        "columnOrder",
        "childStylesheet",
        "showInlineEditingOptionDropdown",
      ],
      options: [
        {
          label: "行更新",
          value: InlineEditingSaveOptions.ROW_LEVEL,
        },
        {
          label: "自定义更新",
          value: InlineEditingSaveOptions.CUSTOM,
        },
      ],
      updateHook: updateInlineEditingSaveOptionHook,
    },
    {
      helpText: "数据主键值唯一，用于表格的 selectedRows 和 triggeredRows",
      propertyName: "primaryColumnId",
      dependencies: ["primaryColumns"],
      label: "主键列",
      controlType: "PRIMARY_COLUMNS_DROPDOWN",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.TEXT },
    },
    {
      propertyName: "defaultSearchText",
      label: "默认搜索内容",
      controlType: "INPUT_TEXT",
      placeholderText: "{{appsmith.user.name}}",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.TEXT },
    },
    {
      helpText: "默认选中行的序号数组",
      propertyName: "defaultSelectedRowIndices",
      label: "默认选中行",
      controlType: "INPUT_TEXT",
      placeholderText: "[0]",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.ARRAY,
        params: {
          children: {
            type: ValidationTypes.NUMBER,
            params: {
              min: -1,
              default: -1,
            },
          },
        },
      },
      hidden: (props: TableWidgetProps) => {
        return !props.multiRowSelection;
      },
      dependencies: ["multiRowSelection"],
    },
    {
      helpText: "默认选中行的序号",
      propertyName: "defaultSelectedRowIndex",
      label: "默认选中行",
      controlType: "INPUT_TEXT",
      placeholderText: "0",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.NUMBER,
        params: {
          min: -1,
          default: -1,
        },
      },
      hidden: (props: TableWidgetProps) => {
        return props.multiRowSelection;
      },
      dependencies: ["multiRowSelection"],
    },
    {
      propertyName: "compactMode",
      helpText: "选择行高",
      label: "默认行高",
      controlType: "DROP_DOWN",
      defaultValue: "DEFAULT",
      isBindProperty: true,
      isTriggerProperty: false,
      options: [
        {
          label: "矮",
          value: "SHORT",
        },
        {
          label: "默认",
          value: "DEFAULT",
        },
        {
          label: "高",
          value: "TALL",
        },
      ],
    },
    {
      helpText:
        "在 API 请求参数中绑定页号 Table.pageNo，onPageChange 换页的时候调用 API",
      propertyName: "serverSidePaginationEnabled",
      label: "服务端分页",
      controlType: "SWITCH",
      isBindProperty: false,
      isTriggerProperty: false,
    },
    {
      helpText: createMessage(TABLE_WIDGET_TOTAL_RECORD_TOOLTIP),
      propertyName: "totalRecordsCount",
      label: "总行数",
      controlType: "INPUT_TEXT",
      placeholderText: "配置表格总行数",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.FUNCTION,
        params: {
          fn: totalRecordsCountValidation,
          expected: {
            type: "Number",
            example: "10",
            autocompleteDataType: AutocompleteDataType.STRING,
          },
        },
      },
      hidden: (props: TableWidgetProps) => !!!props.serverSidePaginationEnabled,
      dependencies: ["serverSidePaginationEnabled"],
    },
    {
      helpText: "控制组件的显示/隐藏",
      propertyName: "isVisible",
      isJSConvertible: true,
      label: "是否显示",
      controlType: "SWITCH",
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
    {
      helpText: "是否支持按列排序",
      propertyName: "isSortable",
      isJSConvertible: true,
      label: "支持排序",
      controlType: "SWITCH",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.BOOLEAN,
        params: {
          default: true,
        },
      },
    },
    {
      propertyName: "multiRowSelection",
      label: "支持多选",
      controlType: "SWITCH",
      isBindProperty: false,
      isTriggerProperty: false,
    },
    {
      propertyName: "enableClientSideSearch",
      label: "支持前端搜索",
      controlType: "SWITCH",
      isBindProperty: false,
      isTriggerProperty: false,
    },
  ],
};
