import React from "react";
import { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import {
  EventType,
  ExecutionResult,
} from "constants/AppsmithActionConstants/ActionConstants";
import ButtonComponent, { ButtonType } from "widgets/ButtonWidget/component";
import { ValidationTypes } from "constants/WidgetValidation";
import ButtonWidget from "widgets/ButtonWidget";
import {
  ButtonBorderRadius,
  ButtonVariant,
  RecaptchaType,
  RecaptchaTypes,
} from "components/constants";
import { IconName } from "@blueprintjs/icons";
import { Alignment } from "@blueprintjs/core";

class FormButtonWidget extends ButtonWidget {
  constructor(props: FormButtonWidgetProps) {
    super(props);
  }

  static getPropertyPaneConfig() {
    const buttonPropertyPaneConfig = super.getPropertyPaneConfig().slice(1);
    buttonPropertyPaneConfig.unshift({
      sectionName: "属性",
      children: [
        {
          propertyName: "text",
          label: "标签",
          helpText: "设置按钮标签",
          controlType: "INPUT_TEXT",
          placeholderText: "请输入文本内容",
          isBindProperty: true,
          isTriggerProperty: false,
          validation: { type: ValidationTypes.TEXT },
        },
        {
          helpText: "鼠标交互时显示的提示信息",
          propertyName: "tooltip",
          label: "提示",
          controlType: "INPUT_TEXT",
          placeholderText: "请输入提示信息",
          isBindProperty: true,
          isTriggerProperty: false,
          validation: { type: ValidationTypes.TEXT },
        },
        {
          propertyName: "isVisible",
          label: "是否显示",
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
          defaultValue: true,
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: false,
          validation: { type: ValidationTypes.BOOLEAN },
        },
        {
          propertyName: "googleRecaptchaKey",
          label: "Google Recaptcha Key",
          helpText: "给按钮设置 Google Recaptcha v3 site key",
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
          helpText: "请选择 reCAPTCHA 版本",
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
    });
    return buttonPropertyPaneConfig;
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

  getPageView() {
    const disabled =
      this.props.disabledWhenInvalid &&
      "isFormValid" in this.props &&
      !this.props.isFormValid;

    return (
      <ButtonComponent
        {...super.getPageView().props}
        isDisabled={disabled}
        onClick={!disabled ? this.onButtonClickBound : undefined}
      />
    );
  }

  static getWidgetType(): WidgetType {
    return "FORM_BUTTON_WIDGET";
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
