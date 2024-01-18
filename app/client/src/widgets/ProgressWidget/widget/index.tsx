import React from "react";

import type { DerivedPropertiesMap } from "WidgetProvider/factory";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";

import { Colors } from "constants/Colors";
import { ValidationTypes } from "constants/WidgetValidation";
import type { SetterConfig, Stylesheet } from "entities/AppTheming";
import ProgressComponent from "../component";
import { ProgressType, ProgressVariant } from "../constants";
import { isAutoLayout } from "layoutSystems/autolayout/utils/flexWidgetUtils";
import type {
  AnvilConfig,
  AutocompletionDefinitions,
} from "WidgetProvider/constants";
import { WIDGET_TAGS } from "constants/WidgetConstants";
import { ResponsiveBehavior } from "layoutSystems/common/utils/constants";
import IconSVG from "../icon.svg";
class ProgressWidget extends BaseWidget<ProgressWidgetProps, WidgetState> {
  static type = "PROGRESS_WIDGET";

  static getConfig() {
    return {
      name: "进度", // The display name which will be made in uppercase and show in the widgets panel ( can have spaces )
      iconSVG: IconSVG,
      tags: [WIDGET_TAGS.DISPLAY],
      needsMeta: false, // Defines if this widget adds any meta properties
      isCanvas: false, // Defines if this widget has a canvas within in which we can drop other widgets
      searchTags: ["progress", "bar"], // Search tags used in the search bar of the UI
    };
  }

  static getDefaults() {
    return {
      widgetName: "Progress",
      rows: 4,
      columns: 28,
      fillColor: Colors.GREEN,
      isIndeterminate: false,
      showResult: false,
      counterClosewise: false,
      isVisible: true,
      steps: 1,
      progressType: ProgressType.LINEAR,
      progress: 50,
      version: 1,
      responsiveBehavior: ResponsiveBehavior.Fill,
    };
  }

  static getAutoLayoutConfig() {
    return {
      disabledPropsDefaults: {
        progressType: ProgressType.LINEAR,
      },
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: () => {
            return {
              minWidth: "120px",
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
        minWidth: { base: "120px" },
      },
    };
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
            controlType: "ICON_TABS",
            fullWidth: true,
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
            hidden: isAutoLayout,
          },
          {
            helpText: "设置进度值",
            propertyName: "progress",
            label: "进度",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入进度值",
            isBindProperty: true,
            isTriggerProperty: false,
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
            validation: {
              type: ValidationTypes.NUMBER,
              params: {
                min: 1,
                max: 100,
                default: 1,
                natural: true,
                passThroughOnZero: false,
              },
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

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "Progress indicators commonly known as spinners, express an unspecified wait time or display the length of a process.",
      "!url": "https://docs.appsmith.com/widget-reference/progress",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      progress: "number",
    };
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

  static getStylesheetConfig(): Stylesheet {
    return {
      fillColor: "{{appsmith.theme.colors.primaryColor}}",
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    };
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

  static getSetterConfig(): SetterConfig {
    return {
      __setters: {
        setVisibility: {
          path: "isVisible",
          type: "boolean",
        },
        setProgress: {
          path: "progress",
          type: "number",
        },
      },
    };
  }

  getWidgetView() {
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
    const { componentHeight, componentWidth } = this.props;
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
