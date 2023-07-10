import { Colors } from "constants/Colors";
import IconSVG from "./icon.svg";
import Widget from "./widget";
import type { RateWidgetProps } from "./widget";

export const CONFIG = {
  features: {
    dynamicHeight: {
      sectionIndex: 1,
      active: true,
    },
  },
  type: Widget.getWidgetType(),
  name: "评分",
  iconSVG: IconSVG,
  needsMeta: true,
  searchTags: ["stars", "rating"],
  defaults: {
    rows: 4,
    columns: 20,
    animateLoading: true,
    maxCount: 5,
    defaultRate: 3,
    activeColor: Colors.RATE_ACTIVE,
    inactiveColor: Colors.ALTO2,
    size: "LARGE",
    isRequired: false,
    isAllowHalf: false,
    isDisabled: false,
    isReadOnly: false,
    tooltips: ["烂透了", "不好", "一般", "好", "好极了"],
    widgetName: "Rating",
  },
  autoLayout: {
    disabledPropsDefaults: {
      size: "LARGE",
    },
    defaults: {
      columns: 7.272727,
      rows: 4,
    },
    autoDimension: {
      width: true,
    },
    widgetSize: [
      {
        viewportMinWidth: 0,
        configuration: (props: RateWidgetProps) => {
          let maxCount = props.maxCount;
          if (typeof maxCount !== "number")
            maxCount = parseInt(props.maxCount as any, 10);
          return {
            // 21 is the size of a star, 5 is the margin between stars
            minWidth: `${maxCount * 21 + (maxCount + 1) * 5}px`,
          };
        },
      },
    ],
    disableResizeHandles: {
      horizontal: true,
      vertical: true,
    },
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
};

export default Widget;
