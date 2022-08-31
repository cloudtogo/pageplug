import Widget from "./widget";
import IconSVG from "./icon.svg";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "Formily表单",
  iconSVG: IconSVG,
  needsMeta: true,
  isCanvas: false,
  defaults: {
    widgetName: "formily",
    rows: 48,
    columns: 32,
    version: 1,
    formType: "PLAIN",
    triggerLabel: "打开表单",
    title: "表单标题",
    submitLabel: "提交",
    showReset: true,
    resetLabel: "重置",
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;
