import Widget from "./widget";
import IconSVG from "./icon.svg";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "按钮",
  iconSVG: IconSVG,
  needsMeta: false,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "button",
    rows: 4,
    columns: 24,
    version: 1,
    rounded: true,
    text: "好的",
    fontSize: "16px",
    showLoading: true,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;
