import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "../BaseWidget";
import { WidgetType, WidgetTypes } from "constants/WidgetConstants";
import ListComponent, {
  ListComponentProps,
} from "components/designSystems/taro/ListComponent";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";

class ListWidget extends BaseWidget<MListWidgetProps, WidgetState> {
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
            placeholderText: '[{ "url": "", name: "" }]',
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
            propertyName: "contentType",
            label: "内容类型",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "图片+标题+描述",
                value: "I_N_D",
              },
              {
                label: "图片+标题+描述+价格",
                value: "I_N_D_P",
              },
              {
                label: "图片+标题+描述+价格+按钮",
                value: "I_N_D_P_B",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "urlKey",
            label: "图片字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "titleKey",
            label: "标题字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "descriptionKey",
            label: "描述字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "priceKey",
            label: "价格字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["contentType"],
            hidden: (props: MListWidgetProps) => {
              return props.contentType === "I_N_D";
            },
          },
          {
            propertyName: "buttonText",
            label: "按钮文本",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["contentType"],
            hidden: (props: MListWidgetProps) => {
              return props.contentType !== "I_N_D_P_B";
            },
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "inset",
            label: "圆角风格",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "width",
            label: "图片宽度",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "height",
            label: "图片高度",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "titleColor",
            label: "标题颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "descriptionColor",
            label: "描述颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "priceColor",
            label: "价格颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
            dependencies: ["contentType"],
            hidden: (props: MListWidgetProps) => {
              return props.contentType === "I_N_D";
            },
          },
          {
            propertyName: "buttonColor",
            label: "按钮颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
            dependencies: ["contentType"],
            hidden: (props: MListWidgetProps) => {
              return props.contentType !== "I_N_D_P_B";
            },
          },
        ],
      },
    ];
  }

  getPageView() {
    const {
      list,
      contentType,
      urlKey,
      titleKey,
      descriptionKey,
      priceKey,
      buttonText,
      inset,
      width,
      height,
      titleColor,
      descriptionColor,
      priceColor,
      buttonColor,
    } = this.props;
    return (
      <ListComponent
        {...{
          list,
          contentType,
          urlKey,
          titleKey,
          descriptionKey,
          priceKey,
          buttonText,
          inset,
          width,
          height,
          titleColor,
          descriptionColor,
          priceColor,
          buttonColor,
        }}
      />
    );
  }

  getWidgetType(): WidgetType {
    return WidgetTypes.TARO_LIST_WIDGET;
  }
}

export interface MListWidgetProps extends WidgetProps, ListComponentProps {}

export default ListWidget;
export const MProfiledListWidget = ListWidget;
