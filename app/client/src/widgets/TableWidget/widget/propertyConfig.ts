import { get } from "lodash";
import { TableWidgetProps } from "../constants";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";
import { PropertyPaneConfig } from "constants/PropertyControlConstants";
import { ButtonVariantTypes } from "components/constants";
import {
  updateDerivedColumnsHook,
  ColumnTypes,
  defaultSelectedRowValidation,
  totalRecordsCountValidation,
  updateColumnStyles,
  updateIconAlignmentHook,
  getBasePropertyPath,
  hideByColumnType,
  uniqueColumnNameValidation,
  removeBoxShadowColorProp,
  updateIconNameHook,
} from "./propertyUtils";
import {
  createMessage,
  TABLE_WIDGET_TOTAL_RECORD_TOOLTIP,
} from "@appsmith/constants/messages";
import { IconNames } from "@blueprintjs/icons";
import { getPrimaryColumnStylesheetValue } from "./helpers";

const ICON_NAMES = Object.keys(IconNames).map(
  (name: string) => IconNames[name as keyof typeof IconNames],
);

export default [
  {
    sectionName: "属性",
    children: [
      {
        helpText:
          "Takes in an array of objects to display rows in the table. Bind data from an API using {{}}",
        propertyName: "tableData",
        label: "Table Data",
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
        helpText: "Columns",
        propertyName: "primaryColumns",
        controlType: "PRIMARY_COLUMNS",
        label: "Columns",
        updateHook: updateDerivedColumnsHook,
        dependencies: ["derivedColumns", "columnOrder", "childStylesheet"],
        isBindProperty: false,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: uniqueColumnNameValidation,
            expected: {
              type: "Unique Column Names",
              example: "abc",
              autocompleteDataType: AutocompleteDataType.STRING,
            },
          },
        },
        panelConfig: {
          editableTitle: true,
          titlePropertyName: "label",
          panelIdPropertyName: "id",
          updateHook: updateDerivedColumnsHook,
          dependencies: ["primaryColumns", "derivedColumns", "columnOrder"],
          children: [
            {
              sectionName: "Column Control",
              children: [
                {
                  propertyName: "columnType",
                  label: "Column Type",
                  controlType: "DROP_DOWN",
                  customJSControl: "COMPUTE_VALUE",
                  options: [
                    {
                      label: "Plain Text",
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
                      label: "Image",
                      value: "image",
                    },
                    {
                      label: "Video",
                      value: "video",
                    },
                    {
                      label: "Date",
                      value: "date",
                    },
                    {
                      label: "Button",
                      value: "button",
                    },
                    {
                      label: "Menu Button",
                      value: "menuButton",
                    },
                    {
                      label: "Icon Button",
                      value: "iconButton",
                    },
                  ],
                  updateHook: updateIconNameHook,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                    "childStylesheet",
                  ],
                  isBindProperty: false,
                  isTriggerProperty: false,
                },
                {
                  propertyName: "displayText",
                  label: "Display Text",
                  controlType: "COMPUTE_VALUE",
                  customJSControl: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    const baseProperty = getBasePropertyPath(propertyPath);
                    const columnType = get(
                      props,
                      `${baseProperty}.columnType`,
                      "",
                    );
                    return columnType !== "url";
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: false,
                  isTriggerProperty: false,
                },
                {
                  helpText:
                    "The value computed & shown in each cell. Use {{currentRow}} to reference each row in the table. This property is not accessible outside the column settings.",
                  propertyName: "computedValue",
                  label: "Computed Value",
                  controlType: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook,
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
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                },
                {
                  propertyName: "isCellVisible",
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnType",
                  ],
                  label: "是否显示",
                  helpText: "Controls the visibility of the cell in the column",
                  updateHook: updateDerivedColumnsHook,
                  defaultValue: true,
                  controlType: "SWITCH",
                  customJSControl: "COMPUTE_VALUE",
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
                  propertyName: "isDisabled",
                  label: "禁用",
                  updateHook: updateDerivedColumnsHook,
                  defaultValue: false,
                  controlType: "SWITCH",
                  customJSControl: "COMPUTE_VALUE",
                  isJSConvertible: true,
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.BOOLEAN,
                    },
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
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
                  updateHook: updateDerivedColumnsHook,
                  label: "紧凑模式",
                  controlType: "SWITCH",
                  customJSControl: "COMPUTE_VALUE",
                  isJSConvertible: true,
                  isBindProperty: true,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.BOOLEAN,
                    },
                  },
                  isTriggerProperty: false,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.MENU_BUTTON,
                    ]);
                  },
                },
                {
                  propertyName: "inputFormat",
                  label: "Original Date Format",
                  controlType: "DROP_DOWN",
                  options: [
                    {
                      label: "UNIX timestamp (s)",
                      value: "Epoch",
                    },
                    {
                      label: "UNIX timestamp (ms)",
                      value: "Milliseconds",
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
                  customJSControl: "COMPUTE_VALUE",
                  isJSConvertible: true,
                  updateHook: updateDerivedColumnsHook,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    const baseProperty = getBasePropertyPath(propertyPath);
                    const columnType = get(
                      props,
                      `${baseProperty}.columnType`,
                      "",
                    );
                    return columnType !== "date";
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
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
                {
                  propertyName: "outputFormat",
                  label: "Display Date Format",
                  controlType: "DROP_DOWN",
                  customJSControl: "COMPUTE_VALUE",
                  isJSConvertible: true,
                  options: [
                    {
                      label: "UNIX timestamp (s)",
                      value: "Epoch",
                    },
                    {
                      label: "UNIX timestamp (ms)",
                      value: "Milliseconds",
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
                  updateHook: updateDerivedColumnsHook,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    const baseProperty = getBasePropertyPath(propertyPath);
                    const columnType = get(
                      props,
                      `${baseProperty}.columnType`,
                      "",
                    );
                    return columnType !== "date";
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnType",
                  ],
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
                {
                  propertyName: "onClick",
                  label: "onClick",
                  controlType: "ACTION_SELECTOR",
                  updateHook: updateDerivedColumnsHook,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    const baseProperty = getBasePropertyPath(propertyPath);
                    const columnType = get(
                      props,
                      `${baseProperty}.columnType`,
                      "",
                    );
                    return columnType !== "image";
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isJSConvertible: true,
                  isBindProperty: true,
                  isTriggerProperty: true,
                },
              ],
            },
            {
              sectionName: "样式",
              hidden: (props: TableWidgetProps, propertyPath: string) => {
                return hideByColumnType(
                  props,
                  propertyPath,
                  [
                    ColumnTypes.TEXT,
                    ColumnTypes.DATE,
                    ColumnTypes.NUMBER,
                    ColumnTypes.URL,
                  ],
                  true,
                );
              },
              dependencies: ["primaryColumns", "derivedColumns"],
              children: [
                {
                  propertyName: "horizontalAlignment",
                  label: "Text Align",
                  controlType: "ICON_TABS",
                  options: [
                    {
                      icon: "LEFT_ALIGN",
                      value: "LEFT",
                    },
                    {
                      icon: "CENTER_ALIGN",
                      value: "CENTER",
                    },
                    {
                      icon: "RIGHT_ALIGN",
                      value: "RIGHT",
                    },
                  ],
                  defaultValue: "LEFT",
                  isJSConvertible: true,
                  customJSControl: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        allowedValues: ["LEFT", "CENTER", "RIGHT"],
                      },
                    },
                  },
                  isTriggerProperty: false,
                },
                {
                  propertyName: "textSize",
                  label: "字体大小",
                  controlType: "DROP_DOWN",
                  isJSConvertible: true,
                  customJSControl: "COMPUTE_VALUE",
                  options: [
                    {
                      label: "S",
                      value: "0.875rem",
                      subText: "0.875rem",
                    },
                    {
                      label: "M",
                      value: "1rem",
                      subText: "1rem",
                    },
                    {
                      label: "L",
                      value: "1.25rem",
                      subText: "1.25rem",
                    },
                    {
                      label: "XL",
                      value: "1.875rem",
                      subText: "1.875rem",
                    },
                  ],
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                    },
                  },
                  updateHook: updateDerivedColumnsHook,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                },
                {
                  propertyName: "fontStyle",
                  label: "Font Style",
                  controlType: "BUTTON_TABS",
                  options: [
                    {
                      icon: "BOLD_FONT",
                      value: "BOLD",
                    },
                    {
                      icon: "ITALICS_FONT",
                      value: "ITALIC",
                    },
                    {
                      icon: "UNDERLINE",
                      value: "UNDERLINE",
                    },
                  ],
                  isJSConvertible: true,
                  customJSControl: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                    },
                  },
                },
                {
                  propertyName: "verticalAlignment",
                  label: "Vertical Alignment",
                  controlType: "ICON_TABS",
                  options: [
                    {
                      icon: "VERTICAL_TOP",
                      value: "TOP",
                    },
                    {
                      icon: "VERTICAL_CENTER",
                      value: "CENTER",
                    },
                    {
                      icon: "VERTICAL_BOTTOM",
                      value: "BOTTOM",
                    },
                  ],
                  defaultValue: "CENTER",
                  isJSConvertible: true,
                  customJSControl: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        allowedValues: ["TOP", "CENTER", "BOTTOM"],
                      },
                    },
                  },
                  isTriggerProperty: false,
                },
                {
                  propertyName: "textColor",
                  label: "文本颜色",
                  controlType: "PRIMARY_COLUMNS_COLOR_PICKER",
                  isJSConvertible: true,
                  customJSControl: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        regex: /^(?![<|{{]).+/,
                      },
                    },
                  },
                  isTriggerProperty: false,
                },
                {
                  propertyName: "cellBackground",
                  label: "Cell Background",
                  controlType: "PRIMARY_COLUMNS_COLOR_PICKER",
                  isJSConvertible: true,
                  customJSControl: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        regex: /^(?![<|{{]).+/,
                      },
                    },
                  },
                  isTriggerProperty: false,
                },
              ],
            },
            {
              sectionName: "Button Properties",
              hidden: (props: TableWidgetProps, propertyPath: string) => {
                return hideByColumnType(
                  props,
                  propertyPath,
                  [
                    ColumnTypes.BUTTON,
                    ColumnTypes.MENU_BUTTON,
                    ColumnTypes.ICON_BUTTON,
                  ],
                  true,
                );
              },
              children: [
                {
                  propertyName: "iconName",
                  label: "图标",
                  helpText: "设置按钮图标",
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.ICON_BUTTON,
                      ColumnTypes.MENU_BUTTON,
                    ]);
                  },
                  updateHook: updateIconAlignmentHook,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  controlType: "ICON_SELECT",
                  customJSControl: "COMPUTE_VALUE",
                  isJSConvertible: true,
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        allowedValues: ICON_NAMES,
                      },
                    },
                  },
                },
                {
                  propertyName: "iconAlign",
                  label: "图标对齐",
                  helpText: "Sets the icon alignment of the menu button",
                  controlType: "ICON_TABS",
                  options: [
                    {
                      icon: "VERTICAL_LEFT",
                      value: "left",
                    },
                    {
                      icon: "VERTICAL_RIGHT",
                      value: "right",
                    },
                  ],
                  isBindProperty: false,
                  isTriggerProperty: false,
                  updateHook: updateDerivedColumnsHook,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.MENU_BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  validation: {
                    type: ValidationTypes.TEXT,
                    params: {
                      allowedValues: ["center", "left", "right"],
                    },
                  },
                },
                {
                  propertyName: "buttonLabel",
                  label: "标签",
                  controlType: "COMPUTE_VALUE",
                  defaultValue: "Action",
                  updateHook: updateDerivedColumnsHook,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                },
                {
                  propertyName: "menuButtonLabel",
                  label: "标签",
                  controlType: "COMPUTE_VALUE",
                  defaultValue: "Open Menu",
                  updateHook: updateDerivedColumnsHook,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.MENU_BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                },
                {
                  propertyName: "buttonColor",
                  getStylesheetValue: getPrimaryColumnStylesheetValue,
                  label: "按钮颜色",
                  controlType: "PRIMARY_COLUMNS_COLOR_PICKER",
                  helpText: "修改按钮颜色",
                  isJSConvertible: true,
                  customJSControl: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.BUTTON,
                      ColumnTypes.ICON_BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        regex: /^(?![<|{{]).+/,
                      },
                    },
                  },
                  isTriggerProperty: false,
                },
                {
                  propertyName: "buttonVariant",
                  label: "按钮类型",
                  controlType: "DROP_DOWN",
                  customJSControl: "COMPUTE_VALUE",
                  defaultValue: ButtonVariantTypes.PRIMARY,
                  isJSConvertible: true,
                  helpText: "Sets the variant",
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.BUTTON,
                      ColumnTypes.ICON_BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  options: [
                    {
                      label: "主按钮",
                      value: ButtonVariantTypes.PRIMARY,
                    },
                    {
                      label: "次级按钮",
                      value: ButtonVariantTypes.SECONDARY,
                    },
                    {
                      label: "文本按钮",
                      value: ButtonVariantTypes.TERTIARY,
                    },
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        default: ButtonVariantTypes.PRIMARY,
                        allowedValues: [
                          ButtonVariantTypes.PRIMARY,
                          ButtonVariantTypes.SECONDARY,
                          ButtonVariantTypes.TERTIARY,
                        ],
                      },
                    },
                  },
                },
                {
                  propertyName: "borderRadius",
                  label: "边框圆角",
                  customJSControl: "COMPUTE_VALUE",
                  isJSConvertible: true,
                  getStylesheetValue: getPrimaryColumnStylesheetValue,
                  helpText:
                    "边框圆角样式",
                  controlType: "BORDER_RADIUS_OPTIONS",
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.ICON_BUTTON,
                      ColumnTypes.MENU_BUTTON,
                      ColumnTypes.BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                    },
                  },
                },
                {
                  propertyName: "boxShadow",
                  label: "阴影",
                  helpText:
                    "组件轮廓投影",
                  controlType: "BOX_SHADOW_OPTIONS",
                  customJSControl: "COMPUTE_VALUE",
                  isJSConvertible: true,
                  updateHook: removeBoxShadowColorProp,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.ICON_BUTTON,
                      ColumnTypes.MENU_BUTTON,
                      ColumnTypes.BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                    },
                  },
                },
                {
                  propertyName: "menuColor",
                  helpText:
                    "Sets the custom color preset based on the menu button variant",
                  label: "Menu Color",
                  controlType: "PRIMARY_COLUMNS_COLOR_PICKER",
                  customJSControl: "COMPUTE_VALUE",
                  isJSConvertible: true,
                  isBindProperty: true,
                  getStylesheetValue: getPrimaryColumnStylesheetValue,
                  isTriggerProperty: false,
                  placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        regex: /^(?![<|{{]).+/,
                      },
                    },
                  },
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.MENU_BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  // Remove menu Style once Custom is Chosen
                  updateHook: updateDerivedColumnsHook,
                },
                {
                  propertyName: "menuVariant",
                  label: "Menu Variant",
                  controlType: "DROP_DOWN",
                  helpText: "Sets the variant of the menu button",
                  options: [
                    {
                      label: "主按钮",
                      value: ButtonVariantTypes.PRIMARY,
                    },
                    {
                      label: "次级按钮",
                      value: ButtonVariantTypes.SECONDARY,
                    },
                    {
                      label: "文本按钮",
                      value: ButtonVariantTypes.TERTIARY,
                    },
                  ],
                  isJSConvertible: true,
                  updateHook: updateDerivedColumnsHook,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.MENU_BUTTON,
                    ]);
                  },
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TEXT,
                    params: {
                      default: ButtonVariantTypes.PRIMARY,
                      allowedValues: [
                        ButtonVariantTypes.PRIMARY,
                        ButtonVariantTypes.SECONDARY,
                        ButtonVariantTypes.TERTIARY,
                      ],
                    },
                  },
                },
                {
                  helpText: "点击按钮时触发",
                  propertyName: "onClick",
                  label: "onClick",
                  controlType: "ACTION_SELECTOR",
                  additionalAutoComplete: (props: TableWidgetProps) => ({
                    currentRow: Object.assign(
                      {},
                      ...Object.keys(props.primaryColumns).map((key) => ({
                        [key]: "",
                      })),
                    ),
                  }),
                  isJSConvertible: true,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: true,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.BUTTON,
                      ColumnTypes.ICON_BUTTON,
                    ]);
                  },
                },
              ],
            },
            {
              sectionName: "菜单配置",
              hidden: (props: TableWidgetProps, propertyPath: string) => {
                return hideByColumnType(
                  props,
                  propertyPath,
                  [ColumnTypes.MENU_BUTTON],
                  true,
                );
              },
              updateHook: updateDerivedColumnsHook,
              children: [
                {
                  helpText: "菜单配置",
                  propertyName: "menuItems",
                  controlType: "MENU_ITEMS",
                  label: "",
                  isBindProperty: false,
                  isTriggerProperty: false,
                  dependencies: ["derivedColumns", "columnOrder"],
                  panelConfig: {
                    editableTitle: true,
                    titlePropertyName: "label",
                    panelIdPropertyName: "id",
                    updateHook: updateDerivedColumnsHook,
                    dependencies: [
                      "primaryColumns",
                      "derivedColumns",
                      "columnOrder",
                    ],
                    children: [
                      {
                        sectionName: "属性",
                        children: [
                          {
                            propertyName: "label",
                            helpText: "设置菜单项标签",
                            label: "标签",
                            controlType: "INPUT_TEXT",
                            placeholderText: "请输入标签",
                            isBindProperty: true,
                            isTriggerProperty: false,
                            validation: { type: ValidationTypes.TEXT },
                            updateHook: updateDerivedColumnsHook,

                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                          {
                            propertyName: "backgroundColor",
                            helpText:
                              "设置菜单项背景颜色",
                            label: "背景颜色",
                            controlType: "PRIMARY_COLUMNS_COLOR_PICKER",
                            isJSConvertible: true,
                            isBindProperty: true,
                            isTriggerProperty: false,
                            updateHook: updateDerivedColumnsHook,

                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                            validation: { type: ValidationTypes.TEXT },
                          },
                          {
                            propertyName: "textColor",
                            helpText: "设置菜单项文本颜色",
                            label: "文本颜色",
                            controlType: "PRIMARY_COLUMNS_COLOR_PICKER",
                            isBindProperty: false,
                            isTriggerProperty: false,
                            updateHook: updateDerivedColumnsHook,

                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                          {
                            propertyName: "isDisabled",
                            helpText: "让组件不可交互",
                            label: "禁用",
                            controlType: "SWITCH",
                            isJSConvertible: true,
                            isBindProperty: true,
                            isTriggerProperty: false,
                            validation: { type: ValidationTypes.BOOLEAN },
                            updateHook: updateDerivedColumnsHook,

                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                          {
                            propertyName: "isVisible",
                            helpText: "控制组件的显示/隐藏",
                            label: "是否显示",
                            controlType: "SWITCH",
                            isJSConvertible: true,
                            isBindProperty: true,
                            isTriggerProperty: false,
                            validation: { type: ValidationTypes.BOOLEAN },
                            updateHook: updateDerivedColumnsHook,

                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                        ],
                      },
                      {
                        sectionName: "图标配置",
                        children: [
                          {
                            propertyName: "iconName",
                            label: "图标",
                            helpText:
                              "设置菜单项的图标",
                            controlType: "ICON_SELECT",
                            isBindProperty: false,
                            isTriggerProperty: false,
                            validation: { type: ValidationTypes.TEXT },
                            updateHook: updateDerivedColumnsHook,
                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                          {
                            propertyName: "iconColor",
                            helpText: "设置菜单项图标颜色",
                            label: "图标颜色",
                            controlType: "PRIMARY_COLUMNS_COLOR_PICKER",
                            isBindProperty: false,
                            isTriggerProperty: false,
                            updateHook: updateDerivedColumnsHook,

                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                          {
                            propertyName: "iconAlign",
                            label: "图标对齐",
                            helpText: "设置菜单项图标对齐方向",
                            controlType: "ICON_TABS",
                            options: [
                              {
                                icon: "VERTICAL_LEFT",
                                value: "left",
                              },
                              {
                                icon: "VERTICAL_RIGHT",
                                value: "right",
                              },
                            ],
                            isBindProperty: false,
                            isTriggerProperty: false,
                            validation: { type: ValidationTypes.TEXT },
                            updateHook: updateDerivedColumnsHook,

                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                        ],
                      },
                      {
                        sectionName: "事件",
                        children: [
                          {
                            helpText:
                              "点击菜单项时触发",
                            propertyName: "onClick",
                            label: "onItemClick",
                            controlType: "ACTION_SELECTOR",
                            isJSConvertible: true,
                            isBindProperty: true,
                            isTriggerProperty: true,
                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        helpText:
          "Assigns a unique column which helps maintain selectedRows and triggeredRows based on value",
        propertyName: "primaryColumnId",
        dependencies: ["primaryColumns"],
        label: "Primary key column",
        controlType: "PRIMARY_COLUMNS_DROPDOWN",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "defaultSearchText",
        label: "Default Search Text",
        controlType: "INPUT_TEXT",
        placeholderText: "{{appsmith.user.name}}",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        helpText: "Selects row(s) by default",
        propertyName: "defaultSelectedRow",
        label: "Default Selected Row",
        controlType: "INPUT_TEXT",
        placeholderText: "0",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: defaultSelectedRowValidation,
            expected: {
              type: "Index of row(s)",
              example: "0 | [0, 1]",
              autocompleteDataType: AutocompleteDataType.STRING,
            },
          },
        },
        dependencies: ["multiRowSelection"],
      },
      {
        propertyName: "compactMode",
        helpText: "Selects row height",
        label: "Default Row Height",
        controlType: "DROP_DOWN",
        defaultValue: "DEFAULT",
        isBindProperty: true,
        isTriggerProperty: false,
        options: [
          {
            label: "Short",
            value: "SHORT",
          },
          {
            label: "Default",
            value: "DEFAULT",
          },
          {
            label: "Tall",
            value: "TALL",
          },
        ],
      },
      {
        helpText:
          "Bind the Table.pageNo property in your API and call it onPageChange",
        propertyName: "serverSidePaginationEnabled",
        label: "服务端分页",
        controlType: "SWITCH",
        isBindProperty: false,
        isTriggerProperty: false,
      },
      {
        helpText: createMessage(TABLE_WIDGET_TOTAL_RECORD_TOOLTIP),
        propertyName: "totalRecordsCount",
        label: "Total Record Count",
        controlType: "INPUT_TEXT",
        placeholderText: "Enter total record count",
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
        hidden: (props: TableWidgetProps) =>
          !!!props.serverSidePaginationEnabled,
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
        helpText: "Controls sorting in View Mode",
        propertyName: "isSortable",
        isJSConvertible: true,
        label: "Sortable",
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
        label: "Enable multi row selection",
        controlType: "SWITCH",
        isBindProperty: false,
        isTriggerProperty: false,
      },
      {
        propertyName: "enableClientSideSearch",
        label: "Enable client side search",
        controlType: "SWITCH",
        isBindProperty: false,
        isTriggerProperty: false,
      },
    ],
  },
  {
    sectionName: "事件",
    children: [
      {
        helpText: "Triggers an action when a table row is selected",
        propertyName: "onRowSelected",
        label: "onRowSelected",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
      {
        helpText: "Triggers an action when a table page is changed",
        propertyName: "onPageChange",
        label: "onPageChange",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
      {
        helpText: "Triggers an action when a table page size is changed",
        propertyName: "onPageSizeChange",
        label: "onPageSizeChange",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
      {
        propertyName: "onSearchTextChanged",
        label: "onSearchTextChanged",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
      {
        helpText: "Triggers an action when a table column is sorted",
        propertyName: "onSort",
        label: "onSort",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
    ],
  },
  {
    sectionName: "Header options",
    children: [
      {
        helpText: "Toggle visibility of the search box",
        propertyName: "isVisibleSearch",
        label: "Search",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        helpText: "Toggle visibility of the filters",
        propertyName: "isVisibleFilters",
        label: "Filters",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        helpText: "Toggle visibility of the data download",
        propertyName: "isVisibleDownload",
        label: "Download",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        helpText: "Toggle visibility of the pagination",
        propertyName: "isVisiblePagination",
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
  },
  {
    sectionName: "样式",
    children: [
      {
        propertyName: "cellBackground",
        label: "Cell Background Color",
        controlType: "COLOR_PICKER",
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns", "derivedColumns"],
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "accentColor",
        label: "强调色",
        controlType: "COLOR_PICKER",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        invisible: true,
      },
      {
        propertyName: "textColor",
        label: "文本颜色",
        controlType: "COLOR_PICKER",
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns", "derivedColumns"],
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "textSize",
        label: "字体大小",
        controlType: "DROP_DOWN",
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns", "derivedColumns"],
        options: [
          {
            label: "S",
            value: "0.875rem",
            subText: "0.875rem",
          },
          {
            label: "M",
            value: "1rem",
            subText: "1rem",
          },
          {
            label: "L",
            value: "1.25rem",
            subText: "1.25rem",
          },
          {
            label: "XL",
            value: "1.875rem",
            subText: "1.875rem",
          },
        ],
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "fontStyle",
        label: "Font Style",
        controlType: "BUTTON_TABS",
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns", "derivedColumns"],
        options: [
          {
            icon: "BOLD_FONT",
            value: "BOLD",
          },
          {
            icon: "ITALICS_FONT",
            value: "ITALIC",
          },
        ],
        isBindProperty: false,
        isTriggerProperty: false,
      },
      {
        propertyName: "horizontalAlignment",
        label: "Text Align",
        controlType: "ICON_TABS",
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns", "derivedColumns"],
        options: [
          {
            icon: "LEFT_ALIGN",
            value: "LEFT",
          },
          {
            icon: "CENTER_ALIGN",
            value: "CENTER",
          },
          {
            icon: "RIGHT_ALIGN",
            value: "RIGHT",
          },
        ],
        defaultValue: "LEFT",
        isBindProperty: false,
        isTriggerProperty: false,
      },
      {
        propertyName: "verticalAlignment",
        label: "Vertical Alignment",
        controlType: "ICON_TABS",
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns", "derivedColumns"],
        options: [
          {
            icon: "VERTICAL_TOP",
            value: "TOP",
          },
          {
            icon: "VERTICAL_CENTER",
            value: "CENTER",
          },
          {
            icon: "VERTICAL_BOTTOM",
            value: "BOTTOM",
          },
        ],
        defaultValue: "CENTER",
        isBindProperty: false,
        isTriggerProperty: false,
      },
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
        helpText:
          "组件轮廓投影",
        controlType: "BOX_SHADOW_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
    ],
  },
] as PropertyPaneConfig[];
