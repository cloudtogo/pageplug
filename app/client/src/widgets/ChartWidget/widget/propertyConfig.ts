import { ChartWidgetProps } from "widgets/ChartWidget/widget";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { CUSTOM_CHART_TYPES, LabelOrientation } from "../constants";
import { isLabelOrientationApplicableFor } from "../component";

export default [
  {
    sectionName: "属性",
    children: [
      {
        helpText: "给图表添加标题",
        placeholderText: "销售报告",
        propertyName: "chartName",
        label: "标题",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        helpText: "修改图表数据展示形态",
        propertyName: "chartType",
        label: "图表类型",
        controlType: "DROP_DOWN",
        options: [
          {
            label: "折线图",
            value: "LINE_CHART",
          },
          {
            label: "水平柱状图",
            value: "BAR_CHART",
          },
          {
            label: "饼图",
            value: "PIE_CHART",
          },
          {
            label: "垂直柱状图",
            value: "COLUMN_CHART",
          },
          {
            label: "面积图",
            value: "AREA_CHART",
          },
          {
            label: "自定义图表",
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
        helpText: "完整配置请查阅 Fusion 官方文档",
        placeholderText: `Fusion 图表配置`,
        propertyName: "customFusionChartConfig",
        label: "自定义 Fusion 图表",
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
                        allowedKeys: [
                          {
                            name: "paletteColors",
                            type: ValidationTypes.TEXT,
                            params: {
                              strict: true,
                              ignoreCase: true,
                            },
                          },
                        ],
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
        helpText: "给图表添加数据",
        propertyName: "chartData",
        placeholderText: '[{ "x": "2021", "y": "94000" }]',
        label: "图表序列",
        controlType: "CHART_DATA",
        isBindProperty: false,
        isTriggerProperty: false,
        hidden: (props: ChartWidgetProps) =>
          props.chartType === "CUSTOM_FUSION_CHART",
        dependencies: ["chartType"],
        children: [
          {
            helpText: "Series data",
            propertyName: "data",
            label: "序列数据",
            controlType: "INPUT_TEXT_AREA",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    required: true,
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
          {
            helpText: "Series Name",
            propertyName: "seriesName",
            label: "序列名称",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        propertyName: "isVisible",
        label: "是否显示",
        helpText: "控制组件的显示/隐藏",
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
      {
        helpText: "允许图表内部滚动",
        propertyName: "allowScroll",
        label: "允许滚动",
        controlType: "SWITCH",
        isBindProperty: false,
        isTriggerProperty: false,
        hidden: (x: ChartWidgetProps) =>
          x.chartType === "CUSTOM_FUSION_CHART" || x.chartType === "PIE_CHART",
        dependencies: ["chartType"],
      },
    ],
  },
  {
    sectionName: "坐标轴配置",
    children: [
      {
        helpText: "设置x轴标签",
        propertyName: "xAxisName",
        placeholderText: "日期",
        label: "x轴标签",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        hidden: (x: any) => x.chartType === "CUSTOM_FUSION_CHART",
        dependencies: ["chartType"],
      },
      {
        helpText: "设置y轴标签",
        propertyName: "yAxisName",
        placeholderText: "收入",
        label: "y轴标签",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        hidden: (x: any) => x.chartType === "CUSTOM_FUSION_CHART",
        dependencies: ["chartType"],
      },
      {
        helpText: "修改x轴标签方向",
        propertyName: "labelOrientation",
        label: "x轴标签方向",
        hidden: (x: ChartWidgetProps) =>
          !isLabelOrientationApplicableFor(x.chartType),
        isBindProperty: false,
        isTriggerProperty: false,
        dependencies: ["chartType"],
        controlType: "DROP_DOWN",
        options: [
          {
            label: "自动",
            value: LabelOrientation.AUTO,
          },
          {
            label: "倾斜",
            value: LabelOrientation.SLANT,
          },
          {
            label: "旋转",
            value: LabelOrientation.ROTATE,
          },
          {
            label: "交错",
            value: LabelOrientation.STAGGER,
          },
        ],
      },
      {
        propertyName: "setAdaptiveYMin",
        label: "自适应坐标轴",
        helpText: "定义坐标轴最小刻度",
        controlType: "SWITCH",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
    ],
  },
  {
    sectionName: "事件",
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
  {
    sectionName: "样式",
    children: [
      {
        propertyName: "borderRadius",
        label: "边框圆角",
        helpText: "边框圆角样式",
        controlType: "BORDER_RADIUS_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "boxShadow",
        label: "阴影",
        helpText: "组件轮廓投影",
        controlType: "BOX_SHADOW_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
    ],
  },
];

export const contentConfig = [
  {
    sectionName: "数据",
    children: [
      {
        helpText: "修改图表数据展示形态",
        propertyName: "chartType",
        label: "图表类型",
        controlType: "DROP_DOWN",
        options: [
          {
            label: "折线图",
            value: "LINE_CHART",
          },
          {
            label: "水平柱状图",
            value: "BAR_CHART",
          },
          {
            label: "饼图",
            value: "PIE_CHART",
          },
          {
            label: "垂直柱状图",
            value: "COLUMN_CHART",
          },
          {
            label: "面积图",
            value: "AREA_CHART",
          },
          {
            label: "自定义图表",
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
        helpText: "完整配置请查阅 Fusion 官方文档",
        placeholderText: `Fusion 图表配置`,
        propertyName: "customFusionChartConfig",
        label: "自定义 Fusion 图表",
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
                        allowedKeys: [
                          {
                            name: "paletteColors",
                            type: ValidationTypes.TEXT,
                            params: {
                              strict: true,
                              ignoreCase: true,
                            },
                          },
                        ],
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
        helpText: "给图表添加数据",
        propertyName: "chartData",
        placeholderText: '[{ "x": "2021", "y": "94000" }]',
        label: "图表序列",
        controlType: "CHART_DATA",
        isBindProperty: false,
        isTriggerProperty: false,
        hidden: (props: ChartWidgetProps) =>
          props.chartType === "CUSTOM_FUSION_CHART",
        dependencies: ["chartType"],
        children: [
          {
            helpText: "Series data",
            propertyName: "data",
            label: "序列数据",
            controlType: "INPUT_TEXT_AREA",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    required: true,
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
          {
            helpText: "Series Name",
            propertyName: "seriesName",
            label: "序列名称",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ],
  },
  {
    sectionName: "属性",
    children: [
      {
        helpText: "给图表添加标题",
        placeholderText: "销售报告",
        propertyName: "chartName",
        label: "标题",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "isVisible",
        label: "是否显示",
        helpText: "控制组件的显示/隐藏",
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
      {
        helpText: "允许图表内部滚动",
        propertyName: "allowScroll",
        label: "允许滚动",
        controlType: "SWITCH",
        isBindProperty: false,
        isTriggerProperty: false,
        hidden: (x: ChartWidgetProps) =>
          x.chartType === "CUSTOM_FUSION_CHART" || x.chartType === "PIE_CHART",
        dependencies: ["chartType"],
      },
    ],
  },
  {
    sectionName: "坐标轴配置",
    children: [
      {
        propertyName: "setAdaptiveYMin",
        label: "自适应坐标轴",
        helpText: "定义坐标轴最小刻度",
        controlType: "SWITCH",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        helpText: "设置x轴标签",
        propertyName: "xAxisName",
        placeholderText: "日期",
        label: "x轴标签",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        hidden: (x: any) => x.chartType === "CUSTOM_FUSION_CHART",
        dependencies: ["chartType"],
      },
      {
        helpText: "设置y轴标签",
        propertyName: "yAxisName",
        placeholderText: "收入",
        label: "y轴标签",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        hidden: (x: any) => x.chartType === "CUSTOM_FUSION_CHART",
        dependencies: ["chartType"],
      },
      {
        helpText: "修改x轴标签方向",
        propertyName: "labelOrientation",
        label: "x轴标签方向",
        hidden: (x: ChartWidgetProps) =>
          !isLabelOrientationApplicableFor(x.chartType),
        isBindProperty: false,
        isTriggerProperty: false,
        dependencies: ["chartType"],
        controlType: "DROP_DOWN",
        options: [
          {
            label: "自动",
            value: LabelOrientation.AUTO,
          },
          {
            label: "倾斜",
            value: LabelOrientation.SLANT,
          },
          {
            label: "旋转",
            value: LabelOrientation.ROTATE,
          },
          {
            label: "交错",
            value: LabelOrientation.STAGGER,
          },
        ],
      },
    ],
  },
  {
    sectionName: "事件",
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

export const styleConfig = [
  {
    sectionName: "轮廓样式",
    children: [
      {
        propertyName: "borderRadius",
        label: "边框圆角",
        helpText: "边框圆角样式",
        controlType: "BORDER_RADIUS_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "boxShadow",
        label: "阴影",
        helpText: "组件轮廓投影",
        controlType: "BOX_SHADOW_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
    ],
  },
];
