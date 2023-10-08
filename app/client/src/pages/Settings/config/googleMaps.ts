import { GOOGLE_MAPS_SETUP_DOC } from "constants/ThirdPartyConstants";
import type { AdminConfigType } from "@appsmith/pages/AdminSettings/config/types";
import {
  CategoryType,
  SettingCategories,
  SettingSubtype,
  SettingTypes,
} from "@appsmith/pages/AdminSettings/config/types";

export const config: AdminConfigType = {
  icon: "map-pin-2-line",
  type: SettingCategories.GOOGLE_MAPS,
  categoryType: CategoryType.GENERAL,
  controlType: SettingTypes.GROUP,
  title: "Google 地图",
  canSave: true,
  needsRefresh: true,
  settings: [
    {
      id: "APPSMITH_GOOGLE_MAPS_READ_MORE",
      category: SettingCategories.GOOGLE_MAPS,
      controlType: SettingTypes.LINK,
      label: "如何配置？",
      url: GOOGLE_MAPS_SETUP_DOC,
    },
    {
      id: "googleMapsKey",
      category: SettingCategories.GOOGLE_MAPS,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "Google 地图 API Key",
    },
  ],
};
