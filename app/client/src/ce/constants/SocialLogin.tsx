import {
  GoogleOAuthURL,
  GithubOAuthURL,
  OidcOAuthURL,
  WechatOAuthURL,
  BussinessWechatOAuthURL,
} from "./ApiConstants";

import GithubLogo from "assets/images/Github.svg";
import GoogleLogo from "assets/images/Google.png";
import SSOLogo from "assets/images/sso-key.png";
import Wechat from "assets/images/WeChat.svg";
import BusinessWeChat from "assets/images/BusinessWeChat.svg";
export interface SocialLoginButtonProps {
  url?: string;
  name: string;
  logo?: string;
  label?: string;
}

export const GoogleSocialLoginButtonProps: SocialLoginButtonProps = {
  url: GoogleOAuthURL,
  name: "Google",
  logo: GoogleLogo,
};

export const GithubSocialLoginButtonProps: SocialLoginButtonProps = {
  url: GithubOAuthURL,
  name: "Github",
  logo: GithubLogo,
};

export const OidcLoginButtonProps: SocialLoginButtonProps = {
  url: OidcOAuthURL,
  name: "OIDC SSO",
  logo: SSOLogo,
};
export const WechatSocialLoginButtonProps: SocialLoginButtonProps = {
  url: WechatOAuthURL,
  name: "wechat",
  logo: Wechat,
};

export const BussinessWechatSocialLoginButtonProps: SocialLoginButtonProps = {
  url: BussinessWechatOAuthURL,
  name: "wecom",
  logo: BusinessWeChat,
};

export const SocialLoginButtonPropsList: Record<
  string,
  SocialLoginButtonProps
> = {
  google: GoogleSocialLoginButtonProps,
  github: GithubSocialLoginButtonProps,
  oidc: OidcLoginButtonProps,
  wechat: WechatSocialLoginButtonProps,
  wecom: BussinessWechatSocialLoginButtonProps,
};

export type SocialLoginType = keyof typeof SocialLoginButtonPropsList;
