import React from "react";
import { get } from "lodash";
import { Alignment } from "@blueprintjs/core";
import { IconName } from "@blueprintjs/icons";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { ValidationTypes } from "constants/WidgetValidation";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import {
  ButtonVariant,
  ButtonPlacementTypes,
  ButtonPlacement,
  ButtonVariantTypes,
} from "components/constants";
import ButtonGroupComponent from "../component";
import { MinimumPopupRows } from "widgets/constants";
import { getStylesheetValue } from "./helpers";

class ButtonGroupWidget extends BaseWidget<
  ButtonGroupWidgetProps,
  WidgetState
> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "设置组件排列方向",
            propertyName: "orientation",
            label: "排列方向",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "水平",
                value: "horizontal",
              },
              {
                label: "垂直",
                value: "vertical",
              },
            ],
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "控制组件的显示/隐藏",
            propertyName: "isVisible",
            label: "是否显示",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            label: "禁用",
            controlType: "SWITCH",
            helpText: "让组件不可交互",
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
        ],
      },
      {
        sectionName: "按钮",
        children: [
          {
            helpText: "按钮组",
            propertyName: "groupButtons",
            controlType: "GROUP_BUTTONS",
            label: "",
            isBindProperty: false,
            isTriggerProperty: false,
            dependencies: ["childStylesheet"],
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
                      helpText: "设置菜单项标签",
                      label: "标签",
                      controlType: "INPUT_TEXT",
                      placeholderText: "请输入标签",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                    },
                    {
                      propertyName: "buttonType",
                      label: "按钮类型",
                      controlType: "DROP_DOWN",
                      helpText: "设置按钮类型",
                      options: [
                        {
                          label: "普通按钮",
                          value: "SIMPLE",
                        },
                        {
                          label: "菜单按钮",
                          value: "MENU",
                        },
                      ],
                      isJSConvertible: true,
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: {
                        type: ValidationTypes.TEXT,
                        params: {
                          allowedValues: ["SIMPLE", "MENU"],
                        },
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
                  ],
                },
                {
                  sectionName: "图标配置",
                  children: [
                    {
                      propertyName: "iconName",
                      label: "图标",
                      helpText: "选择按钮图标",
                      controlType: "ICON_SELECT",
                      isBindProperty: false,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
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
                      helpText: "设置按钮图标的对齐位置",
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
                  sectionName: "菜单配置",
                  hidden: (
                    props: ButtonGroupWidgetProps,
                    propertyPath: string,
                  ) => {
                    const buttonType = get(
                      props,
                      `${propertyPath}.buttonType`,
                      "",
                    );
                    return buttonType !== "MENU";
                  },
                  children: [
                    {
                      helpText: "菜单配置",
                      propertyName: "menuItems",
                      controlType: "MENU_ITEMS",
                      label: "",
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
                                helpText: "设置菜单项标签",
                                label: "标签",
                                controlType: "INPUT_TEXT",
                                placeholderText: "请输入标签",
                                isBindProperty: true,
                                isTriggerProperty: false,
                                validation: { type: ValidationTypes.TEXT },
                              },

                              {
                                propertyName: "isDisabled",
                                helpText: "禁用菜单项",
                                label: "禁用",
                                controlType: "SWITCH",
                                isJSConvertible: true,
                                isBindProperty: true,
                                isTriggerProperty: false,
                                validation: { type: ValidationTypes.BOOLEAN },
                              },
                              {
                                propertyName: "isVisible",
                                helpText: "控制菜单项是否显示",
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
                                isJSConvertible: true,
                                isBindProperty: true,
                                isTriggerProperty: false,
                                validation: { type: ValidationTypes.TEXT },
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
                  ],
                },
                {
                  sectionName: "事件",
                  hidden: (
                    props: ButtonGroupWidgetProps,
                    propertyPath: string,
                  ) => {
                    const buttonType = get(
                      props,
                      `${propertyPath}.buttonType`,
                      "",
                    );
                    return buttonType === "MENU";
                  },
                  children: [
                    {
                      helpText: "点击按钮时触发",
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
                      getStylesheetValue,
                      propertyName: "buttonColor",
                      helpText: "修改按钮颜色",
                      label: "按钮颜色",
                      controlType: "COLOR_PICKER",
                      isJSConvertible: true,
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "buttonVariant",
            label: "按钮类型",
            controlType: "DROP_DOWN",
            helpText: "设置按钮类型",
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
        ],
      },
    ];
  }

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "数据",
        children: [
          {
            helpText: "按钮组",
            propertyName: "groupButtons",
            controlType: "GROUP_BUTTONS",
            label: "按钮",
            isBindProperty: false,
            isTriggerProperty: false,
            dependencies: ["childStylesheet"],
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
              contentChildren: [
                {
                  sectionName: "数据",
                  children: [
                    {
                      propertyName: "buttonType",
                      label: "按钮类型",
                      controlType: "DROP_DOWN",
                      helpText: "设置按钮类型",
                      options: [
                        {
                          label: "普通按钮",
                          value: "SIMPLE",
                        },
                        {
                          label: "菜单按钮",
                          value: "MENU",
                        },
                      ],
                      isJSConvertible: true,
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: {
                        type: ValidationTypes.TEXT,
                        params: {
                          allowedValues: ["SIMPLE", "MENU"],
                        },
                      },
                    },
                    {
                      hidden: (
                        props: ButtonGroupWidgetProps,
                        propertyPath: string,
                      ) => {
                        const buttonType = get(
                          props,
                          `${propertyPath.split(".", 2).join(".")}.buttonType`,
                          "",
                        );
                        return buttonType !== "MENU";
                      },
                      dependencies: ["groupButtons"],
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
                        contentChildren: [
                          {
                            sectionName: "标签",
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
                              },
                            ],
                          },
                          {
                            sectionName: "属性",
                            children: [
                              {
                                propertyName: "isVisible",
                                helpText: "控制菜单项是否显示",
                                label: "是否显示",
                                controlType: "SWITCH",
                                isJSConvertible: true,
                                isBindProperty: true,
                                isTriggerProperty: false,
                                validation: {
                                  type: ValidationTypes.BOOLEAN,
                                },
                              },
                              {
                                propertyName: "isDisabled",
                                helpText: "禁用菜单项",
                                label: "禁用",
                                controlType: "SWITCH",
                                isJSConvertible: true,
                                isBindProperty: true,
                                isTriggerProperty: false,
                                validation: {
                                  type: ValidationTypes.BOOLEAN,
                                },
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
                                propertyName: "backgroundColor",
                                helpText: "设置菜单项背景颜色",
                                label: "背景颜色",
                                controlType: "COLOR_PICKER",
                                isJSConvertible: true,
                                isBindProperty: true,
                                isTriggerProperty: false,
                                validation: { type: ValidationTypes.TEXT },
                              },
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
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
                {
                  sectionName: "标签",
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
                {
                  sectionName: "事件",
                  hidden: (
                    props: ButtonGroupWidgetProps,
                    propertyPath: string,
                  ) => {
                    const buttonType = get(
                      props,
                      `${propertyPath}.buttonType`,
                      "",
                    );
                    return buttonType === "MENU";
                  },
                  children: [
                    {
                      helpText: "点击按钮时触发",
                      propertyName: "onClick",
                      label: "onClick",
                      controlType: "ACTION_SELECTOR",
                      isJSConvertible: true,
                      isBindProperty: true,
                      isTriggerProperty: true,
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
                      helpText: "选择按钮图标",
                      controlType: "ICON_SELECT",
                      isBindProperty: false,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                    },
                    {
                      propertyName: "iconAlign",
                      label: "位置",
                      helpText: "设置按钮图标的对齐位置",
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
                      getStylesheetValue,
                      propertyName: "buttonColor",
                      helpText: "修改按钮颜色",
                      label: "按钮颜色",
                      controlType: "COLOR_PICKER",
                      isJSConvertible: true,
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
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
            helpText: "控制组件的显示/隐藏",
            propertyName: "isVisible",
            label: "是否显示",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            label: "禁用",
            controlType: "SWITCH",
            helpText: "让组件不可交互",
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
            propertyName: "buttonVariant",
            label: "按钮类型",
            controlType: "DROP_DOWN",
            helpText: "设置按钮类型",
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
            helpText: "设置组件排列方向",
            propertyName: "orientation",
            label: "排列方向",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "水平",
                value: "horizontal",
              },
              {
                label: "垂直",
                value: "vertical",
              },
            ],
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

  handleClick = (onClick: string | undefined, callback: () => void): void => {
    if (onClick) {
      super.executeAction({
        triggerPropertyName: "onClick",
        dynamicString: onClick,
        event: {
          type: EventType.ON_CLICK,
          callback,
        },
      });
    }
  };

  getPageView() {
    const { componentWidth } = this.getComponentDimensions();
    const minPopoverWidth = MinimumPopupRows * this.props.parentColumnSpace;

    return (
      <ButtonGroupComponent
        borderRadius={this.props.borderRadius}
        boxShadow={this.props.boxShadow}
        buttonClickHandler={this.handleClick}
        buttonVariant={this.props.buttonVariant}
        groupButtons={this.props.groupButtons}
        isDisabled={this.props.isDisabled}
        minPopoverWidth={minPopoverWidth}
        orientation={this.props.orientation}
        renderMode={this.props.renderMode}
        widgetId={this.props.widgetId}
        width={componentWidth}
      />
    );
  }

  static getWidgetType(): string {
    return "BUTTON_GROUP_WIDGET";
  }
}

export interface ButtonGroupWidgetProps extends WidgetProps {
  orientation: string;
  isDisabled: boolean;
  borderRadius?: string;
  boxShadow?: string;
  buttonVariant: ButtonVariant;
  groupButtons: Record<
    string,
    {
      widgetId: string;
      id: string;
      index: number;
      isVisible?: boolean;
      isDisabled?: boolean;
      label?: string;
      buttonType?: string;
      buttonColor?: string;
      iconName?: IconName;
      iconAlign?: Alignment;
      placement?: ButtonPlacement;
      onClick?: string;
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
    }
  >;
}

export default ButtonGroupWidget;
