import type {
  AdminConfigType,
  Setting,
} from "@appsmith/pages/AdminSettings/config/types";
import {
  SettingCategories,
  SettingTypes,
} from "@appsmith/pages/AdminSettings/config/types";
import { isAirgapped } from "@appsmith/utils/airgapHelpers";

const isAirgappedInstance = isAirgapped();

export const config: AdminConfigType = {
  icon: "timer-2-line",
  type: SettingCategories.VERSION,
  controlType: SettingTypes.GROUP,
  title: "版本",
  canSave: false,
  settings: [
    {
      id: "APPSMITH_CURRENT_VERSION",
      category: SettingCategories.VERSION,
      controlType: SettingTypes.TEXT,
      label: "当前版本",
    },
    {
      id: "APPSMITH_VERSION_READ_MORE",
      url: "https://pageplug.cn",
      // action: (dispatch?: Dispatch<ReduxAction<boolean>>) => {
      //   dispatch &&
      //     dispatch({
      //       type: ReduxActionTypes.TOGGLE_RELEASE_NOTES,
      //       payload: true,
      //     });
      // },
      category: SettingCategories.VERSION,
      controlType: SettingTypes.LINK,
      label: "PagePlug 官方版本发布",
    },
  ].filter((setting) =>
    isAirgappedInstance ? setting.id !== "APPSMITH_VERSION_READ_MORE" : true,
  ) as Setting[],
};
