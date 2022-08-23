import { DEFAULT_FONT_SIZE } from "constants/WidgetConstants";
import Widget from "./widget";
import IconSVG from "./icon.svg";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "文本",
  iconSVG: IconSVG,
  needsMeta: false,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "text",
    text: "文本",
    fontSize: DEFAULT_FONT_SIZE,
    textAlign: "LEFT",
    textColor: "#333",
    rows: 4,
    columns: 16,
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
