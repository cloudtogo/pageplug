import { getAppsmithConfigs } from "@appsmith/configs";
import FormControlRegistry from "./formControl/FormControlRegistry";
import type { LogLevelDesc } from "loglevel";
import localStorage from "utils/localStorage";
import * as log from "loglevel";
import Modal from "react-modal";

export const appInitializer = () => {
  FormControlRegistry.registerFormControlBuilders();
  const appsmithConfigs = getAppsmithConfigs();
  log.setLevel(getEnvLogLevel(appsmithConfigs.logLevel));

  // For accessibility (https://reactcommunity.org/react-modal/accessibility/)
  if (process.env.NODE_ENV !== "test") {
    Modal.setAppElement("#root");
  }
};

const getEnvLogLevel = (configLevel: LogLevelDesc): LogLevelDesc => {
  let logLevel = configLevel;
  if (localStorage && localStorage.getItem) {
    const localStorageLevel = localStorage.getItem(
      "logLevelOverride",
    ) as LogLevelDesc;
    if (localStorageLevel) logLevel = localStorageLevel;
  }
  return logLevel;
};

/**
 * read json data from json url
 * @param blobUrl
 * @returns
 */
export async function readBlob(blobUrl: string): Promise<any> {
  const file = await fetch(blobUrl, {
    referrer: "",
  }).then((r) => r.blob());
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
  });
}
export type PanelStatus = { left: boolean; bottom: boolean; right: boolean };

export type PanelStyle = {
  bottom: {
    h: number;
  };
  codeEditor: {
    w: number;
    h: number;
  };
};

export const DefaultPanelStatus: PanelStatus = {
  left: true,
  bottom: true,
  right: true,
};
const DefaultPanelStyle: PanelStyle = {
  bottom: {
    h: 285,
  },
  codeEditor: {
    w: 744,
    h: 468,
  },
};

export function savePanelStatus(panelStatus: PanelStatus) {
  localStorage.setItem("editor_panel_status", JSON.stringify(panelStatus));
}

export function getPanelStatus(): PanelStatus {
  const str = localStorage.getItem("editor_panel_status");
  if (!str) {
    return DefaultPanelStatus;
  }
  return { ...DefaultPanelStatus, ...JSON.parse(str) };
}

export function savePanelStyle(panelStyle: PanelStyle) {
  localStorage.setItem("editor_panel_style", JSON.stringify(panelStyle));
}

export function getPanelStyle(): PanelStyle {
  const str = localStorage.getItem("editor_panel_style");
  if (!str) {
    return DefaultPanelStyle;
  }
  return { ...DefaultPanelStyle, ...JSON.parse(str) };
}
