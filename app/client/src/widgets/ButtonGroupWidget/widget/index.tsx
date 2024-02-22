import type { Alignment } from "@blueprintjs/core";
import type { IconName } from "@blueprintjs/icons";
import type { ButtonPlacement, ButtonVariant } from "components/constants";
import { ButtonPlacementTypes, ButtonVariantTypes } from "components/constants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import type { SetterConfig, Stylesheet } from "entities/AppTheming";
import { get } from "lodash";
import React from "react";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import { MinimumPopupWidthInPercentage } from "WidgetProvider/constants";
import ButtonGroupComponent from "../component";
import { getStylesheetValue } from "./helpers";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import type {
  AnvilConfig,
  AutocompletionDefinitions,
} from "WidgetProvider/constants";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import { klona as clone } from "klona/full";
import { ResponsiveBehavior } from "layoutSystems/common/utils/constants";
import { BlueprintOperationTypes } from "WidgetProvider/constants";
import IconSVG from "../icon.svg";
import { WIDGET_TAGS, layoutConfigurations } from "constants/WidgetConstants";

class ButtonGroupWidget extends BaseWidget<
  ButtonGroupWidgetProps,
  WidgetState
> {
  static type = "BUTTON_GROUP_WIDGET";

  static getConfig() {
    return {
      name: "按钮组", // The display name which will be made in uppercase and show in the widgets panel ( can have spaces )
      iconSVG: IconSVG,
      needsMeta: false, // Defines if this widget adds any meta properties
      isCanvas: false, // Defines if this widget has a canvas within in which we can drop other widgets
      searchTags: ["click", "submit", "button", "group"], // Search tags used in the search bar of the widgets pane
      tags: [WIDGET_TAGS.BUTTONS],
    };
  }

  static getDefaults() {
    return {
      rows: 4,
      columns: 24,
      widgetName: "ButtonGroup",
      orientation: "horizontal",
      buttonVariant: ButtonVariantTypes.PRIMARY,
      isVisible: true,
      version: 1,
      animateLoading: false,
      responsiveBehavior: ResponsiveBehavior.Fill,
      minWidth: FILL_WIDGET_MIN_WIDTH,
      groupButtons: {
        groupButton1: {
          label: "喜欢",
          iconName: "heart",
          id: "groupButton1",
          widgetId: "",
          buttonType: "SIMPLE",
          placement: "CENTER",
          isVisible: true,
          isDisabled: false,
          index: 0,
          menuItems: {},
        },
        groupButton2: {
          label: "填加",
          iconName: "add",
          id: "groupButton2",
          buttonType: "SIMPLE",
          placement: "CENTER",
          widgetId: "",
          isVisible: true,
          isDisabled: false,
          index: 1,
          menuItems: {},
        },
        groupButton3: {
          label: "更多",
          iconName: "more",
          id: "groupButton3",
          buttonType: "MENU",
          placement: "CENTER",
          widgetId: "",
          isVisible: true,
          isDisabled: false,
          index: 2,
          menuItems: {
            menuItem1: {
              label: "第一项",
              backgroundColor: "#FFFFFF",
              id: "menuItem1",
              widgetId: "",
              onClick: "",
              isVisible: true,
              isDisabled: false,
              index: 0,
            },
            menuItem2: {
              label: "第二项",
              backgroundColor: "#FFFFFF",
              id: "menuItem2",
              widgetId: "",
              onClick: "",
              isVisible: true,
              isDisabled: false,
              index: 1,
            },
            menuItem3: {
              label: "删除",
              iconName: "trash",
              iconColor: "#FFFFFF",
              iconAlign: "right",
              textColor: "#FFFFFF",
              backgroundColor: "#DD4B34",
              id: "menuItem3",
              widgetId: "",
              onClick: "",
              isVisible: true,
              isDisabled: false,
              index: 2,
            },
          },
        },
      },
      blueprint: {
        operations: [
          {
            type: BlueprintOperationTypes.MODIFY_PROPS,
            fn: (widget: WidgetProps & { children?: WidgetProps[] }) => {
              const groupButtons = clone(widget.groupButtons);
              const dynamicBindingPathList: any[] = get(
                widget,
                "dynamicBindingPathList",
                [],
              );

              Object.keys(groupButtons).map((groupButtonKey) => {
                groupButtons[groupButtonKey].buttonColor = get(
                  widget,
                  "childStylesheet.button.buttonColor",
                  "{{appsmith.theme.colors.primaryColor}}",
                );

                dynamicBindingPathList.push({
                  key: `groupButtons.${groupButtonKey}.buttonColor`,
                });
              });

              const updatePropertyMap = [
                {
                  widgetId: widget.widgetId,
                  propertyName: "dynamicBindingPathList",
                  propertyValue: dynamicBindingPathList,
                },
                {
                  widgetId: widget.widgetId,
                  propertyName: "groupButtons",
                  propertyValue: groupButtons,
                },
              ];

              return updatePropertyMap;
            },
          },
        ],
      },
    };
  }

  static getAutoLayoutConfig() {
    return {
      autoDimension: {
        height: true,
      },
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: (props: ButtonGroupWidgetProps) => {
            let minWidth = 120;
            const buttonLength = Object.keys(props.groupButtons).length;
            if (props.orientation === "horizontal") {
              // 120 is the width of the button, 8 is widget padding, 1 is the gap between buttons
              minWidth = 120 * buttonLength + 8 + (buttonLength - 1) * 1;
            }
            return {
              minWidth: `${minWidth}px`,
              minHeight: "40px",
            };
          },
        },
      ],
      disableResizeHandles: {
        vertical: true,
      },
    };
  }

  static getAnvilConfig(): AnvilConfig | null {
    return {
      widgetSize: (props: ButtonGroupWidgetProps) => {
        let minWidth = 120;
        const buttonLength = Object.keys(props.groupButtons).length;
        if (props.orientation === "horizontal") {
          // 120 is the width of the button, 8 is widget padding, 1 is the gap between buttons
          minWidth = 120 * buttonLength + 8 + (buttonLength - 1) * 1;
        }
        return {
          maxHeight: {},
          maxWidth: {},
          minHeight: { base: "40px" },
          minWidth: { base: `${minWidth}px` },
        };
      },
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "The Button group widget represents a set of buttons in a group. Group can have simple buttons or menu buttons with drop-down items.",
      "!url": "https://docs.appsmith.com/widget-reference/button-group",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
    };
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
                      controlType: "ICON_TABS",
                      fullWidth: true,
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
                      defaultValue: "SIMPLE",
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
                                isJSConvertible: true,
                                isBindProperty: true,
                                isTriggerProperty: false,
                                validation: { type: ValidationTypes.TEXT },
                              },
                              {
                                propertyName: "iconAlign",
                                label: "位置",
                                helpText: "设置菜单项图标对齐方向",
                                controlType: "ICON_TABS",
                                fullWidth: false,
                                options: [
                                  {
                                    startIcon: "skip-left-line",
                                    value: "left",
                                  },
                                  {
                                    startIcon: "skip-right-line",
                                    value: "right",
                                  },
                                ],
                                defaultValue: "left",
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
                      isJSConvertible: true,
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                    },
                    {
                      propertyName: "iconAlign",
                      label: "位置",
                      helpText: "设置按钮图标的对齐位置",
                      controlType: "ICON_TABS",
                      fullWidth: false,
                      options: [
                        {
                          startIcon: "skip-left-line",
                          value: "left",
                        },
                        {
                          startIcon: "skip-right-line",
                          value: "right",
                        },
                      ],
                      defaultValue: "left",
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
            defaultValue: false,
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
            controlType: "ICON_TABS",
            fullWidth: true,
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
            defaultValue: ButtonVariantTypes.PRIMARY,
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
            controlType: "ICON_TABS",
            fullWidth: true,
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
            defaultValue: "horizontal",
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

  static getStylesheetConfig(): Stylesheet {
    return {
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "none",
      childStylesheet: {
        button: {
          buttonColor: "{{appsmith.theme.colors.primaryColor}}",
        },
      },
    };
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

  static getSetterConfig(): SetterConfig {
    return {
      __setters: {
        setVisibility: {
          path: "isVisible",
          type: "boolean",
        },
        setDisabled: {
          path: "isDisabled",
          type: "boolean",
        },
      },
    };
  }

  getWidgetView() {
    const { componentWidth } = this.props;
    const minPopoverWidth =
      (MinimumPopupWidthInPercentage / 100) *
      (this.props.mainCanvasWidth ?? layoutConfigurations.MOBILE.maxWidth);

    return (
      <ButtonGroupComponent
        borderRadius={this.props.borderRadius}
        boxShadow={this.props.boxShadow}
        buttonClickHandler={this.handleClick}
        buttonMinWidth={this.isAutoLayoutMode ? 120 : undefined}
        buttonVariant={this.props.buttonVariant}
        groupButtons={this.props.groupButtons}
        isDisabled={this.props.isDisabled}
        minHeight={this.isAutoLayoutMode ? this.props.minHeight : undefined}
        minPopoverWidth={minPopoverWidth}
        orientation={this.props.orientation}
        renderMode={this.props.renderMode}
        widgetId={this.props.widgetId}
        width={componentWidth}
      />
    );
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
