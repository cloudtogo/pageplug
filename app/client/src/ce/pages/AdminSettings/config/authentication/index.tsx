import React from "react";
import {
  GITHUB_SIGNUP_SETUP_DOC,
  GOOGLE_SIGNUP_SETUP_DOC,
  SIGNUP_RESTRICTION_DOC,
} from "constants/ThirdPartyConstants";
import type { AdminConfigType } from "@appsmith/pages/AdminSettings/config/types";
import {
  SettingCategories,
  SettingSubCategories,
  SettingSubtype,
  SettingTypes,
} from "@appsmith/pages/AdminSettings/config/types";
import type { AuthMethodType } from "./AuthPage";
import { AuthPage } from "./AuthPage";
import Google from "assets/images/Google.png";
import SamlSso from "assets/images/saml.svg";
import OIDC from "assets/images/oidc.svg";
import Github from "assets/images/Github.png";
import Lock from "assets/images/lock-password-line.svg";
import {
  JS_ORIGIN_URI_FORM,
  REDIRECT_URL_FORM,
} from "@appsmith/constants/forms";
import { useSelector } from "react-redux";
import {
  getThirdPartyAuths,
  getIsFormLoginEnabled,
} from "@appsmith/selectors/tenantSelectors";

const FormAuth: AdminConfigType = {
  type: SettingCategories.FORM_AUTH,
  controlType: SettingTypes.GROUP,
  title: "账号密码登录",
  subText: "为你的 PagePlug 开启账号密码登录",
  canSave: true,
  isConnected: false,
  settings: [
    {
      id: "APPSMITH_FORM_LOGIN_DISABLED",
      category: SettingCategories.FORM_AUTH,
      subCategory: SettingSubCategories.FORMLOGIN,
      controlType: SettingTypes.TOGGLE,
      label: "登录",
      toggleText: (value: boolean) => (value ? "关闭" : "开启"),
    },
    {
      id: "APPSMITH_SIGNUP_DISABLED",
      category: SettingCategories.FORM_AUTH,
      subCategory: SettingSubCategories.FORMLOGIN,
      controlType: SettingTypes.TOGGLE,
      label: "注册",
      toggleText: (value: boolean) =>
        value ? "只允许邀请用户注册" : "允许任何用户注册",
    },
    {
      id: "APPSMITH_FORM_CALLOUT_BANNER",
      category: SettingCategories.FORM_AUTH,
      subCategory: SettingSubCategories.FORMLOGIN,
      controlType: SettingTypes.LINK,
      label: "账号密码登录不会校验邮箱是否有效",
      url: SIGNUP_RESTRICTION_DOC,
      calloutType: "Warning",
    },
  ],
};

const GoogleAuth: AdminConfigType = {
  type: SettingCategories.GOOGLE_AUTH,
  controlType: SettingTypes.GROUP,
  title: "Google 登录",
  subText: "使用 Google 账号登录你的平台 (OAuth)",
  canSave: true,
  settings: [
    {
      id: "APPSMITH_OAUTH2_GOOGLE_READ_MORE",
      category: SettingCategories.GOOGLE_AUTH,
      subCategory: SettingSubCategories.GOOGLE,
      controlType: SettingTypes.LINK,
      label: "如何配置？",
      url: GOOGLE_SIGNUP_SETUP_DOC,
    },
    {
      id: "APPSMITH_OAUTH2_GOOGLE_JS_ORIGIN_URL",
      category: SettingCategories.GOOGLE_AUTH,
      subCategory: SettingSubCategories.GOOGLE,
      controlType: SettingTypes.UNEDITABLEFIELD,
      label: "JavaScript Origin URL",
      formName: JS_ORIGIN_URI_FORM,
      fieldName: "js-origin-url-form",
      value: "",
      tooltip:
        "This URL will be used while configuring the Google OAuth Client ID's authorized JavaScript origins",
      helpText: "Paste this URL in your Google developer console.",
    },
    {
      id: "APPSMITH_OAUTH2_GOOGLE_REDIRECT_URL",
      category: SettingCategories.GOOGLE_AUTH,
      subCategory: SettingSubCategories.GOOGLE,
      controlType: SettingTypes.UNEDITABLEFIELD,
      label: "Redirect URL",
      formName: REDIRECT_URL_FORM,
      fieldName: "redirect-url-form",
      value: "/login/oauth2/code/google",
      tooltip:
        "This URL will be used while configuring the Google OAuth Client ID's authorized Redirect URIs",
      helpText: "Paste this URL in your Google developer console.",
    },
    {
      id: "APPSMITH_OAUTH2_GOOGLE_CLIENT_ID",
      category: SettingCategories.GOOGLE_AUTH,
      subCategory: SettingSubCategories.GOOGLE,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "Client ID",
      isRequired: true,
    },
    {
      id: "APPSMITH_OAUTH2_GOOGLE_CLIENT_SECRET",
      category: SettingCategories.GOOGLE_AUTH,
      subCategory: SettingSubCategories.GOOGLE,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "Client Secret",
      isRequired: true,
    },
    {
      id: "APPSMITH_SIGNUP_ALLOWED_DOMAINS",
      category: SettingCategories.GOOGLE_AUTH,
      subCategory: SettingSubCategories.GOOGLE,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "允许域名",
      placeholder: "domain1.com, domain2.com",
    },
  ],
};

const GithubAuth: AdminConfigType = {
  type: SettingCategories.GITHUB_AUTH,
  controlType: SettingTypes.GROUP,
  title: "Github 登录",
  subText: "使用 Github 账号登录你的平台 (SAML)",
  canSave: true,
  settings: [
    {
      id: "APPSMITH_OAUTH2_GITHUB_READ_MORE",
      category: SettingCategories.GITHUB_AUTH,
      subCategory: SettingSubCategories.GITHUB,
      controlType: SettingTypes.LINK,
      label: "如何配置？",
      url: GITHUB_SIGNUP_SETUP_DOC,
    },
    {
      id: "APPSMITH_OAUTH2_GITHUB_CLIENT_ID",
      category: SettingCategories.GITHUB_AUTH,
      subCategory: SettingSubCategories.GITHUB,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "Client ID",
      isRequired: true,
    },
    {
      id: "APPSMITH_OAUTH2_GITHUB_CLIENT_SECRET",
      category: SettingCategories.GITHUB_AUTH,
      subCategory: SettingSubCategories.GITHUB,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "Client Secret",
      isRequired: true,
    },
  ],
};

export const FormAuthCallout: AuthMethodType = {
  id: "APPSMITH_FORM_LOGIN_AUTH",
  category: SettingCategories.FORM_AUTH,
  label: "账号密码登录",
  subText: "允许用户使用账号密码登录你的平台",
  image: Lock,
  type: "LINK",
};

export const GoogleAuthCallout: AuthMethodType = {
  id: "APPSMITH_GOOGLE_AUTH",
  category: SettingCategories.GOOGLE_AUTH,
  label: "Google",
  subText: "允许使用 Google 账号登录你的平台",
  image: Google,
  type: "LINK",
};

export const GithubAuthCallout: AuthMethodType = {
  id: "APPSMITH_GITHUB_AUTH",
  category: SettingCategories.GITHUB_AUTH,
  label: "Github",
  subText: "允许使用 Github 账号登录你的平台",
  image: Github,
  type: "LINK",
};

export const SamlAuthCallout: AuthMethodType = {
  id: "APPSMITH_SAML_AUTH",
  category: "saml",
  label: "SAML 2.0",
  subText: `允许使用 SAML2 协议的单点登录服务登录你的平台`,
  image: SamlSso,
  needsUpgrade: true,
  type: "OTHER",
};

export const OidcAuthCallout: AuthMethodType = {
  id: "APPSMITH_OIDC_AUTH",
  category: "oidc",
  label: "OIDC",
  subText: `允许使用 OIDC 协议的单点登录服务登录你的平台`,
  image: OIDC,
  needsUpgrade: true,
  type: "OTHER",
};

const AuthMethods = [
  OidcAuthCallout,
  // SamlAuthCallout,
  GoogleAuthCallout,
  GithubAuthCallout,
  FormAuthCallout,
];

function AuthMain() {
  FormAuthCallout.isConnected = useSelector(getIsFormLoginEnabled);
  const socialLoginList = useSelector(getThirdPartyAuths);
  GoogleAuth.isConnected = GoogleAuthCallout.isConnected =
    socialLoginList.includes("google");
  GithubAuth.isConnected = GithubAuthCallout.isConnected =
    socialLoginList.includes("github");
  return <AuthPage authMethods={AuthMethods} />;
}

export const config: AdminConfigType = {
  icon: "lock-password-line",
  type: SettingCategories.AUTHENTICATION,
  controlType: SettingTypes.PAGE,
  title: "身份认证",
  canSave: false,
  children: [FormAuth, GoogleAuth, GithubAuth],
  component: AuthMain,
};
