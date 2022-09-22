import React, { useContext, useMemo, useState } from "react";
import cls from "clsx";
import { BEM, createBEM } from "../../rvStyle/bem";
import { LIMIT_TYPE } from "./constants";
import { Stepper } from "@taroify/core";

type SkuStepperProps = {
  currentNum: number;
  onChange: (v: number) => void;
  onSkuStepperState: (v: any) => void;
  onSkuOverLimit?: (v: any) => void;
  stock: number;
  stepperTitle?: React.ReactNode;
  disableStepperInput?: boolean;
  hideQuotaText?: boolean;
  quota: number | string;
  quotaUsed: number | string;
  startSaleNum: number | string;
  customStepperConfig?: any;
};

const { QUOTA_LIMIT, STOCK_LIMIT } = LIMIT_TYPE;

const SkuStepper: React.FC<SkuStepperProps> = (props) => {
  const bem = createBEM("rv-sku");
  const [limitType, setLimitType] = useState(STOCK_LIMIT);
  const [updateKey, setUpdateKey] = useState(0);

  const stepperLimit = useMemo(() => {
    const quotaLimit = +props.quota - +props.quotaUsed;
    let limit;
    let currentLimitType;

    // 无限购时直接取库存，有限购时取限购数和库存数中小的那个
    if (+props.quota > 0 && quotaLimit <= props.stock) {
      // 修正负的limit
      limit = quotaLimit < 0 ? 0 : quotaLimit;
      currentLimitType = QUOTA_LIMIT;
    } else {
      limit = props.stock;
      currentLimitType = STOCK_LIMIT;
    }

    setLimitType(currentLimitType);

    return limit;
  }, [props.quota, props.quotaUsed, props.stock]);

  const stepperMinLimit = useMemo(() => {
    return +props.startSaleNum < 1 ? 1 : +props.startSaleNum;
  }, [props.startSaleNum]);

  const quotaContent = useMemo(() => {
    const { quotaText, hideQuotaText } = props.customStepperConfig;
    if (hideQuotaText) return "";

    let text = "";

    if (quotaText) {
      text = quotaText;
    } else {
      const textArr = [];
      if (+props.startSaleNum > 1) {
        textArr.push(`${props.startSaleNum}件起售`);
      }
      if (+props.quota > 0) {
        textArr.push(`限购${+props.quota}件`);
      }
      text = textArr.join(",");
    }

    return text;
  }, [
    JSON.stringify(props.customStepperConfig),
    props.startSaleNum,
    props.quota,
  ]);

  const checkState = (min: number, max: number) => {
    // 如果选择小于起售，则强制变为起售
    if (props.currentNum < min || min > max) {
      props.onChange(min);
    } else if (props.currentNum > max) {
      // 当前选择数量大于最大可选时，需要重置已选数量
      props.onChange(max);
    }
    props.onSkuStepperState({
      valid: min <= max,
      min,
      max,
      limitType,
      quota: props.quota,
      quotaUsed: props.quotaUsed,
      startSaleNum: props.startSaleNum,
    });
  };

  const setCurrentNum = (num: number) => {
    props.onChange(num);
    checkState(stepperMinLimit, stepperLimit);
  };

  const onChange = (currentValue: any) => {
    // setUpdateKey(updateKey + 1);
    const intValue = parseInt(currentValue, 10);
    const { handleStepperChange } = props.customStepperConfig;
    if (handleStepperChange) handleStepperChange(intValue);
    setCurrentNum(currentValue);
  };

  return (
    <div className={cls(bem("stepper-stock"))}>
      <div className={cls(bem("stepper-title"))}>{props.stepperTitle}</div>
      <Stepper
        min={stepperMinLimit}
        max={stepperLimit}
        className={cls(bem("stepper"))}
        value={props.currentNum}
        onChange={onChange}
      >
        <Stepper.Button />
        <Stepper.Input disabled key={updateKey} />
        <Stepper.Button />
      </Stepper>
      {!props.hideQuotaText && quotaContent && (
        <span className={cls(bem("stepper-quota"))}>{quotaContent}</span>
      )}
    </div>
  );
};

SkuStepper.defaultProps = {
  quota: 0,
  quotaUsed: 0,
  startSaleNum: 1,
  customStepperConfig: {},
};

export default SkuStepper;
