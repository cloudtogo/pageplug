import Widget from "./widget";
import IconSVG from "./icon.svg";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "键值对",
  iconSVG: IconSVG,
  needsMeta: false,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "kv",
    rows: 24,
    columns: 48,
    version: 1,
    list: [
      { key: "绿蚁新醅酒", value: "红泥小火炉" },
      { key: "晚来天欲雪", value: "能饮一杯无" },
    ],
    kKey: "key",
    vKey: "value",
    layout: "h",
    inset: false,
    kColor: "#666",
    kSize: "PARAGRAPH",
    kBold: false,
    kAlign: "LEFT",
    vColor: "#333",
    vSize: "PARAGRAPH",
    vBold: true,
    vAlign: "LEFT",
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;
