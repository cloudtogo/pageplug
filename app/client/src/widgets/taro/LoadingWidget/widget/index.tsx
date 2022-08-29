import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { Backdrop, Loading } from "@taroify/core";
import { View } from "@tarojs/components";
import { WidgetType } from "constants/WidgetConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import styled from "styled-components";
import { connect } from "react-redux";
import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import { generateClassName } from "utils/generators";
import { selectWidgetInitAction } from "actions/widgetSelectionActions";
import { previewModeSelector } from "selectors/editorSelectors";
import { AppState } from "reducers";

const Container = styled(View)`
  position: fixed;
  top: 60px;
  width: 0;
  height: 0;
`;

const BackdropBox = styled(Backdrop)`
  left: unset;
  right: unset;
  top: 35px;
  width: 450px;
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

const Indicator = styled(View)`
  position: absolute;
  left: -64px;
  width: 60px;
  height: 60px;
  border-radius: 4px;
  top: 4px;
  background: #bdbdbd66;
  border: 2px dashed #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  & .taroify-loading {
    color: #7e7e7e;

    & .taroify-loading__spinner {
      animation: none;
    }
  }
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

  openPropertyPane = (e: any) => {
    const { showPropertyPane, widgetId } = this.props;
    showPropertyPane && showPropertyPane(widgetId);
    e.stopPropagation();
  };

  getCanvasView() {
    const widgetName = this.showWidgetName(null, true);
    const backdrop = this.getBackdrop();
    return (
      <Container className={generateClassName(this.props.widgetId)}>
        {backdrop}
        {this.props.isPreviewMode ? null : (
          <Indicator onClick={this.openPropertyPane}>
            <Loading type="spinner" />
          </Indicator>
        )}
        {widgetName}
      </Container>
    );
  }

  getPageView() {
    return this.getBackdrop();
  }

  static getWidgetType(): WidgetType {
    return "TARO_LOADING_WIDGET";
  }
}

export interface MLoadingWidgetProps extends WidgetProps {
  showLoading?: boolean;
  showPropertyPane?: (widgetId?: string) => void;
  isPreviewMode: boolean;
}

const mapDispatchToProps = (dispatch: any) => ({
  showPropertyPane: (widgetId?: string) => {
    dispatch({
      type: ReduxActionTypes.SHOW_PROPERTY_PANE,
      payload: { widgetId, force: true },
    });
    dispatch(selectWidgetInitAction(widgetId, false));
  },
});

export default connect(
  (state: AppState) => ({
    isPreviewMode: previewModeSelector(state),
  }),
  mapDispatchToProps,
)(MLoadingWidget);
