import React from "react";
import BaseWidget, { WidgetState } from "widgets/BaseWidget";
import { ValidationTypes } from "constants/WidgetValidation";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import IframeComponent from "../component";
import { IframeWidgetProps } from "../constants";

class IframeWidget extends BaseWidget<IframeWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "source",
            helpText: "页面地址",
            label: "地址",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入嵌入的页面地址",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.SAFE_URL,
              params: {
                default: "https://www.example.com",
              },
            },
          },
          {
            propertyName: "srcDoc",
            helpText: "Inline HTML to embed, overriding the src attribute",
            label: "srcDoc",
            controlType: "INPUT_TEXT",
            placeholderText: "<p>Inline HTML</p>",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
            },
          },
          {
            propertyName: "title",
            label: "标题",
            controlType: "INPUT_TEXT",
            placeholderText: "Documentation",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "animateLoading",
            label: "Animate Loading",
            controlType: "SWITCH",
            helpText: "Controls the loading of the widget",
            defaultValue: true,
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
            helpText: "地址变化时触发",
            propertyName: "onURLChanged",
            label: "onURLChanged",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "Triggers an action when the srcDoc is changed",
            propertyName: "onSrcDocChanged",
            label: "onSrcDocChanged",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "Triggers an action when a message event is received",
            propertyName: "onMessageReceived",
            label: "onMessageReceived",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "borderColor",
            label: "边框颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "borderOpacity",
            label: "边框透明度 (%)",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            inputType: "NUMBER",
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0, max: 100, default: 100 },
            },
          },
          {
            propertyName: "borderWidth",
            label: "边框宽度 (px)",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            inputType: "NUMBER",
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0, default: 1 },
            },
          },
          {
            propertyName: "borderRadius",
            label: "Border Radius",
            helpText:
              "Rounds the corners of the icon button's outer border edge",
            controlType: "BORDER_RADIUS_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "boxShadow",
            label: "Box Shadow",
            helpText:
              "Enables you to cast a drop shadow from the frame of the widget",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      message: undefined,
    };
  }

  handleUrlChange = (url: string) => {
    if (url && this.props.onURLChanged) {
      super.executeAction({
        triggerPropertyName: "onURLChanged",
        dynamicString: this.props.onURLChanged,
        event: {
          type: EventType.ON_IFRAME_URL_CHANGED,
        },
      });
    }
  };

  handleSrcDocChange = (srcDoc?: string) => {
    if (srcDoc && this.props.onSrcDocChanged) {
      super.executeAction({
        triggerPropertyName: "onSrcDocChanged",
        dynamicString: this.props.onSrcDocChanged,
        event: {
          type: EventType.ON_IFRAME_SRC_DOC_CHANGED,
        },
      });
    }
  };

  handleMessageReceive = (event: MessageEvent) => {
    this.props.updateWidgetMetaProperty("message", event.data, {
      triggerPropertyName: "onMessageReceived",
      dynamicString: this.props.onMessageReceived,
      event: {
        type: EventType.ON_IFRAME_MESSAGE_RECEIVED,
      },
    });
  };

  getPageView() {
    const {
      borderColor,
      borderOpacity,
      borderWidth,
      renderMode,
      source,
      srcDoc,
      title,
      widgetId,
    } = this.props;

    return (
      <IframeComponent
        borderColor={borderColor}
        borderOpacity={borderOpacity}
        borderRadius={this.props.borderRadius}
        borderWidth={borderWidth}
        boxShadow={this.props.boxShadow}
        onMessageReceived={this.handleMessageReceive}
        onSrcDocChanged={this.handleSrcDocChange}
        onURLChanged={this.handleUrlChange}
        renderMode={renderMode}
        source={source}
        srcDoc={srcDoc}
        title={title}
        widgetId={widgetId}
      />
    );
  }

  static getWidgetType(): string {
    return "IFRAME_WIDGET";
  }
}

export default IframeWidget;
