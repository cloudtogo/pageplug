import { WidgetCardProps } from "widgets/BaseWidget";
import { generateReactKey } from "utils/generators";
import { keyBy } from "lodash";
/* eslint-disable no-useless-computed-key */

const WidgetSidebarResponse: WidgetCardProps[] = [
  {
    type: "BUTTON_WIDGET",
    widgetCardName: "按钮",
    key: generateReactKey(),
  },
  {
    type: "CHART_WIDGET",
    widgetCardName: "图表",
    key: generateReactKey(),
  },
  {
    type: "CHECKBOX_WIDGET",
    widgetCardName: "勾选",
    key: generateReactKey(),
  },
  {
    type: "SWITCH_WIDGET",
    widgetCardName: "开关",
    key: generateReactKey(),
  },
  {
    type: "CONTAINER_WIDGET",
    widgetCardName: "容器",
    key: generateReactKey(),
  },
  {
    type: "DATE_PICKER_WIDGET2",
    widgetCardName: "日期选择器",
    key: generateReactKey(),
  },
  {
    type: "DROP_DOWN_WIDGET",
    widgetCardName: "单选下拉",
    key: generateReactKey(),
  },
  {
    type: "MULTI_SELECT_WIDGET",
    widgetCardName: "多选下拉",
    key: generateReactKey(),
  },
  {
    type: "FILE_PICKER_WIDGET",
    widgetCardName: "文件上传",
    key: generateReactKey(),
  },
  {
    type: "FORM_WIDGET",
    widgetCardName: "表单",
    key: generateReactKey(),
  },
  {
    type: "LIST_WIDGET",
    widgetCardName: "列表",
    key: generateReactKey(),
    isBeta: true,
  },
  {
    type: "IMAGE_WIDGET",
    widgetCardName: "图片",
    key: generateReactKey(),
  },
  {
    type: "INPUT_WIDGET",
    widgetCardName: "输入框",
    key: generateReactKey(),
  },
  {
    type: "MAP_WIDGET",
    widgetCardName: "地图",
    key: generateReactKey(),
  },
  {
    type: "RADIO_GROUP_WIDGET",
    widgetCardName: "单选框",
    key: generateReactKey(),
  },
  {
    type: "RICH_TEXT_EDITOR_WIDGET",
    widgetCardName: "富文本",
    key: generateReactKey(),
  },
  {
    type: "TABLE_WIDGET",
    widgetCardName: "表格",
    key: generateReactKey(),
  },
  {
    type: "TABS_WIDGET",
    widgetCardName: "标签页",
    key: generateReactKey(),
  },
  {
    type: "TEXT_WIDGET",
    widgetCardName: "文本",
    key: generateReactKey(),
  },
  {
    type: "VIDEO_WIDGET",
    widgetCardName: "视频",
    key: generateReactKey(),
  },
  {
    type: "MODAL_WIDGET",
    widgetCardName: "弹窗",
    key: generateReactKey(),
  },
  {
    type: "RATE_WIDGET",
    widgetCardName: "评分",
    key: generateReactKey(),
  },
  {
    type: "IFRAME_WIDGET",
    widgetCardName: "Iframe",
    key: generateReactKey(),
  },
  {
    type: "DIVIDER_WIDGET",
    widgetCardName: "分隔线",
    key: generateReactKey(),
  },
  {
    type: "MENU_BUTTON_WIDGET",
    widgetCardName: "菜单按钮",
    key: generateReactKey(),
  },
  {
    type: "FORMILY_WIDGET",
    widgetCardName: "复杂表单",
    key: generateReactKey(),
  },
  // {
  //   type: "TARO_PICKER_WIDGET",
  //   widgetCardName: "Picker",
  //   key: generateReactKey(),
  //   isMobile: true,
  // },
  {
    type: "TARO_SWIPER_WIDGET",
    widgetCardName: "轮播",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_GRID_WIDGET",
    widgetCardName: "网格",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_TEXT_WIDGET",
    widgetCardName: "文本",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_LIST_WIDGET",
    widgetCardName: "列表",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_POPUP_WIDGET",
    widgetCardName: "底部弹窗",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_IMAGE_WIDGET",
    widgetCardName: "图片",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_BUTTON_WIDGET",
    widgetCardName: "按钮",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_CELL_WIDGET",
    widgetCardName: "单元格",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_HTML_WIDGET",
    widgetCardName: "HTML",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_SKU_WIDGET",
    widgetCardName: "商品规格",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_KV_WIDGET",
    widgetCardName: "键值对",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_TABS_WIDGET",
    widgetCardName: "标签导航",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_BOTTOM_BAR_WIDGET",
    widgetCardName: "底部面板",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_ACTION_BAR_WIDGET",
    widgetCardName: "动作栏",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_SEARCH_WIDGET",
    widgetCardName: "搜索框",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_LOADING_WIDGET",
    widgetCardName: "加载遮罩",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_CHECKBOX_WIDGET",
    widgetCardName: "复选框",
    key: generateReactKey(),
    isMobile: true,
  },
  {
    type: "TARO_FORM_WIDGET",
    widgetCardName: "表单",
    key: generateReactKey(),
    isMobile: true,
  },
];

export default WidgetSidebarResponse;

export const widgetSidebarConfig = keyBy(WidgetSidebarResponse, "type");
