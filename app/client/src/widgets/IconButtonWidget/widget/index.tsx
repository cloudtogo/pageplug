import type { IconName } from "@blueprintjs/icons";
import React from "react";

import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import type { WidgetType } from "constants/WidgetConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";

import { IconNames } from "@blueprintjs/icons";
import type { ButtonVariant } from "components/constants";
import { ButtonVariantTypes } from "components/constants";
import type { Stylesheet } from "entities/AppTheming";
import IconButtonComponent from "../component";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import type { AutocompletionDefinitions } from "widgets/constants";

const ICON_NAMES = Object.keys(IconNames).map(
  (name: string) => IconNames[name as keyof typeof IconNames],
);
export interface IconButtonWidgetProps extends WidgetProps {
  iconName?: IconName;
  backgroundColor: string;
  buttonVariant: ButtonVariant;
  borderRadius: string;
  boxShadow: string;
  boxShadowColor: string;
  isDisabled: boolean;
  isVisible: boolean;
  onClick?: string;
}

class IconButtonWidget extends BaseWidget<IconButtonWidgetProps, WidgetState> {
  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "iconName",
            label: "图标",
            helpText: "设置按钮图标",
            controlType: "ICON_SELECT",
            defaultIconName: "plus",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ICON_NAMES,
                default: IconNames.PLUS,
              },
            },
          },
          {
<<<<<<< HEAD
            helpText: "点击按钮时触发",
=======
            helpText: "when the button is clicked",
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
            propertyName: "onClick",
            label: "onClick",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            helpText: "鼠标交互时显示的提示信息",
            propertyName: "tooltip",
            label: "提示",
            controlType: "INPUT_TEXT",
            placeholderText: "添加输入字段",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "isVisible",
            helpText: "控制组件的显示/隐藏",
            label: "是否显示",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            helpText: "让组件不可交互",
            label: "禁用",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "animateLoading",
            label: "加载时显示动画",
            controlType: "SWITCH",
            helpText: "组件依赖的数据加载时显示加载动画",
            defaultValue: true,
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
        sectionName: "属性",
        children: [
          {
            propertyName: "buttonVariant",
            label: "按钮类型",
            controlType: "ICON_TABS",
            fullWidth: true,
            helpText: "设置图标按钮类型",
            options: [
              {
                label: "主按钮",
                value: ButtonVariantTypes.PRIMARY,
              },
              {
                label: "次级按钮",
                value: ButtonVariantTypes.SECONDARY,
              },
              {
                label: "文本按钮",
                value: ButtonVariantTypes.TERTIARY,
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [
                  ButtonVariantTypes.PRIMARY,
                  ButtonVariantTypes.SECONDARY,
                  ButtonVariantTypes.TERTIARY,
                ],
                default: ButtonVariantTypes.PRIMARY,
              },
            },
          },
        ],
      },
      {
        sectionName: "颜色配置",
        children: [
          {
            propertyName: "buttonColor",
            helpText: "设置按钮颜色",
            label: "按钮颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                regex: /^(?![<|{{]).+/,
              },
            },
          },
        ],
      },
      {
        sectionName: "轮廓样式",
        children: [
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

  static getStylesheetConfig(): Stylesheet {
    return {
      buttonColor: "{{appsmith.theme.colors.primaryColor}}",
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "none",
    };
  }

  getPageView() {
    const {
      borderRadius,
      boxShadow,
      buttonColor,
      buttonVariant,
      iconName,
      isDisabled,
      isVisible,
      tooltip,
      widgetId,
    } = this.props;

    return (
      <IconButtonComponent
        borderRadius={borderRadius}
        boxShadow={boxShadow}
        buttonColor={buttonColor}
        buttonVariant={buttonVariant}
        hasOnClickAction={!!this.props.onClick}
        height={
          (this.props.bottomRow - this.props.topRow) * this.props.parentRowSpace
        }
        iconName={iconName}
        isDisabled={isDisabled}
        isVisible={isVisible}
        onClick={this.handleClick}
        renderMode={this.props.renderMode}
        tooltip={tooltip}
        widgetId={widgetId}
        width={
          (this.props.rightColumn - this.props.leftColumn) *
          this.props.parentColumnSpace
        }
      />
    );
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "Icon button widget is just an icon, along with all other button properties.",
      "!url": "https://docs.appsmith.com/widget-reference/icon-button",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
    };
  }

  static getWidgetType(): WidgetType {
    return "ICON_BUTTON_WIDGET";
  }

  handleClick = () => {
    const { onClick } = this.props;

    if (onClick) {
      super.executeAction({
        triggerPropertyName: "onClick",
        dynamicString: onClick,
        event: {
          type: EventType.ON_CLICK,
        },
      });
    }
  };
}

export default IconButtonWidget;
