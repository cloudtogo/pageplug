import * as React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "../BaseWidget";
import { WidgetType, RenderModes } from "constants/WidgetConstants";
import ImageComponent from "components/designSystems/taro/ImageComponent";
import { ValidationTypes } from "constants/WidgetValidation";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";

class MImageWidget extends BaseWidget<MImageWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "src",
            label: "图片地址",
            controlType: "INPUT_TEXT",
            placeholderText: "输入图片 URL",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.IMAGE_URL },
          },
          {
            helpText: "设置图片填充父容器的方式",
            propertyName: "mode",
            label: "图片填充方式",
            controlType: "DROP_DOWN",
            defaultValue: "aspectFill",
            options: [
              {
                label: "封面模式，保持原始比例",
                value: "aspectFill",
              },
              {
                label: "填充模式，不保持原始比例",
                value: "scaleToFill",
              },
              {
                label: "包含模式，保持原始比例",
                value: "aspectFit",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "isCircle",
            label: "显示为圆形",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "radius",
            label: "圆角大小（默认单位 px）",
            controlType: "INPUT_TEXT",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["isCircle"],
            hidden: (props: MImageWidgetProps) => {
              return !!props.isCircle;
            },
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
    const { src, onClick, mode, isCircle, radius } = this.props;
    return (
      <ImageComponent
        imageUrl={src}
        onClick={onClick ? this.onImageClick : undefined}
        mode={mode}
        isCircle={isCircle}
        radius={radius}
      />
    );
  }

  onImageClick = () => {
    if (this.props.onClick) {
      super.executeAction({
        triggerPropertyName: "onClick",
        dynamicString: this.props.onClick,
        event: {
          type: EventType.ON_CLICK,
        },
      });
    }
  };

  getWidgetType(): WidgetType {
    return "TARO_IMAGE_WIDGET";
  }
}

export type ImageFillMode = "aspectFill" | "scaleToFill" | "aspectFit";

export interface MImageWidgetProps extends WidgetProps {
  src: string;
  mode: ImageFillMode;
  isCircle?: boolean;
  radius?: string;
  onClick?: string;
}

export default MImageWidget;
export const MProfiledImageWidget = MImageWidget;
