import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import CellComponent from "../component";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { get } from "lodash";

const noMeSubField = (
  props: MCellWidgetProps,
  propertyPath: string,
  field: string,
  current: string,
) => {
  const baseProperty = propertyPath.replace(/\.\w+$/g, "");
  const target = get(props, `${baseProperty}.${field}`, "");
  return target !== current;
};

class MCellWidget extends BaseWidget<MCellWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "内容",
        children: [
          {
            propertyName: "cellsObj",
            label: "单元格列表",
            controlType: "CELLS_INPUT",
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
                  sectionName: "单元格配置",
                  children: [
                    {
                      propertyName: "picType",
                      label: "左侧内容",
                      controlType: "RADIO",
                      options: [
                        {
                          label: "无",
                          value: "none",
                        },
                        {
                          label: "文字",
                          value: "text",
                        },
                        {
                          label: "图标",
                          value: "icon",
                        },
                        {
                          label: "图片",
                          value: "image",
                        },
                      ],
                      columns: 4,
                      defaultValue: "none",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                    },
                    {
                      propertyName: "prefix",
                      label: "左侧文字",
                      controlType: "INPUT_TEXT",
                      placeholderText: "输入左侧文字",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                      dependencies: ["cellsObj"],
                      hidden: (props: MCellWidgetProps, propertyPath: string) =>
                        noMeSubField(props, propertyPath, "picType", "text"),
                    },
                    {
                      propertyName: "icon",
                      label: "图标",
                      controlType: "VANT_ICON_SELECT",
                      isBindProperty: false,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                      dependencies: ["cellsObj"],
                      hidden: (props: MCellWidgetProps, propertyPath: string) =>
                        noMeSubField(props, propertyPath, "picType", "icon"),
                    },
                    {
                      propertyName: "iconColor",
                      label: "图标颜色",
                      controlType: "COLOR_PICKER",
                      isBindProperty: false,
                      isTriggerProperty: false,
                      dependencies: ["cellsObj"],
                      hidden: (props: MCellWidgetProps, propertyPath: string) =>
                        noMeSubField(props, propertyPath, "picType", "icon"),
                    },
                    {
                      propertyName: "picSrc",
                      label: "图片地址",
                      controlType: "INPUT_TEXT",
                      placeholderText: "输入图片地址",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.IMAGE_URL },
                      dependencies: ["cellsObj"],
                      hidden: (props: MCellWidgetProps, propertyPath: string) =>
                        noMeSubField(props, propertyPath, "picType", "image"),
                    },
                    {
                      propertyName: "brief",
                      label: "描述",
                      controlType: "INPUT_TEXT",
                      placeholderText: "输入描述",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                    },
                    {
                      propertyName: "content",
                      label: "右侧内容",
                      controlType: "INPUT_TEXT",
                      placeholderText: "输入右侧内容",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                    },
                    {
                      propertyName: "showArrow",
                      label: "显示右侧箭头",
                      controlType: "SWITCH",
                      isBindProperty: false,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.BOOLEAN },
                    },
                    {
                      propertyName: "isVisible",
                      label: "是否可见",
                      helpText: "控制单元格显示/隐藏",
                      controlType: "SWITCH",
                      useValidationMessage: true,
                      isJSConvertible: true,
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.BOOLEAN },
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
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "inset",
            label: "圆角卡片风格",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "bordered",
            label: "显示外边框",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "title",
            label: "标题",
            controlType: "INPUT_TEXT",
            placeholderText: "输入标题",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            helpText: "控制显示/隐藏",
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

  getCells = () => {
    const cells = Object.values(this.props.cellsObj || {});
    if (cells.length) {
      return cells
        .filter(
          (cell) => cell.isVisible === undefined || !!cell.isVisible === true,
        )
        .sort((cell1, cell2) => cell1.index - cell2.index);
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

  getPageView() {
    return (
      <CellComponent
        title={this.props.title}
        inset={this.props.inset}
        bordered={this.props.bordered}
        cells={this.getCells()}
        runAction={this.runAction}
      />
    );
  }

  static getWidgetType(): WidgetType {
    return "TARO_CELL_WIDGET";
  }
}

export interface MCellWidgetProps extends WidgetProps {
  title?: string;
  inset: boolean;
  bordered: boolean;
  isVisible?: boolean;
  cellsObj: Record<
    string,
    {
      id: string;
      label: string;
      widgetId: string;
      picType: "none" | "icon" | "image" | "text";
      prefix?: string;
      icon?: string;
      iconColor?: string;
      picSrc?: string;
      isVisible?: boolean;
      showArrow?: boolean;
      content?: string;
      brief?: string;
      onClick?: string;
      index: number;
    }
  >;
}

export default MCellWidget;
