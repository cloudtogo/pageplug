import { LabelPosition } from "components/constants";
import { Alignment } from "@blueprintjs/core";

import IconSVG from "./icon.svg";
import Widget from "./widget";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "类别滑动条",
  needsMeta: true,
  searchTags: ["range", "category slider"],
  iconSVG: IconSVG,
  defaults: {
    options: [
      { label: "特别小", value: "xs" },
      { label: "小", value: "sm" },
      { label: "中", value: "md" },
      { label: "大", value: "lg" },
      { label: "特别大", value: "xl" },
    ],
    defaultOptionValue: "md",
    isVisible: true,
    isDisabled: false,
    showMarksLabel: false,
    rows: 8,
    columns: 42,
    widgetName: "CategorySlider",
    shouldScroll: false,
    shouldTruncate: false,
    version: 1,
    animateLoading: true,
    labelText: "尺寸",
    labelPosition: LabelPosition.Left,
    labelAlignment: Alignment.LEFT,
    labelWidth: 5,
    labelTextSize: "0.875rem",
    sliderSize: "m",
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
