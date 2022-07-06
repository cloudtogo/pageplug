import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import SkuComponent from "../component";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import _ from "lodash";
import Taro from "@tarojs/taro";

export type CategoryValueItem = {
  id: string;
  name: string;
  pic?: string;
};

export type Category = {
  name: string;
  key: string;
  values: CategoryValueItem[];
};

export type GoodsItem = {
  id: string;
  price: number;
  stock: number;
  category: Record<string, string>;
};

class MSkuWidget extends BaseWidget<MSkuWidgetProps, MSkuWidgetState> {
  state = {
    addCartLoading: false,
    buyLoading: false,
  };

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "数据",
        children: [
          {
            propertyName: "goodsId",
            label: "商品ID",
            controlType: "INPUT_TEXT",
            placeholderText: "输入商品ID",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "price",
            label: "价格",
            controlType: "INPUT_TEXT",
            placeholderText: "输入商品价格",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0 },
            },
          },
          {
            propertyName: "pic",
            label: "图片",
            controlType: "INPUT_TEXT",
            placeholderText: "输入商品图片地址",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "stockNum",
            label: "库存",
            controlType: "INPUT_TEXT",
            placeholderText: "输入商品总库存",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0, natural: true },
            },
          },
          {
            propertyName: "categories",
            label: "商品规格",
            controlType: "INPUT_TEXT",
            inputType: "ARRAY",
            helpText:
              "每种规格必须包含字段：name(名称), key(键值), values(可选值)",
            placeholderText: "商品规格列表",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    required: true,
                    allowedKeys: [
                      {
                        name: "name",
                        type: ValidationTypes.TEXT,
                        params: {
                          required: true,
                        },
                      },
                      {
                        name: "key",
                        type: ValidationTypes.TEXT,
                        params: {
                          required: true,
                        },
                      },
                      {
                        name: "values",
                        type: ValidationTypes.ARRAY,
                        params: {
                          children: {
                            type: ValidationTypes.OBJECT,
                            params: {
                              required: true,
                              allowedKeys: [
                                {
                                  name: "id",
                                  type: ValidationTypes.TEXT,
                                  params: {
                                    required: true,
                                  },
                                },
                                {
                                  name: "name",
                                  type: ValidationTypes.TEXT,
                                  params: {
                                    required: true,
                                  },
                                },
                                {
                                  name: "pic",
                                  type: ValidationTypes.TEXT,
                                },
                              ],
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            propertyName: "products",
            label: "商品库存",
            controlType: "INPUT_TEXT",
            inputType: "ARRAY",
            helpText:
              "每件商品必须包含字段：id, price(价格), stock(库存), category(规格值)",
            placeholderText: "所有库存商品列表",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    required: true,
                    allowedKeys: [
                      {
                        name: "id",
                        type: ValidationTypes.TEXT,
                        params: {
                          required: true,
                        },
                      },
                      {
                        name: "price",
                        type: ValidationTypes.NUMBER,
                        params: {
                          required: true,
                          min: 0,
                        },
                      },
                      {
                        name: "stock",
                        type: ValidationTypes.NUMBER,
                        params: {
                          required: true,
                          min: 0,
                        },
                      },
                      {
                        name: "category",
                        type: ValidationTypes.OBJECT,
                        params: {
                          required: true,
                        },
                      },
                    ],
                  },
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "color",
            label: "主题色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            propertyName: "onAddCart",
            label: "点击加入购物车",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            propertyName: "onBuy",
            label: "点击立即购买",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getMetaPropertiesMap(): Record<string, undefined> {
    return {
      submitData: undefined,
      selectedSku: undefined,
    };
  }

  onSubmit = (actionName: string) => (data: any) => {
    const isBuy = actionName === "onBuy";
    if (isBuy && this.props.onBuy) {
      this.setState({
        buyLoading: true,
      });
    }
    if (!isBuy && this.props.onAddCart) {
      this.setState({
        addCartLoading: true,
      });
    }
    this.props.updateWidgetMetaProperty("submitData", data, {
      triggerPropertyName: actionName,
      dynamicString: isBuy ? this.props.onBuy : this.props.onAddCart,
      event: {
        type: isBuy ? EventType.ON_BUY : EventType.ON_ADD_CART,
        callback: this.handleActionComplete(actionName),
      },
    });
  };

  onSkuSelected = ({ skuValue, selectedSku, selectedSkuComb }: any) => {
    // console.log(skuValue, selectedSku, selectedSkuComb);
  };

  handleActionComplete = (actionName: string) => (result: any) => {
    this.setState({
      addCartLoading: false,
      buyLoading: false,
    });
    if (actionName === "onAddCart" && result?.success) {
      Taro.showToast({
        title: "添加成功",
        icon: "success",
      });
    }
  };

  getPageView() {
    const {
      goodsId,
      price,
      pic,
      stockNum,
      categories,
      products,
      color,
    } = this.props;
    const { addCartLoading, buyLoading } = this.state;
    const skuData = {
      goods_id: goodsId,
      goods_info: {
        price: price,
        picture: pic,
      },
      sku: {
        price: price,
        stock_num: stockNum,
        none_sku: false,
        hide_stock: false,
        tree: _.isArray(categories)
          ? categories.map((cate: Category) => {
              const { name, key, values } = cate || {
                name: "",
                key: "",
                values: [],
              };
              return {
                k: name,
                k_s: key,
                v: _.isArray(values)
                  ? values.map((v: CategoryValueItem) => ({
                      id: v?.id,
                      name: v?.name,
                      imgUrl: v?.pic,
                    }))
                  : [],
                largeImageMode:
                  _.isArray(values) && values.some((v) => !!v?.pic),
              };
            })
          : [],
        list: _.isArray(products)
          ? products.map((p: GoodsItem) => ({
              id: p?.id,
              price: p?.price,
              stock_num: p?.stock,
              ...p?.category,
            }))
          : [],
      },
    };
    return (
      <SkuComponent
        color={color}
        sku={skuData.sku}
        goods={skuData.goods_info}
        goodsId={skuData.goods_id}
        onAddCart={this.onSubmit("onAddCart")}
        onBuyClicked={this.onSubmit("onBuy")}
        onSkuSelected={this.onSkuSelected}
        addCartLoading={addCartLoading}
        buyLoading={buyLoading}
      />
    );
  }

  static getWidgetType(): WidgetType {
    return "TARO_SKU_WIDGET";
  }
}

export interface MSkuWidgetProps extends WidgetProps {
  goodsId: string;
  price: number;
  pic: string;
  stockNum: number;
  categories: Category[];
  products: GoodsItem[];
  color: string;
  onAddCart: string;
  onBuy: string;
}

interface MSkuWidgetState extends WidgetState {
  addCartLoading: boolean;
  buyLoading: boolean;
}

export default MSkuWidget;
