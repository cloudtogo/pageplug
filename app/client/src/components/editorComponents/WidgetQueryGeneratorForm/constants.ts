import { PluginPackageName } from "entities/Action";

export const DROPDOWN_TRIGGER_DIMENSION = {
  HEIGHT: "36px",
  WIDTH: "100%",
};

export const DROPDOWN_DIMENSION = {
  HEIGHT: "300px",
  WIDTH: "100%",
};

export const DEFAULT_DROPDOWN_OPTION = {
  id: "- Select -",
  label: "",
  value: "",
  data: {},
};

export const PluginFormInputFieldMap: Record<
  string,
  { DATASOURCE: string; TABLE: string; COLUMN: string }
> = {
  [PluginPackageName.MONGO]: {
    DATASOURCE: "MongoDB",
    TABLE: "collection",
    COLUMN: "field",
  },
  [PluginPackageName.GOOGLE_SHEETS]: {
    DATASOURCE: "Google Sheets",
    TABLE: "spreadsheet",
    COLUMN: "keys",
  },
  DEFAULT: {
    DATASOURCE: "SQL Based",
    TABLE: "table",
    COLUMN: "column",
  },
};

export const DATASOURCE_DROPDOWN_SECTIONS = {
  CONNECT_TO_QUERY: "连接Query",
  CHOOSE_DATASOURCE_TO_CONNECT: "选择数据源连接",
  OTHER_ACTIONS: "其他行为",
};

export const DEFAULT_QUERY_OPTIONS_COUNTS_TO_SHOW = 4;
