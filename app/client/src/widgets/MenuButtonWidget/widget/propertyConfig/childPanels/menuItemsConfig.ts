import { ValidationTypes } from "constants/WidgetValidation";

export default {
  editableTitle: true,
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
          helpText: "设置菜单项标签",
          label: "标签",
          controlType: "INPUT_TEXT",
          placeholderText: "下载",
          isBindProperty: true,
          isTriggerProperty: false,
          validation: { type: ValidationTypes.TEXT },
        },
        {
          helpText: "点击菜单项时触发",
          propertyName: "onClick",
          label: "onClick",
          controlType: "ACTION_SELECTOR",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: true,
        },
      ],
    },
    {
      sectionName: "配置",
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
        },
      ],
    },
    {
      sectionName: "颜色配置",
      children: [
        {
          propertyName: "iconColor",
          helpText: "设置菜单项图标颜色",
          label: "图标颜色",
          controlType: "COLOR_PICKER",
          isBindProperty: false,
          isTriggerProperty: false,
        },
        {
          propertyName: "textColor",
          helpText: "设置菜单项文本颜色",
          label: "文本颜色",
          controlType: "COLOR_PICKER",
          isBindProperty: false,
          isTriggerProperty: false,
        },
        {
          propertyName: "backgroundColor",
          helpText: "设置菜单项背景颜色",
          label: "背景颜色",
          controlType: "COLOR_PICKER",
          isBindProperty: false,
          isTriggerProperty: false,
        },
      ],
    },
  ],
};
