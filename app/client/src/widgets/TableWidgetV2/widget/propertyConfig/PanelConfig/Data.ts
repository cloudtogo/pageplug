import { ValidationTypes } from "constants/WidgetValidation";
import type { TableWidgetProps } from "widgets/TableWidgetV2/constants";
import { ColumnTypes, DateInputFormat } from "widgets/TableWidgetV2/constants";
import { get } from "lodash";
import {
  getBasePropertyPath,
  hideByColumnType,
  showByColumnType,
  uniqueColumnAliasValidation,
  updateCurrencyDefaultValues,
  updateMenuItemsSource,
  updateNumberColumnTypeTextAlignment,
  updateThemeStylesheetsInColumns,
} from "../../propertyUtils";
import { AutocompleteDataType } from "utils/autocomplete/AutocompleteDataType";
import { composePropertyUpdateHook } from "widgets/WidgetUtils";
import { CurrencyDropdownOptions } from "widgets/CurrencyInputWidget/component/CurrencyCodeDropdown";

export default {
  sectionName: "数据",
  children: [
    {
      propertyName: "columnType",
      label: "列类型",
      helpText:
        "Type of column to be shown corresponding to the data of the column",
      controlType: "DROP_DOWN",
      options: [
        {
          label: "按钮",
          value: ColumnTypes.BUTTON,
        },
        {
          label: "勾选",
          value: ColumnTypes.CHECKBOX,
        },
        {
          label: "货币",
          value: ColumnTypes.CURRENCY,
        },
        {
          label: "日期",
          value: ColumnTypes.DATE,
        },
        {
          label: "图标按钮",
          value: ColumnTypes.ICON_BUTTON,
        },
        {
          label: "图片",
          value: ColumnTypes.IMAGE,
        },
        {
          label: "菜单按钮",
          value: ColumnTypes.MENU_BUTTON,
        },
        {
          label: "数字",
          value: ColumnTypes.NUMBER,
        },
        {
          label: "文本",
          value: ColumnTypes.TEXT,
        },
        {
          label: "选择器",
          value: ColumnTypes.SELECT,
        },
        {
          label: "开关",
          value: ColumnTypes.SWITCH,
        },
        {
          label: "URL",
          value: ColumnTypes.URL,
        },
        {
          label: "视频",
          value: ColumnTypes.VIDEO,
        },
      ],
      updateHook: composePropertyUpdateHook([
        updateNumberColumnTypeTextAlignment,
        updateThemeStylesheetsInColumns,
        updateMenuItemsSource,
        updateCurrencyDefaultValues,
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
      helpText: "在 selectedrow 中使用的别名",
      propertyName: "alias",
      label: "属性名",
      controlType: "INPUT_TEXT",
      helperText: () =>
        "Changing the name of the column overrides any changes to this field",
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
            ColumnTypes.CURRENCY,
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
      propertyName: "displayText",
      label: "显示文本",
      helpText: "The text to be displayed in the column",
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
      helpText:
        "每个单元格计算后的值，使用 {{currentRow}} 引用当前行数据，这个属性不能在这个列之外访问到",
      propertyName: "computedValue",
      label: "计算值",
      controlType: "TABLE_COMPUTE_VALUE",
      additionalControlData: {
        isArrayValue: true,
      },
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [
          ColumnTypes.DATE,
          ColumnTypes.IMAGE,
          ColumnTypes.NUMBER,
          ColumnTypes.TEXT,
          ColumnTypes.VIDEO,
          ColumnTypes.URL,
          ColumnTypes.CHECKBOX,
          ColumnTypes.SWITCH,
          ColumnTypes.SELECT,
          ColumnTypes.CURRENCY,
        ]);
      },
      dependencies: ["primaryColumns", "columnOrder"],
      isBindProperty: true,
      isTriggerProperty: false,
    },
    {
      propertyName: "inputFormat",
      label: "原始日期类型",
      helpText: "Date format of incoming data to the column",
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
        return columnType !== ColumnTypes.DATE;
      },
      dependencies: ["primaryColumns", "columnOrder"],
      isBindProperty: true,
      validation: {
        type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
        params: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: [
              "YYYY-MM-DDTHH:mm:ss.SSSZ",
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
      helpText: "Date format to be shown to users",
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
        return columnType !== ColumnTypes.DATE;
      },
      dependencies: ["primaryColumns", "columnType"],
      isBindProperty: true,
      validation: {
        type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
        params: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: [
              "YYYY-MM-DDTHH:mm:ss.SSSZ",
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
    {
      helpText: "Changes the type of currency",
      propertyName: "currencyCode",
      label: "Currency",
      enableSearch: true,
      dropdownHeight: "156px",
      controlType: "DROP_DOWN",
      searchPlaceholderText: "Search by code or name",
      options: CurrencyDropdownOptions,
      virtual: true,
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.TEXT,
        params: {
          default: "USD",
          required: true,
          allowedValues: CurrencyDropdownOptions.map((option) => option.value),
        },
      },
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        return columnType !== ColumnTypes.CURRENCY;
      },
      dependencies: ["primaryColumns", "columnType"],
    },
    {
      helpText: "No. of decimals in currency input",
      propertyName: "decimals",
      label: "Decimals allowed",
      controlType: "DROP_DOWN",
      options: [
        {
          label: "0",
          value: 0,
        },
        {
          label: "1",
          value: 1,
        },
        {
          label: "2",
          value: 2,
        },
      ],
      isJSConvertible: false,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.NUMBER,
        params: {
          min: 0,
          max: 2,
          default: 0,
          required: true,
        },
      },
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        return columnType !== ColumnTypes.CURRENCY;
      },
      dependencies: ["primaryColumns", "columnType"],
    },
    {
      propertyName: "thousandSeparator",
      helpText: "formats the currency with a thousand separator",
      label: "Thousand separator",
      controlType: "SWITCH",
      dependencies: ["primaryColumns", "columnType"],
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.BOOLEAN },
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        return columnType !== ColumnTypes.CURRENCY;
      },
    },
    {
      propertyName: "notation",
      helpText: "Displays the currency in standard or compact notation",
      label: "Notation",
      controlType: "DROP_DOWN",
      options: [
        {
          label: "Standard",
          value: "standard",
        },
        {
          label: "Compact",
          value: "compact",
        },
      ],
      dependencies: ["primaryColumns", "columnType"],
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.TEXT,
        params: { default: "standard", allowedValues: ["standard", "compact"] },
      },
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        return columnType !== ColumnTypes.CURRENCY;
      },
    },
  ],
};
