import type React from "react";
import type { ReduxAction } from "@appsmith/constants/ReduxActionConstants";
import type { Dispatch } from "react";
import type { RadioOptionProps } from "pages/Settings/FormGroup/Radio";
import type { CalloutKind, SelectOptionProps } from "design-system";

type ControlType = {
  [K in keyof ControlPropsType]: {
    controlType: K;
    controlTypeProps?: ControlPropsType[K];
  };
}[keyof ControlPropsType];

type ControlPropsType = {
  [SettingTypes.RADIO]: RadioOptionProps;
  [SettingTypes.TEXTINPUT]: unknown;
  [SettingTypes.TOGGLE]: unknown;
  [SettingTypes.LINK]: unknown;
  [SettingTypes.BUTTON]: unknown;
  [SettingTypes.GROUP]: unknown;
  [SettingTypes.TEXT]: unknown;
  [SettingTypes.UNEDITABLEFIELD]: unknown;
  [SettingTypes.ACCORDION]: unknown;
  [SettingTypes.TAGINPUT]: unknown;
  [SettingTypes.DROPDOWN]: unknown;
  [SettingTypes.CHECKBOX]: unknown;
};

export enum SettingTypes {
  RADIO = "RADIO",
  TEXTINPUT = "TEXTINPUT",
  TOGGLE = "TOGGLE",
  LINK = "LINK",
  BUTTON = "BUTTON",
  GROUP = "GROUP",
  TEXT = "TEXT",
  PAGE = "PAGE",
  UNEDITABLEFIELD = "UNEDITABLEFIELD",
  ACCORDION = "ACCORDION",
  TAGINPUT = "TAGINPUT",
  DROPDOWN = "DROPDOWN",
  CHECKBOX = "CHECKBOX",
}

export enum SettingSubtype {
  EMAIL = "email",
  TEXT = "text",
  NUMBER = "number",
  PASSWORD = "password",
}

export const SettingSubCategories = {
  GOOGLE: "google signup",
  GITHUB: "github signup",
  FORMLOGIN: "form login",
  WECHAT: "微信登录",
};

export type Setting = ControlType & {
  id: string;
  category?: string;
  controlSubType?: SettingSubtype;
  format?: (value: string) => any;
  parse?: (value: any) => any;
  helpText?: string;
  label?: React.ReactNode;
  name?: string;
  placeholder?: string;
  validate?: (value: string, setting?: Setting) => string | void;
  url?: string;
  children?: any;
  subCategory?: string;
  value?: string;
  text?: string;
  textSuffix?: React.ReactElement;
  action?: (
    dispatch: Dispatch<ReduxAction<any>>,
    settings?: Record<string, any>,
  ) => void;
  sortOrder?: number;
  subText?: string;
  toggleText?: (value: boolean) => string;
  isVisible?: (values: Record<string, any>) => boolean;
  isHidden?: boolean;
  isDisabled?: (values: Record<string, any>) => boolean;
  calloutType?: CalloutKind;
  advanced?: Setting[];
  isRequired?: boolean;
  forceHidden?: boolean;
  formName?: string;
  fieldName?: string;
  dropdownOptions?: Partial<SelectOptionProps>[];
  needsUpgrade?: boolean;
  tooltip?: string;
};

export interface Category {
  title: string;
  slug: string;
  subText?: string;
  isConnected?: boolean;
  needsRefresh?: boolean;
  children?: Category[];
  icon?: string;
  categoryType: string;
  needsUpgrade?: boolean;
  isEnterprise?: boolean;
  isFeatureEnabled?: boolean;
}

export const SettingCategories = {
  GENERAL: "general",
  MINI: "mini",
  EMAIL: "email",
  GOOGLE_MAPS: "google-maps",
  BAIDU_MAPS: "baidu-maps",
  VERSION: "version",
  ADVANCED: "advanced",
  AUTHENTICATION: "authentication",
  FORM_AUTH: "form-login",
  GOOGLE_AUTH: "google-auth",
  GITHUB_AUTH: "github-auth",
  AUDIT_LOGS: "audit-logs",
  ACCESS_CONTROL: "access-control",
  PROVISIONING: "provisioning",
  BRANDING: "branding",
  WECHAT_AUTH: "wechat-auth",
  SAML_AUTH: "saml-auth",
  OIDC_AUTH: "oidc-auth",
};

export enum CategoryType {
  GENERAL = "general",
  ACL = "acl",
  OTHER = "other",
}

export type AdminConfigType = {
  type: string;
  controlType: SettingTypes;
  title: string;
  subText?: string;
  settings?: Setting[];
  component?: React.ElementType;
  children?: AdminConfigType[];
  canSave: boolean;
  isConnected?: boolean;
  needsRefresh?: boolean;
  icon?: string;
  needsUpgrade?: boolean;
  categoryType: CategoryType;
  isEnterprise?: boolean;
  isFeatureEnabled?: boolean;
};
