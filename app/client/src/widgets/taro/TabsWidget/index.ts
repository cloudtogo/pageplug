import Widget from "./widget";
import IconSVG from "./icon.svg";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "标签导航",
  iconSVG: IconSVG,
  needsMeta: true,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "tabs",
    rows: 40,
    columns: 16,
    version: 1,
    list: [
      { name: "标签1", id: 1 },
      { name: "标签2", id: 2 },
      { name: "标签3", id: 3 },
    ],
    nameKey: "name",
    defaultNum: "0",
    showLoading: false,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;
