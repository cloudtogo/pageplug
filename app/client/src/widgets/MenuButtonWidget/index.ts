import Widget from "./widget";
import IconSVG from "./icon.svg";
import { ButtonPlacementTypes, ButtonVariantTypes } from "components/constants";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "菜单按钮",
  iconSVG: IconSVG,
  defaults: {
    label: "打开菜单",
    menuVariant: ButtonVariantTypes.PRIMARY,
    placement: ButtonPlacementTypes.CENTER,
    isCompact: false,
    isDisabled: false,
    isVisible: true,
    animateLoading: true,
    menuItems: {
      menuItem1: {
        label: "第一项",
        id: "menuItem1",
        widgetId: "",
        isVisible: true,
        isDisabled: false,
        index: 0,
      },
      menuItem2: {
        label: "第二项",
        id: "menuItem2",
        widgetId: "",
        isVisible: true,
        isDisabled: false,
        index: 1,
      },
      menuItem3: {
        label: "第三项",
        id: "menuItem3",
        widgetId: "",
        isVisible: true,
        isDisabled: false,
        index: 2,
      },
    },
    rows: 4,
    columns: 16,
    widgetName: "MenuButton",
    version: 1,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
    contentConfig: Widget.getPropertyPaneContentConfig(),
    styleConfig: Widget.getPropertyPaneStyleConfig(),
  },
};

export default Widget;
