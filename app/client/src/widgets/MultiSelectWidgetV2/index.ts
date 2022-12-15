import Widget from "./widget";
import IconSVG from "./icon.svg";
import { LabelPosition } from "components/constants";
import { Alignment } from "@blueprintjs/core";
import { DynamicHeight } from "utils/WidgetFeatures";

export const CONFIG = {
  features: {
    dynamicHeight: {
      sectionIndex: 4,
      defaultValue: DynamicHeight.FIXED,
      active: true,
    },
  },
  type: Widget.getWidgetType(),
  name: "下拉多选",
  iconSVG: IconSVG,
  needsMeta: true,
  searchTags: ["dropdown", "tags", "multi select"],
  defaults: {
    rows: 7,
    columns: 20,
    animateLoading: true,
    labelText: "标签",
    labelPosition: LabelPosition.Top,
    labelAlignment: Alignment.LEFT,
    labelWidth: 5,
    labelTextSize: "0.875rem",
    options: [
      { label: "蓝", value: "BLUE" },
      { label: "绿", value: "GREEN" },
      { label: "红", value: "RED" },
    ],
    widgetName: "MultiSelect",
    isFilterable: true,
    serverSideFiltering: false,
    defaultOptionValue: ["GREEN", "RED"],
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
    contentConfig: Widget.getPropertyPaneContentConfig(),
    styleConfig: Widget.getPropertyPaneStyleConfig(),
    stylesheetConfig: Widget.getStylesheetConfig(),
  },
};

export default Widget;
