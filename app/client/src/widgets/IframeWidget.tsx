import React from "react";

import BaseWidget, { WidgetProps, WidgetState } from "./BaseWidget";
import { WidgetType, WidgetTypes } from "constants/WidgetConstants";
import IframeComponent from "components/designSystems/blueprint/IframeComponent";
import { ValidationTypes } from "constants/WidgetValidation";
import * as Sentry from "@sentry/react";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import withMeta, { WithMeta } from "./MetaHOC";

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
                default: "https://bing.com",
              },
            },
          },
          {
            propertyName: "title",
            label: "标题",
            controlType: "INPUT_TEXT",
            placeholderText: "页面标题",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
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
            helpText: "接收到消息时触发",
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
            isBindProperty: false,
            isTriggerProperty: false,
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
        ],
      },
    ];
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      message: undefined,
    };
  }

  urlChangedHandler = (url: string) => {
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

  messageReceivedHandler = (event: MessageEvent) => {
    // Accept messages only from the current iframe
    if (!this.props.source?.includes(event.origin)) {
      return;
    }

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
      source,
      title,
      widgetId,
    } = this.props;

    return (
      <IframeComponent
        borderColor={borderColor}
        borderOpacity={borderOpacity}
        borderWidth={borderWidth}
        onMessageReceived={this.messageReceivedHandler}
        onURLChanged={this.urlChangedHandler}
        source={source}
        title={title}
        widgetId={widgetId}
      />
    );
  }

  getWidgetType(): WidgetType {
    return WidgetTypes.IFRAME_WIDGET;
  }
}

export interface IframeWidgetProps extends WidgetProps, WithMeta {
  source: string;
  title?: string;
  onURLChanged?: string;
  onMessageReceived?: string;
  borderColor?: string;
  borderOpacity?: number;
  borderWidth?: number;
  message?: any;
}

export default IframeWidget;
export const ProfiledIframeWidget = Sentry.withProfiler(withMeta(IframeWidget));
