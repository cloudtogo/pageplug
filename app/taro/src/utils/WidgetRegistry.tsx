import { registerWidget } from "./WidgetRegisterHelpers";
import { WidgetConfiguration } from "widgets/constants";
import CanvasWidget, {
  CONFIG as CANVAS_WIDGET_CONFIG,
} from "widgets/CanvasWidget";
import ContainerWidget, {
  CONFIG as CONTAINER_WIDGET_CONFIG,
} from "widgets/ContainerWidget";
import SkeletonWidget, {
  CONFIG as SKELETON_WIDGET_CONFIG,
} from "widgets/SkeletonWidget";

import MButtonWidget, {
  CONFIG as TARO_BUTTON_WIDGET_CONFIG,
} from "widgets/taro/ButtonWidget";
import MActionBarWidget, {
  CONFIG as TARO_ACITON_BAR_WIDGET_CONFIG,
} from "widgets/taro/ActionBarWidget";
import MBottomBarWidget, {
  CONFIG as TARO_BOTTOM_BAR_WIDGET_CONFIG,
} from "widgets/taro/BottomBarWidget";
import MCellWidget, {
  CONFIG as TARO_CELL_WIDGET_CONFIG,
} from "widgets/taro/CellWidget";
import MCheckboxWidget, {
  CONFIG as TARO_CHECKBOX_WIDGET_CONFIG,
} from "widgets/taro/CheckboxWidget";
import MFormWidget, {
  CONFIG as TARO_FORM_WIDGET_CONFIG,
} from "widgets/taro/FormWidget";
import MGridWidget, {
  CONFIG as TARO_GRID_WIDGET_CONFIG,
} from "widgets/taro/GridWidget";
import MHtmlWidget, {
  CONFIG as TARO_HTML_WIDGET_CONFIG,
} from "widgets/taro/HtmlWidget";
import MImageWidget, {
  CONFIG as TARO_IMAGE_WIDGET_CONFIG,
} from "widgets/taro/ImageWidget";
import MKVWidget, {
  CONFIG as TARO_KV_WIDGET_CONFIG,
} from "widgets/taro/KVWidget";
import MListWidget, {
  CONFIG as TARO_LIST_WIDGET_CONFIG,
} from "widgets/taro/ListWidget";
import MLoadingWidget, {
  CONFIG as TARO_LOADING_WIDGET_CONFIG,
} from "widgets/taro/LoadingWidget";
import MPopupWidget, {
  CONFIG as TARO_POPUP_WIDGET_CONFIG,
} from "widgets/taro/PopupWidget";
import MSearchWidget, {
  CONFIG as TARO_SEARCH_WIDGET_CONFIG,
} from "widgets/taro/SearchWidget";
import MSkuWidget, {
  CONFIG as TARO_SKU_WIDGET_CONFIG,
} from "widgets/taro/SkuWidget";
import MSwiperWidget, {
  CONFIG as TARO_SWIPER_WIDGET_CONFIG,
} from "widgets/taro/SwiperWidget";
import MTabsWidget, {
  CONFIG as TARO_TABS_WIDGET_CONFIG,
} from "widgets/taro/TabsWidget";
import MTextWidget, {
  CONFIG as TARO_TEXT_WIDGET_CONFIG,
} from "widgets/taro/TextWidget";

export const ALL_WIDGETS_AND_CONFIG = [
  [CanvasWidget, CANVAS_WIDGET_CONFIG],
  [SkeletonWidget, SKELETON_WIDGET_CONFIG],
  [ContainerWidget, CONTAINER_WIDGET_CONFIG],

  [MButtonWidget, TARO_BUTTON_WIDGET_CONFIG],
  [MActionBarWidget, TARO_ACITON_BAR_WIDGET_CONFIG],
  [MBottomBarWidget, TARO_BOTTOM_BAR_WIDGET_CONFIG],
  [MCellWidget, TARO_CELL_WIDGET_CONFIG],
  [MCheckboxWidget, TARO_CHECKBOX_WIDGET_CONFIG],
  [MFormWidget, TARO_FORM_WIDGET_CONFIG],
  [MGridWidget, TARO_GRID_WIDGET_CONFIG],
  [MHtmlWidget, TARO_HTML_WIDGET_CONFIG],
  [MImageWidget, TARO_IMAGE_WIDGET_CONFIG],
  [MKVWidget, TARO_KV_WIDGET_CONFIG],
  [MListWidget, TARO_LIST_WIDGET_CONFIG],
  [MLoadingWidget, TARO_LOADING_WIDGET_CONFIG],
  [MPopupWidget, TARO_POPUP_WIDGET_CONFIG],
  [MSearchWidget, TARO_SEARCH_WIDGET_CONFIG],
  [MSkuWidget, TARO_SKU_WIDGET_CONFIG],
  [MSwiperWidget, TARO_SWIPER_WIDGET_CONFIG],
  [MTabsWidget, TARO_TABS_WIDGET_CONFIG],
  [MTextWidget, TARO_TEXT_WIDGET_CONFIG],
];

export const registerWidgets = () => {
  for (const widget of ALL_WIDGETS_AND_CONFIG) {
    registerWidget(widget[0], widget[1] as WidgetConfiguration);
  }
};
