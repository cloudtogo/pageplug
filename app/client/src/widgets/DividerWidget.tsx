import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "./BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import DividerComponent from "components/designSystems/blueprint/DividerComponent";
import { ValidationTypes } from "constants/WidgetValidation";
import * as Sentry from "@sentry/react";

class DividerWidget extends BaseWidget<DividerWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "orientation",
            label: "方向",
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
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
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
        sectionName: "样式",
        children: [
          {
            helpText: "线条样式",
            propertyName: "strokeStyle",
            label: "风格",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "实线",
                value: "solid",
                icon: "cap-solid",
                iconSize: "large",
              },
              {
                label: "虚线",
                value: "dashed",
                icon: "line-dashed",
                iconSize: "large",
              },
              {
                label: "点线",
                value: "dotted",
                icon: "line-dotted",
                iconSize: "large",
              },
            ],
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "分隔线粗细",
            propertyName: "thickness",
            label: "粗细 (px)",
            controlType: "INPUT_TEXT",
            placeholderText: "输入线条粗细像素值",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0, default: 0 },
            },
          },
          {
            helpText: "分隔线颜色",
            propertyName: "dividerColor",
            label: "颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            helpText: "线条边角类型",
            propertyName: "capType",
            label: "边角",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "无",
                value: "nc",
                icon: "cap-solid",
                iconSize: "large",
              },
              {
                label: "箭头",
                value: "arrow",
                icon: "arrow-forward",
                iconSize: "large",
              },
              {
                label: "点",
                value: "dot",
                icon: "cap-dot",
                iconSize: "large",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            helpText: "控制分隔线边角是否显示",
            propertyName: "capSide",
            label: "",
            controlType: "ICON_TABS",
            options: [
              {
                icon: "DIVIDER_CAP_LEFT",
                value: -1,
              },
              {
                icon: "DIVIDER_CAP_ALL",
                value: 0,
                width: 48,
              },
              {
                icon: "DIVIDER_CAP_RIGHT",
                value: 1,
              },
            ],
            defaultValue: "0",
            isBindProperty: false,
            isTriggerProperty: false,
            hidden: (props: DividerWidgetProps) => props.capType === "nc",
            dependencies: ["capType"],
          },
        ],
      },
    ];
  }

  getPageView() {
    return (
      <DividerComponent
        capSide={this.props.capSide}
        capType={this.props.capType}
        dividerColor={this.props.dividerColor}
        orientation={this.props.orientation}
        strokeStyle={this.props.strokeStyle}
        thickness={this.props.thickness}
        widgetId={this.props.widgetId}
      />
    );
  }

  getWidgetType(): WidgetType {
    return "DIVIDER_WIDGET";
  }
}

export interface DividerWidgetProps extends WidgetProps {
  orientation: string;
  capType: string;
  capSide?: number;
  strokeStyle?: "solid" | "dashed" | "dotted";
  dividerColor?: string;
  thickness?: number;
}

export default DividerWidget;
export const ProfiledDividerWidget = Sentry.withProfiler(DividerWidget);
