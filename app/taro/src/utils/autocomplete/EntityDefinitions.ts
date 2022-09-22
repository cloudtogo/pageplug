import _ from "lodash";
import { JSCollectionData } from "reducers/entityReducers/jsActionsReducer";

export const GLOBAL_DEFS = {
  dropdownOption: {
    label: "string",
    value: "string",
  },
  tabs: {
    id: "string",
    label: "string",
  },
  chartDataPoint: {
    x: "string",
    y: "string",
  },
  chartData: {
    seriesName: "string",
    data: "[chartDataPoint]",
  },
  latLong: {
    lat: "number",
    long: "number",
    title: "string",
  },
  mapMarker: {
    lat: "number",
    long: "number",
    title: "string",
    description: "string",
  },
  file: {
    data: "string",
    dataFormat: "string",
    name: "text",
    type: "file",
  },
  mapChartDataPoint: {
    id: "string",
    label: "string",
    originalId: "string",
    shortLabel: "string",
    value: "number",
  },
};

export const GLOBAL_FUNCTIONS = {
  "!name": "DATA_TREE.APPSMITH.FUNCTIONS",
  navigateTo: {
    "!doc": "Action to navigate the user to another page or url",
    "!type":
      "fn(pageNameOrUrl: string, params: {}, target?: string) -> +Promise[:t=[!0.<i>.:t]]",
  },
  showAlert: {
    "!doc": "Show a temporary notification style message to the user",
    "!type": "fn(message: string, style: string) -> +Promise[:t=[!0.<i>.:t]]",
  },
  showModal: {
    "!doc": "Open a modal",
    "!type": "fn(modalName: string) -> +Promise[:t=[!0.<i>.:t]]",
  },
  closeModal: {
    "!doc": "Close a modal",
    "!type": "fn(modalName: string) -> +Promise[:t=[!0.<i>.:t]]",
  },
  storeValue: {
    "!doc": "Store key value data locally",
    "!type": "fn(key: string, value: any) -> +Promise[:t=[!0.<i>.:t]]",
  },
  download: {
    "!doc": "Download anything as a file",
    "!type":
      "fn(data: any, fileName: string, fileType?: string) -> +Promise[:t=[!0.<i>.:t]]",
  },
  copyToClipboard: {
    "!doc": "Copy text to clipboard",
    "!type": "fn(data: string, options: object) -> +Promise[:t=[!0.<i>.:t]]",
  },
  resetWidget: {
    "!doc": "Reset widget values",
    "!type":
      "fn(widgetName: string, resetChildren: boolean) -> +Promise[:t=[!0.<i>.:t]]",
  },
  setInterval: {
    "!doc": "Execute triggers at a given interval",
    "!type": "fn(callback: fn, interval: number, id?: string) -> void",
  },
  clearInterval: {
    "!doc": "Stop executing a setInterval with id",
    "!type": "fn(id: string) -> void",
  },
};

export const getPropsForJSActionEntity = ({
  config,
  data,
}: JSCollectionData): Record<string, string> => {
  const properties: Record<string, any> = {};
  const actions = config.actions;
  if (actions && actions.length > 0)
    for (let i = 0; i < config.actions.length; i++) {
      const action = config.actions[i];
      properties[action.name + "()"] = "Function";
      if (data && action.id in data) {
        properties[action.name + ".data"] = data[action.id];
      }
    }
  const variablesProps = config.variables;
  if (variablesProps && variablesProps.length > 0) {
    for (let i = 0; i < variablesProps.length; i++) {
      const variableProp = variablesProps[i];
      properties[variableProp.name] = variableProp.value;
    }
  }
  return properties;
};
