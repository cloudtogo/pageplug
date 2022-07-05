import Widget from "./widget";
import IconSVG from "./icon.svg";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "HTML",
  iconSVG: IconSVG,
  needsMeta: false,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "html",
    rows: 24,
    columns: 56,
    content:
      "<p style='font-size: 36px; font-weight: bold; font-family: fangsong; background:red; color:black; text-align: center;'>恭喜发财 大吉大利</p>",
    version: 1,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;
