/* eslint-disable react/no-array-index-key */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import cls from "clsx";
import { SkuActionType, SkuInstance, SkuProps } from "./PropsType";
import ActionBar from "../../ActionBarWidget/component";
import { Image } from "@taroify/core";
import { ScrollView } from "@tarojs/components";
import { PhotoFail } from "@taroify/icons";
import useSetState from "utils/hooks/use-set-state";
import { createBEM } from "../../rvStyle/bem";
import {
  getSelectedProperties,
  getSelectedPropValues,
  getSelectedSkuValues,
  getSkuComb,
  getSkuImgValue,
  isAllSelected,
  SelectedValueType,
} from "./utils";
import {
  LIMIT_TYPE,
  UNSELECTED_SKU_VALUE_ID,
  BORDER_BOTTOM,
} from "./constants";
import SkuRow from "./SkuRow";
import SkuRowItem from "./SkuRowItem";
import SkuRowPropItem from "./SkuRowPropItem";
import SkuStepper from "./SkuStepper";
import Taro from "@tarojs/taro";

const { QUOTA_LIMIT } = LIMIT_TYPE;

const Sku = forwardRef<SkuInstance, SkuProps>((props, ref) => {
  const bem = createBEM("rv-sku");
  const stepperError = useRef<boolean>(false);
  const [state, updateState]: any[] = useSetState({
    selectedSku: {},
    selectedProp: {},
    selectedNum: props.startSaleNum,
  });

  const { sku, properties = [] } = props;
  const { tree = [] } = sku;

  const hasSku = useMemo(() => !sku.none_sku, [sku.none_sku]);
  const hasSkuOrAttr = useMemo(() => hasSku || properties.length > 0, [
    hasSku,
    properties,
  ]);

  const isSkuCombSelected = useMemo(() => {
    // SKU 未选完
    if (hasSku && !isAllSelected(tree, state.selectedSku)) {
      return false;
    }

    // 属性未全选
    return !properties
      .filter((i) => i.is_necessary !== false)
      .some((i) => (state.selectedProp[i.k_id] || []).length === 0);
  }, [hasSku, state]);

  const selectedSkuValues = useMemo(() => {
    return getSelectedSkuValues(tree, state.selectedSku);
  }, [tree, state.selectedSku]);

  const selectedPropValues = useMemo(() => {
    return getSelectedPropValues(properties, state.selectedProp);
  }, [properties, state.selectedProp]);

  const selectedSkuComb = useMemo(() => {
    let skuComb = null;
    if (isSkuCombSelected) {
      if (hasSku) {
        skuComb = getSkuComb(sku.list, state.selectedSku);
      } else {
        skuComb = {
          id: sku.collection_id,
          price: Math.round(+sku.price * 100),
          stock_num: sku.stock_num,
        };
      }

      if (skuComb) {
        skuComb.properties = getSelectedProperties(
          properties,
          state.selectedProp,
        );
        skuComb.property_price = selectedPropValues.reduce(
          (acc: any, cur: any) => acc + (cur.price || 0),
          0,
        );
      }
    }
    return skuComb;
  }, [
    isSkuCombSelected,
    hasSku,
    JSON.stringify(sku),
    JSON.stringify(state),
    properties,
    selectedPropValues,
  ]);

  const unselectedSku = useMemo(() => {
    return tree
      .filter((item: any) => !state.selectedSku[item.k_s])
      .map((item: any) => item.k);
  }, [tree, state.selectedSku]);

  const getUnselectedProp = useCallback(
    (isNecessary?: boolean) => {
      return properties
        .filter((item) => (isNecessary ? item.is_necessary !== false : true))
        .filter((item) => (state.selectedProp[item.k_id] || []).length < 1)
        .map((item) => item.k);
    },
    [properties, state.selectedProp],
  );

  const selectedText = useMemo(() => {
    if (selectedSkuComb) {
      const values = selectedSkuValues.concat(selectedPropValues);
      return `已选 ${values.map((item: any) => item.name).join(" ")}`;
    }

    return `请选择 ${unselectedSku.concat(getUnselectedProp()).join(" ")}`;
  }, [
    unselectedSku,
    getUnselectedProp,
    selectedSkuComb,
    selectedSkuValues,
    selectedPropValues,
  ]);

  const price = useMemo(() => {
    if (selectedSkuComb) {
      return selectedSkuComb.price + selectedSkuComb.property_price;
    }
    // sku.price是一个格式化好的价格区间
    return sku.price;
  }, [JSON.stringify(selectedSkuComb), sku.price]);

  const stock = useMemo(() => {
    const { stockNum } = props.customStepperConfig;
    if (stockNum !== undefined) {
      return stockNum;
    }
    if (selectedSkuComb) {
      return selectedSkuComb.stock_num;
    }
    return sku.stock_num;
  }, [sku.stock_num, JSON.stringify(selectedSkuComb)]);

  const stockContent = useMemo(() => {
    if (props.stockRender) {
      return props.stockRender(stock);
    }
    return (
      <>
        剩余
        <span
          className={cls(
            bem("stock-num", {
              highlight: stock < (props.stockThreshold || 0),
            }),
          )}
        >
          {stock}
        </span>
        件
      </>
    );
  }, [stock]);

  const onSelect = (skuValue: any) => {
    // 点击已选中的sku时则取消选中
    const selectedSku =
      state.selectedSku[skuValue.skuKeyStr] === skuValue.id
        ? {
            ...state.selectedSku,
            [skuValue.skuKeyStr]: UNSELECTED_SKU_VALUE_ID,
          }
        : { ...state.selectedSku, [skuValue.skuKeyStr]: skuValue.id };

    updateState({ selectedSku, selectedNum: props.startSaleNum });
    if (props.onSkuSelected) {
      props.onSkuSelected({
        skuValue,
        selectedSku: state.selectedSku,
        selectedSkuComb,
      });
    }
  };

  const onPropSelect = (propValue: any) => {
    const arr = state.selectedProp[propValue.skuKeyStr] || [];
    const pos = arr.indexOf(propValue.id);

    if (pos > -1) {
      arr.splice(pos, 1);
    } else if (propValue.multiple) {
      arr.push(propValue.id);
    } else {
      arr.splice(0, 1, propValue.id);
    }
    const selectedProp = {
      ...state.selectedProp,
      [propValue.skuKeyStr]: arr,
    };

    updateState({ selectedProp });

    if (props.onSkuPropSelected) {
      props.onSkuPropSelected({
        propValue,
        selectedProp: state.selectedProp,
        selectedSkuComb,
      });
    }
  };

  const onOverLimit = (data: any) => {
    const { action, limitType, quota, quotaUsed } = data;
    const { handleOverLimit } = props.customStepperConfig;

    if (handleOverLimit) {
      handleOverLimit(data);
      return;
    }

    if (action === "minus") {
      if (props.startSaleNum && props.startSaleNum > 1) {
        Taro.showToast({
          title: `${props.startSaleNum}件起售`,
          icon: "none",
        });
      } else {
        Taro.showToast({
          title: "至少选择一件",
          icon: "none",
        });
      }
    } else if (action === "plus") {
      if (limitType === QUOTA_LIMIT) {
        if (quotaUsed > 0) {
          Taro.showToast({
            title: `每人限购${quota}件，你已购买${quotaUsed}件`,
            icon: "none",
          });
        } else {
          Taro.showToast({
            title: `每人限购${quota}件`,
            icon: "none",
          });
        }
      } else {
        Taro.showToast({
          title: "库存不足",
          icon: "none",
        });
      }
    }
  };

  const onStepperState = (data: any) => {
    stepperError.current = data.valid
      ? null
      : {
          ...data,
          action: "plus",
        };
  };

  const validateSku = () => {
    if (state.selectedNum === 0) {
      return "商品已经无法购买啦";
    }

    if (isSkuCombSelected) {
      return "";
    }

    return `请选择 ${unselectedSku.concat(getUnselectedProp(true)).join(" ")}`;
  };

  const getSkuData = () => {
    return {
      goodsId: props.goodsId,
      selectedNum: state.selectedNum,
      selectedSkuComb,
    };
  };

  const onAddCart = (data: any) => {
    props.onAddCart?.(data);
  };
  const onBuyClicked = (data: any) => {
    props.onBuyClicked?.(data);
  };

  const onBuyOrAddCart = async (type: SkuActionType) => {
    // sku 不符合购买条件
    if (stepperError.current) {
      onOverLimit(stepperError.current);
      return;
    }

    if (props.customSkuValidator) {
      if (
        !(await props.customSkuValidator(type, {
          ...state.selectedSku,
          ...state.selectedProp,
        }))
      ) {
        return;
      }
    } else {
      const error = validateSku();
      if (error) {
        Taro.showToast({
          title: error,
          icon: "none",
        });
        return;
      }
    }

    const data = getSkuData();
    if (type === "add-cart") {
      onAddCart(data);
    } else {
      onBuyClicked(data);
    }
  };

  const show = (initialValue?: typeof state) => {
    if (initialValue) {
      updateState(initialValue);
    }
  };

  const reset = () => {
    updateState({
      selectedSku: {},
      selectedProp: {},
      selectedNum: props.startSaleNum,
    });
  };

  const renderHeaderInfo = () => {
    return (
      <>
        {props.skuHeaderPriceRender?.(price) || (
          <div className={cls(bem("goods-price"))}>
            <span className={cls(bem("price-symbol"))}>￥</span>
            <span className={cls(bem("price-num"))}>{price}</span>
            {props.priceTag && (
              <span className={cls(bem("price-tag"))}>{props.priceTag}</span>
            )}
          </div>
        )}
        {props.skuHeaderOriginPrice && (
          <div className={cls(bem("header-item"))}>
            {props.skuHeaderOriginPrice}
          </div>
        )}
        {!props.hideStock && (
          <div className={cls(bem("header-item"))}>
            <span className={cls(bem("stock"))}>{stockContent}</span>
          </div>
        )}
        {!props.hideSelectedText && (
          <div className={cls(bem("header-item"))}>{selectedText}</div>
        )}
      </>
    );
  };

  const renderHeader = () => {
    if (props.skuHeader) return props.skuHeader;
    const selectedValue = getSkuImgValue(sku, state.selectedSku);
    const imgUrl = selectedValue
      ? selectedValue.imgUrl
      : (props.goods.picture as string);
    return (
      <div className={cls(bem("header"), BORDER_BOTTOM)}>
        {props.showHeaderImage && (
          <Image
            mode="aspectFit"
            src={imgUrl}
            key={imgUrl}
            className={cls(bem("header__img-wrap"))}
            fallback={<PhotoFail />}
          />
        )}
        <div className={cls(bem("header__goods-info"))}>
          {renderHeaderInfo()}
          {props.skuHeaderExtra}
        </div>
      </div>
    );
  };

  const renderGroup = () => {
    return (
      props.skuGroup ||
      (hasSkuOrAttr && (
        <div
          className={cls(
            bem("group-container", {
              "hide-soldout": !props.showSoldoutSku,
            }),
          )}
        >
          {tree.map((skuTreeItem: any, i: number) => (
            <SkuRow key={i} skuRow={skuTreeItem}>
              {skuTreeItem.v.map((skuValue: any, idx: number) => (
                <SkuRowItem
                  key={idx}
                  skuList={sku.list}
                  skuValue={skuValue}
                  skuKeyStr={`${skuTreeItem.k_s}`}
                  selectedSku={state.selectedSku}
                  disableSoldoutSku={!!props.disableSoldoutSku}
                  largeImageMode={skuTreeItem.largeImageMode}
                  previewIcon={props.previewIcon}
                  onSkuSelected={onSelect}
                />
              ))}
            </SkuRow>
          ))}

          {properties.map((skuTreeItem, i) => (
            <SkuRow key={i} skuRow={skuTreeItem}>
              {skuTreeItem.v.map((skuValue, idx) => (
                <SkuRowPropItem
                  key={idx}
                  skuValue={skuValue}
                  skuKeyStr={`${skuTreeItem.k_id}`}
                  selectedProp={state.selectedProp}
                  multiple={skuTreeItem.is_multiple}
                  onSkuPropSelected={onPropSelect}
                />
              ))}
            </SkuRow>
          ))}
        </div>
      ))
    );
  };

  const renderStepper = () =>
    props.skuStepper || (
      <SkuStepper
        currentNum={state.selectedNum}
        onChange={(currentValue) => {
          updateState({ selectedNum: parseInt(`${currentValue}`, 10) });
          if (props.onStepperChange) props.onStepperChange(currentValue);
        }}
        stock={stock}
        quota={props.quota || 0}
        quotaUsed={props.quotaUsed || 0}
        startSaleNum={props.startSaleNum || 1}
        disableStepperInput={props.disableStepperInput}
        customStepperConfig={props.customStepperConfig}
        stepperTitle={props.stepperTitle}
        hideQuotaText={props.hideQuotaText}
        onSkuStepperState={onStepperState}
        onSkuOverLimit={onOverLimit}
      />
    );

  const renderBody = () => {
    return (
      <ScrollView className={cls(bem("body"))} scrollY>
        {props.skuBodyTop}
        {renderGroup()}
        {props.skuGroupExtra}
        {renderStepper()}
      </ScrollView>
    );
  };

  const renderActions = () => {
    return (
      props.skuActions || (
        <div className={cls(bem("actions"))}>
          <ActionBar>
            {props.showAddCartBtn && (
              <ActionBar.Button
                type="warning"
                color={props.color}
                text={props.addCartText || "加入购物车"}
                onClick={() => onBuyOrAddCart("add-cart")}
                loading={props.addCartLoading}
              />
            )}
            <ActionBar.Button
              type="danger"
              color={props.color}
              text={props.buyText || "立即购买"}
              onClick={() => onBuyOrAddCart("buy-clicked")}
              loading={props.buyLoading}
            />
          </ActionBar>
        </div>
      )
    );
  };

  useEffect(() => {
    if (props.initialSku) {
      updateState(props.initialSku);
    }
  }, [JSON.stringify(props.initialSku)]);

  useImperativeHandle(ref, () => ({
    reset,
    getSkuData,
    show,
    update: updateState,
  }));

  return (
    <div
      className={cls(bem("container"))}
      style={{ "--sku-theme-color": props.color } as any}
    >
      {renderHeader()}
      {renderBody()}
      {props.skuActionsTop}
      {renderActions()}
      {props.skuActionsBottom}
    </div>
  );
});

// defaultProps defined if need
Sku.defaultProps = {
  stepperTitle: "购买数量",
  properties: [],
  showAddCartBtn: true,
  disableSoldoutSku: true,
  showHeaderImage: true,
  previewOnClickImage: true,
  showSoldoutSku: true,
  resetOnHide: true,
  safeAreaInsetBottom: true,
  quota: 0,
  quotaUsed: 0,
  startSaleNum: 1,
  stockThreshold: 50,
  bodyOffsetTop: 200,
  customStepperConfig: {},
};

Sku.displayName = "Sku";

export default Sku;
