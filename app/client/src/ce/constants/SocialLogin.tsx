import { GoogleOAuthURL, GithubOAuthURL } from "./ApiConstants";

import GithubLogo from "assets/images/Github.png";
import GoogleLogo from "assets/images/Google.png";
export type SocialLoginButtonProps = {
  url?: string;
  name: string;
  logo?: string;
  label?: string;
};

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

export const WxchatSocialLoginButtonProps = {
  name: "Wechat",
};

export const SocialLoginButtonPropsList: Record<
  string,
  SocialLoginButtonProps
> = {
  google: GoogleSocialLoginButtonProps,
  github: GithubSocialLoginButtonProps,
  wechat: WxchatSocialLoginButtonProps,
};

export type SocialLoginType = keyof typeof SocialLoginButtonPropsList;
