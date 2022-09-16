import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import SwiperComponent from "../component";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import _ from "lodash";

class SwiperWidget extends BaseWidget<SwiperWidgetProps, WidgetState> {
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
              type: ValidationTypes.OBJECT_ARRAY,
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

  getPageView() {
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

  static getWidgetType(): WidgetType {
    return "TARO_SWIPER_WIDGET";
  }
}

export interface SwiperWidgetProps extends WidgetProps {
  list: any[];
  urlKey: string;
}

export default SwiperWidget;
