import IconSVG from "./icon.svg";
import { Alignment } from "@blueprintjs/core";
import Widget from "./widget";
import { LabelPosition } from "components/constants";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "单选组",
  iconSVG: IconSVG,
  needsMeta: true,
  searchTags: ["choice"],
  defaults: {
    rows: 4,
    columns: 20,
    animateLoading: true,
    label: "标签",
    labelPosition: LabelPosition.Left,
    labelAlignment: Alignment.LEFT,
    labelTextSize: "0.875rem",
    labelWidth: 5,
    options: [
      { label: "是", value: "Y" },
      { label: "不是", value: "N" },
    ],
    defaultOptionValue: "Y",
    isRequired: false,
    isDisabled: false,
    isInline: true,
    alignment: Alignment.LEFT,
    widgetName: "RadioGroup",
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
