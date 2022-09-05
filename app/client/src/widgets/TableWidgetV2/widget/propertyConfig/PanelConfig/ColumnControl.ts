import { ValidationTypes } from "constants/WidgetValidation";
import {
  ColumnTypes,
  DateInputFormat,
  TableWidgetProps,
} from "widgets/TableWidgetV2/constants";
import { get } from "lodash";
import {
  getBasePropertyPath,
  hideByColumnType,
  SelectColumnOptionsValidations,
  showByColumnType,
  uniqueColumnAliasValidation,
  updateColumnLevelEditability,
  updateInlineEditingOptionDropdownVisibilityHook,
  updateNumberColumnTypeTextAlignment,
  updateThemeStylesheetsInColumns,
} from "../../propertyUtils";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";
import { isColumnTypeEditable } from "../../utilities";
import { composePropertyUpdateHook } from "widgets/WidgetUtils";

export default {
  sectionName: "列控件",
  children: [
    {
      propertyName: "columnType",
      label: "列类型",
      controlType: "DROP_DOWN",
      options: [
        {
          label: "文本",
          value: "text",
        },
        {
          label: "URL",
          value: "url",
        },
        {
          label: "数字",
          value: "number",
        },
        {
          label: "图片",
          value: "image",
        },
        {
          label: "视频",
          value: "video",
        },
        {
          label: "日期",
          value: "date",
        },
        {
          label: "按钮",
          value: "button",
        },
        {
          label: "菜单按钮",
          value: "menuButton",
        },
        {
          label: "图标按钮",
          value: "iconButton",
        },
      ],
      updateHook: composePropertyUpdateHook([
        updateNumberColumnTypeTextAlignment,
        updateThemeStylesheetsInColumns,
      ]),
      dependencies: ["primaryColumns", "columnOrder", "childStylesheet"],
      isBindProperty: false,
      isTriggerProperty: false,
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return showByColumnType(props, propertyPath, [
          ColumnTypes.EDIT_ACTIONS,
        ]);
      },
    },
    {
      propertyName: "displayText",
      label: "显示文本",
      controlType: "TABLE_COMPUTE_VALUE",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        return columnType !== "url";
      },
      dependencies: ["primaryColumns", "columnOrder"],
      isBindProperty: false,
      isTriggerProperty: false,
    },
    {
      helpText: "在 selectedrow 中使用的别名",
      propertyName: "alias",
      label: "别名",
      controlType: "INPUT_TEXT",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const columnId = propertyPath.match(/primaryColumns\.(.*)\.alias/);
        let isDerivedProperty = false;

        if (columnId && columnId[1] && props.primaryColumns[columnId[1]]) {
          isDerivedProperty = props.primaryColumns[columnId[1]].isDerived;
        }

        return (
          !isDerivedProperty ||
          hideByColumnType(props, propertyPath, [
            ColumnTypes.DATE,
            ColumnTypes.IMAGE,
            ColumnTypes.NUMBER,
            ColumnTypes.TEXT,
            ColumnTypes.VIDEO,
            ColumnTypes.URL,
          ])
        );
      },
      dependencies: ["primaryColumns"],
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.FUNCTION,
        params: {
          expected: {
            type: "string",
            example: "abc",
            autocompleteDataType: AutocompleteDataType.STRING,
          },
          fnString: uniqueColumnAliasValidation.toString(),
        },
      },
    },
    {
      helpText:
        "每个单元格计算后的值，使用 {{currentRow}} 引用当前行数据，这个属性不能在这个列之外访问到",
      propertyName: "computedValue",
      label: "计算值",
      controlType: "TABLE_COMPUTE_VALUE",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [
          ColumnTypes.DATE,
          ColumnTypes.IMAGE,
          ColumnTypes.NUMBER,
          ColumnTypes.TEXT,
          ColumnTypes.VIDEO,
          ColumnTypes.URL,
        ]);
      },
      dependencies: ["primaryColumns", "columnOrder"],
      isBindProperty: true,
      isTriggerProperty: false,
    },
    {
      propertyName: "isCellVisible",
      dependencies: ["primaryColumns", "columnType"],
      label: "是否显示",
      helpText: "控制当前列是否显示",
      defaultValue: true,
      controlType: "SWITCH",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.TABLE_PROPERTY,
        params: {
          type: ValidationTypes.BOOLEAN,
        },
      },
    },
    {
      propertyName: "allowCellWrapping",
      dependencies: ["primaryColumns", "columnType"],
      label: "单元格换行",
      helpText: "允许单元格内容换行",
      defaultValue: true,
      controlType: "SWITCH",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.TABLE_PROPERTY,
        params: {
          type: ValidationTypes.BOOLEAN,
        },
      },
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [
          ColumnTypes.TEXT,
          ColumnTypes.NUMBER,
          ColumnTypes.URL,
          ColumnTypes.DATE,
        ]);
      },
    },
    {
      propertyName: "isCellEditable",
      dependencies: [
        "primaryColumns",
        "columnOrder",
        "columnType",
        "childStylesheet",
        "inlineEditingSaveOption",
      ],
      label: "支持编辑",
      helpText: "让表格单元格可以编辑",
      defaultValue: false,
      controlType: "SWITCH",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      updateHook: composePropertyUpdateHook([
        updateColumnLevelEditability,
        updateInlineEditingOptionDropdownVisibilityHook,
      ]),
      validation: {
        type: ValidationTypes.TABLE_PROPERTY,
        params: {
          type: ValidationTypes.BOOLEAN,
        },
      },
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        const isDerived = get(props, `${baseProperty}.isDerived`, false);
        return !isColumnTypeEditable(columnType) || isDerived;
      },
    },
    {
      propertyName: "isDisabled",
      label: "禁用",
      defaultValue: false,
      controlType: "SWITCH",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.TABLE_PROPERTY,
        params: {
          type: ValidationTypes.BOOLEAN,
        },
      },
      dependencies: ["primaryColumns", "columnOrder"],
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [
          ColumnTypes.ICON_BUTTON,
          ColumnTypes.MENU_BUTTON,
          ColumnTypes.BUTTON,
        ]);
      },
    },
    {
      propertyName: "isCompact",
      helpText: "菜单项占用更少的空间",
      label: "紧凑模式",
      controlType: "SWITCH",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      isBindProperty: true,
      validation: {
        type: ValidationTypes.TABLE_PROPERTY,
        params: {
          type: ValidationTypes.BOOLEAN,
        },
      },
      isTriggerProperty: false,
      dependencies: ["primaryColumns", "columnOrder"],
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [ColumnTypes.MENU_BUTTON]);
      },
    },
    {
      propertyName: "selectOptions",
      helpText: "下拉选择框的可选选项",
      label: "选项",
      controlType: "INPUT_TEXT",
      isJSConvertible: false,
      isBindProperty: true,
      validation: {
        type: ValidationTypes.FUNCTION,
        params: {
          fnString: SelectColumnOptionsValidations.toString(),
        },
      },
      isTriggerProperty: false,
      dependencies: ["primaryColumns"],
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [ColumnTypes.SELECT]);
      },
    },
    {
      propertyName: "inputFormat",
      label: "原始日期类型",
      controlType: "DROP_DOWN",
      options: [
        {
          label: "UNIX 时间戳 (s)",
          value: DateInputFormat.EPOCH,
        },
        {
          label: "UNIX 时间戳 (ms)",
          value: DateInputFormat.MILLISECONDS,
        },
        {
          label: "YYYY-MM-DD",
          value: "YYYY-MM-DD",
        },
        {
          label: "YYYY-MM-DD HH:mm",
          value: "YYYY-MM-DD HH:mm",
        },
        {
          label: "ISO 8601",
          value: "YYYY-MM-DDTHH:mm:ss.SSSZ",
        },
        {
          label: "YYYY-MM-DDTHH:mm:ss",
          value: "YYYY-MM-DDTHH:mm:ss",
        },
        {
          label: "YYYY-MM-DD hh:mm:ss",
          value: "YYYY-MM-DD hh:mm:ss",
        },
        {
          label: "Do MMM YYYY",
          value: "Do MMM YYYY",
        },
        {
          label: "DD/MM/YYYY",
          value: "DD/MM/YYYY",
        },
        {
          label: "DD/MM/YYYY HH:mm",
          value: "DD/MM/YYYY HH:mm",
        },
        {
          label: "LLL",
          value: "LLL",
        },
        {
          label: "LL",
          value: "LL",
        },
        {
          label: "D MMMM, YYYY",
          value: "D MMMM, YYYY",
        },
        {
          label: "H:mm A D MMMM, YYYY",
          value: "H:mm A D MMMM, YYYY",
        },
        {
          label: "MM-DD-YYYY",
          value: "MM-DD-YYYY",
        },
        {
          label: "DD-MM-YYYY",
          value: "DD-MM-YYYY",
        },
        {
          label: "MM/DD/YYYY",
          value: "MM/DD/YYYY",
        },
        {
          label: "DD/MM/YYYY",
          value: "DD/MM/YYYY",
        },
        {
          label: "DD/MM/YY",
          value: "DD/MM/YY",
        },
        {
          label: "MM/DD/YY",
          value: "MM/DD/YY",
        },
      ],
      defaultValue: "YYYY-MM-DD HH:mm",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        return columnType !== "date";
      },
      dependencies: ["primaryColumns", "columnOrder"],
      isBindProperty: true,
      validation: {
        type: ValidationTypes.TABLE_PROPERTY,
        params: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: [
              DateInputFormat.EPOCH,
              DateInputFormat.MILLISECONDS,
              "YYYY-MM-DD",
              "YYYY-MM-DD HH:mm",
              "YYYY-MM-DDTHH:mm:ss.sssZ",
              "YYYY-MM-DDTHH:mm:ss",
              "YYYY-MM-DD hh:mm:ss",
              "Do MMM YYYY",
              "DD/MM/YYYY",
              "DD/MM/YYYY HH:mm",
              "LLL",
              "LL",
              "D MMMM, YYYY",
              "H:mm A D MMMM, YYYY",
              "MM-DD-YYYY",
              "DD-MM-YYYY",
              "MM/DD/YYYY",
              "DD/MM/YYYY",
              "DD/MM/YY",
              "MM/DD/YY",
            ],
          },
        },
      },
      isTriggerProperty: false,
    },
    {
      propertyName: "outputFormat",
      label: "展示日期格式",
      controlType: "DROP_DOWN",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      options: [
        {
          label: "UNIX 时间戳 (s)",
          value: DateInputFormat.EPOCH,
        },
        {
          label: "UNIX 时间戳 (ms)",
          value: DateInputFormat.MILLISECONDS,
        },
        {
          label: "YYYY-MM-DD",
          value: "YYYY-MM-DD",
        },
        {
          label: "YYYY-MM-DD HH:mm",
          value: "YYYY-MM-DD HH:mm",
        },
        {
          label: "ISO 8601",
          value: "YYYY-MM-DDTHH:mm:ss.SSSZ",
        },
        {
          label: "YYYY-MM-DDTHH:mm:ss",
          value: "YYYY-MM-DDTHH:mm:ss",
        },
        {
          label: "YYYY-MM-DD hh:mm:ss",
          value: "YYYY-MM-DD hh:mm:ss",
        },
        {
          label: "Do MMM YYYY",
          value: "Do MMM YYYY",
        },
        {
          label: "DD/MM/YYYY",
          value: "DD/MM/YYYY",
        },
        {
          label: "DD/MM/YYYY HH:mm",
          value: "DD/MM/YYYY HH:mm",
        },
        {
          label: "LLL",
          value: "LLL",
        },
        {
          label: "LL",
          value: "LL",
        },
        {
          label: "D MMMM, YYYY",
          value: "D MMMM, YYYY",
        },
        {
          label: "H:mm A D MMMM, YYYY",
          value: "H:mm A D MMMM, YYYY",
        },
        {
          label: "MM-DD-YYYY",
          value: "MM-DD-YYYY",
        },
        {
          label: "DD-MM-YYYY",
          value: "DD-MM-YYYY",
        },
        {
          label: "MM/DD/YYYY",
          value: "MM/DD/YYYY",
        },
        {
          label: "DD/MM/YYYY",
          value: "DD/MM/YYYY",
        },
        {
          label: "DD/MM/YY",
          value: "DD/MM/YY",
        },
        {
          label: "MM/DD/YY",
          value: "MM/DD/YY",
        },
      ],
      defaultValue: "YYYY-MM-DD HH:mm",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        return columnType !== "date";
      },
      dependencies: ["primaryColumns", "columnType"],
      isBindProperty: true,
      validation: {
        type: ValidationTypes.TABLE_PROPERTY,
        params: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: [
              "Epoch",
              "Milliseconds",
              "YYYY-MM-DD",
              "YYYY-MM-DD HH:mm",
              "YYYY-MM-DDTHH:mm:ss.sssZ",
              "YYYY-MM-DDTHH:mm:ss",
              "YYYY-MM-DD hh:mm:ss",
              "Do MMM YYYY",
              "DD/MM/YYYY",
              "DD/MM/YYYY HH:mm",
              "LLL",
              "LL",
              "D MMMM, YYYY",
              "H:mm A D MMMM, YYYY",
              "MM-DD-YYYY",
              "DD-MM-YYYY",
              "MM/DD/YYYY",
              "DD/MM/YYYY",
              "DD/MM/YY",
              "MM/DD/YY",
            ],
          },
        },
      },
      isTriggerProperty: false,
    },
  ],
};
