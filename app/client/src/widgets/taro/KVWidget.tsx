import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "../BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import KVComponent from "components/designSystems/taro/KVComponent";
import { ValidationTypes } from "constants/WidgetValidation";
import withMeta, { WithMeta } from "../MetaHOC";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import LoadingWrapper from "./LoadingWrapper";

const textSizeOptions = [
  {
    label: "一级标题",
    value: "HEADING1",
    subText: "24px",
    icon: "HEADING_ONE",
  },
  {
    label: "二级标题",
    value: "HEADING2",
    subText: "18px",
    icon: "HEADING_TWO",
  },
  {
    label: "三级标题",
    value: "HEADING3",
    subText: "16px",
    icon: "HEADING_THREE",
  },
  {
    label: "一级段落",
    value: "PARAGRAPH",
    subText: "14px",
    icon: "PARAGRAPH",
  },
  {
    label: "二级段落",
    value: "PARAGRAPH2",
    subText: "12px",
    icon: "PARAGRAPH_TWO",
  },
];

const textAlignOptions = [
  {
    icon: "LEFT_ALIGN",
    value: "LEFT",
  },
  {
    icon: "CENTER_ALIGN",
    value: "CENTER",
  },
  {
    icon: "RIGHT_ALIGN",
    value: "RIGHT",
  },
];

const demoLayoutProps: any = {
  list: [
    {
      key: "晚来天欲雪",
      value: "能饮一杯无",
    },
  ],
  kKey: "key",
  vKey: "value",
  layout: "v",
  inset: false,
  kColor: "#999",
  kSize: "PARAGRAPH",
  kBold: false,
  kAlign: "LEFT",
  vColor: "#000",
  vSize: "PARAGRAPH",
  vBold: false,
  vAlign: "LEFT",
  style: {
    borderRadius: "4px",
    padding: "1px 12px",
    marginBottom: "8px",
    background: "#f7f8f9",
    border: "2px solid #ccc",
  },
};

class MKVWidget extends BaseWidget<MKVWidgetProps, WidgetState> {
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

  getPageView() {
    const {
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
      isLoading,
      showLoading,
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

  getWidgetType(): WidgetType {
    return "TARO_KV_WIDGET";
  }
}

export interface MKVWidgetProps extends WidgetProps, WithMeta {
  list: any[];
  kKey: string;
  vKey: string;
  inset?: boolean;
  layout: "h" | "hb" | "v";
}

export default MKVWidget;
export const MProfiledKVWidget = withMeta(MKVWidget);
