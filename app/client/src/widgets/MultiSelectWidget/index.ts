import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import IconSVG from "./icon.svg";
import Widget from "./widget";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "下拉多选",
  iconSVG: IconSVG,
  needsMeta: true,
  hideCard: true,
  isDeprecated: true,
  replacement: "MULTI_SELECT_WIDGET_V2",
  defaults: {
    rows: 7,
    columns: 20,
    animateLoading: true,
    labelText: "标签",
    labelPosition: LabelPosition.Left,
    labelAlignment: Alignment.LEFT,
    labelWidth: 5,
    options: [
      { label: "蓝", value: "BLUE" },
      { label: "绿", value: "GREEN" },
      { label: "红", value: "RED" },
    ],
    widgetName: "MultiSelect",
    serverSideFiltering: false,
    defaultOptionValue: ["GREEN"],
    version: 1,
    isRequired: false,
    isDisabled: false,
    placeholderText: "请选择",
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;
