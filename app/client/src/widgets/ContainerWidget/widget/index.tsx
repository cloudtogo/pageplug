import type { MouseEventHandler } from "react";
import React from "react";
import type { DerivedPropertiesMap } from "WidgetProvider/factory";
import type { ContainerStyle } from "../component";
import ContainerComponent from "../component";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import { ValidationTypes } from "constants/WidgetValidation";
import { compact, get, map, sortBy } from "lodash";
import WidgetsMultiSelectBox from "layoutSystems/fixedlayout/common/widgetGrouping/WidgetsMultiSelectBox";
import type { SetterConfig, Stylesheet } from "entities/AppTheming";
import { getSnappedGrid } from "sagas/WidgetOperationUtils";
import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import {
  isAutoHeightEnabledForWidget,
  DefaultAutocompleteDefinitions,
  isAutoHeightEnabledForWidgetWithLimits,
} from "widgets/WidgetUtils";
import {
  BlueprintOperationTypes,
  type AnvilConfig,
  type AutocompletionDefinitions,
  type AutoLayoutConfig,
  type WidgetBaseConfiguration,
  type WidgetDefaultProps,
  type FlattenedWidgetProps,
} from "WidgetProvider/constants";
import { WIDGET_TAGS } from "constants/WidgetConstants";
import IconSVG from "../icon.svg";
import { ButtonBoxShadowTypes } from "components/constants";
import { Colors } from "constants/Colors";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import { GridDefaults, WidgetHeightLimits } from "constants/WidgetConstants";
import {
  FlexVerticalAlignment,
  Positioning,
  ResponsiveBehavior,
} from "layoutSystems/common/utils/constants";
import { renderAppsmithCanvas } from "layoutSystems/CanvasFactory";
import { generateDefaultLayoutPreset } from "layoutSystems/anvil/layoutComponents/presets/DefaultLayoutPreset";
import type { CanvasWidgetsReduxState } from "reducers/entityReducers/canvasWidgetsReducer";
import { LayoutSystemTypes } from "layoutSystems/types";
import type { LayoutProps } from "layoutSystems/anvil/utils/anvilTypes";
import { getWidgetBluePrintUpdates } from "utils/WidgetBlueprintUtils";

export class ContainerWidget extends BaseWidget<
  ContainerWidgetProps<WidgetProps>,
  WidgetState
> {
  static type = "CONTAINER_WIDGET";

  constructor(props: ContainerWidgetProps<WidgetProps>) {
    super(props);
    this.renderChildWidget = this.renderChildWidget.bind(this);
  }

  static getConfig(): WidgetBaseConfiguration {
    return {
      name: "容器",
      iconSVG: IconSVG,
      tags: [WIDGET_TAGS.GERNERAL],
      isCanvas: true,
      searchTags: ["div", "parent", "group", "container"],
    };
  }

  static getFeatures() {
    return {
      dynamicHeight: {
        sectionIndex: 0,
        active: true,
      },
    };
  }

  static getMethods() {
    return {
      getCanvasHeightOffset: (props: WidgetProps): number => {
        const offset =
          props.borderWidth && props.borderWidth > 1
            ? Math.ceil(
                (2 * parseInt(props.borderWidth, 10) || 0) /
                  GridDefaults.DEFAULT_GRID_ROW_HEIGHT,
              )
            : 0;

        return offset;
      },
    };
  }

  static getDefaults(): WidgetDefaultProps {
    return {
      backgroundColor: "#FFFFFF",
      rows: WidgetHeightLimits.MIN_CANVAS_HEIGHT_IN_ROWS,
      columns: 24,
      widgetName: "Container",
      containerStyle: "card",
      borderColor: Colors.GREY_5,
      borderWidth: "1",
      boxShadow: ButtonBoxShadowTypes.NONE,
      animateLoading: false,
      children: [],
      blueprint: {
        view: [
          {
            type: "CANVAS_WIDGET",
            position: { top: 0, left: 0 },
            props: {
              containerStyle: "none",
              canExtend: false,
              detachFromLayout: true,
              children: [],
            },
          },
        ],
        operations: [
          {
            type: BlueprintOperationTypes.MODIFY_PROPS,
            fn: (
              widget: FlattenedWidgetProps,
              widgets: CanvasWidgetsReduxState,
              parent: FlattenedWidgetProps,
              layoutSystemType: LayoutSystemTypes,
            ) => {
              if (layoutSystemType !== LayoutSystemTypes.ANVIL) {
                return [];
              }

              //get Canvas Widget
              const canvasWidget: FlattenedWidgetProps = get(
                widget,
                "children.0",
              );

              const layout: LayoutProps[] = generateDefaultLayoutPreset();

              return getWidgetBluePrintUpdates({
                [canvasWidget.widgetId]: {
                  layout,
                },
              });
            },
          },
        ],
      },
      version: 1,
      flexVerticalAlignment: FlexVerticalAlignment.Stretch,
      responsiveBehavior: ResponsiveBehavior.Fill,
      minWidth: FILL_WIDGET_MIN_WIDTH,
    };
  }

  static getAutoLayoutConfig(): AutoLayoutConfig {
    return {
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: () => {
            return {
              minWidth: "280px",
              minHeight: "50px",
            };
          },
        },
      ],
      disableResizeHandles: (props: ContainerWidgetProps<WidgetProps>) => ({
        // Disables vertical resize handles for all container widgets except for the List item container
        vertical: !props.isListItemContainer,
      }),
    };
  }

  static getAnvilConfig(): AnvilConfig | null {
    return {
      widgetSize: {
        maxHeight: {},
        maxWidth: {},
        minHeight: { base: "50px" },
        minWidth: { base: "280px" },
      },
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "Containers are used to group widgets together to form logical higher order widgets. Containers let you organize your page better and move all the widgets inside them together.",
      "!url": "https://docs.appsmith.com/widget-reference/container",
      backgroundColor: {
        "!type": "string",
        "!url": "https://docs.appsmith.com/widget-reference/container",
      },
      isVisible: DefaultAutocompleteDefinitions.isVisible,
    };
  }

  static getSetterConfig(): SetterConfig | null {
    return {
      __setters: {
        setVisibility: {
          path: "isVisible",
          type: "boolean",
        },
      },
    };
  }

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "控制组件的显示/隐藏",
            propertyName: "isVisible",
            label: "是否显示",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "允许组件内部内容滚动",
            propertyName: "shouldScrollContents",
            label: "允许内容滚动",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "animateLoading",
            label: "加载时显示动画",
            controlType: "SWITCH",
            helpText: "组件依赖的数据加载时显示加载动画",
            defaultValue: false,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
    ];
  }

  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "颜色配置",
        children: [
          {
            helpText: "使用 html 颜色名称，HEX，RGB 或者 RGBA 值",
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
            helpText: "使用图片 URL 或 Base64 数据",
            placeholderText: "使用图片 URL 或 Base64 数据",
            propertyName: "backgroundImage",
            label: "背景图片",
            controlType: "INPUT_TEXT",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "使用 html 颜色名称，HEX，RGB 或者 RGBA 值",
            placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
            propertyName: "borderColor",
            label: "边框颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "轮廓样式",
        children: [
          {
            helpText: "输入边框宽度",
            propertyName: "borderWidth",
            label: "边框宽度",
            placeholderText: "以 px 为单位",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.NUMBER },
            postUpdateAction: ReduxActionTypes.CHECK_CONTAINERS_FOR_AUTO_HEIGHT,
          },
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText: "边框圆角样式",
            controlType: "BORDER_RADIUS_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "boxShadow",
            label: "阴影",
            helpText: "组件轮廓投影",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }
  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }
  static getMetaPropertiesMap(): Record<string, any> {
    return {};
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "{{appsmith.theme.boxShadow.appBoxShadow}}",
    };
  }

  getSnapSpaces = () => {
    const { componentWidth } = this.props;
    const { snapGrid } = getSnappedGrid(this.props, componentWidth);

    return snapGrid;
  };

  renderChildWidget(childWidgetData: WidgetProps): React.ReactNode {
    const childWidget = { ...childWidgetData };

    const { componentHeight, componentWidth } = this.props;

    childWidget.rightColumn = componentWidth;
    childWidget.bottomRow = this.props.shouldScrollContents
      ? childWidget.bottomRow
      : componentHeight;
    childWidget.minHeight = componentHeight;
    childWidget.shouldScrollContents = false;
    childWidget.canExtend = this.props.shouldScrollContents;

    childWidget.parentId = this.props.widgetId;
    // Pass layout controls to children
    childWidget.positioning =
      childWidget?.positioning || this.props.positioning;
    childWidget.useAutoLayout = this.props.positioning
      ? this.props.positioning === Positioning.Vertical
      : false;

    return renderAppsmithCanvas(childWidget as WidgetProps);
  }

  renderChildren = () => {
    return map(
      // sort by row so stacking context is correct
      // TODO(abhinav): This is hacky. The stacking context should increase for widgets rendered top to bottom, always.
      // Figure out a way in which the stacking context is consistent.
      this.props.positioning !== Positioning.Fixed
        ? this.props.children
        : sortBy(compact(this.props.children), (child) => child.topRow),
      this.renderChildWidget,
    );
  };

  renderAsContainerComponent(props: ContainerWidgetProps<WidgetProps>) {
    const isAutoHeightEnabled: boolean =
      isAutoHeightEnabledForWidget(this.props) &&
      !isAutoHeightEnabledForWidgetWithLimits(this.props) &&
      this.props.positioning !== Positioning.Vertical;

    return (
      <ContainerComponent {...props} noScroll={isAutoHeightEnabled}>
        <WidgetsMultiSelectBox
          {...this.getSnapSpaces()}
          noContainerOffset={!!props.noContainerOffset}
          widgetId={this.props.widgetId}
          widgetType={this.props.type}
        />
        {/* without the wrapping div onClick events are triggered twice */}
        <>{this.renderChildren()}</>
      </ContainerComponent>
    );
  }

  getWidgetView() {
    return this.renderAsContainerComponent(this.props);
  }
}

export interface ContainerWidgetProps<T extends WidgetProps>
  extends WidgetProps {
  children?: T[];
  containerStyle?: ContainerStyle;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onClickCapture?: MouseEventHandler<HTMLDivElement>;
  shouldScrollContents?: boolean;
  noPad?: boolean;
  positioning?: Positioning;
}

export default ContainerWidget;
