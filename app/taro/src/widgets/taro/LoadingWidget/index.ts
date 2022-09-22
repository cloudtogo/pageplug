import Widget from "./widget";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "加载遮罩",
  iconSVG: null,
  needsMeta: false,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "loading",
    rows: 8,
    columns: 16,
    version: 1,
    detachFromLayout: true,
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
