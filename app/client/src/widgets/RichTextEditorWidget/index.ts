import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import IconSVG from "./icon.svg";
import Widget from "./widget";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "富文本编辑器",
  iconSVG: IconSVG,
  needsMeta: true,
  searchTags: ["input", "rte"],
  defaults: {
    defaultText: "编辑器初始<b>内容</b>",
    rows: 20,
    columns: 24,
    animateLoading: true,
    isDisabled: false,
    isVisible: true,
    isRequired: false,
    widgetName: "RichTextEditor",
    isDefaultClickDisabled: true,
    inputType: "html",
    labelText: "标签",
    labelPosition: LabelPosition.Top,
    labelAlignment: Alignment.LEFT,
    labelWidth: 5,
    version: 1,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
    contentConfig: Widget.getPropertyPaneContentConfig(),
    styleConfig: Widget.getPropertyPaneStyleConfig(),
  },
};

export default Widget;
