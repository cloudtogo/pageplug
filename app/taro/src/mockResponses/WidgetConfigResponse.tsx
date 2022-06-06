import { WidgetConfigReducerState } from "reducers/entityReducers/widgetConfigReducer";
import { WidgetTypes } from "constants/WidgetConstants";
import { Colors } from "constants/Colors";

/*
 ********************************{Grid Density Migration}*********************************
 */
export const GRID_DENSITY_MIGRATION_V1 = 4;

/**
 * this config sets the default values of properties being used in the widget
 */
const WidgetConfigResponse: WidgetConfigReducerState = {
  config: {
    CONTAINER_WIDGET: {
      backgroundColor: "#FFFFFF",
      rows: 10 * GRID_DENSITY_MIGRATION_V1,
      columns: 8 * GRID_DENSITY_MIGRATION_V1,
      widgetName: "Container",
      containerStyle: "card",
      children: [],
      blueprint: {
        view: [
          {
            type: "CANVAS_WIDGET",
            position: { top: 0, left: 0 },
            props: {
              containerStyle: "none",
              canExtend: false,
              detachFromLayout: true,
              children: [],
            },
          },
        ],
      },
      version: 1,
    },
    CANVAS_WIDGET: {
      rows: 0,
      columns: 0,
      widgetName: "Canvas",
      version: 1,
    },
    [WidgetTypes.TARO_PICKER_WIDGET]: {
      widgetName: "m_picker",
      rows: 2 * GRID_DENSITY_MIGRATION_V1,
      columns: 4 * GRID_DENSITY_MIGRATION_V1,
      title: "喵喵",
    },
    [WidgetTypes.TARO_SWIPER_WIDGET]: {
      widgetName: "m_swiper",
      rows: 6 * GRID_DENSITY_MIGRATION_V1,
      columns: 14 * GRID_DENSITY_MIGRATION_V1,
      list: [
        { url: "https://img01.yzcdn.cn/vant/apple-1.jpg" },
        { url: "https://img01.yzcdn.cn/vant/apple-2.jpg" },
        { url: "https://img01.yzcdn.cn/vant/apple-3.jpg" },
        { url: "https://img01.yzcdn.cn/vant/apple-4.jpg" },
      ],
      urlKey: "url",
    },
    [WidgetTypes.TARO_GRID_WIDGET]: {
      widgetName: "m_grid",
      rows: 6 * GRID_DENSITY_MIGRATION_V1,
      columns: 14 * GRID_DENSITY_MIGRATION_V1,
      list: [
        { url: "", name: "文本" },
        { url: "", name: "文本" },
        { url: "", name: "文本" },
        { url: "", name: "文本" },
        { url: "", name: "文本" },
        { url: "", name: "文本" },
      ],
      urlKey: "url",
      titleKey: "name",
      cols: 4,
      gutter: "0",
      bordered: true,
      gridType: "I_N",
      titleColor: "#646566",
      descriptionColor: "#DD4B34",
      buttonColor: "#03b365",
      priceUnit: "￥",
    },
    [WidgetTypes.TARO_TEXT_WIDGET]: {
      widgetName: "m_text",
      text: "文本",
      fontSize: "PARAGRAPH",
      textAlign: "LEFT",
      textColor: Colors.THUNDER,
      rows: 1 * GRID_DENSITY_MIGRATION_V1,
      columns: 4 * GRID_DENSITY_MIGRATION_V1,
      version: 1,
    },
    [WidgetTypes.TARO_LIST_WIDGET]: {
      widgetName: "m_list",
      rows: 6 * GRID_DENSITY_MIGRATION_V1,
      columns: 14 * GRID_DENSITY_MIGRATION_V1,
      list: [
        { url: "", name: "标题", description: "描述" },
        { url: "", name: "标题", description: "描述" },
        { url: "", name: "标题", description: "描述" },
        { url: "", name: "标题", description: "描述" },
      ],
      urlKey: "url",
      titleKey: "name",
      descriptionKey: "description",
      contentType: "I_N_D",
      controlType: "BUTTON",
      width: "100px",
      height: "80px",
      inset: false,
      titleColor: "#646566",
      descriptionColor: "#999",
      priceColor: "#DD4B34",
      buttonColor: "#03b365",
    },
    [WidgetTypes.TARO_POPUP_WIDGET]: {
      widgetName: "m_popup",
      rows: 10 * GRID_DENSITY_MIGRATION_V1,
      columns: 16 * GRID_DENSITY_MIGRATION_V1,
      // detachFromLayout is set true for widgets that are not bound to the widgets within the layout.
      // setting it to true will only render the widgets(from sidebar) on the main container without any collision check.
      detachFromLayout: true,
      canOutsideClickClose: true,
      rounded: true,
      height: 400,
      children: [],
      version: 1,
      blueprint: {
        view: [
          {
            type: "CANVAS_WIDGET",
            position: { left: 0, top: 0 },
            props: {
              detachFromLayout: true,
              canExtend: false,
              isVisible: true,
              isDisabled: false,
              shouldScrollContents: false,
              children: [],
              version: 1,
            },
          },
        ],
      },
    },
    [WidgetTypes.TARO_IMAGE_WIDGET]: {
      widgetName: "m_image",
      rows: 6 * GRID_DENSITY_MIGRATION_V1,
      columns: 8 * GRID_DENSITY_MIGRATION_V1,
      src: "https://img.yzcdn.cn/vant/cat.jpeg",
      mode: "aspectFit",
      version: 1,
    },
    [WidgetTypes.TARO_BUTTON_WIDGET]: {
      widgetName: "m_button",
      rows: 1 * GRID_DENSITY_MIGRATION_V1,
      columns: 6 * GRID_DENSITY_MIGRATION_V1,
      version: 1,
      rounded: true,
      text: "好的",
      fontSize: "16px",
      showLoading: true,
    },
    [WidgetTypes.TARO_CELL_WIDGET]: {
      widgetName: "m_cell",
      rows: 3 * GRID_DENSITY_MIGRATION_V1,
      columns: 14 * GRID_DENSITY_MIGRATION_V1,
      version: 1,
      inset: false,
      bordered: false,
      cellsObj: {
        cell1: {
          label: "单元格 1",
          id: "cell1",
          widgetId: "",
          isVisible: true,
          picType: "none",
          showArrow: true,
          index: 0,
        },
        cell2: {
          label: "单元格 2",
          id: "cell2",
          widgetId: "",
          isVisible: true,
          picType: "none",
          showArrow: true,
          index: 1,
        },
      },
    },
    [WidgetTypes.TARO_HTML_WIDGET]: {
      widgetName: "m_html",
      rows: 6 * GRID_DENSITY_MIGRATION_V1,
      columns: 14 * GRID_DENSITY_MIGRATION_V1,
      content:
        "<p style='font-size: 36px; font-weight: bold; font-family: fangsong; background:red; color:black; text-align: center;'>恭喜发财 大吉大利</p>",
      version: 1,
    },
    [WidgetTypes.TARO_SKU_WIDGET]: {
      widgetName: "m_sku",
      rows: 8 * GRID_DENSITY_MIGRATION_V1,
      columns: 14 * GRID_DENSITY_MIGRATION_V1,
      version: 1,
      goodsId: "10010",
      price: 399,
      pic: "https://b.yzcdn.cn/vant/sku/shoes-1.png",
      stockNum: 999,
      categories: [
        {
          name: "颜色",
          key: "color",
          values: [
            {
              id: "1",
              name: "粉色",
              pic: "https://b.yzcdn.cn/vant/sku/shoes-1.png",
            },
            {
              id: "2",
              name: "黄色",
              pic: "https://b.yzcdn.cn/vant/sku/shoes-2.png",
            },
            {
              id: "3",
              name: "蓝色",
              pic: "https://b.yzcdn.cn/vant/sku/shoes-3.png",
            },
          ],
        },
        {
          name: "尺寸",
          key: "size",
          values: [
            {
              id: "1",
              name: "大",
            },
            {
              id: "2",
              name: "小",
            },
          ],
        },
      ],
      products: [
        {
          id: "2259",
          category: {
            color: "2",
            size: "1",
          },
          price: 100,
          stock: 110,
        },
        {
          id: "2260",
          category: {
            color: "3",
            size: "1",
          },
          price: 100,
          stock: 99,
        },
        {
          id: "2257",
          category: {
            color: "1",
            size: "1",
          },
          price: 100,
          stock: 111,
        },
        {
          id: "2258",
          category: {
            color: "1",
            size: "2",
          },
          price: 100,
          stock: 6,
        },
      ],
      color: "#f44336",
    },
    [WidgetTypes.TARO_KV_WIDGET]: {
      widgetName: "m_kv",
      rows: 6 * GRID_DENSITY_MIGRATION_V1,
      columns: 12 * GRID_DENSITY_MIGRATION_V1,
      version: 1,
      list: [
        { key: "绿蚁新醅酒", value: "红泥小火炉" },
        { key: "晚来天欲雪", value: "能饮一杯无" },
      ],
      kKey: "key",
      vKey: "value",
      layout: "h",
      inset: false,
      kColor: "#666",
      kSize: "PARAGRAPH",
      kBold: false,
      kAlign: "LEFT",
      vColor: "#333",
      vSize: "PARAGRAPH",
      vBold: true,
      vAlign: "LEFT",
    },
    [WidgetTypes.TARO_TABS_WIDGET]: {
      widgetName: "m_tabs",
      rows: 10 * GRID_DENSITY_MIGRATION_V1,
      columns: 4 * GRID_DENSITY_MIGRATION_V1,
      version: 1,
      list: [
        { name: "标签1", id: 1 },
        { name: "标签2", id: 2 },
        { name: "标签3", id: 3 },
      ],
      nameKey: "name",
      defaultNum: "0",
      showLoading: false,
    },
    [WidgetTypes.TARO_BOTTOM_BAR_WIDGET]: {
      widgetName: "m_bottom_bar",
      rows: 3 * GRID_DENSITY_MIGRATION_V1,
      columns: 16 * GRID_DENSITY_MIGRATION_V1,
      // detachFromLayout is set true for widgets that are not bound to the widgets within the layout.
      // setting it to true will only render the widgets(from sidebar) on the main container without any collision check.
      detachFromLayout: true,
      canOutsideClickClose: true,
      height: 100,
      children: [],
      version: 1,
      blueprint: {
        view: [
          {
            type: "CANVAS_WIDGET",
            position: { left: 0, top: 0 },
            props: {
              detachFromLayout: true,
              canExtend: false,
              isVisible: true,
              isDisabled: false,
              shouldScrollContents: false,
              children: [],
              version: 1,
            },
          },
        ],
      },
    },
    [WidgetTypes.TARO_ACTION_BAR_WIDGET]: {
      widgetName: "m_action_bar",
      rows: 2 * GRID_DENSITY_MIGRATION_V1,
      columns: 14 * GRID_DENSITY_MIGRATION_V1,
      version: 1,
      actionsObj: {
        action1: {
          label: "购物车",
          id: "action1",
          widgetId: "",
          index: 0,
          type: "icon",
          badge: "6",
          icon: "cart-o",
        },
        action2: {
          label: "加入购物车",
          id: "action2",
          widgetId: "",
          index: 1,
          type: "button",
          buttonType: "warning",
        },
        action3: {
          label: "立即购买",
          id: "action3",
          widgetId: "",
          index: 2,
          type: "button",
          buttonType: "danger",
        },
      },
    },
    [WidgetTypes.TARO_SEARCH_WIDGET]: {
      widgetName: "m_search",
      rows: 2 * GRID_DENSITY_MIGRATION_V1,
      columns: 14 * GRID_DENSITY_MIGRATION_V1,
      version: 1,
      rounded: true,
      readonly: false,
      showButton: false,
      inputAlign: "left",
    },
    [WidgetTypes.TARO_LOADING_WIDGET]: {
      widgetName: "m_loading",
      rows: 2 * GRID_DENSITY_MIGRATION_V1,
      columns: 4 * GRID_DENSITY_MIGRATION_V1,
      version: 1,
      detachFromLayout: true,
      showLoading: false,
    },
    [WidgetTypes.TARO_CHECKBOX_WIDGET]: {
      widgetName: "m_checkbox",
      rows: 1 * GRID_DENSITY_MIGRATION_V1,
      columns: 4 * GRID_DENSITY_MIGRATION_V1,
      version: 1,
      label: "勾选",
      defaultCheckedState: true,
      isDisabled: false,
      showLoading: false,
    },
    [WidgetTypes.TARO_FORM_WIDGET]: {
      widgetName: "m_form",
      rows: 6 * GRID_DENSITY_MIGRATION_V1,
      columns: 14 * GRID_DENSITY_MIGRATION_V1,
      version: 1,
      fieldsObj: {
        user: {
          label: "用户名",
          id: "user",
          name: "user",
          widgetId: "",
          fieldType: "input",
          required: true,
          inputType: "text",
          index: 0,
        },
        password: {
          label: "密码",
          id: "password",
          name: "password",
          widgetId: "",
          fieldType: "input",
          required: true,
          inputType: "password",
          index: 1,
        },
      },
    },
  },
  configVersion: 1,
};

export default WidgetConfigResponse;
