import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import { ResponsiveBehavior } from "utils/autoLayout/constants";

import IconSVG from "./icon.svg";
import Widget from "./widget";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "下拉多选",
  searchTags: ["multi select"],
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
<<<<<<< HEAD
<<<<<<< HEAD
    placeholderText: "请选择",
    responsiveBehavior: getDefaultResponsiveBehavior(Widget.getWidgetType()),
=======
    placeholderText: "Select option(s)",
    responsiveBehavior: ResponsiveBehavior.Fill,
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
=======
    placeholderText: "Select option(s)",
    responsiveBehavior: ResponsiveBehavior.Fill,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
    minWidth: FILL_WIDGET_MIN_WIDTH,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
    stylesheetConfig: Widget.getStylesheetConfig(),
    autocompleteDefinitions: Widget.getAutocompleteDefinitions(),
  },
};

export default Widget;
