import type { AdminConfigType } from "@appsmith/pages/AdminSettings/config/types";
import {
  SettingCategories,
  SettingTypes,
} from "@appsmith/pages/AdminSettings/config/types";
import BrandingPage from "pages/Settings/config/branding/BrandingPage";

export const config: AdminConfigType = {
  type: SettingCategories.BRANDING,
  controlType: SettingTypes.PAGE,
  canSave: false,
  title: "自定义品牌",
  icon: "pantone",
  component: BrandingPage,
};
