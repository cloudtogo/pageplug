import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import ListComponent, { ListComponentProps } from "../component";
import { ValidationTypes } from "constants/WidgetValidation";
import { DerivedPropertiesMap } from "utils/WidgetFactory";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { View } from "@tarojs/components";
import { Skeleton } from "@taroify/core";
import styled from "styled-components";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";

const LoadingContainer = styled(View)`
  height: 100%;
  overflow: hidden;

  & .taroify-skeleton {
    width: 100%;
    height: 100px;
    border-radius: 4px;
    margin: 20px 0;
  }
`;

class ListWidget extends BaseWidget<MListWidgetProps, WidgetState> {
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
            placeholderText: '[{ "url": "", name: "" }]',
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
            propertyName: "contentType",
            label: "内容类型",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "图片+标题+描述",
                value: "I_N_D",
              },
              {
                label: "图片+标题+描述+价格",
                value: "I_N_D_P",
              },
              {
                label: "图片+标题+描述+价格+控件",
                value: "I_N_D_P_B",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "checkedKey",
            label: "勾选字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["enableCheckbox"],
            hidden: (props: MListWidgetProps) => {
              return !props.enableCheckbox;
            },
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
          },
          {
            propertyName: "priceKey",
            label: "价格字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["contentType"],
            hidden: (props: MListWidgetProps) => {
              return props.contentType === "I_N_D";
            },
          },
          {
            propertyName: "controlType",
            label: "控件类型",
            controlType: "RADIO",
            options: [
              {
                label: "文字",
                value: "TEXT",
              },
              {
                label: "按钮",
                value: "BUTTON",
              },
              {
                label: "数字输入",
                value: "STEPPER",
              },
            ],
            columns: 3,
            defaultValue: "BUTTON",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["contentType"],
            hidden: (props: MListWidgetProps) => {
              return props.contentType !== "I_N_D_P_B";
            },
          },
          {
            propertyName: "controlTextKey",
            label: "文字控件字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["contentType", "controlType"],
            hidden: (props: MListWidgetProps) => {
              return !(
                props.contentType === "I_N_D_P_B" &&
                props.controlType === "TEXT"
              );
            },
          },
          {
            propertyName: "buttonText",
            label: "按钮文本",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["contentType", "controlType"],
            hidden: (props: MListWidgetProps) => {
              return !(
                props.contentType === "I_N_D_P_B" &&
                props.controlType === "BUTTON"
              );
            },
          },
          {
            propertyName: "defaultNumKey",
            label: "数字输入字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["contentType", "controlType"],
            hidden: (props: MListWidgetProps) => {
              return !(
                props.contentType === "I_N_D_P_B" &&
                props.controlType === "STEPPER"
              );
            },
          },
          {
            propertyName: "enableCheckbox",
            label: "显示复选框",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "enableSwipe",
            label: "滑动删除",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "showLoading",
            label: "数据加载时显示加载动画",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "inset",
            label: "圆角风格",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
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
            propertyName: "height",
            label: "图片高度",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
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
          },
          {
            propertyName: "priceColor",
            label: "价格颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
            dependencies: ["contentType"],
            hidden: (props: MListWidgetProps) => {
              return props.contentType === "I_N_D";
            },
          },
          {
            propertyName: "textColor",
            label: "文本控件颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
            dependencies: ["contentType", "controlType"],
            hidden: (props: MListWidgetProps) => {
              return !(
                props.contentType === "I_N_D_P_B" &&
                props.controlType === "TEXT"
              );
            },
          },
          {
            propertyName: "buttonColor",
            label: "按钮颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
            dependencies: ["contentType", "controlType"],
            hidden: (props: MListWidgetProps) => {
              return !(
                props.contentType === "I_N_D_P_B" &&
                props.controlType === "BUTTON"
              );
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
            hidden: (props: MListWidgetProps) => {
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
            hidden: (props: MListWidgetProps) => {
              return !props.enableEmptyButton;
            },
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            helpText: "勾选行时触发",
            propertyName: "onItemChecked",
            label: "onItemChecked",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
            dependencies: ["enableCheckbox"],
            hidden: (props: MListWidgetProps) => {
              return !props.enableCheckbox;
            },
          },
          {
            helpText: "删除行时触发",
            propertyName: "onDeleteClicked",
            label: "onDeleteClicked",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
            dependencies: ["enableSwipe"],
            hidden: (props: MListWidgetProps) => {
              return !props.enableSwipe;
            },
          },
          {
            helpText: "点击行时触发",
            propertyName: "onItemClicked",
            label: "onItemClicked",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "点击行按钮时触发",
            propertyName: "onItemButtonClicked",
            label: "onItemButtonClicked",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
            dependencies: ["contentType", "controlType"],
            hidden: (props: MListWidgetProps) => {
              return !(
                props.contentType === "I_N_D_P_B" &&
                props.controlType === "BUTTON"
              );
            },
          },
          {
            helpText: "数字输入变化时触发",
            propertyName: "onItemStepperChanged",
            label: "onItemStepperChanged",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
            dependencies: ["contentType", "controlType"],
            hidden: (props: MListWidgetProps) => {
              return !(
                props.contentType === "I_N_D_P_B" &&
                props.controlType === "STEPPER"
              );
            },
          },
        ],
      },
    ];
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      data: `{{this.list}}`,
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      currentItem: undefined,
      data: [],
    };
  }

  onCurrentItemChanged = (
    item: any,
    type: "ITEM" | "BUTTON" | "STEPPER" | "CHECKBOX" | "DELETE",
  ) => {
    let actionName = "onItemClicked";
    if (type === "BUTTON") {
      actionName = "onItemButtonClicked";
    } else if (type === "STEPPER") {
      actionName = "onItemStepperChanged";
    } else if (type === "CHECKBOX") {
      actionName = "onItemChecked";
    } else if (type === "DELETE") {
      actionName = "onDeleteClicked";
    }
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
    const { isLoading, showLoading } = this.props;

    if (isLoading && showLoading) {
      return (
        <LoadingContainer>
          {Array.from(Array(6)).map((a, i) => (
            <Skeleton animation="pulse" key={i} />
          ))}
        </LoadingContainer>
      );
    }

    return (
      <ListComponent
        {...this.props}
        onItemClicked={this.onCurrentItemChanged}
        runAction={this.runAction}
      />
    );
  }

  static getWidgetType(): WidgetType {
    return "TARO_LIST_WIDGET";
  }
}

export interface MListWidgetProps extends WidgetProps, ListComponentProps {}

export default ListWidget;
