import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import DividerComponent from "../component";

import { ValidationTypes } from "constants/WidgetValidation";

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
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "分隔线粗细",
            propertyName: "thickness",
            label: "粗细 (px)",
            controlType: "INPUT_TEXT",
            placeholderText: "5",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
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
            helpText: "线条端点类型",
            propertyName: "capType",
            label: "端点",
            controlType: "DROP_DOWN",
            isJSConvertible: true,
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
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ["nc", "arrow", "dot"],
                required: true,
                default: "nc",
              },
            },
          },
          {
            helpText: "设置线条端点位置",
            propertyName: "capSide",
            label: "端点位置",
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
            helpText: "设置组件排列方向",
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
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            helpText: "分隔线颜色",
            propertyName: "dividerColor",
            label: "颜色",
            controlType: "COLOR_PICKER",
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
            helpText: "设置分隔线风格",
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
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "分隔线粗细",
            propertyName: "thickness",
            label: "粗细 (px)",
            controlType: "INPUT_TEXT",
            placeholderText: "5",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0, default: 0 },
            },
          },
        ],
      },
      {
        sectionName: "端点",
        children: [
          {
            helpText: "线条端点类型",
            propertyName: "capType",
            label: "端点",
            controlType: "DROP_DOWN",
            isJSConvertible: true,
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
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ["nc", "arrow", "dot"],
                required: true,
                default: "nc",
              },
            },
          },
          {
            helpText: "设置线条端点位置",
            propertyName: "capSide",
            label: "端点位置",
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
      />
    );
  }

  static getWidgetType(): WidgetType {
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
