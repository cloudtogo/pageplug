import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import KVComponent from "../component";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import LoadingWrapper from "../../LoadingWrapper";
import {
  textSizeOptions,
  textAlignOptions,
  demoLayoutProps,
} from "../constants";

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

  static getWidgetType(): WidgetType {
    return "TARO_KV_WIDGET";
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
