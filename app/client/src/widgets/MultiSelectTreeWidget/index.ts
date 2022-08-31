import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import IconSVG from "./icon.svg";
import Widget from "./widget";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "下拉树形多选",
  iconSVG: IconSVG,
  needsMeta: true,
  searchTags: ["dropdown"],
  defaults: {
    rows: 4,
    columns: 20,
    mode: "SHOW_ALL",
    animateLoading: true,
    options: [
      {
        label: "蓝",
        value: "BLUE",
        children: [
          {
            label: "深蓝",
            value: "DARK BLUE",
          },
          {
            label: "浅蓝",
            value: "LIGHT BLUE",
          },
        ],
      },
      { label: "绿", value: "GREEN" },
      { label: "红", value: "RED" },
    ],
    widgetName: "MultiTreeSelect",
    defaultOptionValue: ["GREEN"],
    version: 1,
    isVisible: true,
    isRequired: false,
    isDisabled: false,
    allowClear: false,
    expandAll: false,
    placeholderText: "请选择",
    labelText: "标签",
    labelPosition: LabelPosition.Left,
    labelAlignment: Alignment.LEFT,
    labelWidth: 5,
    labelTextSize: "0.875rem",
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
