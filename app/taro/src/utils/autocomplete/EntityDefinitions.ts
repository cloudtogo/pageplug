import _ from "lodash";

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
  },
  mapMarker: {
    lat: "number",
    long: "number",
    title: "string",
    description: "string",
  },
  file: {
    data: "string",
    name: "text",
    type: "file",
  },
};

export const GLOBAL_FUNCTIONS = {
  "!name": "DATA_TREE.APPSMITH.FUNCTIONS",
  navigateTo: {
    "!doc": "Action to navigate the user to another page or url",
    "!type": "fn(pageNameOrUrl: string, params: {}, target?: string) -> void",
  },
  showAlert: {
    "!doc": "Show a temporary notification style message to the user",
    "!type": "fn(message: string, style: string) -> void",
  },
  showModal: {
    "!doc": "Open a modal",
    "!type": "fn(modalName: string) -> void",
  },
  closeModal: {
    "!doc": "Close a modal",
    "!type": "fn(modalName: string) -> void",
  },
  storeValue: {
    "!doc": "Store key value data locally",
    "!type": "fn(key: string, value: any) -> void",
  },
  copyToClipboard: {
    "!doc": "Copy text to clipboard",
    "!type": "fn(data: string, options: object) -> void",
  },
  resetWidget: {
    "!doc": "Reset widget values",
    "!type": "fn(widgetName: string, resetChildren: boolean) -> void",
  },
};
