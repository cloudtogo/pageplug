import Taro from "@tarojs/taro";

const getQueryParamsObject = () => {
  return Taro.getCurrentInstance().router?.params || {};
};

export default getQueryParamsObject;
