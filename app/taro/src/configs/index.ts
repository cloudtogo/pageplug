import { AppsmithUIConfigs } from "./types";

export type INJECTED_CONFIGS = {
  logLevel: "debug" | "error";
};
declare global {
  interface Window {
    APPSMITH_FEATURE_CONFIGS: INJECTED_CONFIGS;
    Intercom: any;
  }
}

const getConfigsFromEnvVars = (): INJECTED_CONFIGS => {
  return {
    logLevel:
      (process.env.REACT_APP_CLIENT_LOG_LEVEL as
        | "debug"
        | "error"
        | undefined) || "error",
  };
};

export const getAppsmithConfigs = (): AppsmithUIConfigs => {
  const ENV_CONFIG = getConfigsFromEnvVars();
  return {
    logLevel: ENV_CONFIG.logLevel,
  };
};
