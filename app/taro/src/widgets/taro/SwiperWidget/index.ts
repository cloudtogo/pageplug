import Widget from "./widget";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "轮播",
  iconSVG: null,
  needsMeta: false,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "swiper",
    rows: 24,
    columns: 56,
    list: [
      { url: "https://img01.yzcdn.cn/vant/apple-1.jpg" },
      { url: "https://img01.yzcdn.cn/vant/apple-2.jpg" },
      { url: "https://img01.yzcdn.cn/vant/apple-3.jpg" },
      { url: "https://img01.yzcdn.cn/vant/apple-4.jpg" },
    ],
    urlKey: "url",
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;
