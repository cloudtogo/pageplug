import { ValidationTypes } from "constants/WidgetValidation";
import { PropertyPaneConfig } from "constants/PropertyControlConstants";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { MenuItemsSource, MenuButtonWidgetProps } from "../../constants";
import { AutocompleteDataType } from "utils/autocomplete/CodemirrorTernService";
import { sourceDataArrayValidation } from "widgets/MenuButtonWidget/validations";
import configureMenuItemsConfig from "./childPanels/configureMenuItemsConfig";
import menuItemsConfig from "./childPanels/menuItemsConfig";
import { updateMenuItemsSource } from "./propertyUtils";

export default [
  {
    sectionName: "属性",
    children: [
      {
        propertyName: "label",
        helpText: "设置菜单标签",
        label: "标签",
        controlType: "INPUT_TEXT",
        placeholderText: "Open",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "menuItemsSource",
        helpText: "设置菜单项数据源",
        label: "菜单项数据源",
        controlType: "ICON_TABS",
        fullWidth: true,
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
        dependencies: ["sourceData", "configureMenuItems"],
      },
      {
        helpText: "静态菜单配置",
        propertyName: "menuItems",
        controlType: "MENU_ITEMS",
        label: "静态菜单项",
        isBindProperty: false,
        isTriggerProperty: false,
        hidden: (props: MenuButtonWidgetProps) =>
          props.menuItemsSource === MenuItemsSource.DYNAMIC,
        dependencies: ["menuItemsSource"],
        panelConfig: menuItemsConfig,
      },
      {
        helpText: "动态菜单项数组",
        propertyName: "sourceData",
        label: "动态菜单项",
        controlType: "INPUT_TEXT",
        placeholderText: "{{Query1.data}}",
        inputType: "ARRAY",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: sourceDataArrayValidation,
            expected: {
              type: "Array of values",
              example: `['option1', 'option2'] | [{ "label": "label1", "value": "value1" }]`,
              autocompleteDataType: AutocompleteDataType.ARRAY,
            },
          },
        },
        evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
        hidden: (props: MenuButtonWidgetProps) =>
          props.menuItemsSource === MenuItemsSource.STATIC,
        dependencies: ["menuItemsSource"],
      },
      {
        helpText: "配置菜单项的外观",
        propertyName: "configureMenuItems",
        controlType: "OPEN_CONFIG_PANEL",
        buttonConfig: {
          label: "配置",
          icon: "settings-2-line",
        },
        label: "配置菜单项",
        isBindProperty: false,
        isTriggerProperty: false,
        hidden: (props: MenuButtonWidgetProps) =>
          props.menuItemsSource === MenuItemsSource.STATIC || !props.sourceData,
        dependencies: ["menuItemsSource", "sourceData"],
        panelConfig: configureMenuItemsConfig,
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
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
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
        propertyName: "isCompact",
        helpText: "让菜单项显示更紧凑",
        label: "紧凑模式",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
    ],
  },
] as PropertyPaneConfig[];
