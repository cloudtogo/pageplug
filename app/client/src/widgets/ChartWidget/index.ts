import { Colors } from "constants/Colors";
import { generateReactKey } from "widgets/WidgetUtils";
import { LabelOrientation } from "./constants";
import IconSVG from "./icon.svg";
import Widget from "./widget";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "图表",
  iconSVG: IconSVG,
  needsMeta: true,
  searchTags: ["graph", "visuals", "visualisations"],
  defaults: {
    rows: 32,
    columns: 24,
    widgetName: "Chart",
    chartType: "COLUMN_CHART",
    chartName: "销售报告",
    allowScroll: false,
    version: 1,
    animateLoading: true,
    chartData: {
      [generateReactKey()]: {
        seriesName: "销售额",
        data: [
          {
            x: "产品1",
            y: 20000,
          },
          {
            x: "产品2",
            y: 22000,
          },
          {
            x: "产品3",
            y: 32000,
          },
        ],
      },
    },
    xAxisName: "产品线",
    yAxisName: "收入（元）",
    labelOrientation: LabelOrientation.AUTO,
    customFusionChartConfig: {
      type: "column2d",
      dataSource: {
        data: [
          {
            label: "产品1",
            value: 20000,
          },
          {
            label: "产品2",
            value: 22000,
          },
          {
            label: "产品3",
            value: 32000,
          },
        ],
        chart: {
          caption: "销售报告",
          xAxisName: "产品线",
          yAxisName: "收入（元）",
          theme: "fusion",
          alignCaptionWithCanvas: 1,
          // Caption styling =======================
          captionFontSize: "24",
          captionAlignment: "center",
          captionPadding: "20",
          captionFontColor: Colors.THUNDER,
          // legend position styling ==========
          legendIconSides: "4",
          legendIconBgAlpha: "100",
          legendIconAlpha: "100",
          legendPosition: "top",
          // Canvas styles ========
          canvasPadding: "0",
          // Chart styling =======
          chartLeftMargin: "20",
          chartTopMargin: "10",
          chartRightMargin: "40",
          chartBottomMargin: "10",
          // Axis name styling ======
          xAxisNameFontSize: "14",
          labelFontSize: "12",
          labelFontColor: Colors.DOVE_GRAY2,
          xAxisNameFontColor: Colors.DOVE_GRAY2,

          yAxisNameFontSize: "14",
          yAxisValueFontSize: "12",
          yAxisValueFontColor: Colors.DOVE_GRAY2,
          yAxisNameFontColor: Colors.DOVE_GRAY2,
        },
      },
    },
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
    contentConfig: Widget.getPropertyPaneContentConfig(),
    styleConfig: Widget.getPropertyPaneStyleConfig(),
  },
};

export default Widget;
