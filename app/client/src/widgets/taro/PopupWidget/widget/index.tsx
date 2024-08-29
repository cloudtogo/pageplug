import type { ReactNode } from "react";
import React from "react";
import { connect } from "react-redux";
import { ReduxActionTypes } from "ee/constants/ReduxActionConstants";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import WidgetFactory from "WidgetProvider/factory";
import { ValidationTypes } from "constants/WidgetValidation";
import ModalComponent from "../component";
import type { RenderMode } from "constants/WidgetConstants";
import { generateClassName } from "utils/generators";
import type { AppState } from "ee/reducers";
import { getCanvasWidth } from "selectors/editorSelectors";
import IconSVG from "../icon.svg";
import { WIDGET_TAGS } from "constants/WidgetConstants";

export class MPopupWidget extends BaseWidget<MPopupWidgetProps, WidgetState> {
  static type = "TARO_POPUP_WIDGET";

  static getConfig() {
    return {
      name: "底部弹窗",
      tags: [WIDGET_TAGS.GERNERAL],
      searchTags: ["popup", "dialog", "modal"],
      iconSVG: IconSVG,
      needsMeta: true,
      isCanvas: false,
      isMobile: true,
    };
  }

  static getDefaults() {
    return {
      widgetName: "popup",
      rows: 40,
      columns: 64,
      // detachFromLayout is set true for widgets that are not bound to the widgets within the layout.
      // setting it to true will only render the widgets(from sidebar) on the main container without any collision check.
      detachFromLayout: true,
      canOutsideClickClose: true,
      rounded: true,
      height: 400,
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
            label: "弹窗高度（不带单位的数字）",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 200, max: 800 },
            },
          },
          {
            propertyName: "canOutsideClickClose",
            label: "点击背景关闭",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "rounded",
            label: "圆角风格",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            helpText: "弹窗关闭后触发",
            propertyName: "onClose",
            label: "onClose",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
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

  onModalClose = () => {
    if (this.props.onClose) {
      super.executeAction({
        triggerPropertyName: "onClose",
        dynamicString: this.props.onClose,
        event: {
          type: EventType.ON_MODAL_CLOSE,
        },
      });
    }
  };

  closeModal = () => {
    this.props.showPropertyPane(undefined);
    this.props.updateWidgetMetaProperty("isVisible", false);
  };

  getChildren(): ReactNode {
    if (this.props.children && this.props.children.length > 0) {
      const children = this.props.children.filter(Boolean);
      return children.length > 0 && children.map(this.renderChildWidget);
    }
  }

  makeModalComponent(content: ReactNode) {
    return (
      <ModalComponent
        canOutsideClickClose={!!this.props.canOutsideClickClose}
        className={`${generateClassName(this.props.widgetId)}`}
        height={this.props.height}
        isOpen={!!this.props.isVisible}
        onClose={this.closeModal}
        onModalClose={this.onModalClose}
        rounded={this.props.rounded}
      >
        {content}
      </ModalComponent>
    );
  }

  getWidgetView() {
    const children = this.getChildren();
    return this.makeModalComponent(children);
  }
}

export interface MPopupWidgetProps extends WidgetProps {
  renderMode: RenderMode;
  children?: WidgetProps[];
  canOutsideClickClose?: boolean;
  rounded?: boolean;
  height: number;
  showPropertyPane: (widgetId?: string) => void;
  onClose: string;
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
export default connect(mapStateToProps, mapDispatchToProps)(MPopupWidget);
