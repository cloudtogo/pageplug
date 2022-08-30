import React from "react";

import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { DerivedPropertiesMap } from "utils/WidgetFactory";

import ProgressComponent from "../component";
import { ProgressType, ProgressVariant } from "../constants";
import { ValidationTypes } from "constants/WidgetValidation";
import { Colors } from "constants/Colors";

class ProgressWidget extends BaseWidget<ProgressWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "是否显示循环加载动画",
            propertyName: "isIndeterminate",
            label: "循环加载",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "设置进度条形状",
            propertyName: "progressType",
            label: "类型",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "环形",
                value: ProgressType.CIRCULAR,
              },
              {
                label: "线形",
                value: ProgressType.LINEAR,
              },
            ],
            defaultValue: ProgressType.LINEAR,
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            helpText: "设置进度值",
            propertyName: "progress",
            label: "进度",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入进度值",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            defaultValue: 50,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0, max: 100, default: 50 },
            },
            hidden: (props: ProgressWidgetProps) => props.isIndeterminate,
            dependencies: ["isIndeterminate"],
          },
          {
            helpText: "整体进度分成若干步骤，设置步骤的数量",
            propertyName: "steps",
            label: "步数",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入步数",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 1, max: 100, default: 1, natural: true },
            },
            hidden: (props: ProgressWidgetProps) => props.isIndeterminate,
            dependencies: ["isIndeterminate"],
          },
          {
            propertyName: "counterClockwise",
            helpText: "设置进度方向是顺时针还是逆时针",
            label: "逆时针",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
            hidden: (props: ProgressWidgetProps) =>
              props.progressType === ProgressType.LINEAR ||
              props.isIndeterminate,
            dependencies: ["isIndeterminate", "progressType"],
          },
          {
            helpText: "同步显示进度值",
            propertyName: "showResult",
            label: "显示进度值",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
            hidden: (props: ProgressWidgetProps) => props.isIndeterminate,
            dependencies: ["isIndeterminate"],
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
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            helpText: "设置进度条的填充颜色",
            propertyName: "fillColor",
            label: "填充颜色",
            controlType: "COLOR_PICKER",
            defaultColor: Colors.GREEN,
            isBindProperty: true,
            isJSConvertible: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                regex: /^(?![<|{{]).+/,
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
            helpText: "是否显示循环加载动画",
            propertyName: "isIndeterminate",
            label: "循环加载",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "设置进度条形状",
            propertyName: "progressType",
            label: "类型",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "环形",
                value: ProgressType.CIRCULAR,
              },
              {
                label: "线形",
                value: ProgressType.LINEAR,
              },
            ],
            defaultValue: ProgressType.LINEAR,
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            helpText: "设置进度值",
            propertyName: "progress",
            label: "进度",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入进度值",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            defaultValue: 50,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0, max: 100, default: 50 },
            },
            hidden: (props: ProgressWidgetProps) => props.isIndeterminate,
            dependencies: ["isIndeterminate"],
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            helpText: "整体进度分成若干步骤，设置步骤的数量",
            propertyName: "steps",
            label: "步数",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入步数",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 1, max: 100, default: 1, natural: true },
            },
            hidden: (props: ProgressWidgetProps) => props.isIndeterminate,
            dependencies: ["isIndeterminate"],
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
            propertyName: "counterClockwise",
            helpText: "设置进度方向是顺时针还是逆时针",
            label: "逆时针",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
            hidden: (props: ProgressWidgetProps) =>
              props.progressType === ProgressType.LINEAR ||
              props.isIndeterminate,
            dependencies: ["isIndeterminate", "progressType"],
          },
          {
            helpText: "同步显示进度值",
            propertyName: "showResult",
            label: "显示进度值",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
            hidden: (props: ProgressWidgetProps) => props.isIndeterminate,
            dependencies: ["isIndeterminate"],
          },
        ],
      },
    ];
  }

  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "颜色配置",
        children: [
          {
            helpText: "设置进度条的填充颜色",
            propertyName: "fillColor",
            label: "填充颜色",
            controlType: "COLOR_PICKER",
            defaultColor: Colors.GREEN,
            isBindProperty: true,
            isJSConvertible: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                regex: /^(?![<|{{]).+/,
              },
            },
          },
        ],
      },
    ];
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {};
  }

  getPageView() {
    const {
      borderRadius,
      counterClockwise,
      fillColor,
      isIndeterminate,
      progress,
      progressType,
      showResult,
      steps,
    } = this.props;
    const { componentHeight, componentWidth } = this.getComponentDimensions();
    const isScaleY = componentHeight > componentWidth;

    return (
      <ProgressComponent
        borderRadius={borderRadius}
        counterClockwise={counterClockwise}
        fillColor={fillColor}
        isScaleY={isScaleY}
        showResult={showResult}
        steps={steps}
        type={progressType}
        value={progress}
        variant={
          isIndeterminate
            ? ProgressVariant.INDETERMINATE
            : ProgressVariant.DETERMINATE
        }
      />
    );
  }

  static getWidgetType(): string {
    return "PROGRESS_WIDGET";
  }
}

export interface ProgressWidgetProps extends WidgetProps {
  isIndeterminate: boolean;
  progressType: ProgressType;
  progress: number;
  steps: number;
  showResult: boolean;
  counterClockwise: boolean;
  fillColor: string;
}

export default ProgressWidget;
