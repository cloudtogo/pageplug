import { createReducer } from "utils/AppsmithUtils";
import { ReduxActionTypes, ReduxAction } from "constants/ReduxActionConstants";
import { WidgetProps } from "widgets/BaseWidget";
import WidgetConfigResponse from "mockResponses/WidgetConfigResponse";
import { ContainerWidgetProps } from "widgets/ContainerWidget";

import { PickerWidgetProps } from "widgets/taro/PickerWidget";
import { SwiperWidgetProps } from "widgets/taro/SwiperWidget";
import { GridWidgetProps } from "widgets/taro/GridWidget";
import { MTextWidgetProps } from "widgets/taro/TextWidget";
import { MListWidgetProps } from "widgets/taro/ListWidget";
import { MPopupWidgetProps } from "widgets/taro/PopupWidget";
import { MImageWidgetProps } from "widgets/taro/ImageWidget";
import { MButtonWidgetProps } from "widgets/taro/ButtonWidget";
import { MCellWidgetProps } from "widgets/taro/CellWidget";
import { MHtmlWidgetProps } from "widgets/taro/HtmlWidget";
import { MSkuWidgetProps } from "widgets/taro/SkuWidget";
import { MKVWidgetProps } from "widgets/taro/KVWidget";
import { MTabsWidgetProps } from "widgets/taro/TabsWidget";
import { MBottomBarWidgetProps } from "widgets/taro/BottomBarWidget";
import { MActionBarWidgetProps } from "widgets/taro/ActionBarWidget";
import { MSearchWidgetProps } from "widgets/taro/SearchWidget";
import { MLoadingWidgetProps } from "widgets/taro/LoadingWidget";
import { MCheckboxWidgetProps } from "widgets/taro/CheckboxWidget";
import { MFormWidgetProps } from "widgets/taro/FormWidget";

const initialState: WidgetConfigReducerState = WidgetConfigResponse;

export type WidgetBlueprint = {
  view?: Array<{
    type: string;
    size?: { rows: number; cols: number };
    position: { top?: number; left?: number };
    props: Record<string, any>;
  }>;
  operations?: any;
};

export interface WidgetConfigProps {
  rows: number;
  columns: number;
  blueprint?: WidgetBlueprint;
  widgetName: string;
}

export interface WidgetConfigReducerState {
  config: {
    CONTAINER_WIDGET: Partial<ContainerWidgetProps<WidgetProps>> &
      WidgetConfigProps;
    CANVAS_WIDGET: Partial<ContainerWidgetProps<WidgetProps>> &
      WidgetConfigProps;
    TARO_PICKER_WIDGET: Partial<PickerWidgetProps> & WidgetConfigProps;
    TARO_SWIPER_WIDGET: Partial<SwiperWidgetProps> & WidgetConfigProps;
    TARO_GRID_WIDGET: Partial<GridWidgetProps> & WidgetConfigProps;
    TARO_TEXT_WIDGET: Partial<MTextWidgetProps> & WidgetConfigProps;
    TARO_LIST_WIDGET: Partial<MListWidgetProps> & WidgetConfigProps;
    TARO_POPUP_WIDGET: Partial<MPopupWidgetProps> & WidgetConfigProps;
    TARO_IMAGE_WIDGET: Partial<MImageWidgetProps> & WidgetConfigProps;
    TARO_BUTTON_WIDGET: Partial<MButtonWidgetProps> & WidgetConfigProps;
    TARO_CELL_WIDGET: Partial<MCellWidgetProps> & WidgetConfigProps;
    TARO_HTML_WIDGET: Partial<MHtmlWidgetProps> & WidgetConfigProps;
    TARO_SKU_WIDGET: Partial<MSkuWidgetProps> & WidgetConfigProps;
    TARO_KV_WIDGET: Partial<MKVWidgetProps> & WidgetConfigProps;
    TARO_TABS_WIDGET: Partial<MTabsWidgetProps> & WidgetConfigProps;
    TARO_BOTTOM_BAR_WIDGET: Partial<MBottomBarWidgetProps> & WidgetConfigProps;
    TARO_ACTION_BAR_WIDGET: Partial<MActionBarWidgetProps> & WidgetConfigProps;
    TARO_SEARCH_WIDGET: Partial<MSearchWidgetProps> & WidgetConfigProps;
    TARO_LOADING_WIDGET: Partial<MLoadingWidgetProps> & WidgetConfigProps;
    TARO_CHECKBOX_WIDGET: Partial<MCheckboxWidgetProps> & WidgetConfigProps;
    TARO_FORM_WIDGET: Partial<MFormWidgetProps> & WidgetConfigProps;
  };
  configVersion: number;
}

const widgetConfigReducer = createReducer(initialState, {
  [ReduxActionTypes.LOAD_WIDGET_CONFIG]: (
    state: WidgetConfigReducerState,
    action: ReduxAction<WidgetConfigReducerState>
  ) => {
    return { ...action.payload };
  },
});

export default widgetConfigReducer;
