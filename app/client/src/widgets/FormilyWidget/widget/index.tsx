import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import FormilyComponent from "../component";
import { ValidationTypes } from "constants/WidgetValidation";
import { Stylesheet } from "entities/AppTheming";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ConfigProvider } from "antd";

class FormilyWidget extends BaseWidget<FormilyWidgetProps, WidgetState> {
  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "schema",
            label: "",
            controlType: "FORMILY_EDITOR",
            isJSConvertible: false,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "initValue",
            label: "表单初始值",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.OBJECT },
          },
          {
            helpText: "表单展示形式，支持平铺、弹窗、侧边抽屉三种形式",
            propertyName: "formType",
            label: "表单交互",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "平铺",
                value: "PLAIN",
              },
              {
                label: "弹窗",
                value: "MODAL",
              },
              {
                label: "侧边抽屉",
                value: "DRAWER",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "modalWidth",
            label: "弹窗宽度",
            helpText: "支持设置各种样式单位，如屏幕百分比（%）、像素值（px）",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["formType"],
            hidden: (props: FormilyWidgetProps) => {
              return props.formType !== "MODAL";
            },
          },
          {
            propertyName: "drawerWidth",
            label: "侧边抽屉宽度",
            helpText: "支持设置各种样式单位，如屏幕百分比（%）、像素值（px）",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["formType"],
            hidden: (props: FormilyWidgetProps) => {
              return props.formType !== "DRAWER";
            },
          },
          {
            propertyName: "triggerLabel",
            label: "打开表单按钮文字",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["formType"],
            hidden: (props: FormilyWidgetProps) => {
              return props.formType === "PLAIN";
            },
          },
          {
            propertyName: "title",
            label: "表单标题",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "submitLabel",
            label: "提交按钮文字",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "showReset",
            label: "允许重置",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "resetLabel",
            label: "重置按钮文字",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["showReset"],
            hidden: (props: FormilyWidgetProps) => {
              return !props.showReset;
            },
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
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            propertyName: "onFormSubmit",
            label: "提交表单数据",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
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
            propertyName: "componentSize",
            label: "组件尺寸",
            helpText: "表单中组件的尺寸",
            controlType: "ICON_TABS",
            fullWidth: true,
            options: [
              {
                label: "小",
                value: "small",
              },
              {
                label: "中",
                value: "middle",
              },
              {
                label: "大",
                value: "large",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
      {
        sectionName: "颜色",
        children: [
          {
            propertyName: "themeColor",
            label: "主题色",
            helpText: "表单中组件的主题色",
            controlType: "COLOR_PICKER",
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
      themeColor: "{{appsmith.theme.colors.primaryColor}}",
    };
  }

  static getMetaPropertiesMap(): Record<string, undefined> {
    return {
      formData: undefined,
    };
  }

  onFormSubmit = (data: any) => {
    this.props.updateWidgetMetaProperty("formData", data, {
      triggerPropertyName: "onFormSubmit",
      dynamicString: this.props.onFormSubmit,
      event: {
        type: EventType.ON_FORM_SUBMIT,
      },
    });
  };

  getPageView() {
    const {
      title,
      formType,
      triggerLabel,
      submitLabel,
      showReset,
      resetLabel,
      schema,
      initValue,
      componentSize,
      themeColor,
      widgetId,
      modalWidth,
      drawerWidth,
    } = this.props;
    return (
      <ConfigProvider
        componentSize={componentSize}
        theme={{
          token: {
            colorPrimary: themeColor,
          },
        }}
      >
        <FormilyComponent
          onFormSubmit={this.onFormSubmit}
          {...{
            title,
            formType,
            triggerLabel,
            submitLabel,
            showReset,
            resetLabel,
            schema,
            initValue,
            widgetId,
            modalWidth,
            drawerWidth,
          }}
        />
      </ConfigProvider>
    );
  }

  static getWidgetType(): WidgetType {
    return "FORMILY_WIDGET";
  }
}

export interface FormilyWidgetProps extends WidgetProps {
  formType: FormType;
  initValue?: any;
  title?: string;
  triggerLabel?: string;
  submitLabel?: string;
  showReset?: boolean;
  resetLabel?: string;
  formData: any;
  schema: string;
  onFormSubmit?: string;
  modalWidth?: string;
  drawerWidth?: string;
  componentSize: any;
  themeColor?: string;
}
export type FormType = "PLAIN" | "MODAL" | "DRAWER";

export default FormilyWidget;
