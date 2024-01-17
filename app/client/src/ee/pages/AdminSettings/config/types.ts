export * from "ce/pages/AdminSettings/config/types";
import {
  SettingCategories as SettingCategoriesCE,
  SettingSubCategories as SettingSubCategoriesCE,
} from "ce/pages/AdminSettings/config/types";

export const SettingCategories = {
  ...SettingCategoriesCE,
  OIDC_AUTH: "oidc",
  ACCESS_USER: "access-user",
  ACCESS_GROUP: "access-group",
  ACCESS_ROLE: "access-role",
};

export const SettingSubCategories = {
  ...SettingSubCategoriesCE,
  OIDC: "oidc 登录",
  WECHAT: "微信登录",
  BUSSINESS_WECHAT: "企业微信登录",
};
