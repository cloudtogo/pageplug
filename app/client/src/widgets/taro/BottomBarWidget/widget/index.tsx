import type { ReactNode } from "react";
import React from "react";
import { connect } from "react-redux";
import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import WidgetFactory from "WidgetProvider/factory/index";
import { ValidationTypes } from "constants/WidgetValidation";
import BottomBarComponent from "../component";
import type { RenderMode } from "constants/WidgetConstants";
import { generateClassName } from "utils/generators";
import { getCanvasWidth } from "selectors/editorSelectors";
import type { AppState } from "@appsmith/reducers";
import IconSVG from "../icon.svg";
import { WIDGET_TAGS } from "constants/WidgetConstants";

export class MBottomBarWidget extends BaseWidget<
  MBottomBarWidgetProps,
  WidgetState
> {
  static type = "TARO_BOTTOM_BAR_WIDGET";

  static getConfig() {
    return {
      name: "底部面板",
      tags: [WIDGET_TAGS.GERNERAL],
      searchTags: ["bottom bar"],
      iconSVG: IconSVG,
      needsMeta: false,
      isCanvas: true,
      isMobile: true,
    };
  }

  static getDefaults() {
    return {
      widgetName: "bottom_bar",
      rows: 12,
      columns: 64,
      // detachFromLayout is set true for widgets that are not bound to the widgets within the layout.
      // setting it to true will only render the widgets(from sidebar) on the main container without any collision check.
      detachFromLayout: true,
      height: 100,
      children: [],
      version: 1,
      blueprint: {
        view: [
          {
            type: "CANVAS_WIDGET",
            position: { left: 0, top: 0 },
            props: {
              detachFromLayout: true,
              canExtend: false,
              isVisible: true,
              isDisabled: false,
              shouldScrollContents: false,
              children: [],
              version: 1,
            },
          },
        ],
      },
    };
  }

  static getAutoLayoutConfig() {
    return {
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: () => {
            return {
              minWidth: "280px",
              minHeight: "70px",
            };
          },
        },
      ],
      disableResizeHandles: {
        vertical: true,
      },
    };
  }

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
    const childWidget = { ...childWidgetData };
    childWidget.parentId = this.props.widgetId;
    childWidget.shouldScrollContents = false;
    childWidget.canExtend = false;
    childWidget.bottomRow = this.props.height;
    childWidget.containerStyle = "none";
    childWidget.minHeight = this.props.height;
    childWidget.rightColumn = this.props.mainCanvasWidth;
    return WidgetFactory.createWidget(childWidget, this.props.renderMode);
  };

  getChildren(): ReactNode {
    if (this.props.children && this.props.children.length > 0) {
      const children = this.props.children.filter(Boolean);
      return children.length > 0 && children.map(this.renderChildWidget);
    }
  }

  makeComponent(content: ReactNode) {
    return (
      <BottomBarComponent
        className={`${generateClassName(this.props.widgetId)}`}
        height={this.props.height}
      >
        {content}
      </BottomBarComponent>
    );
  }

  getWidgetView() {
    const children = this.getChildren();
    return this.makeComponent(children);
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
