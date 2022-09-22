import React, { ReactNode } from "react";
import { connect } from "react-redux";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import WidgetFactory from "utils/WidgetFactory";
import { ValidationTypes } from "constants/WidgetValidation";
import ModalComponent from "../component";
import { RenderMode } from "constants/WidgetConstants";
import { generateClassName } from "utils/generators";
import { AppState } from "reducers";
import { getCanvasWidth } from "selectors/editorSelectors";

export class MPopupWidget extends BaseWidget<MPopupWidgetProps, WidgetState> {
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
    childWidgetData.parentId = this.props.widgetId;
    childWidgetData.shouldScrollContents = false;
    childWidgetData.canExtend = false;
    childWidgetData.bottomRow = this.props.height;
    childWidgetData.isVisible = this.props.isVisible;
    childWidgetData.containerStyle = "none";
    childWidgetData.minHeight = this.props.height;
    childWidgetData.rightColumn = this.props.mainCanvasWidth;
    // child widgets need context for connect()
    childWidgetData.context = this.props.context;
    return WidgetFactory.createWidget(childWidgetData, this.props.renderMode);
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
        className={generateClassName(this.props.widgetId)}
        height={this.props.height}
        rounded={this.props.rounded}
        isOpen={!!this.props.isVisible}
        onClose={this.closeModal}
        onModalClose={this.onModalClose}
      >
        {content}
      </ModalComponent>
    );
  }

  getPageView() {
    console.log(this.props.mainCanvasWidth)
    const children = this.getChildren();
    return this.makeModalComponent(children);
  }

  static getWidgetType() {
    return "TARO_POPUP_WIDGET";
  }
}

export interface MPopupWidgetProps extends WidgetProps {
  renderMode: RenderMode;
  children?: WidgetProps[];
  canOutsideClickClose?: boolean;
  rounded?: boolean;
  height: number;
  onClose: string;
  mainCanvasWidth: number;
}

const mapStateToProps = (state: AppState) => {
  const props = {
    mainCanvasWidth: getCanvasWidth(state),
  };
  return props;
};
export default connect(mapStateToProps)(MPopupWidget);
