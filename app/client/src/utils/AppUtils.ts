import { getAppsmithConfigs } from "@appsmith/configs";
import FormControlRegistry from "./formControl/FormControlRegistry";
import { LogLevelDesc } from "loglevel";
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
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
}
