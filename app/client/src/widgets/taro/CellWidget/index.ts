import Widget from "./widget";
import IconSVG from "./icon.svg";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "单元格",
  iconSVG: IconSVG,
  needsMeta: false,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "cell",
    rows: 12,
    columns: 56,
    version: 1,
    inset: false,
    bordered: false,
    cellsObj: {
      cell1: {
        label: "单元格 1",
        id: "cell1",
        widgetId: "",
        isVisible: true,
        picType: "none",
        showArrow: true,
        index: 0,
      },
      cell2: {
        label: "单元格 2",
        id: "cell2",
        widgetId: "",
        isVisible: true,
        picType: "none",
        showArrow: true,
        index: 1,
      },
    },
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;
