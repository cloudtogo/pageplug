import { ValidationTypes } from "constants/WidgetValidation";
import { ColumnTypes, TableWidgetProps } from "widgets/TableWidgetV2/constants";
import { hideByColumnType } from "../../propertyUtils";

export default {
  sectionName: "菜单配置",
  hidden: (props: TableWidgetProps, propertyPath: string) => {
    return hideByColumnType(
      props,
      propertyPath,
      [ColumnTypes.MENU_BUTTON],
      true,
    );
  },
  children: [
    {
      helpText: "菜单配置",
      propertyName: "menuItems",
      controlType: "MENU_ITEMS",
      label: "",
      isBindProperty: false,
      isTriggerProperty: false,
      dependencies: ["columnOrder"],
      panelConfig: {
        editableTitle: true,
        titlePropertyName: "label",
        panelIdPropertyName: "id",
        dependencies: ["primaryColumns", "columnOrder"],
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
                dependencies: ["primaryColumns", "columnOrder"],
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
                  type: ValidationTypes.TABLE_PROPERTY,
                  params: {
                    type: ValidationTypes.TEXT,
                    params: {
                      regex: /^(?![<|{{]).+/,
                    },
                  },
                },
              },
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
                  type: ValidationTypes.TABLE_PROPERTY,
                  params: {
                    type: ValidationTypes.TEXT,
                    params: {
                      regex: /^(?![<|{{]).+/,
                    },
                  },
                },
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
                  type: ValidationTypes.TABLE_PROPERTY,
                  params: {
                    type: ValidationTypes.BOOLEAN,
                  },
                },
                dependencies: ["primaryColumns", "columnOrder"],
              },
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
                  type: ValidationTypes.TABLE_PROPERTY,
                  params: {
                    type: ValidationTypes.BOOLEAN,
                  },
                },
                dependencies: ["primaryColumns", "columnOrder"],
              },
            ],
          },
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
                propertyName: "iconColor",
                helpText: "设置菜单项图标颜色",
                label: "图标颜色",
                controlType: "PRIMARY_COLUMNS_COLOR_PICKER_V2",
                isBindProperty: false,
                isTriggerProperty: false,
                dependencies: ["primaryColumns", "columnOrder"],
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
                dependencies: ["primaryColumns", "columnOrder"],
              },
            ],
          },
          {
            sectionName: "事件",
            children: [
              {
                helpText: "点击菜单项时触发",
                propertyName: "onClick",
                label: "onItemClick",
                controlType: "ACTION_SELECTOR",
                isJSConvertible: true,
                isBindProperty: true,
                isTriggerProperty: true,
                dependencies: ["primaryColumns", "columnOrder"],
              },
            ],
          },
        ],
      },
    },
  ],
};
