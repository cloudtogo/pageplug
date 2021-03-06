import * as React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "./BaseWidget";
import { WidgetType, RenderModes } from "constants/WidgetConstants";
import ImageComponent from "components/designSystems/appsmith/ImageComponent";
import { ValidationTypes } from "constants/WidgetValidation";
import * as Sentry from "@sentry/react";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";

class ImageWidget extends BaseWidget<ImageWidgetProps, WidgetState> {
  constructor(props: ImageWidgetProps) {
    super(props);
    this.onImageClick = this.onImageClick.bind(this);
  }
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "图片地址或者 Base64 数据",
            propertyName: "image",
            label: "图片",
            controlType: "INPUT_TEXT",
            placeholderText: "输入图片 URL / Base64",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.IMAGE_URL },
          },
          {
            propertyName: "defaultImage",
            label: "默认图片",
            controlType: "INPUT_TEXT",
            placeholderText: "输入图片 URL / Base64",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.IMAGE_URL },
          },
          {
            helpText: "控制组件显示/隐藏",
            propertyName: "isVisible",
            label: "是否可见",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "控制图片的最大拉伸倍数",
            propertyName: "maxZoomLevel",
            label: "最大缩放倍数",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "1x (原始尺寸))",
                value: 1,
              },
              {
                label: "2x",
                value: 2,
              },
              {
                label: "4x",
                value: 4,
              },
              {
                label: "8x",
                value: 8,
              },
              {
                label: "16x",
                value: 16,
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { allowedValues: [1, 2, 4, 8, 16] },
            },
          },
          {
            helpText: "设置图片填充父容器的方式",
            propertyName: "objectFit",
            label: "图片填充方式",
            controlType: "DROP_DOWN",
            defaultValue: "contain",
            options: [
              {
                label: "Contain",
                value: "contain",
              },
              {
                label: "Cover",
                value: "cover",
              },
              {
                label: "Auto",
                value: "auto",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ["contain", "cover", "auto"],
              },
            },
          },
          {
            helpText: "是否允许旋转图片",
            propertyName: "enableRotation",
            label: "允许旋转",
            controlType: "SWITCH",
            isJSConvertible: false,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "是否允许下载图片",
            propertyName: "enableDownload",
            label: "允许下载",
            controlType: "SWITCH",
            isJSConvertible: false,
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
            helpText: "当用户点击图片时触发",
            propertyName: "onClick",
            label: "onClick",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  getPageView() {
    const { maxZoomLevel, objectFit } = this.props;
    return (
      <ImageComponent
        defaultImageUrl={this.props.defaultImage}
        disableDrag={(disable: boolean) => {
          this.disableDrag(disable);
        }}
        enableDownload={this.props.enableDownload}
        enableRotation={this.props.enableRotation}
        imageUrl={this.props.image}
        isLoading={this.props.isLoading}
        maxZoomLevel={maxZoomLevel}
        objectFit={objectFit}
        onClick={this.props.onClick ? this.onImageClick : undefined}
        showHoverPointer={this.props.renderMode === RenderModes.PAGE}
        widgetId={this.props.widgetId}
      />
    );
  }

  onImageClick() {
    if (this.props.onClick) {
      super.executeAction({
        triggerPropertyName: "onClick",
        dynamicString: this.props.onClick,
        event: {
          type: EventType.ON_CLICK,
        },
      });
    }
  }

  getWidgetType(): WidgetType {
    return "IMAGE_WIDGET";
  }
}

export type ImageShape = "RECTANGLE" | "CIRCLE" | "ROUNDED";

export interface ImageWidgetProps extends WidgetProps {
  image: string;
  imageShape: ImageShape;
  defaultImage: string;
  maxZoomLevel: number;
  imageRotation?: number;
  enableDownload?: boolean;
  enableRotation?: boolean;
  objectFit: string;
  onClick?: string;
}

export default ImageWidget;
export const ProfiledImageWidget = Sentry.withProfiler(ImageWidget);
