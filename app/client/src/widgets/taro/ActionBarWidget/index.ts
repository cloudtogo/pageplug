import Widget from "./widget";
import IconSVG from "./icon.svg";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "动作栏",
  iconSVG: IconSVG,
  needsMeta: false,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "action_bar",
    rows: 8,
    columns: 56,
    version: 1,
    actionsObj: {
      action1: {
        label: "购物车",
        id: "action1",
        widgetId: "",
        index: 0,
        type: "icon",
        badge: "6",
        icon: "cart-o",
      },
      action2: {
        label: "加入购物车",
        id: "action2",
        widgetId: "",
        index: 1,
        type: "button",
        buttonType: "warning",
      },
      action3: {
        label: "立即购买",
        id: "action3",
        widgetId: "",
        index: 2,
        type: "button",
        buttonType: "danger",
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
