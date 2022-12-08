import { DEFAULT_FONT_SIZE } from "constants/WidgetConstants";
import { OverflowTypes } from "./constants";
import IconSVG from "./icon.svg";
import Widget from "./widget";

export const CONFIG = {
  features: {
    dynamicHeight: {
      sectionIndex: 0,
      active: true,
    },
  },
  type: Widget.getWidgetType(),
  name: "文本",
  iconSVG: IconSVG,
  searchTags: [
    "typography",
    "paragraph",
    "label",
    "text",
    "文字",
    "标题",
    "段落",
    "字符",
  ],
  defaults: {
    text: "文本",
    fontSize: DEFAULT_FONT_SIZE,
    fontStyle: "BOLD",
    textAlign: "LEFT",
    textColor: "#231F20",
    rows: 4,
    columns: 16,
    widgetName: "Text",
    shouldTruncate: false,
    overflow: OverflowTypes.NONE,
    version: 1,
    animateLoading: true,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
    contentConfig: Widget.getPropertyPaneContentConfig(),
    styleConfig: Widget.getPropertyPaneStyleConfig(),
    stylesheetConfig: Widget.getStylesheetConfig(),
  },
};

export default Widget;
