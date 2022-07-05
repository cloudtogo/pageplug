import Widget from "./widget";
import IconSVG from "./icon.svg";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "网格",
  iconSVG: IconSVG,
  needsMeta: true,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "grid",
    rows: 24,
    columns: 56,
    list: [
      { url: "", name: "文本" },
      { url: "", name: "文本" },
      { url: "", name: "文本" },
      { url: "", name: "文本" },
      { url: "", name: "文本" },
      { url: "", name: "文本" },
    ],
    urlKey: "url",
    titleKey: "name",
    cols: 4,
    gutter: "0",
    bordered: true,
    gridType: "I_N",
    titleColor: "#646566",
    descriptionColor: "#DD4B34",
    buttonColor: "#03b365",
    priceUnit: "￥",
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;
