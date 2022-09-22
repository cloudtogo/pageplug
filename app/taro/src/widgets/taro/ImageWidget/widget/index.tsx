import * as React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import ImageComponent from "../component";
import { ValidationTypes } from "constants/WidgetValidation";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import LoadingWrapper from "../../LoadingWrapper";

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
            placeholderText: "输入图片地址",
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
            propertyName: "radius",
            label: "圆角大小（默认单位 px）",
            controlType: "INPUT_TEXT",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
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
    const { src, onClick, mode, radius, isLoading } = this.props;
    return (
      <LoadingWrapper isLoading={isLoading}>
        <ImageComponent
          imageUrl={src}
          onClick={onClick ? this.onImageClick : undefined}
          mode={mode}
          radius={radius}
        />
      </LoadingWrapper>
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

  static getWidgetType(): WidgetType {
    return "TARO_IMAGE_WIDGET";
  }
}

export type ImageFillMode = "aspectFill" | "scaleToFill" | "aspectFit";

export interface MImageWidgetProps extends WidgetProps {
  src: string;
  mode: ImageFillMode;
  radius?: string;
  onClick?: string;
}

export default MImageWidget;
