import type { MenuItemProps } from "design-system-old";
import _ from "lodash";
import Api from "api/Api";

export const addItemsInContextMenu = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  args: boolean[],
  history: any,
  workspaceId: string,
  moreActionItems: MenuItemProps[],
) => {
  return moreActionItems;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getHtmlPageTitle = (instanceName: string) => {
  return "Pageplug";
};

export const isCEMode = () => {
  return true;
};

export const getPageTitle = (
  displayName?: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  titleSuffix?: string,
) => {
  return `${displayName ? `${displayName} | ` : ""}Appsmith`;
};

// TODO: Remove this function once we have a better way to handle this
// get only the part of the url after the domain name
export const to = (url: string) => {
  const path = _.drop(
    url
      .toString()
      .replace(/([a-z])?:\/\//, "$1")
      .split("/"),
  ).join("/");
  return `/${path}`;
};

export const defaultOptionSelected = "";

export function getSnippetUrl(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isPublicApp: boolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  method: string,
) {
  return url;
}
export const ThirdPartyLogin = (requestUrl: any): void => {
  Api.get(requestUrl).then(({ data }) => {
    const url = data.redirectUrl;
    const newWindow: any = window.open(url, "_self");
    newWindow.focus();
  });
};
