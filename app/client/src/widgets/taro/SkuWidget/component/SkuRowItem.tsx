import React, { useMemo } from "react";
import cls from "clsx";
import { Image } from "@taroify/core";
import { PhotoFail } from "@taroify/icons";
import { createBEM } from "../../rvStyle/bem";
import { isSkuChoosable } from "./utils";

type SkuRowItemProps = {
  lazyload?: boolean;
  skuValue: Record<any, any>;
  skuKeyStr: string;
  selectedSku: Record<any, any>;
  largeImageMode: boolean;
  disableSoldoutSku: boolean;
  skuList: any[];
  previewIcon?: React.ReactNode;
  onSkuSelected?: (params: any) => void;
  onSkuPreviewImage?: (params: any) => void;
};

const SkuRowItem: React.FC<SkuRowItemProps> = (props) => {
  const bem = createBEM("rv-sku-row");
  const classPrefix = props.largeImageMode ? "image-item" : "item";

  const imgUrl = useMemo(() => {
    const url = props.skuValue.imgUrl || props.skuValue.img_url;
    return props.largeImageMode
      ? url ||
          "https://img01.yzcdn.cn/upload_files/2020/06/24/FmKWDg0bN9rMcTp9ne8MXiQWGtLn.png"
      : url;
  }, [props.skuValue]);

  const choosable = useMemo(() => {
    if (!props.disableSoldoutSku) {
      return true;
    }
    return isSkuChoosable(props.skuList, props.selectedSku, {
      key: props.skuKeyStr,
      valueId: props.skuValue.id,
    });
  }, [
    JSON.stringify(props.skuList),
    JSON.stringify(props.selectedSku),
    props.skuKeyStr,
  ]);

  const imageRender = () => {
    if (imgUrl) {
      return (
        <Image
          mode="aspectFit"
          src={imgUrl}
          lazyLoad={props.lazyload}
          className={cls(bem(`${classPrefix}-img`))}
          fallback={<PhotoFail />}
        />
      );
    }
    return null;
  };

  const onSelect = () => {
    if (choosable && props.onSkuSelected) {
      props.onSkuSelected({ ...props.skuValue, skuKeyStr: props.skuKeyStr });
    }
  };

  const choosed = props.skuValue.id === props.selectedSku[props.skuKeyStr];

  return (
    <span
      className={cls(
        bem(classPrefix, {
          active: choosed,
          disabled: !choosable,
        }),
      )}
      onClick={onSelect}
    >
      {imageRender()}
      <div className={cls(bem(`${classPrefix}-name`))}>
        {props.largeImageMode ? (
          <span className={cls("rv-multi-ellipsis--l2")}>
            {props.skuValue?.name}
          </span>
        ) : (
          props.skuValue?.name
        )}
      </div>
    </span>
  );
};

export default SkuRowItem;
