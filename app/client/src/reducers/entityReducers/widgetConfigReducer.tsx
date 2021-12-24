import { createReducer } from "utils/AppsmithUtils";
import { ReduxActionTypes, ReduxAction } from "constants/ReduxActionConstants";
import { WidgetProps } from "widgets/BaseWidget";
import WidgetConfigResponse from "mockResponses/WidgetConfigResponse";
import { ButtonWidgetProps } from "widgets/ButtonWidget";
import { TextWidgetProps } from "widgets/TextWidget";
import { ContainerWidgetProps } from "widgets/ContainerWidget";
import { ImageWidgetProps } from "widgets/ImageWidget";
import { InputWidgetProps } from "widgets/InputWidget";
import { RichTextEditorWidgetProps } from "widgets/RichTextEditorWidget";
import { DatePickerWidgetProps } from "widgets/DatePickerWidget";
import { DatePickerWidget2Props } from "widgets/DatePickerWidget2";
import { TableWidgetProps } from "widgets/TableWidget/TableWidgetConstants";
import { DropdownWidgetProps } from "widgets/DropdownWidget";
import { CheckboxWidgetProps } from "widgets/CheckboxWidget";
import { RadioGroupWidgetProps } from "widgets/RadioGroupWidget";
import { FilePickerWidgetProps } from "widgets/FilepickerWidget";
import {
  TabsWidgetProps,
  TabContainerWidgetProps,
} from "widgets/Tabs/TabsWidget";
import { ChartWidgetProps } from "widgets/ChartWidget";
import { FormWidgetProps } from "widgets/FormWidget";
import { FormButtonWidgetProps } from "widgets/FormButtonWidget";
import { MapWidgetProps } from "widgets/MapWidget";
import { ModalWidgetProps } from "widgets/ModalWidget";
import { IconWidgetProps } from "widgets/IconWidget";
import { VideoWidgetProps } from "widgets/VideoWidget";
import { SkeletonWidgetProps } from "widgets/SkeletonWidget";
import { SwitchWidgetProps } from "widgets/SwitchWidget";
import { ListWidgetProps } from "widgets/ListWidget/ListWidget";
import { MultiSelectWidgetProps } from "widgets/MultiSelectWidget";
import { DividerWidgetProps } from "widgets/DividerWidget";
import { RateWidgetProps } from "widgets/RateWidget";
import { IframeWidgetProps } from "widgets/IframeWidget";
import { MenuButtonWidgetProps } from "widgets/MenuButtonWidget";
import { FormilyWidgetProps } from "widgets/FormilyWidget";
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
import { MSimpleFormWidgetProps } from "widgets/taro/SimpleFormWidget";
import { MKVWidgetProps } from "widgets/taro/KVWidget";
import { MTabsWidgetProps } from "widgets/taro/TabsWidget";

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
    BUTTON_WIDGET: Partial<ButtonWidgetProps> & WidgetConfigProps;
    TEXT_WIDGET: Partial<TextWidgetProps> & WidgetConfigProps;
    IMAGE_WIDGET: Partial<ImageWidgetProps> & WidgetConfigProps;
    INPUT_WIDGET: Partial<InputWidgetProps> & WidgetConfigProps;
    RICH_TEXT_EDITOR_WIDGET: Partial<RichTextEditorWidgetProps> &
      WidgetConfigProps;
    CONTAINER_WIDGET: Partial<ContainerWidgetProps<WidgetProps>> &
      WidgetConfigProps;
    DATE_PICKER_WIDGET: Partial<DatePickerWidgetProps> & WidgetConfigProps;
    DATE_PICKER_WIDGET2: Partial<DatePickerWidget2Props> & WidgetConfigProps;
    TABLE_WIDGET: Partial<TableWidgetProps> & WidgetConfigProps;
    VIDEO_WIDGET: Partial<VideoWidgetProps> & WidgetConfigProps;
    DROP_DOWN_WIDGET: Partial<DropdownWidgetProps> & WidgetConfigProps;
    MULTI_SELECT_WIDGET: Partial<MultiSelectWidgetProps> & WidgetConfigProps;
    CHECKBOX_WIDGET: Partial<CheckboxWidgetProps> & WidgetConfigProps;
    SWITCH_WIDGET: Partial<SwitchWidgetProps> & WidgetConfigProps;
    RADIO_GROUP_WIDGET: Partial<RadioGroupWidgetProps> & WidgetConfigProps;
    FILE_PICKER_WIDGET: Partial<FilePickerWidgetProps> & WidgetConfigProps;
    TABS_WIDGET: Partial<TabsWidgetProps<TabContainerWidgetProps>> &
      WidgetConfigProps;
    TABS_MIGRATOR_WIDGET: Partial<TabsWidgetProps<TabContainerWidgetProps>> &
      WidgetConfigProps;
    MODAL_WIDGET: Partial<ModalWidgetProps> & WidgetConfigProps;
    CHART_WIDGET: Partial<ChartWidgetProps> & WidgetConfigProps;
    FORM_WIDGET: Partial<FormWidgetProps> & WidgetConfigProps;
    FORM_BUTTON_WIDGET: Partial<FormButtonWidgetProps> & WidgetConfigProps;
    MAP_WIDGET: Partial<MapWidgetProps> & WidgetConfigProps;
    CANVAS_WIDGET: Partial<ContainerWidgetProps<WidgetProps>> &
      WidgetConfigProps;
    ICON_WIDGET: Partial<IconWidgetProps> & WidgetConfigProps;
    SKELETON_WIDGET: Partial<SkeletonWidgetProps> & WidgetConfigProps;
    LIST_WIDGET: Partial<ListWidgetProps<WidgetProps>> & WidgetConfigProps;
    DIVIDER_WIDGET: Partial<DividerWidgetProps> & WidgetConfigProps;
    RATE_WIDGET: Partial<RateWidgetProps> & WidgetConfigProps;
    IFRAME_WIDGET: Partial<IframeWidgetProps> & WidgetConfigProps;
    MENU_BUTTON_WIDGET: Partial<MenuButtonWidgetProps> & WidgetConfigProps;
    FORMILY_WIDGET: Partial<FormilyWidgetProps> & WidgetConfigProps;
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
    TARO_SIMPLE_FORM_WIDGET: Partial<MSimpleFormWidgetProps> &
      WidgetConfigProps;
    TARO_KV_WIDGET: Partial<MKVWidgetProps> & WidgetConfigProps;
    TARO_TABS_WIDGET: Partial<MTabsWidgetProps> & WidgetConfigProps;
  };
  configVersion: number;
}

const widgetConfigReducer = createReducer(initialState, {
  [ReduxActionTypes.LOAD_WIDGET_CONFIG]: (
    state: WidgetConfigReducerState,
    action: ReduxAction<WidgetConfigReducerState>,
  ) => {
    return { ...action.payload };
  },
});

export default widgetConfigReducer;
