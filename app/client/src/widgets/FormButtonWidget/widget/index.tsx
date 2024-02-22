import React from "react";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import type { ExecutionResult } from "constants/AppsmithActionConstants/ActionConstants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import type { ButtonType } from "widgets/ButtonWidget/component";
import ButtonComponent from "widgets/ButtonWidget/component";
import { ValidationTypes } from "constants/WidgetValidation";
import ButtonWidget from "widgets/ButtonWidget";
import type {
  ButtonBorderRadius,
  ButtonVariant,
  RecaptchaType,
} from "components/constants";
import {
  ButtonPlacementTypes,
  ButtonVariantTypes,
  RecaptchaTypes,
} from "components/constants";
import type { IconName } from "@blueprintjs/icons";
import { Alignment } from "@blueprintjs/core";
import type { ButtonWidgetProps } from "widgets/ButtonWidget/widget";
import type { Stylesheet } from "entities/AppTheming";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import type {
  AutocompletionDefinitions,
  PropertyUpdates,
  SnipingModeProperty,
} from "WidgetProvider/constants";
import IconSVG from "../icon.svg";

class FormButtonWidget extends ButtonWidget {
  constructor(props: FormButtonWidgetProps) {
    super(props);
  }

  static type = "FORM_BUTTON_WIDGET";

  static getConfig() {
    return {
      name: "表单按钮",
      iconSVG: IconSVG,
      hideCard: true,
      isDeprecated: true,
      replacement: "BUTTON_WIDGET",
      needsMeta: true,
      searchTags: ["button", "submit", "form"],
    } as any; // TODO (Sangeeth): Type error
  }

  static getDefaults() {
    return {
      rows: 4,
      columns: 12,
      widgetName: "FormButton",
      text: "提交",
      isDefaultClickDisabled: true,
      recaptchaType: RecaptchaTypes.V3,
      version: 1,
      animateLoading: false,
    } as any; // TODO (Sangeeth): Type error
  }

  static getMethods() {
    return {
      getSnipingModeUpdates: (
        propValueMap: SnipingModeProperty,
      ): PropertyUpdates[] => {
        return [
          {
            propertyPath: "onClick",
            propertyValue: propValueMap.run,
            isDynamicPropertyPath: true,
          },
        ];
      },
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "Form button is provided by default to every form. It is used for form submission and resetting form inputs",
      "!url": "https://docs.appsmith.com/widget-reference/form",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      text: "string",
      isDisabled: "bool",
      recaptchaToken: "string",
    };
  }

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "通用配置",
        children: [
          {
            propertyName: "text",
            label: "文本",
            helpText: "设置按钮文本",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入按钮文本",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "鼠标悬浮时显示的提示信息",
            propertyName: "tooltip",
            label: "提示",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入提示内容",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            helpText: "控制组件的显示/隐藏",
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
            defaultValue: false,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "googleRecaptchaKey",
            label: "Google Recaptcha Key",
            helpText: "为按钮设置 Google Recaptcha v3 key",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入 google recaptcha key",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "recaptchaType",
            label: "Google reCAPTCHA 版本",
            controlType: "DROP_DOWN",
            helpText: "选择 reCAPTCHA 版本",
            options: [
              {
                label: "reCAPTCHA v3",
                value: RecaptchaTypes.V3,
              },
              {
                label: "reCAPTCHA v2",
                value: RecaptchaTypes.V2,
              },
            ],
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [RecaptchaTypes.V3, RecaptchaTypes.V2],
                default: RecaptchaTypes.V3,
              },
            },
          },
        ],
      },
      {
        sectionName: "表单选项",
        children: [
          {
            helpText: "如果组件在表单组件中，表单校验失败时按钮不可点击",
            propertyName: "disabledWhenInvalid",
            label: "表单校验失败时禁止提交",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "如果组件在表单组件中，表单数据提交后重置表单组件",
            propertyName: "resetFormOnClick",
            label: "表单提交成功后重置表单",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "事件",
        children: [
          {
            helpText: "点击时触发",
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
        sectionName: "样式",
        children: [
          {
            propertyName: "buttonColor",
            helpText: "设置按钮颜色",
            label: "按钮颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "buttonVariant",
            label: "按钮类型",
            controlType: "DROP_DOWN",
            helpText: "设置按钮类型",
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
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText: "设置边框圆角半径",
            controlType: "BORDER_RADIUS_OPTIONS",
            isBindProperty: true,
            isJSConvertible: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
            },
          },
          {
            propertyName: "boxShadow",
            label: "阴影",
            helpText: "设置组件外框阴影",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "iconName",
            label: "图标",
            helpText: "设置按钮图标",
            controlType: "ICON_SELECT",
            isBindProperty: false,
            isTriggerProperty: false,
            updateHook: (
              props: ButtonWidgetProps,
              propertyPath: string,
              propertyValue: string,
            ) => {
              const propertiesToUpdate = [{ propertyPath, propertyValue }];
              if (!props.iconAlign) {
                propertiesToUpdate.push({
                  propertyPath: "iconAlign",
                  propertyValue: Alignment.LEFT,
                });
              }
              return propertiesToUpdate;
            },
            dependencies: ["iconAlign"],
            validation: {
              type: ValidationTypes.TEXT,
            },
          },
          {
            propertyName: "placement",
            label: "图标对齐",
            controlType: "DROP_DOWN",
            helpText: "设置图标对齐方式",
            options: [
              {
                label: "左对齐",
                value: ButtonPlacementTypes.START,
              },
              {
                label: "两端对齐",
                value: ButtonPlacementTypes.BETWEEN,
              },
              {
                label: "居中对齐",
                value: ButtonPlacementTypes.CENTER,
              },
            ],
            defaultValue: ButtonPlacementTypes.CENTER,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [
                  ButtonPlacementTypes.START,
                  ButtonPlacementTypes.BETWEEN,
                  ButtonPlacementTypes.CENTER,
                ],
                default: ButtonPlacementTypes.CENTER,
              },
            },
          },
          {
            propertyName: "iconAlign",
            label: "图标位置",
            helpText: "设置图标位置",
            controlType: "ICON_TABS",
            defaultValue: "left",
            options: [
              {
                startIcon: "align-left",
                value: "left",
              },
              {
                startIcon: "align-right",
                value: "right",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ["center", "left", "right"],
              },
            },
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

  clickWithRecaptcha(token: string) {
    if (this.props.onClick) {
      this.setState({
        isLoading: true,
      });
    }
    this.props.updateWidgetMetaProperty("recaptchaToken", token, {
      triggerPropertyName: "onClick",
      dynamicString: this.props.onClick,
      event: {
        type: EventType.ON_CLICK,
        callback: this.handleActionResult,
      },
    });
  }

  onButtonClick() {
    if (this.props.onClick) {
      this.setState({
        isLoading: true,
      });
      super.executeAction({
        triggerPropertyName: "onClick",
        dynamicString: this.props.onClick,
        event: {
          type: EventType.ON_CLICK,
          callback: this.handleActionResult,
        },
      });
    } else if (this.props.resetFormOnClick && this.props.onReset) {
      this.props.onReset();
    }
  }

  handleActionResult = (result: ExecutionResult) => {
    this.setState({
      isLoading: false,
    });
    if (result.success) {
      if (this.props.resetFormOnClick && this.props.onReset)
        this.props.onReset();
    }
  };

  getWidgetView() {
    const disabled =
      this.props.disabledWhenInvalid &&
      "isFormValid" in this.props &&
      !this.props.isFormValid;

    return (
      <ButtonComponent
        {...super.getWidgetView().props}
        isDisabled={disabled}
        onClick={!disabled ? this.onButtonClickBound : undefined}
      />
    );
  }
}

export interface FormButtonWidgetProps extends WidgetProps {
  text?: string;
  onClick?: string;
  isVisible?: boolean;
  buttonType: ButtonType;
  isFormValid?: boolean;
  resetFormOnClick?: boolean;
  onReset?: () => void;
  disabledWhenInvalid?: boolean;
  googleRecaptchaKey?: string;
  recaptchaType: RecaptchaType;
  buttonVariant?: ButtonVariant;
  buttonColor?: string;
  borderRadius?: ButtonBorderRadius;
  boxShadow?: string;
  iconName?: IconName;
  iconAlign?: Alignment;
}

export interface FormButtonWidgetState extends WidgetState {
  isLoading: boolean;
}

export default FormButtonWidget;
