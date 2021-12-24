import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "../BaseWidget";
import { WidgetType, WidgetTypes } from "constants/WidgetConstants";
import GridComponent, {
  GridComponentProps,
} from "components/designSystems/taro/GridComponent";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";

class GridWidget extends BaseWidget<GridWidgetProps, WidgetState> {
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
            placeholderText: '[{ "url": "", title: "" }]',
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
            propertyName: "gridType",
            label: "内容类型",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "图片+标题",
                value: "I_N",
              },
              {
                label: "图片+标题+描述",
                value: "I_N_D",
              },
              {
                label: "图片+标题+描述+按钮",
                value: "I_N_D_B",
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
            dependencies: ["gridType"],
            hidden: (props: GridWidgetProps) => {
              return props.gridType === "I_N";
            },
          },
          {
            propertyName: "asPrice",
            label: "描述是价格",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
            dependencies: ["gridType"],
            hidden: (props: GridWidgetProps) => {
              return props.gridType === "I_N";
            },
          },
          {
            propertyName: "priceUnit",
            label: "价格单位符号",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["gridType", "asPrice"],
            hidden: (props: GridWidgetProps) => {
              return props.gridType === "I_N" || !props.asPrice;
            },
          },
          {
            propertyName: "buttonText",
            label: "按钮文本",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            dependencies: ["gridType"],
            hidden: (props: GridWidgetProps) => {
              return props.gridType !== "I_N_D_B";
            },
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "height",
            label: "图片高度",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "cols",
            label: "列数",
            controlType: "INPUT_TEXT",
            placeholderText: "网格显示多少列",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 2, default: 4 },
            },
          },
          {
            propertyName: "gutter",
            label: "网格间距",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "bordered",
            label: "是否显示边框",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
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
            dependencies: ["gridType"],
            hidden: (props: GridWidgetProps) => {
              return props.gridType === "I_N";
            },
          },
          {
            propertyName: "buttonColor",
            label: "按钮颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
            dependencies: ["gridType"],
            hidden: (props: GridWidgetProps) => {
              return props.gridType !== "I_N_D_B";
            },
          },
        ],
      },
    ];
  }

  getPageView() {
    const {
      list,
      gridType,
      urlKey,
      titleKey,
      descriptionKey,
      asPrice,
      priceUnit,
      buttonText,
      height,
      cols,
      gutter,
      bordered,
      titleColor,
      descriptionColor,
      buttonColor,
    } = this.props;
    return (
      <GridComponent
        {...{
          list,
          gridType,
          urlKey,
          titleKey,
          descriptionKey,
          asPrice,
          priceUnit,
          buttonText,
          height,
          cols,
          gutter,
          bordered,
          titleColor,
          descriptionColor,
          buttonColor,
        }}
      />
    );
  }

  getWidgetType(): WidgetType {
    return WidgetTypes.TARO_GRID_WIDGET;
  }
}

export interface GridWidgetProps extends WidgetProps, GridComponentProps {}

export default GridWidget;
export const ProfiledGridWidget = GridWidget;
