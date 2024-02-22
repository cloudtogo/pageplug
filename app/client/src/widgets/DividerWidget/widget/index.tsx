import React from "react";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import DividerComponent from "../component";
import { ValidationTypes } from "constants/WidgetValidation";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import { isAutoLayout } from "layoutSystems/autolayout/utils/flexWidgetUtils";
import type {
  AnvilConfig,
  AutocompletionDefinitions,
} from "WidgetProvider/constants";
import type { SetterConfig, Stylesheet } from "entities/AppTheming";
import { Colors } from "constants/Colors";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import { ResponsiveBehavior } from "layoutSystems/common/utils/constants";
import IconSVG from "../icon.svg";

import { WIDGET_TAGS } from "constants/WidgetConstants";

class DividerWidget extends BaseWidget<DividerWidgetProps, WidgetState> {
  static type = "DIVIDER_WIDGET";

  static getConfig() {
    return {
      name: "分隔线",
      iconSVG: IconSVG,
      tags: [WIDGET_TAGS.GERNERAL],
      searchTags: ["line", "divider", "separator"],
    };
  }

  static getDefaults() {
    return {
      rows: 4,
      columns: 20,
      widgetName: "Divider",
      orientation: "horizontal",
      capType: "nc",
      capSide: 0,
      strokeStyle: "solid",
      dividerColor: Colors.GRAY,
      thickness: 2,
      isVisible: true,
      version: 1,
      animateLoading: false,
      responsiveBehavior: ResponsiveBehavior.Fill,
      minWidth: FILL_WIDGET_MIN_WIDTH,
    };
  }

  static getAutoLayoutConfig() {
    return {
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: () => {
            return {
              minWidth: "280px",
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
      widgetSize: {
        maxHeight: {},
        maxWidth: {},
        minHeight: { base: "40px" },
        minWidth: { base: "280px" },
      },
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc": "Divider is a simple UI widget used as a separator",
      "!url": "https://docs.appsmith.com/widget-reference/divider",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      orientation: "string",
      capType: "string",
      capSide: "number",
      strokeStyle: "string",
      dividerColor: "string",
      thickness: "number",
    };
  }

  static getSetterConfig(): SetterConfig {
    return {
      __setters: {
        setVisibility: {
          path: "isVisible",
          type: "boolean",
        },
      },
    };
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
            helpText: "设置组件排列方向",
            propertyName: "orientation",
            label: "方向",
            controlType: "ICON_TABS",
            defaultValue: "horizontal",
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
            hidden: isAutoLayout,
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
              },
              {
                label: "虚线",
                value: "dashed",
                icon: "line-dashed",
              },
              {
                label: "点线",
                value: "dotted",
                icon: "line-dotted",
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
              },
              {
                label: "箭头",
                value: "arrow",
                icon: "arrow-forward",
              },
              {
                label: "点",
                value: "dot",
                icon: "cap-dot",
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
            fullWidth: true,
            options: [
              {
                startIcon: "contract-left-line",
                value: -1,
              },
              {
                startIcon: "column-freeze",
                value: 0,
                width: 48,
              },
              {
                startIcon: "contract-right-line",
                value: 1,
              },
            ],
            defaultValue: 0,
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
    ];
  }

  static getStylesheetConfig(): Stylesheet {
    return {};
  }

  getWidgetView() {
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
