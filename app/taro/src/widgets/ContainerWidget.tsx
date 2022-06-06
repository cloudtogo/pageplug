import React from "react";
import { map, sortBy, compact } from "lodash";
import {
  GridDefaults,
  CONTAINER_GRID_PADDING,
  WIDGET_PADDING,
  MAIN_CONTAINER_WIDGET_ID,
} from "constants/WidgetConstants";
import WidgetFactory from "utils/WidgetFactory";
import ContainerComponent, {
  ContainerStyle,
} from "components/designSystems/appsmith/ContainerComponent";
import { WidgetType, WidgetTypes } from "constants/WidgetConstants";
import BaseWidget, { WidgetProps, WidgetState } from "./BaseWidget";
import { ValidationTypes } from "constants/WidgetValidation";

class ContainerWidget extends BaseWidget<
  ContainerWidgetProps<WidgetProps>,
  WidgetState
> {
  constructor(props: ContainerWidgetProps<WidgetProps>) {
    super(props);
    this.renderChildWidget = this.renderChildWidget.bind(this);
  }

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "css颜色配置（html颜色名称，HEX，RGB 或 RGBA）",
            placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
            propertyName: "backgroundColor",
            label: "背景颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "控制组件是否可见",
            propertyName: "isVisible",
            label: "是否可见",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "shouldScrollContents",
            label: "是否滚动内容",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
    ];
  }

  getSnapSpaces = () => {
    const { componentWidth } = this.getComponentDimensions();
    // For all widgets inside a container, we remove both container padding as well as widget padding from component width
    let padding = (CONTAINER_GRID_PADDING + WIDGET_PADDING) * 2;
    if (
      this.props.widgetId === MAIN_CONTAINER_WIDGET_ID ||
      this.props.type === "CONTAINER_WIDGET"
    ) {
      //For MainContainer and any Container Widget padding doesn't exist coz there is already container padding.
      padding = CONTAINER_GRID_PADDING * 2;
    }
    if (this.props.noPad) {
      // Widgets like ListWidget choose to have no container padding so will only have widget padding
      padding = WIDGET_PADDING * 2;
    }
    let width = componentWidth;
    width -= padding;
    return {
      snapRowSpace: GridDefaults.DEFAULT_GRID_ROW_HEIGHT,
      snapColumnSpace: componentWidth
        ? width / GridDefaults.DEFAULT_GRID_COLUMNS
        : 0,
    };
  };

  renderChildWidget(childWidgetData: WidgetProps): React.ReactNode {
    // For now, isVisible prop defines whether to render a detached widget
    if (childWidgetData.detachFromLayout && !childWidgetData.isVisible) {
      return null;
    }

    const { componentHeight, componentWidth } = this.getComponentDimensions();

    childWidgetData.rightColumn = componentWidth;
    childWidgetData.bottomRow = this.props.shouldScrollContents
      ? childWidgetData.bottomRow
      : componentHeight;
    childWidgetData.minHeight = componentHeight;
    childWidgetData.isVisible = this.props.isVisible;
    childWidgetData.shouldScrollContents = false;
    childWidgetData.canExtend = this.props.shouldScrollContents;
    childWidgetData.parentId = this.props.widgetId;
    // child widgets need context for connect()
    childWidgetData.context = this.props.context;

    return WidgetFactory.createWidget(childWidgetData, this.props.renderMode);
  }

  renderChildren = () => {
    return map(
      // sort by row so stacking context is correct
      // TODO(abhinav): This is hacky. The stacking context should increase for widgets rendered top to bottom, always.
      // Figure out a way in which the stacking context is consistent.
      sortBy(compact(this.props.children), (child) => child.topRow),
      this.renderChildWidget,
    );
  };

  renderAsContainerComponent(props: ContainerWidgetProps<WidgetProps>) {
    return (
      <ContainerComponent {...props}>
        {/* without the wrapping div onClick events are triggered twice */}
        <>{this.renderChildren()}</>
      </ContainerComponent>
    );
  }

  getPageView() {
    return this.renderAsContainerComponent(this.props);
  }

  getWidgetType(): WidgetType {
    return WidgetTypes.CONTAINER_WIDGET;
  }
}

export interface ContainerWidgetProps<T extends WidgetProps>
  extends WidgetProps {
  children?: T[];
  containerStyle?: ContainerStyle;
  shouldScrollContents?: boolean;
  noPad?: boolean;
}

export default ContainerWidget;
export const ProfiledContainerWidget = ContainerWidget;
