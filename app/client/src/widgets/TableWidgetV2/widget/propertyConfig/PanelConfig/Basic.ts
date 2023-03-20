import { ValidationTypes } from "constants/WidgetValidation";
import {
  ColumnTypes,
  ICON_NAMES,
  TableWidgetProps,
} from "widgets/TableWidgetV2/constants";
import {
  hideByColumnType,
  hideByMenuItemsSource,
  hideIfMenuItemsSourceDataIsFalsy,
  updateIconAlignment,
  updateMenuItemsSource,
} from "../../propertyUtils";
import { IconNames } from "@blueprintjs/icons";
import { MenuItemsSource } from "widgets/MenuButtonWidget/constants";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { AutocompleteDataType } from "utils/autocomplete/CodemirrorTernService";
import { sourceDataArrayValidation } from "widgets/MenuButtonWidget/validations";
import configureMenuItemsConfig from "./childPanels/configureMenuItemsConfig";

export default {
  sectionName: "属性",
  hidden: (props: TableWidgetProps, propertyPath: string) => {
    return hideByColumnType(
      props,
      propertyPath,
      [ColumnTypes.BUTTON, ColumnTypes.ICON_BUTTON, ColumnTypes.MENU_BUTTON],
      true,
    );
  },
  children: [
    {
      propertyName: "iconName",
      label: "图标",
      helpText: "设置按钮图标",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [ColumnTypes.ICON_BUTTON]);
      },
      updateHook: updateIconAlignment,
      dependencies: ["primaryColumns", "columnOrder"],
      controlType: "ICON_SELECT",
      customJSControl: "TABLE_COMPUTE_VALUE",
      defaultIconName: "add",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
        params: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: ICON_NAMES,
            default: IconNames.ADD,
          },
        },
      },
    },
    {
      propertyName: "buttonLabel",
      label: "文本",
      helpText: "Sets the label of the button",
      controlType: "TABLE_COMPUTE_VALUE",
      defaultValue: "动作",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [ColumnTypes.BUTTON]);
      },
      dependencies: ["primaryColumns", "columnOrder"],
      isBindProperty: true,
      isTriggerProperty: false,
    },
    {
      propertyName: "menuButtonLabel",
      label: "文本",
      helpText: "Sets the label of the button",
      controlType: "TABLE_COMPUTE_VALUE",
      defaultValue: "打开菜单",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [ColumnTypes.MENU_BUTTON]);
      },
      dependencies: ["primaryColumns", "columnOrder"],
      isBindProperty: true,
      isTriggerProperty: false,
    },
    {
      propertyName: "menuItemsSource",
      helpText: "菜单配置",
      label: "菜单项",
      controlType: "ICON_TABS",
      fullWidth: true,
      defaultValue: MenuItemsSource.STATIC,
      options: [
        {
          label: "静态",
          value: MenuItemsSource.STATIC,
        },
        {
          label: "动态",
          value: MenuItemsSource.DYNAMIC,
        },
      ],
      isJSConvertible: false,
      isBindProperty: false,
      isTriggerProperty: false,
      validation: { type: ValidationTypes.TEXT },
      updateHook: updateMenuItemsSource,
      dependencies: [
        "primaryColumns",
        "columnOrder",
        "sourceData",
        "configureMenuItems",
      ],
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(
          props,
          propertyPath,
          [ColumnTypes.MENU_BUTTON],
          false,
        );
      },
    },
    {
      helpText: "Takes in an array of items to display the menu items.",
      propertyName: "sourceData",
      label: "Source Data",
      controlType: "TABLE_COMPUTE_VALUE",
      placeholderText: "{{Query1.data}}",
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.FUNCTION,
        params: {
          expected: {
            type: "Array of values",
            example: `['option1', 'option2'] | [{ "label": "label1", "value": "value1" }]`,
            autocompleteDataType: AutocompleteDataType.ARRAY,
          },
          fnString: sourceDataArrayValidation.toString(),
        },
      },
      evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return (
          hideByColumnType(
            props,
            propertyPath,
            [ColumnTypes.MENU_BUTTON],
            false,
          ) ||
          hideByMenuItemsSource(props, propertyPath, MenuItemsSource.STATIC)
        );
      },
      dependencies: ["primaryColumns", "columnOrder", "menuItemsSource"],
    },
    {
      helpText: "Configure how each menu item will appear.",
      propertyName: "configureMenuItems",
      controlType: "OPEN_CONFIG_PANEL",
      buttonConfig: {
        label: "Item Configuration",
        icon: "settings-2-line",
      },
      label: "Configure Menu Items",
      isBindProperty: false,
      isTriggerProperty: false,
      hidden: (props: TableWidgetProps, propertyPath: string) =>
        hideByColumnType(
          props,
          propertyPath,
          [ColumnTypes.MENU_BUTTON],
          false,
        ) ||
        hideIfMenuItemsSourceDataIsFalsy(props, propertyPath) ||
        hideByMenuItemsSource(props, propertyPath, MenuItemsSource.STATIC),
      dependencies: [
        "primaryColumns",
        "columnOrder",
        "menuItemsSource",
        "sourceData",
      ],
      panelConfig: configureMenuItemsConfig,
    },
    {
      helpText: "Menu items",
      propertyName: "menuItems",
      controlType: "MENU_ITEMS",
      label: "Menu Items",
      isBindProperty: false,
      isTriggerProperty: false,
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return (
          hideByColumnType(
            props,
            propertyPath,
            [ColumnTypes.MENU_BUTTON],
            false,
          ) ||
          hideByMenuItemsSource(props, propertyPath, MenuItemsSource.DYNAMIC)
        );
      },
      dependencies: ["primaryColumns", "columnOrder"],
      panelConfig: {
        editableTitle: true,
        titlePropertyName: "label",
        panelIdPropertyName: "id",
        dependencies: ["primaryColumns", "columnOrder"],
        contentChildren: [
          {
            sectionName: "属性",
            children: [
              {
                propertyName: "label",
                helpText: "设置菜单项标签",
                label: "文本",
                controlType: "INPUT_TEXT",
                placeholderText: "请输入标签",
                isBindProperty: true,
                isTriggerProperty: false,
                validation: { type: ValidationTypes.TEXT },
                dependencies: ["primaryColumns", "columnOrder"],
              },
              {
                helpText: "点击菜单项时触发",
                propertyName: "onClick",
                label: "onClick",
                controlType: "ACTION_SELECTOR",
                isJSConvertible: true,
                isBindProperty: true,
                isTriggerProperty: true,
                dependencies: ["primaryColumns", "columnOrder"],
              },
            ],
          },
          {
            sectionName: "属性",
            children: [
              {
                propertyName: "isVisible",
                helpText: "控制组件的显示/隐藏",
                label: "是否显示",
                controlType: "SWITCH",
                customJSControl: "TABLE_COMPUTE_VALUE",
                isJSConvertible: true,
                isBindProperty: true,
                isTriggerProperty: false,
                validation: {
                  type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
                  params: {
                    type: ValidationTypes.BOOLEAN,
                  },
                },
                dependencies: ["primaryColumns", "columnOrder"],
              },
              {
                propertyName: "isDisabled",
                helpText: "让组件不可交互",
                label: "禁用",
                controlType: "SWITCH",
                customJSControl: "TABLE_COMPUTE_VALUE",
                isJSConvertible: true,
                isBindProperty: true,
                isTriggerProperty: false,
                validation: {
                  type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
                  params: {
                    type: ValidationTypes.BOOLEAN,
                  },
                },
                dependencies: ["primaryColumns", "columnOrder"],
              },
            ],
          },
        ],
        styleChildren: [
          {
            sectionName: "图标配置",
            children: [
              {
                propertyName: "iconName",
                label: "图标",
                helpText: "设置菜单项的图标",
                controlType: "ICON_SELECT",
                isBindProperty: false,
                isTriggerProperty: false,
                validation: { type: ValidationTypes.TEXT },
                dependencies: ["primaryColumns", "columnOrder"],
              },
              {
                propertyName: "iconAlign",
                label: "位置",
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
                dependencies: ["primaryColumns", "columnOrder"],
              },
            ],
          },
          {
            sectionName: "颜色配置",
            children: [
              {
                propertyName: "textColor",
                helpText: "设置菜单项文本颜色",
                label: "文本颜色",
                controlType: "PRIMARY_COLUMNS_COLOR_PICKER_V2",
                customJSControl: "TABLE_COMPUTE_VALUE",
                isJSConvertible: true,
                isBindProperty: true,
                isTriggerProperty: false,
                dependencies: ["primaryColumns", "columnOrder"],
                validation: {
                  type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
                  params: {
                    type: ValidationTypes.TEXT,
                    params: {
                      regex: /^(?![<|{{]).+/,
                    },
                  },
                },
              },
              {
                propertyName: "backgroundColor",
                helpText: "设置菜单项背景颜色",
                label: "背景颜色",
                controlType: "PRIMARY_COLUMNS_COLOR_PICKER_V2",
                customJSControl: "TABLE_COMPUTE_VALUE",
                isJSConvertible: true,
                isBindProperty: true,
                isTriggerProperty: false,
                dependencies: ["primaryColumns", "columnOrder"],
                validation: {
                  type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
                  params: {
                    type: ValidationTypes.TEXT,
                    params: {
                      regex: /^(?![<|{{]).+/,
                    },
                  },
                },
              },
              {
                propertyName: "iconColor",
                helpText: "设置菜单项图标颜色",
                label: "图标颜色",
                controlType: "PRIMARY_COLUMNS_COLOR_PICKER_V2",
                isBindProperty: false,
                isTriggerProperty: false,
                dependencies: ["primaryColumns", "columnOrder"],
              },
            ],
          },
        ],
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
      dependencies: ["primaryColumns", "columnOrder"],
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
};
