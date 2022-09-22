import { UNSELECTED_SKU_VALUE_ID } from "./constants";
import { SelectedSkuData, SkuData } from "./PropsType";

export type SelectedValueType = {
  ks: string;
  imgUrl: string;
  position: number;
};

export function getSkuImgValue(
  sku: SkuData,
  selectedSku: SelectedSkuData,
): SelectedValueType | undefined {
  let imgValue;

  sku.tree.some((item) => {
    const id = selectedSku[item.k_s];

    if (id && item.v) {
      const matchedSkuIdx = item.v.findIndex((skuValue) => skuValue.id === id);
      const matchedSku = item.v[matchedSkuIdx];

      const img =
        matchedSku?.previewImgUrl || matchedSku?.imgUrl || matchedSku?.img_url;
      if (img) {
        imgValue = {
          ...matchedSku,
          ks: item.k_s,
          imgUrl: img,
          position: matchedSkuIdx,
        };
        return true;
      }
    }

    return false;
  });

  return imgValue;
}

/*
  normalize sku tree

  [
    {
      count: 2,
      k: "品种", // 规格名称 skuKeyName
      k_id: "1200", // skuKeyId
      k_s: "s1" // skuKeyStr
      v: [ // skuValues
        { // skuValue
          id: "1201", // skuValueId
          name: "萌" // 具体的规格值 skuValueName
        }, {
          id: "973",
          name: "帅"
        }
      ]
    },
    ...
  ]
                |
                v
  {
    s1: [{
      id: "1201",
      name: "萌"
    }, {
      id: "973",
      name: "帅"
    }],
    ...
  }
 */
export const normalizeSkuTree = (skuTree: any) => {
  const normalizedTree: any = {};
  skuTree.forEach((treeItem: any) => {
    normalizedTree[treeItem.k_s] = treeItem.v;
  });
  return normalizedTree;
};

export const normalizePropList = (propList: any) => {
  const normalizedProp: any = {};
  propList.forEach((item: any) => {
    const itemObj: any = {};
    item.v.forEach((it: any) => {
      itemObj[it.id] = it;
    });
    normalizedProp[item.k_id] = itemObj;
  });
  return normalizedProp;
};

// 判断是否所有的sku都已经选中
export const isAllSelected = (skuTree: any, selectedSku: any) => {
  // 筛选selectedSku对象中key值不为空的值
  const selected = Object.keys(selectedSku).filter(
    (skuKeyStr) => selectedSku[skuKeyStr] !== UNSELECTED_SKU_VALUE_ID,
  );
  return skuTree.length === selected.length;
};

// 根据已选择的 sku 获取 skuComb
export const getSkuComb = (skuList: any, selectedSku: any) => {
  const skuComb = skuList.filter((item: any) =>
    Object.keys(selectedSku).every(
      (skuKeyStr) => String(item[skuKeyStr]) === String(selectedSku[skuKeyStr]),
    ),
  );
  return skuComb[0];
};

// 获取已选择的sku名称
export const getSelectedSkuValues = (skuTree: any, selectedSku: any) => {
  const normalizedTree = normalizeSkuTree(skuTree);
  return Object.keys(selectedSku).reduce((selectedValues: any, skuKeyStr) => {
    const skuValues = normalizedTree[skuKeyStr];
    const skuValueId = selectedSku[skuKeyStr];

    if (skuValueId !== UNSELECTED_SKU_VALUE_ID) {
      const skuValue = skuValues.filter(
        (value: any) => value.id === skuValueId,
      )[0];
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      skuValue && selectedValues.push(skuValue);
    }
    return selectedValues;
  }, []);
};

// 判断sku是否可选
export const isSkuChoosable = (
  skuList: any,
  selectedSku: any,
  skuToChoose: any,
) => {
  const { key, valueId } = skuToChoose;

  // 先假设sku已选中，拼入已选中sku对象中
  const matchedSku = {
    ...selectedSku,
    [key]: valueId,
  };

  // 再判断剩余sku是否全部不可选，若不可选则当前sku不可选中
  const skusToCheck = Object.keys(matchedSku).filter(
    (skuKey) => matchedSku[skuKey] !== UNSELECTED_SKU_VALUE_ID,
  );

  const filteredSku = skuList.filter((sku: any) =>
    skusToCheck.every(
      (skuKey) => String(matchedSku[skuKey]) === String(sku[skuKey]),
    ),
  );

  const stock = filteredSku.reduce((total: any, sku: any) => {
    total += sku.stock_num;
    return total;
  }, 0);
  return stock > 0;
};

export const getSelectedPropValues = (propList: any, selectedProp: any) => {
  const normalizeProp: any = normalizePropList(propList);
  return Object.keys(selectedProp).reduce((acc: any, cur) => {
    selectedProp[cur].forEach((it: any) => {
      acc.push({
        ...normalizeProp[cur][it],
      });
    });
    return acc;
  }, []);
};

export const getSelectedProperties = (propList: any, selectedProp: any) => {
  const list: any = [];
  (propList || []).forEach((prop: any) => {
    if (selectedProp[prop.k_id] && selectedProp[prop.k_id].length > 0) {
      const v: any = [];
      prop.v.forEach((it: any) => {
        if (selectedProp[prop.k_id].indexOf(it.id) > -1) {
          v.push({ ...it });
        }
      });
      list.push({
        ...prop,
        v,
      });
    }
  });
  return list;
};

export default {
  normalizeSkuTree,
  getSkuComb,
  getSelectedSkuValues,
  isAllSelected,
  isSkuChoosable,
  getSelectedPropValues,
  getSelectedProperties,
};
