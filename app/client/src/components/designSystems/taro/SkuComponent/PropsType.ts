import React from "react";

export type SkuData = {
  price: string | number;
  none_sku: boolean;
  stock_num: number;
  hide_stock?: boolean;
  collection_id?: number;
  tree: SkuTreeItemData[];
  list: SkuListItemData[];
  properties?: SkuPropItemData[];
};

export type SkuTreeItemData = {
  k: string | number;
  v: SkuTreeItemValueData[];
  k_s: string | number;
  is_multiple?: boolean;
};

export type SkuTreeItemValueData = {
  id: string | number;
  name: string | number;
  imgUrl?: string;
  img_url?: string;
  previewImgUrl?: string;
};

export type SkuPropItemData = {
  k: number | string;
  v: SkuPropItemValueData[];
  k_id: string | number;
  is_multiple?: boolean;
  is_necessary?: boolean;
};

export type SkuPropItemValueData = {
  id: number | string;
  name: string;
  price?: string | number;
};

export type SkuListItemData = {
  id: number;
  s1: string;
  s2: string;
  s3: string;
  price: number;
  stock_num: number;
};

export type SkuMessageData = {
  name: string;
  type: string;
  required?: string;
  datetime?: string;
  multiple?: string;
  placeholder?: string;
};

export type SkuGoodsData = {
  title: string;
  picture: string;
};

export type SelectedSkuData = Record<string, string>;

export type SkuValueType = Record<string | number, (string | number)[]>;

export type SkuFieldNames = {
  text?: string;
  value?: string;
  children?: string;
};

export type SkuActionType = "add-cart" | "buy-clicked";

export type SkuStateType = {
  selectedSku?: Record<string | number, string | number>;
  selectedProp?: Record<string | number, string | number | unknown>;
  selectedNum?: number;
};
export interface SkuProps {
  /** 商品sku数据 */
  sku: any;
  /** 商品信息	 */
  goods: Record<string | number, unknown>;
  /** 商品id */
  goodsId?: number | string;
  /** 显示在价格后面的标签	 */
  priceTag?: React.ReactNode;
  /** 是否显示限购提示	 */
  hideQuotaText?: boolean;
  /** 是否隐藏已选提示 */
  hideSelectedText?: boolean;
  /** 是否显示商品剩余库存	 */
  hideStock?: boolean;
  /** 库存阈值。低于这个值会把库存数高亮显示	 */
  stockThreshold?: number;
  /** 是否显示加入购物车按钮	 */
  showAddCartBtn?: boolean;
  /** 购买按钮文字	 */
  buyText?: string;
  /** 加入购物车按钮文字	 */
  addCartText?: string;
  /** 限购数，0 表示不限购	 */
  quota?: number;
  /** 已经购买过的数量	 */
  quotaUsed?: number;
  /** 隐藏时重置状态 */
  resetOnHide?: boolean;
  /** 是否禁用步进器输入	 */
  disableStepperInput?: boolean;
  /** 是否在点击遮罩层后关闭	 */
  closeOnClickOverlay?: boolean;
  /** 数量选择组件左侧文案	 */
  stepperTitle?: React.ReactNode;
  /** 步进器相关自定义配置	 */
  customStepperConfig?: any;
  /** 指定挂载的节点 */
  getContainer?: any;
  /** 默认选中的 sku */
  initialSku?: SkuStateType;
  /** 是否展示售罄的 sku，默认展示并置灰	 */
  showSoldoutSku?: boolean;
  /** 是否禁用售罄的 sku	 */
  disableSoldoutSku?: boolean;
  /** 是否开启底部安全区适配	 */
  safeAreaInsetBottom?: boolean;
  /** 起售数量	 */
  startSaleNum?: number;
  /** 商品属性 */
  properties?: SkuPropItemData[];
  /** 自定义预览icon */
  previewIcon?: React.ReactNode;
  /** 是否在点击商品图片时自动预览	 */
  previewOnClickImage?: boolean;
  /** 是否展示头部图片	 */
  showHeaderImage?: boolean;
  /** 是否开启图片懒加载 */
  lazyload?: boolean;
  /**
   * sku距视窗顶部距离
   * @default 200
   */
  bodyOffsetTop?: number;
  /** 商品信息展示区，包含商品图片、名称、价格等信息 */
  skuHeader?: React.ReactNode;
  /** 自定义 sku 头部价格展示 */
  skuHeaderPriceRender?: (price: number) => React.ReactNode;
  /** 自定义 sku 头部原价展示 */
  skuHeaderOriginPrice?: React.ReactNode;
  /** 额外 sku 头部区域 */
  skuHeaderExtra?: React.ReactNode;
  /** 自定义 sku 头部图片额外的展示 */
  skuHeaderImageExtra?: React.ReactNode;
  /** sku 展示区上方的内容，无默认展示内容，按需使用 */
  skuBodyTop?: React.ReactNode;
  /** 自定义商品 sku 展示区 */
  skuGroup?: React.ReactNode;
  /** 额外商品 sku 展示区，一般用不到 */
  skuGroupExtra?: React.ReactNode;
  /** 自定义商品数量选择区 */
  skuStepper?: React.ReactNode;
  /** 操作按钮区顶部内容，无默认展示内容，按需使用 */
  skuActionsTop?: React.ReactNode;
  /** 操作按钮区底部内容，无默认展示内容，按需使用 */
  skuActionsBottom?: React.ReactNode;
  /** 自定义操作按钮区 */
  skuActions?: React.ReactNode;
  /** 自定义库存渲染方法 */
  stockRender?: (stock: number) => React.ReactNode;
  /** 自定义sku校验规则 */
  customSkuValidator?: (
    actionType: SkuActionType,
    selectedSku: SkuValueType,
  ) => void | boolean | Promise<boolean>;
  /** 点击添加购物车回调	 */
  onAddCart?: (value: SkuValueType) => void;
  /** 点击购买回调	 */
  onBuyClicked?: (value: SkuValueType) => void;
  /** 购买数量变化时触发	 */
  onStepperChange?: (value: number) => void;
  /** 切换规格类目时触发	 */
  onSkuSelected?: (value: any) => void;
  /** 切换商品属性时触发	 */
  onSkuPropSelected?: (value: any) => void;
  /** 打开商品图片预览时触发	 */
  onOpenPreview?: (data: any) => void;
  /** 关闭商品图片预览时触发	 */
  onClosePreview?: (data: any) => void;
  /** 主题色 */
  color?: string;
  /** 加入购物车按钮加载中 */
  addCartLoading?: boolean;
  /** 立即购买按钮加载中 */
  buyLoading?: boolean;
}

export type SkuInstance = {
  /** 重置Sku到初始状态	 */
  reset: () => void;
  /** 打开Sku，支持设置默认值 */
  show: (initialValue?: SkuStateType) => void;
  /** 更新Sku设置 */
  update: (initialValue: SkuStateType) => void;
  /** 获取当前 skuData */
  getSkuData: () => SkuStateType;
};
