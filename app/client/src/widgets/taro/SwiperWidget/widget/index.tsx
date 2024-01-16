import React from "react";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import SwiperComponent from "../component";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import IconSVG from "../icon.svg";

class SwiperWidget extends BaseWidget<SwiperWidgetProps, WidgetState> {
  static type = "TARO_SWIPER_WIDGET";

  static getConfig() {
    return {
      name: "轮播",
      searchTags: ["swipper", "image", "picture"],
      iconSVG: IconSVG,
      needsMeta: false,
      isCanvas: false,
      isMobile: true,
    };
  }

  static getDefaults() {
    return {
      widgetName: "swiper",
      rows: 24,
      columns: 56,
      list: [
        { url: "https://img01.yzcdn.cn/vant/apple-1.jpg" },
        { url: "https://img01.yzcdn.cn/vant/apple-2.jpg" },
        { url: "https://img01.yzcdn.cn/vant/apple-3.jpg" },
        { url: "https://img01.yzcdn.cn/vant/apple-4.jpg" },
      ],
      urlKey: "url",
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
            helpText: "轮播数据列表，通过 {{}} 进行数据绑定",
            propertyName: "list",
            label: "数据",
            controlType: "INPUT_TEXT",
            placeholderText: '例如 [{ "url": "val1", link: "val2" }]',
            inputType: "ARRAY",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                default: [],
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            propertyName: "urlKey",
            label: "图片字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  getWidgetView() {
    const { list, urlKey } = this.props;
    return (
      <SwiperComponent
        {...{
          list,
          urlKey,
        }}
      />
    );
  }
}

export interface SwiperWidgetProps extends WidgetProps {
  list: any[];
  urlKey: string;
}

export default SwiperWidget;
