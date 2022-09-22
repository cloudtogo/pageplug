import {
  ADMIN_SETTINGS_PATH,
  BUILDER_PATH,
  BUILDER_PATH_DEPRECATED,
  PLACEHOLDER_APP_SLUG,
  PLACEHOLDER_PAGE_SLUG,
  TEMPLATES_PATH,
  VIEWER_PATH,
  VIEWER_PATH_DEPRECATED,
} from "constants/routes";
import { APP_MODE } from "entities/App";
import getQueryParamsObject from "utils/getQueryParamsObject";
// import { matchPath } from "react-router";
import { ApplicationVersion } from "actions/applicationActions";
import {
  ApplicationPayload,
  Page,
} from "@appsmith/constants/ReduxActionConstants";

const matchPath: any = (a?: any, b?: any) => null;

export function convertToQueryParams(
  params: Record<string, string> = {},
): string {
  const paramKeys = Object.keys(params);
  const queryParams: string[] = [];
  if (paramKeys) {
    paramKeys.forEach((paramKey: string) => {
      const value = params[paramKey];
      if (paramKey && value) {
        queryParams.push(`${paramKey}=${value}`);
      }
    });
  }
  return queryParams.length ? "?" + queryParams.join("&") : "";
}

const fetchParamsToPersist = () => {
  const existingParams = getQueryParamsObject() || {};
  // not persisting the entire query currently, since that's the current behaviour
  const { branch, embed } = existingParams;
  let params = { branch, embed } as any;
  // test param to make sure a query param is present in the URL during dev and tests
  if ((window as any).Cypress) {
    params = { a: "b", ...params };
  }
  return params;
};

export const fillPathname = (
  pathname: string,
  application: ApplicationPayload,
  page: Page,
) => {
  return pathname
    .replace(`/applications/${application.id}`, `/app/${application.slug}`)
    .replace(`/pages/${page.pageId}`, `/${page.slug}-${page.pageId}`);
};

type Optional<T extends { [k in keyof T]: T[k] }> = {
  [K in keyof T]+?: T[K];
};

type BaseURLBuilderParams = {
  applicationId: string;
  applicationSlug: string;
  pageId: string;
  pageSlug: string;
  applicationVersion?: ApplicationVersion;
};

type URLBuilderParams = BaseURLBuilderParams & {
  suffix: string;
  branch: string;
  hash: string;
  params: Record<string, any>;
};

export const DEFAULT_BASE_URL_BUILDER_PARAMS: BaseURLBuilderParams = {
  applicationId: "",
  applicationSlug: "",
  pageId: "",
  pageSlug: "",
};

/**
 * This variable is private to this module and should not be exported.
 * This variable holds the information essential for url building, (current applicationId, pageId, pageSlug and applicationSlug ),
 * updateURLFactory method is used to update this variable in a middleware. Refer /store.ts.
 * */
let BASE_URL_BUILDER_PARAMS = DEFAULT_BASE_URL_BUILDER_PARAMS;

export function updateURLFactory(params: Optional<BaseURLBuilderParams>) {
  BASE_URL_BUILDER_PARAMS = { ...BASE_URL_BUILDER_PARAMS, ...params };
}

export const getRouteBuilderParams = () => BASE_URL_BUILDER_PARAMS;

/**
 * Do not export this method directly. Please write wrappers for your URLs.
 * Uses applicationVersion attribute to determine whether to use slug URLs or legacy URLs.
 */
function baseURLBuilder(
  {
    applicationId,
    applicationSlug,
    applicationVersion,
    pageId,
    pageSlug,
    ...rest
  }: Optional<URLBuilderParams>,
  mode: APP_MODE = APP_MODE.EDIT,
): string {
  const { hash = "", params = {}, suffix } = { ...rest };
  applicationVersion =
    applicationVersion || BASE_URL_BUILDER_PARAMS.applicationVersion;
  const shouldUseLegacyURLs =
    typeof applicationVersion !== "undefined" &&
    applicationVersion < ApplicationVersion.SLUG_URL;

  let basePath = "";
  pageId = pageId || BASE_URL_BUILDER_PARAMS.pageId;

  // fallback incase pageId is not set
  if (!pageId) {
    const match = matchPath<{ pageId: string }>(window.location.pathname, {
      path: [
        BUILDER_PATH,
        BUILDER_PATH_DEPRECATED,
        VIEWER_PATH,
        VIEWER_PATH_DEPRECATED,
      ],
      strict: false,
      exact: false,
    });
    pageId = match?.params.pageId;
  }
  // fallback incase pageId is not set

  if (shouldUseLegacyURLs) {
    applicationId = applicationId || BASE_URL_BUILDER_PARAMS.applicationId;
    basePath = `/applications/${applicationId}/pages/${pageId}`;
  } else {
    applicationSlug =
      applicationSlug ||
      BASE_URL_BUILDER_PARAMS.applicationSlug ||
      PLACEHOLDER_APP_SLUG;
    pageSlug =
      pageSlug || BASE_URL_BUILDER_PARAMS.pageSlug || PLACEHOLDER_PAGE_SLUG;
    basePath = `/app/${applicationSlug}/${pageSlug}-${pageId}`;
  }
  basePath += mode === APP_MODE.EDIT ? "/edit" : "";

  const paramsToPersist = fetchParamsToPersist();
  const modifiedParams = { ...paramsToPersist, ...params };
  const queryString = convertToQueryParams(modifiedParams);
  const suffixPath = suffix ? `/${suffix}` : "";
  const hashPath = hash ? `#${hash}` : "";

  // hash fragment should be at the end of the href
  // ref: https://www.rfc-editor.org/rfc/rfc3986#section-4.1
  return `${basePath}${suffixPath}${queryString}${hashPath}`;
}

export const builderURL = (props?: Optional<URLBuilderParams>): string => {
  return baseURLBuilder({ ...props });
};

export const viewerURL = (props?: Optional<URLBuilderParams>): string => {
  return baseURLBuilder({ ...props }, APP_MODE.PUBLISHED);
};

export function adminSettingsCategoryUrl({
  category,
  selected,
}: {
  category: string;
  selected?: string;
}) {
  return `${ADMIN_SETTINGS_PATH}/${category}${selected ? "/" + selected : ""}`;
}

export const templateIdUrl = ({ id }: { id: string }): string =>
  `${TEMPLATES_PATH}/${id}`;
