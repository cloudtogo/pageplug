import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "../BaseWidget";
import { Backdrop, Loading } from "@taroify/core";
import { View } from "@tarojs/components";
import { WidgetType } from "constants/WidgetConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { styled } from 'linaria/react';

const BackdropBox = styled(Backdrop)`
  display: flex;
  align-items: center;
  justify-content: center;
  --backdrop-background-color: transparent;
`;

const LoadingContainer = styled(View)`
  width: 150px;
  height: 150px;
  padding: 12px;
  border-radius: 6px;
  background: #000000bd;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  --loading-color: #fff;
  --loading-text-color: #fff;
`;

class MLoadingWidget extends BaseWidget<MLoadingWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "showLoading",
            label: "显示加载中",
            controlType: "SWITCH",
            helpText: "用于绑定动作的运行状态",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "loadingText",
            label: "加载文案",
            controlType: "INPUT_TEXT",
            placeholderText: "加载中...",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  getBackdrop = () => {
    const { showLoading, loadingText, isLoading } = this.props;
    return (
      <BackdropBox open={showLoading || isLoading}>
        <LoadingContainer>
          <Loading direction="vertical">{loadingText || "加载中..."}</Loading>
        </LoadingContainer>
      </BackdropBox>
    );
  };

  getPageView() {
    return this.getBackdrop();
  }

  getWidgetType(): WidgetType {
    return "TARO_LOADING_WIDGET";
  }
}

export interface MLoadingWidgetProps extends WidgetProps {
  showLoading?: boolean;
}

export default MLoadingWidget;
export const MProfiledLoadingWidget = MLoadingWidget;
