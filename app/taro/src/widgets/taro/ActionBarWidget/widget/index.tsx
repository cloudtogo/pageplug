import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import ActionBar from "../component";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { get } from "lodash";

const noMeSubField = (
  props: MActionBarWidgetProps,
  propertyPath: string,
  field: string,
  current: string,
) => {
  const baseProperty = propertyPath.replace(/\.\w+$/g, "");
  const target = get(props, `${baseProperty}.${field}`, "");
  return target !== current;
};

class MActionBarWidget extends BaseWidget<MActionBarWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "内容",
        children: [
          {
            propertyName: "actionsObj",
            label: "动作单元",
            controlType: "ACTIONS_INPUT",
            isJSConvertible: false,
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
                  sectionName: "配置",
                  children: [
                    {
                      propertyName: "type",
                      label: "类型",
                      controlType: "RADIO",
                      options: [
                        {
                          label: "图标",
                          value: "icon",
                        },
                        {
                          label: "按钮",
                          value: "button",
                        },
                      ],
                      columns: 3,
                      defaultValue: "icon",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                    },
                    {
                      propertyName: "icon",
                      label: "图标",
                      controlType: "VANT_ICON_SELECT",
                      isJSConvertible: true,
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                      dependencies: ["actionsObj"],
                      hidden: (
                        props: MActionBarWidgetProps,
                        propertyPath: string,
                      ) => noMeSubField(props, propertyPath, "type", "icon"),
                    },
                    {
                      propertyName: "badge",
                      label: "小红点提示",
                      controlType: "INPUT_TEXT",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                      dependencies: ["actionsObj"],
                      hidden: (
                        props: MActionBarWidgetProps,
                        propertyPath: string,
                      ) => noMeSubField(props, propertyPath, "type", "icon"),
                    },
                    {
                      propertyName: "color",
                      label: "颜色",
                      controlType: "COLOR_PICKER",
                      isJSConvertible: true,
                      isBindProperty: true,
                      isTriggerProperty: false,
                    },
                    {
                      propertyName: "buttonType",
                      label: "按钮类型",
                      controlType: "RADIO",
                      options: [
                        {
                          label: "浅底色",
                          value: "warning",
                        },
                        {
                          label: "深底色",
                          value: "danger",
                        },
                      ],
                      name: "buttonRadio",
                      columns: 3,
                      defaultValue: "danger",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                      dependencies: ["actionsObj"],
                      hidden: (
                        props: MActionBarWidgetProps,
                        propertyPath: string,
                      ) => noMeSubField(props, propertyPath, "type", "button"),
                    },
                  ],
                },
                {
                  sectionName: "动作",
                  children: [
                    {
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
            },
          },
        ],
      },
    ];
  }

  getActions = () => {
    const list = Object.values(this.props.actionsObj || {});
    if (list.length) {
      return list
        .filter((a) => a.isVisible === undefined || !!a.isVisible === true)
        .sort((a, b) => a.index - b.index);
    }
    return [];
  };

  runAction = (script: string) => {
    if (script) {
      super.executeAction({
        triggerPropertyName: "onClick",
        dynamicString: script,
        event: {
          type: EventType.ON_CLICK,
        },
      });
    }
  };

  onClickAction = (script: string) => () => {
    this.runAction(script);
  };

  getPageView() {
    const actions = this.getActions();
    return (
      <ActionBar>
        {actions.map((action, index) => {
          const { label, type, icon, color, badge, buttonType, onClick } =
            action || {};
          if (type === "icon") {
            return (
              <ActionBar.Icon
                key={index}
                icon={icon}
                color={color}
                badge={{ content: badge }}
                text={label}
                onClick={this.onClickAction(onClick || "")}
              />
            );
          }
          return (
            <ActionBar.Button
              key={index}
              type={buttonType}
              color={color}
              text={label}
              onClick={this.onClickAction(onClick || "")}
            />
          );
        })}
      </ActionBar>
    );
  }

  static getWidgetType(): WidgetType {
    return "TARO_ACTION_BAR_WIDGET";
  }
}

export interface MActionBarWidgetProps extends WidgetProps {
  actionsObj: Record<
    string,
    {
      id: string;
      label: string;
      widgetId: string;
      type: "icon" | "button";
      icon?: string;
      color?: string;
      badge?: string;
      buttonType?: "warning" | "danger";
      isVisible?: boolean;
      onClick?: string;
      index: number;
    }
  >;
}

export default MActionBarWidget;
