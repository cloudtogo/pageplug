import { GOOGLE_MAPS_SETUP_DOC } from "constants/ThirdPartyConstants";
import type { Setting } from "../types";
import {
  SettingCategories,
  SettingSubtype,
  SettingTypes,
} from "@appsmith/pages/AdminSettings/config/types";

export const googleMapsConfig: Setting[] = [
  {
    id: "APPSMITH_GOOGLE_MAPS_READ_MORE",
    category: SettingCategories.DEVELOPER_SETTINGS,
    controlType: SettingTypes.CALLOUT,
    label: "如何配置谷歌地图?",
    url: GOOGLE_MAPS_SETUP_DOC,
  },
  {
    id: "googleMapsKey",
    category: SettingCategories.DEVELOPER_SETTINGS,
    controlType: SettingTypes.TEXTINPUT,
    controlSubType: SettingSubtype.TEXT,
    label: "谷歌地图API key",
  },
];
