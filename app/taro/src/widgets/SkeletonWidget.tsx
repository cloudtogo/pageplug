import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "./BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import { Skeleton } from "@taroify/core";
import { styled } from "linaria/react";

const Loading = styled(Skeleton)`
  width: 100%;
  height: 100%;
  border-radius: 4px;
`;

class SkeletonWidget extends BaseWidget<SkeletonWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [];
  }
  getPageView() {
    return <Loading animation="pulse" />;
  }

  getWidgetType(): WidgetType {
    return "SKELETON_WIDGET";
  }
}

export interface SkeletonWidgetProps extends WidgetProps {
  isLoading: boolean;
}

export default SkeletonWidget;
export const ProfiledSkeletonWidget = SkeletonWidget;
