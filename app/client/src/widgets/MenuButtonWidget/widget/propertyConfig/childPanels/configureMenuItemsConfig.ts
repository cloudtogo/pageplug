import { ValidationTypes } from "constants/WidgetValidation";
import { ICON_NAMES } from "../../../constants";
import { getSourceDataKeysForEventAutocomplete } from "../../helper";

export default {
  editableTitle: false,
  titlePropertyName: "label",
  panelIdPropertyName: "id",
  updateHook: (props: any, propertyPath: string, propertyValue: string) => {
    return [
      {
        propertyPath,
        propertyValue,
      },
    ];
  },
  contentChildren: [
    {
      sectionName: "属性",
      children: [
        {
          propertyName: "label",
          helpText: "设置菜单项标签，通过 {{currentItem}} 绑定当前菜单项数据",
          label: "标签",
          controlType: "MENU_BUTTON_DYNAMIC_ITEMS",
          placeholderText: "{{currentItem.name}}",
          isBindProperty: true,
          isTriggerProperty: false,
          validation: {
            type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
            params: {
              type: ValidationTypes.TEXT,
            },
          },
          dependencies: ["sourceDataKeys"],
        },
        {
          propertyName: "isVisible",
          helpText:
            "控制组件的显示/隐藏，通过 {{currentItem}} 绑定当前菜单项数据",
          label: "是否显示",
          controlType: "SWITCH",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: false,
          validation: {
            type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
            params: {
              type: ValidationTypes.BOOLEAN,
            },
          },
          customJSControl: "MENU_BUTTON_DYNAMIC_ITEMS",
          dependencies: ["sourceDataKeys"],
        },
        {
          propertyName: "isDisabled",
          helpText: "让组件不可交互，通过 {{currentItem}} 绑定当前菜单项数据",
          label: "禁用",
          controlType: "SWITCH",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: false,
          validation: {
            type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
            params: {
              type: ValidationTypes.BOOLEAN,
            },
          },
          customJSControl: "MENU_BUTTON_DYNAMIC_ITEMS",
          dependencies: ["sourceDataKeys"],
        },
      ],
    },
    {
      sectionName: "事件",
      children: [
        {
          helpText: "点击菜单项时触发，通过 {{currentItem}} 绑定当前菜单项数据",
          propertyName: "onClick",
          label: "onClick",
          controlType: "ACTION_SELECTOR",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: true,
          additionalAutoComplete: getSourceDataKeysForEventAutocomplete,
          dependencies: ["sourceDataKeys"],
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
          helpText: "设置菜单项的图标，通过 {{currentItem}} 绑定当前菜单项数据",
          controlType: "ICON_SELECT",
          isBindProperty: true,
          isTriggerProperty: false,
          isJSConvertible: true,
          validation: {
            type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
            params: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ICON_NAMES,
              },
            },
          },
          customJSControl: "MENU_BUTTON_DYNAMIC_ITEMS",
          dependencies: ["sourceDataKeys"],
        },
        {
          propertyName: "iconAlign",
          label: "位置",
          helpText:
            "设置菜单项图标对齐方向，通过 {{currentItem}} 绑定当前菜单项数据",
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
          isBindProperty: true,
          isTriggerProperty: false,
          isJSConvertible: true,
          validation: {
            type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
            params: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ["center", "left", "right"],
              },
            },
          },
          customJSControl: "MENU_BUTTON_DYNAMIC_ITEMS",
          dependencies: ["sourceDataKeys"],
        },
      ],
    },
    {
      sectionName: "颜色配置",
      children: [
        {
          propertyName: "iconColor",
          helpText:
            "设置菜单项图标颜色，通过 {{currentItem}} 绑定当前菜单项数据",
          label: "图标颜色",
          controlType: "COLOR_PICKER",
          isBindProperty: true,
          isTriggerProperty: false,
          isJSConvertible: true,
          customJSControl: "MENU_BUTTON_DYNAMIC_ITEMS",
          dependencies: ["sourceDataKeys"],
          validation: {
            type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
            params: {
              type: ValidationTypes.TEXT,
              regex: /^(?![<|{{]).+/,
            },
          },
        },
        {
          propertyName: "backgroundColor",
          helpText:
            "设置菜单项背景颜色，通过 {{currentItem}} 绑定当前菜单项数据",
          label: "背景颜色",
          controlType: "COLOR_PICKER",
          isBindProperty: true,
          isTriggerProperty: false,
          isJSConvertible: true,
          customJSControl: "MENU_BUTTON_DYNAMIC_ITEMS",
          dependencies: ["sourceDataKeys"],
          validation: {
            type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
            params: {
              type: ValidationTypes.TEXT,
              regex: /^(?![<|{{]).+/,
            },
          },
        },
        {
          propertyName: "textColor",
          helpText:
            "设置菜单项文本颜色，通过 {{currentItem}} 绑定当前菜单项数据",
          label: "文本颜色",
          controlType: "COLOR_PICKER",
          isBindProperty: true,
          isTriggerProperty: false,
          isJSConvertible: true,
          customJSControl: "MENU_BUTTON_DYNAMIC_ITEMS",
          dependencies: ["sourceDataKeys"],
          validation: {
            type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
            params: {
              type: ValidationTypes.TEXT,
              regex: /^(?![<|{{]).+/,
            },
          },
        },
      ],
    },
  ],
};
