import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import DocumentViewerComponent from "../component";
import {
  ValidationTypes,
  ValidationResponse,
} from "constants/WidgetValidation";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";

export function documentUrlValidation(value: unknown): ValidationResponse {
  // applied validations if value exist
  if (value) {
    const whiteSpaceRegex = /\s/g;
    const urlRegex = /(?:https:\/\/|www)?([\da-z.-]+)\.([a-z.]{2,6})[/\w .-]*\/?/;
    const base64Regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
    if (
      urlRegex.test(value as string) &&
      !whiteSpaceRegex.test(value as string)
    ) {
      if ((value as string).startsWith("www")) {
        return {
          isValid: true,
          parsed: "https://" + value,
        };
      }
      try {
        const newUrl = new URL(value as string);
        // URL is valid
        return {
          isValid: true,
          parsed: newUrl.href,
        };
      } catch (error) {
        return {
          isValid: false,
          parsed: "",
          messages: ["填写的 URL / Base64 无效"],
        };
      }
    } else if (base64Regex.test(value as string)) {
      // base 64 is valid
      return {
        isValid: true,
        parsed: value,
      };
    } else {
      // value is not valid URL / Base64
      return {
        isValid: false,
        parsed: "",
        messages: ["填写的 URL / Base64 无效"],
      };
    }
  }
  // value is empty here
  return {
    isValid: true,
    parsed: "",
    messages: [""],
  };
}

class DocumentViewerWidget extends BaseWidget<
  DocumentViewerWidgetProps,
  WidgetState
> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText:
              "需要预览文档的链接。如果是 URL，支持的文件扩展名包括 txt、pdf、docx、ppt、pptx 和 xlsx；如果是 base64，不支持 ppt。",
            propertyName: "docUrl",
            label: "文档链接",
            controlType: "INPUT_TEXT",
            placeholderText: "URL / Base64",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: documentUrlValidation,
                expected: {
                  type: "URL / Base64",
                  example: "https://www.example.com",
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
          },
          {
            helpText: "控制组件显示/隐藏",
            propertyName: "isVisible",
            label: "是否显示",
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

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "数据",
        children: [
          {
            helpText:
              "需要预览文档的链接。如果是 URL，支持的文件扩展名包括 txt、pdf、docx、ppt、pptx 和 xlsx；如果是 base64，不支持 ppt。",
            propertyName: "docUrl",
            label: "文档链接",
            controlType: "INPUT_TEXT",
            placeholderText: "URL / Base64",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: documentUrlValidation,
                expected: {
                  type: "URL / Base64",
                  example: "https://www.example.com",
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            helpText: "控制组件显示/隐藏",
            propertyName: "isVisible",
            label: "是否显示",
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

  getPageView() {
    return <DocumentViewerComponent docUrl={this.props.docUrl} />;
  }

  static getWidgetType(): string {
    return "DOCUMENT_VIEWER_WIDGET";
  }
}

export interface DocumentViewerWidgetProps extends WidgetProps {
  docUrl: string;
}

export default DocumentViewerWidget;
