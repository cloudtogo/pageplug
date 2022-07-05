import Widget from "./widget";
import IconSVG from "./icon.svg";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "表单",
  iconSVG: IconSVG,
  needsMeta: true,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "form",
    rows: 24,
    columns: 56,
    version: 1,
    fieldsObj: {
      user: {
        label: "用户名",
        id: "user",
        name: "user",
        widgetId: "",
        fieldType: "input",
        required: true,
        inputType: "text",
        index: 0,
      },
      password: {
        label: "密码",
        id: "password",
        name: "password",
        widgetId: "",
        fieldType: "input",
        required: true,
        inputType: "password",
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
