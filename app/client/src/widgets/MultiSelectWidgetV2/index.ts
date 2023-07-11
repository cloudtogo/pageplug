import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import { ResponsiveBehavior } from "utils/autoLayout/constants";
import { DynamicHeight } from "utils/WidgetFeatures";

import IconSVG from "./icon.svg";
import Widget from "./widget";

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
    contentConfig: Widget.getPropertyPaneContentConfig(),
    styleConfig: Widget.getPropertyPaneStyleConfig(),
    stylesheetConfig: Widget.getStylesheetConfig(),
    autocompleteDefinitions: Widget.getAutocompleteDefinitions(),
  },
  autoLayout: {
    disabledPropsDefaults: {
      labelPosition: LabelPosition.Top,
      labelTextSize: "0.875rem",
    },
    defaults: {
      rows: 6.6,
    },
    autoDimension: {
      height: true,
    },
    widgetSize: [
      {
        viewportMinWidth: 0,
        configuration: () => {
          return {
            minWidth: "160px",
          };
        },
      },
    ],
    disableResizeHandles: {
      vertical: true,
    },
  },
};

export default Widget;
