import { Colors } from "constants/Colors";
import { WIDGET_TAGS } from "constants/WidgetConstants";
import IconSVG from "./icon.svg";
import Widget from "./widget";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "环形进度条",
  searchTags: ["circular progress"],
  tags: [WIDGET_TAGS.DISPLAY],
  isDeprecated: true,
  replacement: "PROGRESS_WIDGET",
  iconSVG: IconSVG,
  defaults: {
    counterClockWise: false,
    fillColor: Colors.GREEN,
    isVisible: true,
    progress: 65,
    showResult: true,

    rows: 17,
    columns: 16,
    widgetName: "CircularProgress",
    shouldScroll: false,
    shouldTruncate: false,
    version: 1,
    animateLoading: false,
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
