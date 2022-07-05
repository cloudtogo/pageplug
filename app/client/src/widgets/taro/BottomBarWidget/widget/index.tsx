import React, { ReactNode } from "react";
import { connect } from "react-redux";
import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import WidgetFactory from "utils/WidgetFactory";
import { ValidationTypes } from "constants/WidgetValidation";
import BottomBarComponent from "../component";
import { RenderMode } from "constants/WidgetConstants";
import { generateClassName } from "utils/generators";
import { getCanvasWidth } from "selectors/editorSelectors";
import { AppState } from "reducers";

export class MBottomBarWidget extends BaseWidget<
  MBottomBarWidgetProps,
  WidgetState
> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "height",
            label: "面板高度（不带单位的数字）",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 80, max: 200 },
            },
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            helpText: "控制显示/隐藏",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
    ];
  }

  renderChildWidget = (childWidgetData: WidgetProps): ReactNode => {
    childWidgetData.parentId = this.props.widgetId;
    childWidgetData.shouldScrollContents = false;
    childWidgetData.canExtend = false;
    childWidgetData.bottomRow = this.props.height;
    childWidgetData.isVisible = this.props.isVisible;
    childWidgetData.containerStyle = "none";
    childWidgetData.minHeight = this.props.height;
    childWidgetData.rightColumn = this.props.mainCanvasWidth;
    return WidgetFactory.createWidget(childWidgetData, this.props.renderMode);
  };

  getChildren(): ReactNode {
    if (this.props.children && this.props.children.length > 0) {
      const children = this.props.children.filter(Boolean);
      return children.length > 0 && children.map(this.renderChildWidget);
    }
  }

  makeModalComponent(content: ReactNode) {
    return (
      <BottomBarComponent
        className={`${generateClassName(this.props.widgetId)}`}
        height={this.props.height}
      >
        {content}
      </BottomBarComponent>
    );
  }

  getCanvasView() {
    let children = this.getChildren();
    children = this.showWidgetName(children, true);
    return this.makeModalComponent(children);
  }

  getPageView() {
    const children = this.getChildren();
    return this.makeModalComponent(children);
  }

  static getWidgetType() {
    return "TARO_BOTTOM_BAR_WIDGET";
  }
}

export interface MBottomBarWidgetProps extends WidgetProps {
  renderMode: RenderMode;
  children?: WidgetProps[];
  height: number;
  showPropertyPane: (widgetId?: string) => void;
  mainCanvasWidth: number;
}

const mapDispatchToProps = (dispatch: any) => ({
  showPropertyPane: (
    widgetId?: string,
    callForDragOrResize?: boolean,
    force = false,
  ) => {
    dispatch({
      type:
        widgetId || callForDragOrResize
          ? ReduxActionTypes.SHOW_PROPERTY_PANE
          : ReduxActionTypes.HIDE_PROPERTY_PANE,
      payload: { widgetId, callForDragOrResize, force },
    });
  },
});

const mapStateToProps = (state: AppState) => {
  const props = {
    mainCanvasWidth: getCanvasWidth(state),
  };
  return props;
};
export default connect(mapStateToProps, mapDispatchToProps)(MBottomBarWidget);
