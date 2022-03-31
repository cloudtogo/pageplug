import React, { lazy, Suspense } from "react";
import BaseWidget, { WidgetProps, WidgetState } from "../../BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { DerivedPropertiesMap } from "utils/WidgetFactory";
import Skeleton from "components/utils/Skeleton";
import { retryPromise } from "utils/AppsmithUtils";
import showdown from "showdown";

export enum RTEFormats {
  MARKDOWN = "markdown",
  HTML = "html",
}
const RichTextEditorComponent = lazy(() =>
  retryPromise(() =>
    import(/* webpackChunkName: "rte",webpackPrefetch: 2 */ "../component"),
  ),
);

class RichTextEditorWidget extends BaseWidget<
  RichTextEditorWidgetProps,
  WidgetState
> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "inputType",
            helpText: "内容输入方式，支持HTML和Markdown",
            label: "输入格式",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "Markdown",
                value: "markdown",
              },
              {
                label: "HTML",
                value: "html",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "defaultText",
            label: "默认文本",
            controlType: "INPUT_TEXT",
            placeholderText: "<b>Hello World</b>",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "isRequired",
            label: "必须",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            label: "是否禁用",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "animateLoading",
            label: "Animate Loading",
            controlType: "SWITCH",
            helpText: "Controls the loading of the widget",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isToolbarHidden",
            label: "Hide toolbar",
            helpText: "Controls the visibility of the toolbar",
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
            helpText: "文本变化时触发",
            propertyName: "onTextChange",
            label: "onTextChange",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      text: undefined,
    };
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      text: "defaultText",
    };
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      value: `{{this.text}}`,
      isValid: `{{ this.isRequired ? this.text && this.text.length : true }}`,
    };
  }

  onValueChange = (text: string) => {
    this.props.updateWidgetMetaProperty("text", text, {
      triggerPropertyName: "onTextChange",
      dynamicString: this.props.onTextChange,
      event: {
        type: EventType.ON_TEXT_CHANGE,
      },
    });
  };

  getPageView() {
    let value = this.props.text ?? "";
    if (this.props.inputType === RTEFormats.MARKDOWN) {
      const converter = new showdown.Converter();
      value = converter.makeHtml(value);
    }

    return (
      <Suspense fallback={<Skeleton />}>
        <RichTextEditorComponent
          isDisabled={this.props.isDisabled}
          isMarkdown={this.props.inputType === RTEFormats.MARKDOWN}
          isToolbarHidden={!!this.props.isToolbarHidden}
          isValid={this.props.isValid}
          isVisible={this.props.isVisible}
          key={this.props.widgetId}
          onValueChange={this.onValueChange}
          placeholder={this.props.placeholder}
          value={value}
          widgetId={this.props.widgetId}
        />
      </Suspense>
    );
  }

  static getWidgetType(): WidgetType {
    return "RICH_TEXT_EDITOR_WIDGET";
  }
}

export interface RichTextEditorWidgetProps extends WidgetProps {
  defaultText?: string;
  text: string;
  inputType: string;
  placeholder?: string;
  onTextChange?: string;
  isDisabled?: boolean;
  isVisible?: boolean;
  isRequired?: boolean;
  isToolbarHidden?: boolean;
}

export default RichTextEditorWidget;
