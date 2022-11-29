// import { ChartWidgetProps } from "widgets/ChartWidget/widget";
import { EchartWidgetProps } from "widgets/EchartWidget/widget";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
// import { EditorModes } from "components/editorComponents/CodeEditor/EditorConfig";
import {
  // CUSTOM_CHART_TYPES,
  LabelOrientation,
  isLabelOrientationApplicableFor,
} from "../constants";

export default [
  {
    sectionName: "属性",
    children: [
      {
        helpText: "给图表添加标题",
        placeholderText: "Echart 标题",
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
            label: "柱状图",
            value: "BAR_CHART",
          },
          {
            label: "饼图",
            value: "PIE_CHART",
          },
          {
            label: "散点图",
            value: "SCATTER_CHART",
          },
          {
            label: "自定义图表",
            value: "CUSTOM_CHART",
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
              "SCATTER_CHART",
              "CUSTOM_CHART",
            ],
          },
        },
      },
      {
        helpText: "完整配置请查阅 Echart 官方文档",
        placeholderText: `Echart 图表配置`,
        propertyName: "customEchartConfig",
        label: "自定义 Echart 图表",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        // mode: EditorModes.JAVASCRIPT,
        validation: {
          type: ValidationTypes.OBJECT,
          params: {
            allowedKeys: [
              {
                type: ValidationTypes.ARRAY,
                name: "series",
                params: {
                  default: [] || {},
                  required: true,
                },
              },
            ],
          },
        },
        hidden: (props: EchartWidgetProps) =>
          props.chartType !== "CUSTOM_CHART",
        dependencies: ["chartType"],
        evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
      },
      {
        helpText: "给图表添加数据",
        propertyName: "chartData",
        placeholderText: '[{ "name": "2021", "value": 94000 }]',
        label: "图表序列",
        controlType: "ECHART_DATA",
        isBindProperty: false,
        isTriggerProperty: false,
        hidden: (props: EchartWidgetProps) =>
          props.chartType === "CUSTOM_CHART",
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
                        name: "name",
                        type: ValidationTypes.TEXT,
                        params: {
                          required: true,
                          default: "",
                        },
                      },
                      {
                        name: "value",
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
      // {
      //   propertyName: "useDataSet",
      //   label: "使用数据集DataSet",
      //   helpText: "使用数据集设置图表数据",
      //   controlType: "SWITCH",
      //   isJSConvertible: true,
      //   isBindProperty: true,
      //   isTriggerProperty: false,
      //   validation: { type: ValidationTypes.BOOLEAN },
      // },

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
        hidden: (x: EchartWidgetProps) =>
          x.chartType === "CUSTOM_CHART" || x.chartType === "PIE_CHART",
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
        placeholderText: "设置x轴标签",
        label: "x轴标签",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        dependencies: ["chartType"],
      },
      {
        helpText: "设置y轴标签",
        propertyName: "yAxisName",
        placeholderText: "设置y轴标签",
        label: "y轴标签",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        dependencies: ["chartType"],
      },
      {
        helpText: "修改x轴标签方向",
        propertyName: "labelOrientation",
        label: "x轴标签方向",
        hidden: (x: EchartWidgetProps) =>
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
    sectionName: "地图注册配置",
    children: [
      {
        propertyName: "registerMapName",
        label: "地图名称",
        placeholderText: "地图名称",
        helpText: "地图名称",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            regex: /\w+/,
          },
        },
        // hidden: (x: any) => x.chartType !== "CUSTOM_CHART",
        dependencies: ["chartType"],
      },
      {
        helpText: "地图注册JSON数据",
        propertyName: "registerMapJsonUrl",
        label: "JSON链接",
        controlType: "INPUT_TEXT",
        placeholderText: "注册地图JSON数据链接",
        isBindProperty: true,
        isTriggerProperty: false,
        helpLink: "https://datav.aliyun.com/portal/school/atlas/area_selector",
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            default: "",
            required: false,
            // regex: /(http(s?):)([/|.|\w|\s|-])*\.(?:json)/,
          },
        },
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
      {
        propertyName: "backgroundColor",
        helpText: "设置菜单项背景颜色",
        label: "背景颜色",
        controlType: "COLOR_PICKER",
        isBindProperty: true,
        isTriggerProperty: false,
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
            label: "柱状图",
            value: "BAR_CHART",
          },
          {
            label: "饼图",
            value: "PIE_CHART",
          },
          {
            label: "散点图",
            value: "SCATTER_CHART",
          },
          {
            label: "自定义图表",
            value: "CUSTOM_CHART",
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
              "SCATTER_CHART",
              "CUSTOM_CHART",
            ],
          },
        },
      },
      {
        helpText: "完整配置请查阅 Echart 官方文档",
        placeholderText: `Echart 图表配置`,
        propertyName: "customEchartConfig",
        label: "自定义 Echart 图表",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.OBJECT,
          params: {
            allowedKeys: [
              {
                type: ValidationTypes.ARRAY,
                name: "series",
                params: {
                  default: [] || {},
                  required: true,
                },
              },
            ],
          },
        },
        hidden: (props: EchartWidgetProps) =>
          props.chartType !== "CUSTOM_CHART",
        dependencies: ["chartType"],
        // mode: EditorModes.JAVASCRIPT,
        evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
      },
      {
        helpText: "给图表添加数据",
        propertyName: "chartData",
        placeholderText: '[{ "name": "2021", "value": 94000 }]',
        label: "图表序列",
        controlType: "ECHART_DATA",
        isBindProperty: false,
        isTriggerProperty: false,
        hidden: (props: EchartWidgetProps) =>
          props.chartType === "CUSTOM_CHART",
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
                        name: "name",
                        type: ValidationTypes.TEXT,
                        params: {
                          required: true,
                          default: "",
                        },
                      },
                      {
                        name: "value",
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
    sectionName: "属性",
    children: [
      {
        helpText: "给图表添加标题",
        placeholderText: "Echart 标题",
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
        hidden: (x: EchartWidgetProps) =>
          x.chartType === "CUSTOM_CHART" || x.chartType === "PIE_CHART",
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
        hidden: (x: any) => x.chartType === "CUSTOM_CHART",
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
        hidden: (x: any) => x.chartType === "CUSTOM_CHART",
        dependencies: ["chartType"],
      },
      // {
      //   helpText: "修改x轴标签方向",
      //   propertyName: "labelOrientation",
      //   label: "x轴标签方向",
      //   hidden: (x: EchartWidgetProps) =>
      //     !isLabelOrientationApplicableFor(x.chartType),
      //   isBindProperty: false,
      //   isTriggerProperty: false,
      //   dependencies: ["chartType"],
      //   controlType: "DROP_DOWN",
      //   options: [
      //     {
      //       label: "自动",
      //       value: LabelOrientation.AUTO,
      //     },
      //     {
      //       label: "倾斜",
      //       value: LabelOrientation.SLANT,
      //     },
      //     {
      //       label: "旋转",
      //       value: LabelOrientation.ROTATE,
      //     },
      //     {
      //       label: "交错",
      //       value: LabelOrientation.STAGGER,
      //     },
      //   ],
      // },
    ],
  },
  {
    sectionName: "地图注册配置",
    children: [
      {
        propertyName: "registerMapName",
        label: "地图名称",
        helpText: "地图名称",
        placeholderText: "地图名称",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            regex: /\w+/,
          },
        },
        // hidden: (x: any) => x.chartType === "CUSTOM_CHART",
        dependencies: ["chartType"],
      },
      {
        helpText: "地图注册JSON数据",
        propertyName: "registerMapJsonUrl",
        label: "JSON链接",
        controlType: "INPUT_TEXT",
        placeholderText: "注册地图JSON数据链接",
        isBindProperty: true,
        isTriggerProperty: false,
        helpLink: "https://datav.aliyun.com/portal/school/atlas/area_selector",
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            default: "",
            required: false,
            // regex: /(http(s?):)([/|.|\w|\s|-])*\.(?:json)/,
          },
        },
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
      {
        propertyName: "backgroundColor",
        helpText: "设置菜单项背景颜色",
        label: "背景颜色",
        controlType: "COLOR_PICKER",
        isBindProperty: true,
        isTriggerProperty: false,
      },
    ],
  },
];
