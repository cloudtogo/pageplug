import React, { useContext } from "react";
import cls from "clsx";
import { BEM, createBEM } from "../../rvStyle/bem";
import { BORDER_BOTTOM } from "./constants";

type SkuRowProps = {
  skuRow: Record<any, any>;
};

const SkuRow: React.FC<SkuRowProps> = (props) => {
  const bem = createBEM("rv-sku-row");
  const { skuRow } = props;

  const renderTitle = () => {
    return (
      <div className={cls(bem("title"))}>
        {skuRow.k}
        {skuRow.is_multiple && (
          <span className={cls(bem("title-multiple"))}>（可多选）</span>
        )}
      </div>
    );
  };

  const renderContent = () => {
    const { largeImageMode } = skuRow;
    return largeImageMode ? (
      <div className={cls(bem("scroller"))}>
        <div className={cls(bem("row"))}>{props.children}</div>
      </div>
    ) : (
      props.children
    );
  };

  return (
    <div className={cls(bem(), BORDER_BOTTOM)}>
      {renderTitle()}
      {renderContent()}
    </div>
  );
};

export default SkuRow;
