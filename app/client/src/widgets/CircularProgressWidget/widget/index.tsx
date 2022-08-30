import * as React from "react";

import { ValidationTypes } from "constants/WidgetValidation";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";
import CircularProgressComponent, {
  CircularProgressComponentProps,
} from "../component";

interface CircularProgressWidgetProps
  extends WidgetProps,
    CircularProgressComponentProps {
  borderRadius?: string;
}

class CircularProgressWidget extends BaseWidget<
  CircularProgressWidgetProps,
  WidgetState
> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "progress",
            helpText: "设置组件进度值",
            label: "进度",
            controlType: "INPUT_TEXT",
            placeholderText: "进度值：",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            validation: { type: ValidationTypes.NUMBER },
          },
          {
            propertyName: "counterClockwise",
            helpText: "逆时针方向",
            label: "逆时针",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "showResult",
            helpText: "显示进度值",
            label: "显示进度值",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isVisible",
            helpText: "控制组件的显示/隐藏",
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
            propertyName: "fillColor",
            label: "填充颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                regex: /^((?![<|{{]).+){0,1}/,
                expected: {
                  type: "string (HTML 颜色名称，HEX 值)",
                  example: `red | #9C0D38`,
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
          },
        ],
      },
    ];
  }

  getPageView() {
    return (
      <CircularProgressComponent
        counterClockwise={this.props.counterClockwise}
        fillColor={this.props.fillColor}
        progress={this.props.progress}
        showResult={this.props.showResult}
      />
    );
  }

  static getWidgetType() {
    return "CIRCULAR_PROGRESS_WIDGET";
  }
}

export default CircularProgressWidget;
