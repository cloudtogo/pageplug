import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import IconSVG from "./icon.svg";
import Widget from "./widget";
import { WIDGET_TAGS } from "constants/WidgetConstants";

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
  tags: [WIDGET_TAGS.TOGGLES],
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
    setterConfig: Widget.getSetterConfig(),
  },
  autoLayout: {
    defaults: {
      columns: 14,
      rows: 7,
    },
    disabledPropsDefaults: {
      labelPosition: LabelPosition.Top,
    },
    autoDimension: {
      height: true,
    },
    widgetSize: [
      {
        viewportMinWidth: 0,
        configuration: () => {
          return {
            minWidth: "240px",
            minHeight: "70px",
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
