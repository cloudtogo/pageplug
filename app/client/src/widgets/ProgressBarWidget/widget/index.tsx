import React from "react";

import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { DerivedPropertiesMap } from "utils/WidgetFactory";

import ProgressBarComponent from "../component";

import { ValidationTypes } from "constants/WidgetValidation";
import { Colors } from "constants/Colors";
import { BarType } from "../constants";

class ProgressBarWidget extends BaseWidget<
  ProgressBarWidgetProps,
  WidgetState
> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "Sets progress bar type",
            propertyName: "barType",
            label: "Type",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "Indeterminate",
                value: BarType.INDETERMINATE,
              },
              {
                label: "Determinate",
                value: BarType.DETERMINATE,
              },
            ],
            defaultValue: BarType.INDETERMINATE,
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            helpText: "Provide progress value",
            propertyName: "progress",
            label: "进度",
            controlType: "INPUT_TEXT",
            placeholderText: "Enter progress value",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            defaultValue: 50,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0, max: 100, default: 50 },
            },
          },
          {
            helpText: "Sets a number of steps",
            propertyName: "steps",
            label: "Number of steps",
            controlType: "INPUT_TEXT",
            placeholderText: "Enter number of steps",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 1, max: 100, default: 1, natural: true },
            },
            hidden: (props: ProgressBarWidgetProps) => {
              return props.barType !== BarType.DETERMINATE;
            },
            dependencies: ["barType"],
          },
          {
            helpText: "显示进度值",
            propertyName: "showResult",
            label: "显示进度值",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
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
            helpText: "Controls the progress color of progress bar",
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
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText:
              "边框圆角样式",
            controlType: "BORDER_RADIUS_OPTIONS",
            isBindProperty: true,
            isJSConvertible: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
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
    return (
      <ProgressBarComponent
        barType={this.props.barType}
        borderRadius={this.props.borderRadius}
        fillColor={this.props.fillColor}
        progress={this.props.progress}
        showResult={this.props.showResult}
        steps={this.props.steps}
      />
    );
  }

  static getWidgetType(): string {
    return "PROGRESSBAR_WIDGET";
  }
}

export interface ProgressBarWidgetProps extends WidgetProps {
  progress?: number;
  showResult: boolean;
  fillColor: string;
  barType: BarType;
  steps: number;
  borderRadius?: string;
}

export default ProgressBarWidget;
