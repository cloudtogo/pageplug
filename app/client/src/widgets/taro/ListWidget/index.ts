import Widget from "./widget";
import IconSVG from "./icon.svg";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "列表",
  iconSVG: IconSVG,
  needsMeta: true,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "list",
    rows: 24,
    columns: 56,
    list: [
      { url: "", name: "标题", description: "描述" },
      { url: "", name: "标题", description: "描述" },
      { url: "", name: "标题", description: "描述" },
      { url: "", name: "标题", description: "描述" },
    ],
    urlKey: "url",
    titleKey: "name",
    descriptionKey: "description",
    contentType: "I_N_D",
    controlType: "BUTTON",
    width: "100px",
    height: "80px",
    inset: false,
    titleColor: "#646566",
    descriptionColor: "#999",
    priceColor: "#DD4B34",
    buttonColor: "#03b365",
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;
