import IconSVG from "./icon.svg";
import Widget from "./widget";
import { ButtonPlacementTypes } from "components/constants";
import { ScannerLayout } from "./constants";
import { ResponsiveBehavior } from "utils/autoLayout/constants";
import { WIDGET_TAGS } from "constants/WidgetConstants";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "扫码器",
  iconSVG: IconSVG,
  tags: [WIDGET_TAGS.FEATRUE],
  needsMeta: true,
  searchTags: [
    "barcode scanner",
    "qr scanner",
    "code detector",
    "barcode reader",
    "code scanner",
    "二维码",
    "条形码",
  ],
  defaults: {
    rows: 33,
    label: "扫描二维码/条形码",
    columns: 25,
    widgetName: "CodeScanner",
    isDefaultClickDisabled: true,
    scannerLayout: ScannerLayout.ALWAYS_ON,
    version: 1,
    isRequired: false,
    isDisabled: false,
    animateLoading: false,
    placement: ButtonPlacementTypes.CENTER,
    responsiveBehavior: ResponsiveBehavior.Fill,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    styleConfig: Widget.getPropertyPaneStyleConfig(),
    contentConfig: Widget.getPropertyPaneContentConfig(),
    stylesheetConfig: Widget.getStylesheetConfig(),
    setterConfig: Widget.getSetterConfig(),
    autocompleteDefinitions: Widget.getAutocompleteDefinitions(),
  },
  autoLayout: {
    disabledPropsDefaults: {
      scannerLayout: ScannerLayout.ALWAYS_ON,
    },
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
