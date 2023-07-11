import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import { ResponsiveBehavior } from "utils/autoLayout/constants";

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
<<<<<<< HEAD
<<<<<<< HEAD
      { label: "特别小", value: "xs" },
      { label: "小", value: "sm" },
      { label: "中", value: "md" },
      { label: "大", value: "lg" },
      { label: "特别大", value: "xl" },
=======
=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      { label: "xs", value: "xs" },
      { label: "sm", value: "sm" },
      { label: "md", value: "md" },
      { label: "lg", value: "lg" },
      { label: "xl", value: "xl" },
<<<<<<< HEAD
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
    ],
    defaultOptionValue: "md",
    isVisible: true,
    isDisabled: false,
    showMarksLabel: true,
    rows: 8,
    columns: 40,
    widgetName: "CategorySlider",
    shouldScroll: false,
    shouldTruncate: false,
    version: 1,
    animateLoading: true,
<<<<<<< HEAD
<<<<<<< HEAD
    labelText: "尺寸",
    labelPosition: LabelPosition.Left,
=======
    labelText: "Size",
    labelPosition: LabelPosition.Top,
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
=======
    labelText: "Size",
    labelPosition: LabelPosition.Top,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
    labelAlignment: Alignment.LEFT,
    labelWidth: 5,
    labelTextSize: "0.875rem",
    sliderSize: "m",
    responsiveBehavior: ResponsiveBehavior.Fill,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
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
      rows: 7,
      columns: 40,
    },
    widgetSize: [
      {
        viewportMinWidth: 0,
        configuration: () => {
          return {
            minWidth: "180px",
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
