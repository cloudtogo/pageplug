import {
  AdminConfigType,
  CategoryType,
  SettingCategories,
  SettingSubtype,
  SettingTypes,
} from "@appsmith/pages/AdminSettings/config/types";

export const config: AdminConfigType = {
  icon: "mobile",
  type: SettingCategories.MINI,
  controlType: SettingTypes.GROUP,
  categoryType: CategoryType.GENERAL,
  title: "小程序",
  canSave: true,
  settings: [
    {
      id: "CLOUDOS_WECHAT_APPID",
      category: SettingCategories.MINI,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "AppID（小程序ID）",
    },
    {
      id: "CLOUDOS_WECHAT_SECRET",
      category: SettingCategories.MINI,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "AppSecret（小程序密钥）",
    },
  ],
};
