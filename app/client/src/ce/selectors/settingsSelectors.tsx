import type { AppState } from "ee/reducers";

export const getWXLoginClientId = (state: AppState) =>
  state.settings.config.APPSMITH_WX_CLIENT_ID;
