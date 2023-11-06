export type ENVIRONMENT = "PRODUCTION" | "STAGING" | "LOCAL";

export const DOCS_BASE_URL = "https://docs.appsmith.com/";
export const TELEMETRY_URL = `${DOCS_BASE_URL}telemetry`;
export const ASSETS_CDN_URL = "https://assets.appsmith.com";
export const GITHUB_RELEASE_URL =
  "https://github.com/appsmithorg/appsmith/releases/tag";
export const GET_RELEASE_NOTES_URL = (tagName: string) =>
  `${GITHUB_RELEASE_URL}/${tagName}`;
export const GOOGLE_MAPS_SETUP_DOC = "https://docs.pageplug.cn";
export const BAIDU_MAPS_SETUP_DOC =
  "https://lbsyun.baidu.com/index.php?title=jspopularGL/guide/getkey";
export const GOOGLE_SIGNUP_SETUP_DOC =
  "https://docs.appsmith.com/getting-started/setup/instance-configuration/authentication/google-login";
export const GITHUB_SIGNUP_SETUP_DOC =
  "https://docs.appsmith.com/getting-started/setup/instance-configuration/authentication/github-login";
export const OIDC_SIGNUP_SETUP_DOC =
  "https://docs.appsmith.com/getting-started/setup/instance-configuration/authentication/openid-connect-oidc";
export const SAML_SIGNUP_SETUP_DOC =
  "https://docs.appsmith.com/getting-started/setup/instance-configuration/authentication/security-assertion-markup-language-saml";
export const EMAIL_SETUP_DOC =
  "https://docs.pageplug.cn/%E5%AD%A6%E4%B9%A0%E6%96%87%E6%A1%A3/%E9%85%8D%E7%BD%AE%E9%82%AE%E7%AE%B1%E6%9C%8D%E5%8A%A1";
export const SIGNUP_RESTRICTION_DOC = "https://docs.pageplug.cn";
export const EMBED_PRIVATE_APPS_DOC =
  "https://docs.appsmith.com/advanced-concepts/embed-appsmith-into-existing-application#embedding-private-apps";
export const WX_SIGNUP_SETUP_DOC =
  "https://docs.pageplug.cn/%E5%AD%A6%E4%B9%A0%E6%96%87%E6%A1%A3/%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81/%E5%BE%AE%E4%BF%A1%E5%8D%95%E7%82%B9%E7%99%BB%E5%BD%95";
export const PROVISIONING_SETUP_DOC = "https://docs.pageplug.cn";
export const PRICING_PAGE_URL = (
  URL: string,
  source: string,
  instanceId: string,
) => `${URL}?source=${source}${instanceId ? `&instance=${instanceId}` : ``}`;
