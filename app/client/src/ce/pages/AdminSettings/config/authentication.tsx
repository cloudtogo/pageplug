/* eslint-disable @typescript-eslint/no-restricted-imports */
import React from "react";
import {
  DOCS_BASE_URL,
  EMAIL_SETUP_DOC,
  GOOGLE_SIGNUP_SETUP_DOC,
  WX_SIGNUP_SETUP_DOC,
} from "constants/ThirdPartyConstants";
import type { AdminConfigType } from "@appsmith/pages/AdminSettings/config/types";
import {
  CategoryType,
  SettingCategories,
  SettingSubCategories,
  SettingSubtype,
  SettingTypes,
} from "@appsmith/pages/AdminSettings/config/types";
import type { AuthMethodType } from "pages/AdminSettings/Authentication/AuthPage";
import { AuthPage } from "pages/AdminSettings/Authentication/AuthPage";
import Google from "assets/images/Google.png";
import SamlSso from "assets/images/saml.svg";
import OIDC from "assets/images/oidc.svg";
import Github from "assets/images/Github.svg";
import Lock from "assets/images/lock-password-line.svg";
import WeChat from "assets/images/WeChat.svg";
import BusinessWeChat from "assets/images/BusinessWeChat.svg";
import Dingding from "assets/images/Dingding.svg";

import { useSelector } from "react-redux";
import {
  getThirdPartyAuths,
  getIsFormLoginEnabled,
} from "@appsmith/selectors/tenantSelectors";
import {
  FORM_LOGIN_DESC,
  GITHUB_AUTH_DESC,
  GOOGLE_AUTH_DESC,
  OIDC_AUTH_DESC,
  SAML_AUTH_DESC,
  createMessage,
  BUSINESS_WECHAT_AUTH_DESC,
  WECHAT_AUTH_DESC,
  DINGDING_AUTH_DESC,
} from "@appsmith/constants/messages";
import { isSAMLEnabled } from "@appsmith/utils/planHelpers";
import { selectFeatureFlags } from "@appsmith/selectors/featureFlagsSelectors";
import store from "store";
import { getWXLoginClientId } from "@appsmith/selectors/settingSelectors";
import { BUSSINESS_WX_SINGUP_DOC } from "constants/ThirdPartyConstants";

const { enableWeChatOAuth } = getAppsmithConfigs();
const featureFlags = selectFeatureFlags(store.getState());
import { getAppsmithConfigs } from "@appsmith/configs";
const { mailEnabled } = getAppsmithConfigs();

const FormAuth: AdminConfigType = {
  type: SettingCategories.FORM_AUTH,
  categoryType: CategoryType.GENERAL,
  controlType: SettingTypes.GROUP,
  title: "账号密码登录",
  subText: createMessage(FORM_LOGIN_DESC),
  canSave: true,
  isConnected: false,
  settings: [
    {
      id: "APPSMITH_FORM_LOGIN_DISABLED",
      category: SettingCategories.FORM_AUTH,
      controlType: SettingTypes.TOGGLE,
      label: "登录",
      toggleText: (value: boolean) => (value ? "关闭" : "开启"),
    },
    {
      id: "APPSMITH_SIGNUP_DISABLED",
      category: SettingCategories.FORM_AUTH,
      controlType: SettingTypes.TOGGLE,
      label: "注册",
      toggleText: (value: boolean) =>
        value ? "只允许邀请用户注册" : "允许任何用户注册",
    },
    // {
    //   id: "emailVerificationEnabled",
    //   category: SettingCategories.FORM_AUTH,
    //   controlType: SettingTypes.TOGGLE,
    //   label: "email verification",
    //   isDisabled: (settings) => {
    //     // Disabled when mail is not enabled, unless setting already enabled then enabled
    //     if (!settings) {
    //       return true;
    //     }
    //     if (settings.emailVerificationEnabled) {
    //       return false;
    //     }
    //     return !mailEnabled;
    //   },
    // },
    {
      id: "APPSMITH_FORM_DISABLED_BANNER",
      category: SettingCategories.FORM_AUTH,
      controlType: SettingTypes.LINK,
      label: "账号密码登录不会校验邮箱是否有效",
      url: EMAIL_SETUP_DOC,
      calloutType: "warning",
      isVisible: (settings) => {
        // Visible when mail is disabled, unless setting already enabled then visible
        if (!settings) {
          return false;
        }
        if (settings.emailVerificationEnabled) {
          return false;
        }
        return !mailEnabled;
      },
    },
    {
      id: "APPSMITH_FORM_CALLOUT_BANNER",
      category: SettingCategories.FORM_AUTH,
      controlType: SettingTypes.CALLOUT,
      label:
        "Please ensure that your SMTP settings are correctly configured to ensure that the verification emails can be delivered",
      calloutType: "warning",
      isVisible: (settings) => {
        // Visible when mail is enabled and setting is true
        if (!settings) {
          return false;
        }
        return settings.emailVerificationEnabled && mailEnabled;
      },
    },
    {
      id: "APPSMITH_FORM_ERROR_BANNER",
      category: SettingCategories.FORM_AUTH,
      controlType: SettingTypes.LINK,
      label:
        "Valid SMTP settings not found. Signup with email verification will not work without SMTP configuration",
      calloutType: "error",
      isVisible: (settings) => {
        // Visible when mail is disabled but settings is true
        if (!settings) {
          return false;
        }
        if (!mailEnabled && settings.emailVerificationEnabled) {
          return true;
        }
        return false;
      },
    },
  ],
};

const GoogleAuth: AdminConfigType = {
  type: SettingCategories.GOOGLE_AUTH,
  categoryType: CategoryType.GENERAL,
  controlType: SettingTypes.GROUP,
  title: "Google 登录",
  subText: createMessage(GOOGLE_AUTH_DESC),
  canSave: true,
  settings: [
    {
      id: "APPSMITH_OAUTH2_GOOGLE_READ_MORE",
      category: SettingCategories.GOOGLE_AUTH,
      controlType: SettingTypes.CALLOUT,
      label: "如何配置？",
      url: GOOGLE_SIGNUP_SETUP_DOC,
    },
    {
      id: "APPSMITH_OAUTH2_GOOGLE_JS_ORIGIN_URL",
      category: SettingCategories.GOOGLE_AUTH,
      controlType: SettingTypes.UNEDITABLEFIELD,
      label: "JavaScript origin URL",
      fieldName: "js-origin-url-form",
      value: "",
      tooltip: "这个URL将在配置Google OAuth Client ID的授权JavaScript源时使用",
      helpText: "请将这个URL粘贴到您的Google开发者控制台中。",
    },
    {
      id: "APPSMITH_OAUTH2_GOOGLE_REDIRECT_URL",
      category: SettingCategories.GOOGLE_AUTH,
      controlType: SettingTypes.UNEDITABLEFIELD,
      label: "Redirect URL",
      fieldName: "redirect-url-form",
      value: "/login/oauth2/code/google",
      tooltip: "这个URL将在配置Google OAuth Client ID的授权重定向URI时使用。",
      helpText: "请将这个URL粘贴到您的Google开发者控制台中。",
    },
    {
      id: "APPSMITH_OAUTH2_GOOGLE_CLIENT_ID",
      category: SettingCategories.GOOGLE_AUTH,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "Client ID",
      isRequired: true,
    },
    {
      id: "APPSMITH_OAUTH2_GOOGLE_CLIENT_SECRET",
      category: SettingCategories.GOOGLE_AUTH,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "Client secret",
      isRequired: true,
    },
    {
      id: "APPSMITH_SIGNUP_ALLOWED_DOMAINS",
      category: SettingCategories.GOOGLE_AUTH,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "允许域名",
      placeholder: "domain1.com, domain2.com",
    },
  ],
};

const GithubAuth: AdminConfigType = {
  type: SettingCategories.GITHUB_AUTH,
  categoryType: CategoryType.GENERAL,
  controlType: SettingTypes.GROUP,
  title: "Github 登录",
  subText: createMessage(GITHUB_AUTH_DESC),
  canSave: true,
  settings: [
    {
      id: "APPSMITH_OAUTH2_GITHUB_READ_MORE",
      category: SettingCategories.GITHUB_AUTH,
      controlType: SettingTypes.CALLOUT,
      label: "如何配置？",
      url: DOCS_BASE_URL,
    },
    {
      id: "APPSMITH_OAUTH2_GITHUB_HOMEPAGE_URL",
      category: SettingCategories.GITHUB_AUTH,
      controlType: SettingTypes.UNEDITABLEFIELD,
      label: "Homepage URL",
      fieldName: "homepage-url-form",
      value: "",
      tooltip: "这个URL将用于配置GitHub OAuth Client ID的主页URL。",
      helpText: "请将这个URL粘贴到您的GitHub开发者设置中。",
    },
    {
      id: "APPSMITH_OAUTH2_GITHUB_REDIRECT_URL",
      category: SettingCategories.GITHUB_AUTH,
      controlType: SettingTypes.UNEDITABLEFIELD,
      label: "Redirect URL",
      fieldName: "callback-url-form",
      value: "/login/oauth2/code/github",
      tooltip: "这个URL将用于配置GitHub OAuth Client ID的授权回调URL。",
      helpText: "请将这个URL粘贴到您的GitHub开发者设置中。",
    },
    {
      id: "APPSMITH_OAUTH2_GITHUB_CLIENT_ID",
      category: SettingCategories.GITHUB_AUTH,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "Client ID",
      isRequired: true,
    },
    {
      id: "APPSMITH_OAUTH2_GITHUB_CLIENT_SECRET",
      category: SettingCategories.GITHUB_AUTH,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "Client secret",
      isRequired: true,
    },
  ],
};

const OIDCAuth: AdminConfigType = {
  type: SettingCategories.OIDC_AUTH,
  controlType: SettingTypes.GROUP,
  title: "OIDC登录",
  subText: "让你可以用OIDC账号进行登录",
  canSave: true,
  isConnected: false,
  categoryType: CategoryType.OTHER,
  settings: [],
};

const WeChatAuth: AdminConfigType = {
  type: SettingCategories.WECHAT_AUTH,
  controlType: SettingTypes.GROUP,
  title: "微信登录",
  subText: "让你可以使用微信账号进行登录",
  canSave: true,
  isConnected: enableWeChatOAuth,
  categoryType: CategoryType.OTHER,
  settings: [
    {
      id: "APPSMITH_OAUTH2_WECHAT_READ_MORE",
      category: SettingCategories.WECHAT_AUTH,
      subCategory: SettingSubCategories.WECHAT,
      controlType: SettingTypes.CALLOUT,
      label: "如何配置？",
      url: WX_SIGNUP_SETUP_DOC,
    },
    {
      id: "APPSMITH_WX_CLIENT_REDIRECT_URL",
      category: SettingCategories.WECHAT_AUTH,
      subCategory: SettingSubCategories.WECHAT,
      controlType: SettingTypes.UNEDITABLEFIELD,
      label: "Redirect URL",
      fieldName: "oidc-redirect-url",
      formName: "OidcRedirectUrl",
      value: "/api/v1/wxLogin/callback",
      helpText: "拷贝到你的认证服务器配置中",
      forceHidden: true,
    },
    {
      id: "APPSMITH_WX_CLIENT_ID",
      category: SettingCategories.WECHAT_AUTH,
      subCategory: SettingSubCategories.WECHAT,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "Client ID",
      isRequired: true,
    },
    {
      id: "APPSMITH_WX_CLIENT_SECRET",
      category: SettingCategories.WECHAT_AUTH,
      subCategory: SettingSubCategories.WECHAT,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "Client Secret",
      isRequired: true,
    },
  ],
};

const BussinessWeChatAuth: AdminConfigType = {
  type: SettingCategories.BUSINESS_WECHAT_AUTH,
  controlType: SettingTypes.GROUP,
  title: "企业微信登录",
  subText: "让你可以使用企业微信账号进行登录",
  canSave: true,
  isConnected: false,
  categoryType: CategoryType.OTHER,
  settings: [
    {
      id: "APPSMITH_OAUTH2_OIDC_READ_MORE",
      category: SettingCategories.BUSINESS_WECHAT_AUTH,
      subCategory: SettingSubCategories.BUSSINESS_WECHAT,
      controlType: SettingTypes.LINK,
      label: "如何配置？",
      url: BUSSINESS_WX_SINGUP_DOC,
    },
    {
      id: "APPSMITH_WECOM_REDIRET_URI",
      category: SettingCategories.BUSINESS_WECHAT_AUTH,
      subCategory: SettingSubCategories.BUSSINESS_WECHAT,
      controlType: SettingTypes.UNEDITABLEFIELD,
      label: "Redirect URL",
      fieldName: "oidc-redirect-url",
      formName: "OidcRedirectUrl",
      value: "/api/v1/wecomLogin/callback",
      helpText: "拷贝到你的认证服务器配置中",
      forceHidden: true,
    },
    {
      id: "APPSMITH_WECOM_CORP_ID",
      category: SettingCategories.BUSINESS_WECHAT_AUTH,
      subCategory: SettingSubCategories.BUSSINESS_WECHAT,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "CORP ID",
      isRequired: true,
    },
    {
      id: "APPSMITH_WECOM_AGENT_ID",
      category: SettingCategories.BUSINESS_WECHAT_AUTH,
      subCategory: SettingSubCategories.BUSSINESS_WECHAT,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "AGENT ID",
      isRequired: true,
    },
    {
      id: "APPSMITH_WECOM_SECRET",
      category: SettingCategories.BUSINESS_WECHAT_AUTH,
      subCategory: SettingSubCategories.BUSSINESS_WECHAT,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "Secret",
      isRequired: true,
    },
  ],
};

const DingdingAuth: AdminConfigType = {
  type: SettingCategories.WECHAT_AUTH,
  controlType: SettingTypes.GROUP,
  title: "钉钉登录",
  subText: "让你可以用钉钉账号进行登录",
  canSave: true,
  isConnected: false,
  categoryType: CategoryType.OTHER,
  settings: [],
};

export const FormAuthCallout: AuthMethodType = {
  id: "APPSMITH_FORM_LOGIN_AUTH",
  category: SettingCategories.FORM_AUTH,
  label: "账号密码登录",
  subText: createMessage(FORM_LOGIN_DESC),
  image: Lock,
  icon: "lock-password-line",
  isFeatureEnabled: true,
};

export const GoogleAuthCallout: AuthMethodType = {
  id: "APPSMITH_GOOGLE_AUTH",
  category: SettingCategories.GOOGLE_AUTH,
  label: "Google",
  subText: createMessage(GOOGLE_AUTH_DESC),
  image: Google,
  isFeatureEnabled: true,
};

export const GithubAuthCallout: AuthMethodType = {
  id: "APPSMITH_GITHUB_AUTH",
  category: SettingCategories.GITHUB_AUTH,
  label: "Github",
  subText: createMessage(GITHUB_AUTH_DESC),
  image: Github,
  isFeatureEnabled: true,
};

export const SamlAuthCallout: AuthMethodType = {
  id: "APPSMITH_SAML_AUTH",
  category: SettingCategories.SAML_AUTH,
  label: "SAML 2.0",
  subText: createMessage(SAML_AUTH_DESC),
  image: SamlSso,
  isFeatureEnabled: isSAMLEnabled(featureFlags),
};

export const OidcAuthCallout: AuthMethodType = {
  id: "APPSMITH_OIDC_AUTH",
  category: SettingCategories.OIDC_AUTH,
  label: "OIDC",
  subText: createMessage(OIDC_AUTH_DESC),
  image: OIDC,
  isFeatureEnabled: false,
};

const WeChatCallout: AuthMethodType = {
  id: "APPSMITH_WECHAT_AUTH",
  category: SettingCategories.WECHAT_AUTH,
  label: "微信",
  subText: createMessage(WECHAT_AUTH_DESC),
  image: WeChat,
  isConnected: enableWeChatOAuth,
  isFeatureEnabled: true,
};

const BusinessWeChatCallout: AuthMethodType = {
  id: "APPSMITH_BUSINESS_WECHAT_AUTH",
  category: SettingCategories.BUSINESS_WECHAT_AUTH,
  label: "企业微信",
  subText: createMessage(BUSINESS_WECHAT_AUTH_DESC),
  image: BusinessWeChat,
  isConnected: false,
  isFeatureEnabled: false,
};

const DingdingCallout: AuthMethodType = {
  id: "APPSMITH_DINGDING_AUTH",
  category: SettingCategories.DINGDING_AUTH,
  label: "钉钉",
  subText: createMessage(DINGDING_AUTH_DESC),
  image: Dingding,
  isConnected: false,
  isFeatureEnabled: false,
};

const AuthMethods = [
  OidcAuthCallout,
  GoogleAuthCallout,
  GithubAuthCallout,
  FormAuthCallout,
  WeChatCallout,
  BusinessWeChatCallout,
  DingdingCallout,
];

function AuthMain() {
  const WXLoginClientId = useSelector(getWXLoginClientId);
  FormAuthCallout.isConnected = useSelector(getIsFormLoginEnabled);
  const socialLoginList = useSelector(getThirdPartyAuths);
  WeChatAuth.isConnected = WeChatCallout.isConnected =
    socialLoginList.includes("wechat") || !!WXLoginClientId;
  GoogleAuth.isConnected = GoogleAuthCallout.isConnected =
    socialLoginList.includes("google");
  GithubAuth.isConnected = GithubAuthCallout.isConnected =
    socialLoginList.includes("github");
  return <AuthPage authMethods={AuthMethods} />;
}

export const config: AdminConfigType = {
  icon: "lock-password-line",
  type: SettingCategories.AUTHENTICATION,
  categoryType: CategoryType.GENERAL,
  controlType: SettingTypes.PAGE,
  title: "身份认证",
  canSave: false,
  children: [
    FormAuth,
    GoogleAuth,
    GithubAuth,
    OIDCAuth,
    WeChatAuth,
    BussinessWeChatAuth,
    DingdingAuth,
  ],
  component: AuthMain,
};
