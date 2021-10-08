import { ChartWidgetProps } from "widgets/ChartWidget";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { CUSTOM_CHART_TYPES } from "constants/CustomChartConstants";

export default [
  {
    sectionName: "属性",
    children: [
      {
        placeholderText: "请输入图表标题",
        propertyName: "chartName",
        label: "标题",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "chartType",
        label: "图表类型",
        controlType: "DROP_DOWN",
        options: [
          {
            label: "Line Chart",
            value: "LINE_CHART",
          },
          {
            label: "Bar Chart",
            value: "BAR_CHART",
          },
          {
            label: "Pie Chart",
            value: "PIE_CHART",
          },
          {
            label: "Column Chart",
            value: "COLUMN_CHART",
          },
          {
            label: "Area Chart",
            value: "AREA_CHART",
          },
          {
            label: "Custom Chart",
            value: "CUSTOM_FUSION_CHART",
          },
        ],
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: [
              "LINE_CHART",
              "BAR_CHART",
              "PIE_CHART",
              "COLUMN_CHART",
              "AREA_CHART",
              "CUSTOM_FUSION_CHART",
            ],
          },
        },
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
    ],
  },
  {
    sectionName: "图表数据",
    children: [
      {
        helpText: "手动配置 FusionChart",
        placeholderText: `Enter {"type": "bar2d","dataSource": {}}`,
        propertyName: "customFusionChartConfig",
        label: "自定义 Fusion 图表配置",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.OBJECT,
          params: {
            allowedKeys: [
              {
                type: ValidationTypes.TEXT,
                name: "type",
                params: {
                  allowedValues: CUSTOM_CHART_TYPES,
                  default: "",
                  required: true,
                },
              },
              {
                type: ValidationTypes.OBJECT,
                name: "dataSource",
                params: {
                  allowedKeys: [
                    {
                      name: "chart",
                      type: ValidationTypes.OBJECT,
                      params: {
                        default: {},
                      },
                    },
                    {
                      name: "data",
                      type: ValidationTypes.ARRAY,
                      params: {
                        default: [],
                        children: {
                          type: ValidationTypes.OBJECT,
                          params: {
                            allowedKeys: [
                              {
                                name: "label",
                                type: ValidationTypes.TEXT,
                              },
                              {
                                name: "value",
                                type: ValidationTypes.NUMBER,
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        hidden: (props: ChartWidgetProps) =>
          props.chartType !== "CUSTOM_FUSION_CHART",
        dependencies: ["chartType"],
        evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
      },
      {
        propertyName: "chartData",
        placeholderText: '例如 [{ "x": "val", "y": "val" }]',
        label: "图表数据 Series",
        controlType: "CHART_DATA",
        isBindProperty: false,
        isTriggerProperty: false,
        hidden: (props: ChartWidgetProps) =>
          props.chartType === "CUSTOM_FUSION_CHART",
        dependencies: ["chartType"],
        children: [
          {
            propertyName: "seriesName",
            label: "Series 名称",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "data",
            label: "Series 数据",
            controlType: "INPUT_TEXT_AREA",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    allowedKeys: [
                      {
                        name: "x",
                        type: ValidationTypes.TEXT,
                        params: {
                          required: true,
                          default: "",
                        },
                      },
                      {
                        name: "y",
                        type: ValidationTypes.NUMBER,
                        params: {
                          required: true,
                          default: 10,
                        },
                      },
                    ],
                  },
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
        ],
      },
    ],
  },
  {
    sectionName: "Axis 数据轴",
    hidden: (props: ChartWidgetProps) =>
      props.chartType === "CUSTOM_FUSION_CHART",
    dependencies: ["chartType"],
    children: [
      {
        propertyName: "xAxisName",
        placeholderText: "请输入x-轴名称",
        label: "x-轴名称",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "yAxisName",
        placeholderText: "请输入y-轴名称",
        label: "y-轴名称",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        helpText: "允许图表内水平滚动",
        propertyName: "allowHorizontalScroll",
        label: "允许水平滚动",
        controlType: "SWITCH",
        isBindProperty: false,
        isTriggerProperty: false,
        hidden: (x: any) => x.chartType === "CUSTOM_FUSION_CHART",
        dependencies: ["chartType"],
      },
    ],
  },
  {
    sectionName: "动作",
    children: [
      {
        helpText: "点击数据点时触发",
        propertyName: "onDataPointClick",
        label: "onDataPointClick",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
    ],
  },
];
