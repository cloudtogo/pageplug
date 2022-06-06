import React from "react";
import BaseWidget, { WidgetProps } from "widgets/BaseWidget";
import { WidgetTypes } from "constants/WidgetConstants";
import CanvasWidget, { ProfiledCanvasWidget } from "widgets/CanvasWidget";
import ContainerWidget, {
  ContainerWidgetProps,
  ProfiledContainerWidget,
} from "widgets/ContainerWidget";
import SkeletonWidget, {
  ProfiledSkeletonWidget,
  SkeletonWidgetProps,
} from "../widgets/SkeletonWidget";
import WidgetFactory from "./WidgetFactory";
import PickerWidget, {
  PickerWidgetProps,
  ProfiledPickerWidget,
} from "widgets/taro/PickerWidget";
import SwiperWidget, {
  SwiperWidgetProps,
  ProfiledSwiperWidget,
} from "widgets/taro/SwiperWidget";
import GridWidget, {
  GridWidgetProps,
  ProfiledGridWidget,
} from "widgets/taro/GridWidget";
import MTextWidget, {
  MTextWidgetProps,
  MProfiledTextWidget,
} from "widgets/taro/TextWidget";
import MListWidget, {
  MListWidgetProps,
  MProfiledListWidget,
} from "widgets/taro/ListWidget";
import MPopupWidget, {
  MPopupWidgetProps,
  MProfiledPopupWidget,
} from "widgets/taro/PopupWidget";
import MImageWidget, {
  MImageWidgetProps,
  MProfiledImageWidget,
} from "widgets/taro/ImageWidget";
import MButtonWidget, {
  MButtonWidgetProps,
  MProfiledButtonWidget,
} from "widgets/taro/ButtonWidget";
import MCellWidget, {
  MCellWidgetProps,
  MProfiledCellWidget,
} from "widgets/taro/CellWidget";
import MHtmlWidget, {
  MHtmlWidgetProps,
  MProfiledHtmlWidget,
} from "widgets/taro/HtmlWidget";
import MSkuWidget, {
  MSkuWidgetProps,
  MProfiledSkuWidget,
} from "widgets/taro/SkuWidget";
import MKVWidget, {
  MKVWidgetProps,
  MProfiledKVWidget,
} from "widgets/taro/KVWidget";
import MTabsWidget, {
  MTabsWidgetProps,
  MProfiledTabsWidget,
} from "widgets/taro/TabsWidget";
import MBottomBarWidget, {
  MBottomBarWidgetProps,
  MProfiledBottomBarWidget,
} from "widgets/taro/BottomBarWidget";
import MActionBarWidget, {
  MActionBarWidgetProps,
  MProfiledActionBarWidget,
} from "widgets/taro/ActionBarWidget";
import MSearchWidget, {
  MSearchWidgetProps,
  MProfiledSearchWidget,
} from "widgets/taro/SearchWidget";
import MLoadingWidget, {
  MLoadingWidgetProps,
  MProfiledLoadingWidget,
} from "widgets/taro/LoadingWidget";
import MCheckboxWidget, {
  MCheckboxWidgetProps,
  MProfiledCheckboxWidget,
} from "widgets/taro/CheckboxWidget";
import MFormWidget, {
  MFormWidgetProps,
  MProfiledFormWidget,
} from "widgets/taro/FormWidget";

export default class WidgetBuilderRegistry {
  static registerWidgetBuilders() {
    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.CANVAS_WIDGET,
      {
        buildWidget(
          widgetData: ContainerWidgetProps<WidgetProps>,
        ): JSX.Element {
          return <ProfiledCanvasWidget {...widgetData} />;
        },
      },
      CanvasWidget.getDerivedPropertiesMap(),
      CanvasWidget.getDefaultPropertiesMap(),
      CanvasWidget.getMetaPropertiesMap(),
      CanvasWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      "CONTAINER_WIDGET",
      {
        buildWidget(
          widgetData: ContainerWidgetProps<WidgetProps>,
        ): JSX.Element {
          return <ProfiledContainerWidget {...widgetData} />;
        },
      },
      ContainerWidget.getDerivedPropertiesMap(),
      ContainerWidget.getDefaultPropertiesMap(),
      ContainerWidget.getMetaPropertiesMap(),
      ContainerWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.SKELETON_WIDGET,
      {
        buildWidget(widgetProps: SkeletonWidgetProps): JSX.Element {
          return <ProfiledSkeletonWidget {...widgetProps} />;
        },
      },
      SkeletonWidget.getDerivedPropertiesMap(),
      SkeletonWidget.getDefaultPropertiesMap(),
      SkeletonWidget.getMetaPropertiesMap(),
      SkeletonWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_PICKER_WIDGET,
      {
        buildWidget(widgetData: PickerWidgetProps): JSX.Element {
          return <ProfiledPickerWidget {...widgetData} />;
        },
      },
      PickerWidget.getDerivedPropertiesMap(),
      PickerWidget.getDefaultPropertiesMap(),
      PickerWidget.getMetaPropertiesMap(),
      PickerWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_SWIPER_WIDGET,
      {
        buildWidget(widgetData: SwiperWidgetProps): JSX.Element {
          return <ProfiledSwiperWidget {...widgetData} />;
        },
      },
      SwiperWidget.getDerivedPropertiesMap(),
      SwiperWidget.getDefaultPropertiesMap(),
      SwiperWidget.getMetaPropertiesMap(),
      SwiperWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_GRID_WIDGET,
      {
        buildWidget(widgetData: GridWidgetProps): JSX.Element {
          return <ProfiledGridWidget {...widgetData} />;
        },
      },
      GridWidget.getDerivedPropertiesMap(),
      GridWidget.getDefaultPropertiesMap(),
      GridWidget.getMetaPropertiesMap(),
      GridWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_TEXT_WIDGET,
      {
        buildWidget(widgetData: MTextWidgetProps): JSX.Element {
          return <MProfiledTextWidget {...widgetData} />;
        },
      },
      MTextWidget.getDerivedPropertiesMap(),
      MTextWidget.getDefaultPropertiesMap(),
      MTextWidget.getMetaPropertiesMap(),
      MTextWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_LIST_WIDGET,
      {
        buildWidget(widgetData: MListWidgetProps): JSX.Element {
          return <MProfiledListWidget {...widgetData} />;
        },
      },
      MListWidget.getDerivedPropertiesMap(),
      MListWidget.getDefaultPropertiesMap(),
      MListWidget.getMetaPropertiesMap(),
      MListWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_POPUP_WIDGET,
      {
        buildWidget(widgetData: MPopupWidgetProps): JSX.Element {
          return <MProfiledPopupWidget {...widgetData} />;
        },
      },
      MPopupWidget.getDerivedPropertiesMap(),
      MPopupWidget.getDefaultPropertiesMap(),
      MPopupWidget.getMetaPropertiesMap(),
      MPopupWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_IMAGE_WIDGET,
      {
        buildWidget(widgetData: MImageWidgetProps): JSX.Element {
          return <MProfiledImageWidget {...widgetData} />;
        },
      },
      MImageWidget.getDerivedPropertiesMap(),
      MImageWidget.getDefaultPropertiesMap(),
      MImageWidget.getMetaPropertiesMap(),
      MImageWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_BUTTON_WIDGET,
      {
        buildWidget(widgetData: MButtonWidgetProps): JSX.Element {
          return <MProfiledButtonWidget {...widgetData} />;
        },
      },
      MButtonWidget.getDerivedPropertiesMap(),
      MButtonWidget.getDefaultPropertiesMap(),
      MButtonWidget.getMetaPropertiesMap(),
      MButtonWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_CELL_WIDGET,
      {
        buildWidget(widgetData: MCellWidgetProps): JSX.Element {
          return <MProfiledCellWidget {...widgetData} />;
        },
      },
      MCellWidget.getDerivedPropertiesMap(),
      MCellWidget.getDefaultPropertiesMap(),
      MCellWidget.getMetaPropertiesMap(),
      MCellWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_HTML_WIDGET,
      {
        buildWidget(widgetData: MHtmlWidgetProps): JSX.Element {
          return <MProfiledHtmlWidget {...widgetData} />;
        },
      },
      MHtmlWidget.getDerivedPropertiesMap(),
      MHtmlWidget.getDefaultPropertiesMap(),
      MHtmlWidget.getMetaPropertiesMap(),
      MHtmlWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_SKU_WIDGET,
      {
        buildWidget(widgetData: MSkuWidgetProps): JSX.Element {
          return <MProfiledSkuWidget {...widgetData} />;
        },
      },
      MSkuWidget.getDerivedPropertiesMap(),
      MSkuWidget.getDefaultPropertiesMap(),
      MSkuWidget.getMetaPropertiesMap(),
      MSkuWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_KV_WIDGET,
      {
        buildWidget(widgetData: MKVWidgetProps): JSX.Element {
          return <MProfiledKVWidget {...widgetData} />;
        },
      },
      MKVWidget.getDerivedPropertiesMap(),
      MKVWidget.getDefaultPropertiesMap(),
      MKVWidget.getMetaPropertiesMap(),
      MKVWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_TABS_WIDGET,
      {
        buildWidget(widgetData: MTabsWidgetProps): JSX.Element {
          return <MProfiledTabsWidget {...widgetData} />;
        },
      },
      MTabsWidget.getDerivedPropertiesMap(),
      MTabsWidget.getDefaultPropertiesMap(),
      MTabsWidget.getMetaPropertiesMap(),
      MTabsWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_BOTTOM_BAR_WIDGET,
      {
        buildWidget(widgetData: MBottomBarWidgetProps): JSX.Element {
          return <MProfiledBottomBarWidget {...widgetData} />;
        },
      },
      MBottomBarWidget.getDerivedPropertiesMap(),
      MBottomBarWidget.getDefaultPropertiesMap(),
      MBottomBarWidget.getMetaPropertiesMap(),
      MBottomBarWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_ACTION_BAR_WIDGET,
      {
        buildWidget(widgetData: MActionBarWidgetProps): JSX.Element {
          return <MProfiledActionBarWidget {...widgetData} />;
        },
      },
      MActionBarWidget.getDerivedPropertiesMap(),
      MActionBarWidget.getDefaultPropertiesMap(),
      MActionBarWidget.getMetaPropertiesMap(),
      MActionBarWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_SEARCH_WIDGET,
      {
        buildWidget(widgetData: MSearchWidgetProps): JSX.Element {
          return <MProfiledSearchWidget {...widgetData} />;
        },
      },
      MSearchWidget.getDerivedPropertiesMap(),
      MSearchWidget.getDefaultPropertiesMap(),
      MSearchWidget.getMetaPropertiesMap(),
      MSearchWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_LOADING_WIDGET,
      {
        buildWidget(widgetData: MLoadingWidgetProps): JSX.Element {
          return <MProfiledLoadingWidget {...widgetData} />;
        },
      },
      MLoadingWidget.getDerivedPropertiesMap(),
      MLoadingWidget.getDefaultPropertiesMap(),
      MLoadingWidget.getMetaPropertiesMap(),
      MLoadingWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_CHECKBOX_WIDGET,
      {
        buildWidget(widgetData: MCheckboxWidgetProps): JSX.Element {
          return <MProfiledCheckboxWidget {...widgetData} />;
        },
      },
      MCheckboxWidget.getDerivedPropertiesMap(),
      MCheckboxWidget.getDefaultPropertiesMap(),
      MCheckboxWidget.getMetaPropertiesMap(),
      MCheckboxWidget.getPropertyPaneConfig(),
    );

    WidgetFactory.registerWidgetBuilder(
      WidgetTypes.TARO_FORM_WIDGET,
      {
        buildWidget(widgetData: MFormWidgetProps): JSX.Element {
          return <MProfiledFormWidget {...widgetData} />;
        },
      },
      MFormWidget.getDerivedPropertiesMap(),
      MFormWidget.getDefaultPropertiesMap(),
      MFormWidget.getMetaPropertiesMap(),
      MFormWidget.getPropertyPaneConfig(),
    );
  }
}
