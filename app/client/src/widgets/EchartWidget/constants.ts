export type ChartType =
  | "LINE_CHART"
  | "BAR_CHART"
  | "PIE_CHART"
  | "COLUMN_CHART"
  | "AREA_CHART"
  | "SCATTER_CHART"
  | "CUSTOM_CHART";

export interface ChartDataPoint {
  x: any;
  y: any;
}

export interface DataSetT {
  value: any;
  name: string;
}

export interface ChartData {
  name?: string;
  seriesName?: string;
  data: DataSetT[];
  type: string;
}

export interface CustomFusionChartConfig {
  type: string;
  dataSource?: any;
}

export interface AllChartData {
  [key: string]: ChartData;
}

export interface ChartSelectedDataPoint {
  x: any;
  y: any;
  seriesTitle: string;
}

export const defaultColors = [
  "#3366FF",
  "#91cc75",
  "#fac858",
  "#ee6666",
  "#38AFF4",
  "#03b365",
  "#fc8452",
  "#9a60b4",
  "#ea7ccc",
];

export const CUSTOM_CHART_TYPES = [
  "line",
  "bar",
  "pie",
  "scatter",
  "effectScatter",
  "radar",
  "tree",
  "treemap",
  "sunburst",
  "boxplot",
  "candlestick",
  "heatmap",
  "map",
  "parallel",
  "lines",
  "graph",
  "sankey",
  "funnel",
  "gauge",
  "pictorialBar",
  "themeRiver",
  "custom",
];

type Feature = {
  type: string;
  properties: any;
};

export interface RegisterMapData {
  type: string;
  features: Feature[];
}

export const CUSTOM_CHART_DEFAULT_PARSED = {
  type: "",
  xAxis: {},
  yAxis: {},
  series: [],
};

export enum LabelOrientation {
  AUTO = "auto",
  SLANT = "slant",
  ROTATE = "rotate",
  STAGGER = "stagger",
}

export enum AxisType {
  CATEGORY = "category",
  VALUE = "value",
  TIME = "time",
  LOG = "log",
}

export const LABEL_ORIENTATION_COMPATIBLE_CHARTS = [
  "LINE_CHART",
  "AREA_CHART",
  "COLUMN_CHART",
];

export const ECHART_TYPE_MAP: any = {
  LINE_CHART: "line",
  BAR_CHART: "bar",
  PIE_CHART: "pie",
  COLUMN_CHART: "bar",
  AREA_CHART: "line",
  SCATTER_CHART: "scatter",
  CUSTOM_CHART: "custom",
};

export const NO_AXIS: any = {
  PIE_CHART: 1,
  CUSTOM_CHART: 1,
};

export const isLabelOrientationApplicableFor = (chartType: string) =>
  LABEL_ORIENTATION_COMPATIBLE_CHARTS.includes(chartType);

export const ECHART_BASIC_OPTION = {
  xAxis: {
    type: "category",
  },
  animation: true,
  yAxis: {
    type: "value",
  },
  series: [],
};
