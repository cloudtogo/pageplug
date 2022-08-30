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
            label: "URL",
            controlType: "INPUT_TEXT",
            placeholderText: "https://www.example.com",
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
            helpText: "直接写 HTML",
            label: "HTML",
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
        sectionName: "动作",
        children: [
          {
            helpText: "URL 变化时触发",
            propertyName: "onURLChanged",
            label: "onURLChanged",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "内联 HTML 变化时触发",
            propertyName: "onSrcDocChanged",
            label: "onSrcDocChanged",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "收到消息时触发",
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
            label: "边框圆角",
            helpText: "边框圆角样式",
            controlType: "BORDER_RADIUS_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "boxShadow",
            label: "阴影",
            helpText: "组件轮廓投影",
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

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "数据",
        children: [
          {
            propertyName: "source",
            helpText: "嵌入页面的地址",
            label: "URL",
            controlType: "INPUT_TEXT",
            placeholderText: "https://www.example.com",
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
            helpText: "直接写 HTML",
            label: "HTML",
            controlType: "INPUT_TEXT",
            placeholderText: "<p>Inline HTML</p>",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
            },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "title",
            helpText: "页面标题",
            label: "标题",
            controlType: "INPUT_TEXT",
            placeholderText: "Documentation",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
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
        sectionName: "事件",
        children: [
          {
            helpText: "URL 变化时触发",
            propertyName: "onURLChanged",
            label: "onURLChanged",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "内联 HTML 变化时触发",
            propertyName: "onSrcDocChanged",
            label: "onSrcDocChanged",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "收到消息时触发",
            propertyName: "onMessageReceived",
            label: "onMessageReceived",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
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
            propertyName: "borderColor",
            label: "边框颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "轮廓样式",
        children: [
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
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText: "边框圆角样式",
            controlType: "BORDER_RADIUS_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "boxShadow",
            label: "阴影",
            helpText: "组件轮廓投影",
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
      messageMetadata: undefined,
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

  handleMessageReceive = ({
    data,
    lastEventId,
    origin,
    ports,
  }: MessageEvent) => {
    this.props.updateWidgetMetaProperty("messageMetadata", {
      lastEventId,
      origin,
      ports,
    });
    this.props.updateWidgetMetaProperty("message", data, {
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
