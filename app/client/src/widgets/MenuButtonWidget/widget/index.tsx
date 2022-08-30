import React from "react";

import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import MenuButtonComponent from "../component";
import { ValidationTypes } from "constants/WidgetValidation";
import { Alignment } from "@blueprintjs/core";
import {
  ButtonBorderRadius,
  ButtonVariant,
  ButtonVariantTypes,
  ButtonPlacementTypes,
  ButtonPlacement,
} from "components/constants";
import { IconName } from "@blueprintjs/icons";
import { MinimumPopupRows } from "widgets/constants";
export interface MenuButtonWidgetProps extends WidgetProps {
  label?: string;
  isDisabled?: boolean;
  isVisible?: boolean;
  isCompact?: boolean;
  menuItems: Record<
    string,
    {
      widgetId: string;
      id: string;
      index: number;
      isVisible?: boolean;
      isDisabled?: boolean;
      label?: string;
      backgroundColor?: string;
      textColor?: string;
      iconName?: IconName;
      iconColor?: string;
      iconAlign?: Alignment;
      onClick?: string;
    }
  >;
  menuVariant?: ButtonVariant;
  menuColor?: string;
  borderRadius: ButtonBorderRadius;
  boxShadow?: string;
  iconName?: IconName;
  iconAlign?: Alignment;
  placement?: ButtonPlacement;
}

class MenuButtonWidget extends BaseWidget<MenuButtonWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "label",
            helpText: "设置菜单文本",
            label: "文本",
            controlType: "INPUT_TEXT",
            placeholderText: "输入文本内容",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "menuItems",
            controlType: "MENU_ITEMS",
            label: "菜单项",
            isBindProperty: false,
            isTriggerProperty: false,
            panelConfig: {
              editableTitle: true,
              titlePropertyName: "label",
              panelIdPropertyName: "id",
              updateHook: (
                props: any,
                propertyPath: string,
                propertyValue: string,
              ) => {
                return [
                  {
                    propertyPath,
                    propertyValue,
                  },
                ];
              },
              children: [
                {
                  sectionName: "属性",
                  children: [
                    {
                      propertyName: "label",
                      helpText: "菜单项文本",
                      label: "文本",
                      controlType: "INPUT_TEXT",
                      placeholderText: "输入文本",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                    },
                    {
                      propertyName: "isDisabled",
                      label: "是否禁用",
                      controlType: "SWITCH",
                      isJSConvertible: true,
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.BOOLEAN },
                    },
                    {
                      propertyName: "isVisible",
                      label: "是否可见",
                      controlType: "SWITCH",
                      isJSConvertible: true,
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.BOOLEAN },
                    },
                  ],
                },
                {
                  sectionName: "图标配置",
                  children: [
                    {
                      propertyName: "iconName",
                      label: "图标",
                      helpText: "菜单项图标",
                      controlType: "ICON_SELECT",
                      isBindProperty: false,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                    },
                    {
                      propertyName: "iconAlign",
                      label: "图标对齐",
                      helpText: "菜单项图标对齐方式",
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
                  sectionName: "动作",
                  children: [
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
                  sectionName: "样式",
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
                      propertyName: "backgroundColor",
                      helpText: "设置菜单项背景颜色",
                      label: "背景颜色",
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
                  ],
                },
              ],
            },
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
            helpText: "菜单项占用更少的空间",
            label: "紧凑模式",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "按钮图标",
        children: [
          {
            propertyName: "menuColor",
            helpText: "设置菜单按钮颜色",
            label: "菜单颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "menuVariant",
            label: "菜单按钮类型",
            controlType: "DROP_DOWN",
            helpText: "设置菜单按钮的风格类型",
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
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [
                  ButtonVariantTypes.PRIMARY,
                  ButtonVariantTypes.SECONDARY,
                  ButtonVariantTypes.TERTIARY,
                ],
                default: ButtonVariantTypes.PRIMARY,
              },
            },
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
            helpText: "组件轮廓投影",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "iconName",
            label: "图标",
            helpText: "菜单按钮图标",
            controlType: "ICON_SELECT",
            isBindProperty: false,
            isTriggerProperty: false,
            updateHook: (
              props: MenuButtonWidgetProps,
              propertyPath: string,
              propertyValue: string,
            ) => {
              const propertiesToUpdate = [{ propertyPath, propertyValue }];
              if (!props.iconAlign) {
                propertiesToUpdate.push({
                  propertyPath: "iconAlign",
                  propertyValue: Alignment.LEFT,
                });
              }
              return propertiesToUpdate;
            },
            dependencies: ["iconAlign"],
            validation: {
              type: ValidationTypes.TEXT,
            },
          },
          {
            propertyName: "placement",
            label: "排列方式",
            controlType: "DROP_DOWN",
            helpText: "设置图标与标签的排列方式",
            options: [
              {
                label: "向前对齐",
                value: ButtonPlacementTypes.START,
              },
              {
                label: "两边对齐",
                value: ButtonPlacementTypes.BETWEEN,
              },
              {
                label: "居中对齐",
                value: ButtonPlacementTypes.CENTER,
              },
            ],
            defaultValue: ButtonPlacementTypes.CENTER,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [
                  ButtonPlacementTypes.START,
                  ButtonPlacementTypes.BETWEEN,
                  ButtonPlacementTypes.CENTER,
                ],
                default: ButtonPlacementTypes.CENTER,
              },
            },
          },
          {
            propertyName: "iconAlign",
            label: "图标对齐",
            helpText: "菜单按钮图标对齐方式",
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
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ["center", "left", "right"],
              },
            },
          },
        ],
      },
    ];
  }

  static getPropertyPaneContentConfig() {
    return [
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
            helpText: "菜单配置",
            propertyName: "menuItems",
            controlType: "MENU_ITEMS",
            label: "菜单项",
            isBindProperty: false,
            isTriggerProperty: false,
            panelConfig: {
              editableTitle: true,
              titlePropertyName: "label",
              panelIdPropertyName: "id",
              updateHook: (
                props: any,
                propertyPath: string,
                propertyValue: string,
              ) => {
                return [
                  {
                    propertyPath,
                    propertyValue,
                  },
                ];
              },
              // TODO(aswathkk): Delete the following
              children: [
                {
                  sectionName: "属性",
                  children: [
                    {
                      propertyName: "label",
                      helpText: "设置菜单项标签",
                      label: "标签",
                      controlType: "INPUT_TEXT",
                      placeholderText: "Download",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
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
                      propertyName: "isVisible",
                      helpText: "控制组件的显示/隐藏",
                      label: "是否显示",
                      controlType: "SWITCH",
                      isJSConvertible: true,
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.BOOLEAN },
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
                    },
                  ],
                },
                {
                  sectionName: "事件",
                  children: [
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
                  sectionName: "样式",
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
                      propertyName: "backgroundColor",
                      helpText: "设置菜单项背景颜色",
                      label: "背景颜色",
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
                  ],
                },
              ],
              contentChildren: [
                {
                  sectionName: "属性",
                  children: [
                    {
                      propertyName: "label",
                      helpText: "设置菜单项标签",
                      label: "标签",
                      controlType: "INPUT_TEXT",
                      placeholderText: "Download",
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
            },
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
            helpText: "菜单项占用更少的空间",
            label: "紧凑模式",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
    ];
  }

  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "menuVariant",
            label: "按钮类型",
            controlType: "DROP_DOWN",
            helpText: "设置菜单按钮的风格类型",
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
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [
                  ButtonVariantTypes.PRIMARY,
                  ButtonVariantTypes.SECONDARY,
                  ButtonVariantTypes.TERTIARY,
                ],
                default: ButtonVariantTypes.PRIMARY,
              },
            },
          },
        ],
      },
      {
        sectionName: "图标配置",
        children: [
          {
            propertyName: "iconName",
            label: "图标",
            helpText: "设置菜单按钮图标",
            controlType: "ICON_SELECT",
            isBindProperty: false,
            isTriggerProperty: false,
            updateHook: (
              props: MenuButtonWidgetProps,
              propertyPath: string,
              propertyValue: string,
            ) => {
              const propertiesToUpdate = [{ propertyPath, propertyValue }];
              if (!props.iconAlign) {
                propertiesToUpdate.push({
                  propertyPath: "iconAlign",
                  propertyValue: Alignment.LEFT,
                });
              }
              return propertiesToUpdate;
            },
            dependencies: ["iconAlign"],
            validation: {
              type: ValidationTypes.TEXT,
            },
          },
          {
            propertyName: "iconAlign",
            label: "位置",
            helpText: "设置菜单按钮图标对齐方式",
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
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ["center", "left", "right"],
              },
            },
          },
          {
            propertyName: "placement",
            label: "排列方式",
            controlType: "DROP_DOWN",
            helpText: "设置图标与标签的排列方式",
            options: [
              {
                label: "向前对齐",
                value: ButtonPlacementTypes.START,
              },
              {
                label: "两边对齐",
                value: ButtonPlacementTypes.BETWEEN,
              },
              {
                label: "居中对齐",
                value: ButtonPlacementTypes.CENTER,
              },
            ],
            defaultValue: ButtonPlacementTypes.CENTER,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [
                  ButtonPlacementTypes.START,
                  ButtonPlacementTypes.BETWEEN,
                  ButtonPlacementTypes.CENTER,
                ],
                default: ButtonPlacementTypes.CENTER,
              },
            },
          },
        ],
      },
      {
        sectionName: "颜色配置",
        children: [
          {
            propertyName: "menuColor",
            helpText: "设置菜单按钮颜色",
            label: "按钮颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "轮廓样式",
        children: [
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
            helpText: "组件轮廓投影",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  menuItemClickHandler = (onClick: string | undefined) => {
    if (onClick) {
      super.executeAction({
        triggerPropertyName: "onClick",
        dynamicString: onClick,
        event: {
          type: EventType.ON_CLICK,
        },
      });
    }
  };

  getPageView() {
    const { componentWidth } = this.getComponentDimensions();
    const menuDropDownWidth = MinimumPopupRows * this.props.parentColumnSpace;

    return (
      <MenuButtonComponent
        {...this.props}
        menuDropDownWidth={menuDropDownWidth}
        onItemClicked={this.menuItemClickHandler}
        renderMode={this.props.renderMode}
        width={componentWidth}
      />
    );
  }

  static getWidgetType() {
    return "MENU_BUTTON_WIDGET";
  }
}

export default MenuButtonWidget;
