import Widget from "./widget";
import IconSVG from "./icon.svg";
import { WIDGET_TAGS } from "constants/WidgetConstants";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import { ResponsiveBehavior } from "utils/autoLayout/constants";

export const CONFIG = {
  features: {
    dynamicHeight: {
      sectionIndex: 0,
      active: true,
    },
  },
  type: Widget.getWidgetType(),
  name: "Formily表单",
  searchTags: ["form", "submit"],
  tags: [WIDGET_TAGS.INPUTS],
  iconSVG: IconSVG,
  needsMeta: true,
  isCanvas: false,
  defaults: {
    widgetName: "formily",
    rows: 48,
    columns: 32,
    version: 1,
    formType: "PLAIN",
    triggerLabel: "打开表单",
    title: "表单标题",
    submitLabel: "提交",
    showReset: true,
    resetLabel: "重置",
    componentSize: "middle",
    modalWidth: "520px",
    drawerWidth: "520px",
    responsiveBehavior: ResponsiveBehavior.Fill,
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
    setterConfig: Widget.getSetterConfig(),
  },
  autoLayout: {
    widgetSize: [
      {
        viewportMinWidth: 0,
        configuration: () => {
          return {
            minWidth: "280px",
            minHeight: "300px",
          };
        },
      },
    ],
  },
};

export default Widget;
