import Widget from "./widget";
import IconSVG from "./icon.svg";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "底部弹窗",
  iconSVG: IconSVG,
  needsMeta: true,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "popup",
    rows: 40,
    columns: 64,
    // detachFromLayout is set true for widgets that are not bound to the widgets within the layout.
    // setting it to true will only render the widgets(from sidebar) on the main container without any collision check.
    detachFromLayout: true,
    canOutsideClickClose: true,
    rounded: true,
    height: 400,
    children: [],
    version: 1,
    blueprint: {
      view: [
        {
          type: "CANVAS_WIDGET",
          position: { left: 0, top: 0 },
          props: {
            detachFromLayout: true,
            canExtend: false,
            isVisible: true,
            isDisabled: false,
            shouldScrollContents: false,
            children: [],
            version: 1,
          },
        },
      ],
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
