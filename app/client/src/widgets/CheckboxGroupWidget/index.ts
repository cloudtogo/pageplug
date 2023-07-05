import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import { getDefaultResponsiveBehavior } from "utils/layoutPropertiesUtils";
import IconSVG from "./icon.svg";
import Widget from "./widget";

export const CONFIG = {
  features: {
    dynamicHeight: {
      sectionIndex: 3,
      active: true,
    },
  },
  type: Widget.getWidgetType(),
  name: "勾选组",
  iconSVG: IconSVG,
  needsMeta: true,
  searchTags: ["checkbox group"],
  defaults: {
    rows: 6,
    columns: 23,
    animateLoading: true,
    labelTextSize: "0.875rem",
    options: [
      { label: "蓝", value: "BLUE" },
      { label: "绿", value: "GREEN" },
      { label: "红", value: "RED" },
    ],
    defaultSelectedValues: ["BLUE"],
    isDisabled: false,
    isInline: true,
    isRequired: false,
    isVisible: true,
    labelText: "标签",
    labelPosition: LabelPosition.Top,
    labelAlignment: Alignment.LEFT,
    labelWidth: 5,
    widgetName: "CheckboxGroup",
    version: 2,
    responsiveBehavior: getDefaultResponsiveBehavior(Widget.getWidgetType()),
    minWidth: FILL_WIDGET_MIN_WIDTH,
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
