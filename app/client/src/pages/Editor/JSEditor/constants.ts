import type { OptionProps } from "design-system-old";
import type { JSActionDropdownOption } from "./utils";

export const RUN_BUTTON_DEFAULTS = {
  HEIGHT: "30px",
  CTA_TEXT: "运行",
  // space between button and dropdown
  GAP_SIZE: "10px",
  DROPDOWN_HIGHLIGHT_BG: "#E7E7E7",
};
export const NO_SELECTION_DROPDOWN_OPTION: JSActionDropdownOption = {
  label: "未选中函数",
  value: "",
  data: null,
};
export const NO_FUNCTION_DROPDOWN_OPTION: JSActionDropdownOption = {
  label: "目前没有定义函数",
  value: "",
  data: null,
};

export const CONFIRM_BEFORE_CALLING_HEADING = {
  text: "Confirm before calling ",
  hasInfo: true,
  info: `Ask for confirmation before executing function.`,
  key: "run_before_calling",
  hidden: true,
};

export const SETTINGS_HEADINGS = [
  {
    text: "函数名",
    hasInfo: false,
    key: "func_name",
    hidden: undefined,
  },
  {
    text: "页面加载后执行",
    hasInfo: true,
    info: "页面加载后立即执行该函数",
    key: "run_on_pageload",
    hidden: undefined,
  },
  {
    text: "执行函数前确认",
    hasInfo: true,
    info: "执行函数前向用户弹窗提醒确认执行",
    key: "run_before_calling",
  },
];
export const RADIO_OPTIONS: OptionProps[] = [
  {
    label: "是",
    value: "true",
  },
  {
    label: "否",
    value: "false",
  },
];
export const RUN_GUTTER_ID = "run-gutter";
export const RUN_GUTTER_CLASSNAME = "run-marker-gutter";
export const JS_OBJECT_HOTKEYS_CLASSNAME = "js-object-hotkeys";
export const ANIMATE_RUN_GUTTER = "animate-run-marker";

export const testLocators = {
  runJSAction: "run-js-action",
};
