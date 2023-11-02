import Widget from "./widget";
import IconSVG from "./icon.svg";
import { generateReactKey } from "widgets/WidgetUtils";
import { ECHART_TYPE_MAP } from "./constants";
import { WIDGET_TAGS } from "constants/WidgetConstants";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import { ResponsiveBehavior } from "utils/autoLayout/constants";
const DEFAUTL_CHART = {
  name: "",
  chartName: "秋季系列",
  chartType: "LINE_CHART",
  type: ECHART_TYPE_MAP["LINE_CHART"],
  data: [
    {
      value: 335,
      name: "衬衫",
    },
    {
      value: 234,
      name: "羊毛衫",
    },
    {
      value: 1548,
      name: "雪纺衫",
    },
    {
      value: 758,
      name: "裤子",
    },
    {
      value: 358,
      name: "高跟鞋",
    },
    {
      value: 658,
      name: "袜子",
    },
  ],
  xAxisName: "品类",
  yAxisName: "销量",
};
const defaultKey = generateReactKey();
export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "Echarts", // The display name which will be made in uppercase and show in the widgets panel ( can have spaces )
  iconSVG: IconSVG,
  needsMeta: true, // Defines if this widget adds any meta properties
  tags: [WIDGET_TAGS.DISPLAY],
  searchTags: ["graph", "echart", "chart", "visualisations"],
  defaults: {
    widgetName: "Echarts",
    mycustom: 2,
    rows: 32,
    columns: 24,
    version: 1,
    chartData: {
      [defaultKey]: {
        type: DEFAUTL_CHART.type,
        seriesName: DEFAUTL_CHART.chartName,
        data: DEFAUTL_CHART.data,
      },
    },
    chartType: DEFAUTL_CHART.chartType,
    chartName: DEFAUTL_CHART.name,
    xAxisName: DEFAUTL_CHART.xAxisName,
    yAxisName: DEFAUTL_CHART.yAxisName,
    allowScroll: false,
    animateLoading: false,
    customEchartConfig: {
      title: {
        text: "Referer of a Website",
        subtext: "Fake Data",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "50%",
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    },
    responsiveBehavior: ResponsiveBehavior.Fill,
    minWidth: FILL_WIDGET_MIN_WIDTH,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
    contentConfig: Widget.getPropertyPaneContentConfig(),
    styleConfig: Widget.getPropertyPaneStyleConfig(),
    stylesheetConfig: Widget.getStylesheetConfig(),
    autocompleteDefinitions: Widget.getAutocompleteDefinitions(),
    setterConfig: Widget.getSetterConfig(),
  },
  autoLayout: {
    widgetSize: [
      {
        viewportMinWidth: 0,
        configuration: () => {
          return {
            minWidth: "280px",
            minHeight: "300px",
          };
        },
      },
    ],
  },
};

export default Widget;
