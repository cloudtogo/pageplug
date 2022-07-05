import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import GridComponent, { GridComponentProps } from "../component";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { View } from "@tarojs/components";
import { Skeleton } from "@taroify/core";
import styled from "styled-components";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";

const LoadingContainer = styled(View)<{
  cols?: number;
}>`
  display: grid;
  height: 100%;
  gap: 4px;
  grid-template-columns: repeat(${(props) => props.cols || 2}, 1fr);

  & .taroify-skeleton {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
`;

class GridWidget extends BaseWidget<GridWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "数组，通过 {{}} 进行数据绑定",
            propertyName: "list",
            label: "数据",
            controlType: "INPUT_TEXT",
            placeholderText: '[{ "url": "", title: "" }]',
            inputType: "ARRAY",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.OBJECT_ARRAY,
              params: {
                default: [],
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            propertyName: "gridType",
            label: "内容类型",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "图片+标题",
                value: "I_N",
              },
              {
                label: "图片+标题+描述",
                value: "I_N_D",
              },
              {
                label: "图片+标题+描述+按钮",
                value: "I_N_D_B",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "urlKey",
            label: "图片字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "badgeKey",
            label: "红点字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "titleKey",
            label: "标题字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "descriptionKey",
            label: "描述字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["gridType"],
            hidden: (props: GridWidgetProps) => {
              return props.gridType === "I_N";
            },
          },
          {
            propertyName: "asPrice",
            label: "描述是价格",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
            dependencies: ["gridType"],
            hidden: (props: GridWidgetProps) => {
              return props.gridType === "I_N";
            },
          },
          {
            propertyName: "priceUnit",
            label: "价格单位符号",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["gridType", "asPrice"],
            hidden: (props: GridWidgetProps) => {
              return props.gridType === "I_N" || !props.asPrice;
            },
          },
          {
            propertyName: "buttonText",
            label: "按钮文本",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["gridType"],
            hidden: (props: GridWidgetProps) => {
              return props.gridType !== "I_N_D_B";
            },
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "height",
            label: "图片高度",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "width",
            label: "图片宽度",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "cols",
            label: "列数",
            controlType: "INPUT_TEXT",
            placeholderText: "网格显示多少列",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 2, default: 4 },
            },
          },
          {
            propertyName: "gutter",
            label: "网格间距",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "bordered",
            label: "是否显示边框",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "titleColor",
            label: "标题颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "descriptionColor",
            label: "描述颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
            dependencies: ["gridType"],
            hidden: (props: GridWidgetProps) => {
              return props.gridType === "I_N";
            },
          },
          {
            propertyName: "buttonColor",
            label: "按钮颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
            dependencies: ["gridType"],
            hidden: (props: GridWidgetProps) => {
              return props.gridType !== "I_N_D_B";
            },
          },
        ],
      },
      {
        sectionName: "空数据样式",
        children: [
          {
            propertyName: "emptyPic",
            label: "空数据图片",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "emptyText",
            label: "空数据文案",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "enableEmptyButton",
            label: "显示空数据按钮",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "emptyButtonText",
            label: "按钮文本",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["enableEmptyButton"],
            hidden: (props: GridWidgetProps) => {
              return !props.enableEmptyButton;
            },
          },
          {
            propertyName: "emptyButtonAction",
            label: "按钮动作",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
            dependencies: ["enableEmptyButton"],
            hidden: (props: GridWidgetProps) => {
              return !props.enableEmptyButton;
            },
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            helpText: "点击单元格时触发",
            propertyName: "onItemClicked",
            label: "onItemClicked",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "点击单元格按钮时触发",
            propertyName: "onItemButtonClicked",
            label: "onItemButtonClicked",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
            dependencies: ["gridType"],
            hidden: (props: GridWidgetProps) => {
              return props.gridType !== "I_N_D_B";
            },
          },
        ],
      },
    ];
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      currentItem: undefined,
    };
  }

  onCurrentItemChanged = (item: any, type: "ITEM" | "BUTTON") => {
    const actionName =
      type === "ITEM" ? "onItemClicked" : "onItemButtonClicked";
    const actionScript = this.props[actionName];
    this.props.updateWidgetMetaProperty("currentItem", item, {
      triggerPropertyName: actionName,
      dynamicString: actionScript,
      event: {
        type: EventType.ON_CLICK,
      },
    });
  };

  runAction = (dynamicString: string) => {
    if (dynamicString) {
      super.executeAction({
        triggerPropertyName: "onClick",
        dynamicString,
        event: {
          type: EventType.ON_CLICK,
        },
      });
    }
  };

  getPageView() {
    const { cols, isLoading } = this.props;

    if (isLoading) {
      return (
        <LoadingContainer cols={cols}>
          {Array.from(Array((cols || 2) * 3)).map((a, i) => (
            <Skeleton animation="pulse" key={i} />
          ))}
        </LoadingContainer>
      );
    }

    return (
      <GridComponent
        {...this.props}
        onItemClicked={this.onCurrentItemChanged}
        runAction={this.runAction}
      />
    );
  }

  static getWidgetType(): WidgetType {
    return "TARO_GRID_WIDGET";
  }
}

export interface GridWidgetProps extends WidgetProps, GridComponentProps {}

export default GridWidget;
