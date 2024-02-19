import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import type { ChartWidgetProps } from "widgets/ChartWidget/widget";
import {
  CUSTOM_CHART_TYPES,
  LabelOrientation,
  LABEL_ORIENTATION_COMPATIBLE_CHARTS,
  messages,
} from "../constants";

export const isLabelOrientationApplicableFor = (chartType: string) =>
  LABEL_ORIENTATION_COMPATIBLE_CHARTS.includes(chartType);

const labelOptions = (
  customEChartsEnabled: boolean,
  showCustomFusionChartDeprecationMessage: boolean,
) => {
  const options = [
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
      label: messages.customFusionChartOptionLabel(
        showCustomFusionChartDeprecationMessage,
      ),
      value: "CUSTOM_FUSION_CHART",
    },
  ];

  if (customEChartsEnabled) {
    options.splice(options.length - 1, 0, {
      label: "自定义图表",
      value: "CUSTOM_ECHART",
    });
  }
  return options;
};

export const contentConfig = (
  customEChartsEnabled: boolean,
  showCustomFusionChartDeprecationMessage: boolean,
) => {
  return [
    {
      sectionName: "数据",
      children: [
        {
          helpText: "修改图表数据展示形态",
          propertyName: "chartType",
          label: "图表类型",
          controlType: "DROP_DOWN",
          options: labelOptions(
            customEChartsEnabled,
            showCustomFusionChartDeprecationMessage,
          ),
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
                "CUSTOM_ECHART",
                "CUSTOM_FUSION_CHART",
              ],
            },
          },
        },
        {
          helpText: "完整配置请查阅 Fusion 官方文档",
          placeholderText: `fusion 图表配置`,
          propertyName: "customEChartConfig",
          label: "自定义 fusion 图表",
          controlType: "INPUT_TEXT",
          isBindProperty: true,
          isTriggerProperty: false,
          validation: {
            type: ValidationTypes.OBJECT,
            params: {
              default: {},
            },
          },
          hidden: (props: ChartWidgetProps) =>
            props.chartType !== "CUSTOM_ECHART",
          dependencies: ["chartType"],
        },
        {
          helpText: "配置 Fusion 图表",
          placeholderText: `Fusion图表配置`,
          propertyName: "customFusionChartConfig",
          label: "自定义 fusion 图表",
          controlType: "INPUT_TEXT",
          isBindProperty: true,
          isTriggerProperty: false,
          validation: {
            type: ValidationTypes.OBJECT,
            params: {
              default: {},
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
                    required: true,
                    ignoreCase: false,
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
          evaluationSubstitutionType:
            EvaluationSubstitutionType.SMART_SUBSTITUTE,
        },
        {
          helpText: "Populates the chart with the data",
          propertyName: "chartData",
          placeholderText: '[{ "x": "2021", "y": "94000" }]',
          label: "Chart series",
          controlType: "CHART_DATA",
          isBindProperty: false,
          isTriggerProperty: false,
          hidden: (props: ChartWidgetProps) =>
            ["CUSTOM_FUSION_CHART", "CUSTOM_ECHART"].includes(props.chartType),
          dependencies: ["chartType"],
          children: [
            {
              helpText: "Series data",
              propertyName: "data",
              label: "Series data",
              controlType: "INPUT_TEXT_AREA",
              isBindProperty: true,
              isTriggerProperty: false,
              validation: {
                type: ValidationTypes.ARRAY,
                params: {
                  default: [],
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
              helpText: "Series name",
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
          hidden: (props: ChartWidgetProps) =>
            ["CUSTOM_ECHART"].includes(props.chartType),
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
          defaultValue: false,
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
          hidden: (props: ChartWidgetProps) =>
            ["CUSTOM_FUSION_CHART", "PIE_CHART", "CUSTOM_ECHART"].includes(
              props.chartType,
            ),
          dependencies: ["chartType"],
        },
        {
          helpText: "在series data上显示或隐藏数据点标签",
          propertyName: "showDataPointLabel",
          label: "Show Labels",
          controlType: "SWITCH",
          isBindProperty: false,
          isTriggerProperty: false,
          hidden: (props: ChartWidgetProps) =>
            ["CUSTOM_FUSION_CHART", "CUSTOM_ECHART"].includes(props.chartType),
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
          hidden: (props: any) => props.chartType == "CUSTOM_ECHART",
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
          hidden: (props: any) =>
            ["CUSTOM_FUSION_CHART", "CUSTOM_ECHART"].includes(props.chartType),
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
          hidden: (props: any) =>
            ["CUSTOM_FUSION_CHART", "CUSTOM_ECHART"].includes(props.chartType),
          dependencies: ["chartType"],
        },
        {
          helpText: "修改x轴标签方向",
          propertyName: "labelOrientation",
          label: "x轴标签方向",
          hidden: (props: ChartWidgetProps) =>
            !isLabelOrientationApplicableFor(props.chartType),
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
};

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
