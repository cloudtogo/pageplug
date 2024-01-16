import React from "react";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import KVComponent from "../component";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import LoadingWrapper from "../../LoadingWrapper";
import {
  textSizeOptions,
  textAlignOptions,
  demoLayoutProps,
} from "../constants";
import IconSVG from "../icon.svg";

class MKVWidget extends BaseWidget<MKVWidgetProps, WidgetState> {
  static type = "TARO_KV_WIDGET";

  static getConfig() {
    return {
      name: "键值对",
      searchTags: ["kv", "text", "文本", "field"],
      iconSVG: IconSVG,
      needsMeta: false,
      isCanvas: false,
      isMobile: true,
    };
  }

  static getDefaults() {
    return {
      widgetName: "kv",
      rows: 24,
      columns: 48,
      version: 1,
      list: [
        { key: "绿蚁新醅酒", value: "红泥小火炉" },
        { key: "晚来天欲雪", value: "能饮一杯无" },
      ],
      kKey: "key",
      vKey: "value",
      layout: "h",
      inset: false,
      kColor: "#666",
      kSize: "PARAGRAPH",
      kBold: false,
      kAlign: "LEFT",
      vColor: "#333",
      vSize: "PARAGRAPH",
      vBold: true,
      vAlign: "LEFT",
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
            helpText: "数组，通过 {{}} 进行数据绑定",
            propertyName: "list",
            label: "数据",
            controlType: "INPUT_TEXT",
            placeholderText: '[{ "a": "1", b: "2" }]',
            inputType: "ARRAY",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.OBJECT_ARRAY,
              params: {
                default: [],
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            propertyName: "kKey",
            label: "键字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "vKey",
            label: "值字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "inset",
            label: "圆角风格背景",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "layout",
            label: "布局",
            controlType: "RADIO",
            options: [
              {
                label: <KVComponent {...demoLayoutProps} layout="v" />,
                value: "v",
              },
              {
                label: <KVComponent {...demoLayoutProps} layout="h" />,
                value: "h",
              },
              {
                label: <KVComponent {...demoLayoutProps} layout="hb" />,
                value: "hb",
              },
            ],
            columns: 1,
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "showLoading",
            label: "数据加载时显示加载动画",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "键样式",
        children: [
          {
            propertyName: "kColor",
            label: "颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "kSize",
            label: "字体大小",
            controlType: "DROP_DOWN",
            options: textSizeOptions,
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "kBold",
            label: "粗体",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "kAlign",
            label: "文字对齐",
            controlType: "ICON_TABS",
            options: textAlignOptions,
            defaultValue: "LEFT",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "值样式",
        children: [
          {
            propertyName: "vColor",
            label: "颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "vSize",
            label: "字体大小",
            controlType: "DROP_DOWN",
            options: textSizeOptions,
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "vBold",
            label: "粗体",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "vAlign",
            label: "文字对齐",
            controlType: "ICON_TABS",
            options: textAlignOptions,
            defaultValue: "LEFT",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  getWidgetView() {
    const {
      inset,
      isLoading,
      kAlign,
      kBold,
      kColor,
      kKey,
      kSize,
      layout,
      list,
      showLoading,
      vAlign,
      vBold,
      vColor,
      vKey,
      vSize,
    } = this.props;
    return (
      <LoadingWrapper isLoading={isLoading && showLoading}>
        <KVComponent
          {...{
            list,
            kKey,
            vKey,
            inset,
            layout,
            kColor,
            kSize,
            kBold,
            kAlign,
            vColor,
            vSize,
            vBold,
            vAlign,
          }}
        />
      </LoadingWrapper>
    );
  }
}

export interface MKVWidgetProps extends WidgetProps {
  list: any[];
  kKey: string;
  vKey: string;
  inset?: boolean;
  layout: "h" | "hb" | "v";
}

export default MKVWidget;
