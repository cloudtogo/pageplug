import Widget from "./widget";
import IconSVG from "./icon.svg";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "商品规格",
  iconSVG: IconSVG,
  needsMeta: true,
  isCanvas: false,
  isMobile: true,
  defaults: {
    widgetName: "sku",
    rows: 32,
    columns: 56,
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
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;
