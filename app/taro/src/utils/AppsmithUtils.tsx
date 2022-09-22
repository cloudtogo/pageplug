import {
  ApplicationPayload,
  Page,
  ReduxAction,
} from "@appsmith/constants/ReduxActionConstants";
import { getAppsmithConfigs } from "@appsmith/configs";
import { Property } from "api/ActionAPI";
import _ from "lodash";
import * as log from "loglevel";
import produce from "immer";
import { ERROR_CODES } from "@appsmith/constants/ApiConstants";
import { createMessage, ERROR_500 } from "@appsmith/constants/messages";
import { APP_MODE } from "entities/App";
import { trimQueryString } from "./helpers";
import { PLACEHOLDER_APP_SLUG, PLACEHOLDER_PAGE_SLUG } from "constants/routes";
import { viewerURL } from "RouteBuilder";

export const createReducer = (
  initialState: any,
  handlers: { [type: string]: (state: any, action: any) => any }
) => {
  return function reducer(state = initialState, action: ReduxAction<any>) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
};

export const createImmerReducer = (
  initialState: any,
  handlers: { [type: string]: any }
) => {
  return function reducer(state = initialState, action: ReduxAction<any>) {
    if (handlers.hasOwnProperty(action.type)) {
      return produce(handlers[action.type])(state, action);
    } else {
      return state;
    }
  };
};

export const transformDynamicSize = (n: number = 0) => `${(n * 750) / 450}rpx`;
export const transformRemSize = (n: number = 0) => transformDynamicSize(n * 16);

export const appInitializer = () => {
  const appsmithConfigs = getAppsmithConfigs();
  log.setLevel(appsmithConfigs.logLevel);
};

export const initializeAnalyticsAndTrackers = () => {};

export const mapToPropList = (map: Record<string, string>): Property[] => {
  return _.map(map, (value, key) => {
    return { key: key, value: value };
  });
};

export const getDuplicateName = (prefix: string, existingNames: string[]) => {
  const trimmedPrefix = prefix.replace(/ /g, "");
  const regex = new RegExp(`^${trimmedPrefix}(\\d+)$`);
  const usedIndices: number[] = existingNames.map((name) => {
    if (name && regex.test(name)) {
      const matches = name.match(regex);
      const ind =
        matches && Array.isArray(matches) ? parseInt(matches[1], 10) : 0;
      return Number.isNaN(ind) ? 0 : ind;
    }
    return 0;
  }) as number[];

  const lastIndex = Math.max(...usedIndices, ...[0]);

  return trimmedPrefix + `_${lastIndex + 1}`;
};

export const noop = () => {
  log.debug("noop");
};

export const stopEventPropagation = (e: any) => {
  e.stopPropagation();
};

export const convertToString = (value: any): string => {
  if (_.isUndefined(value)) {
    return "";
  }
  if (_.isObject(value)) {
    return JSON.stringify(value, null, 2);
  }
  if (_.isString(value)) return value;
  return value.toString();
};

export function getQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const keys = urlParams.keys();
  let key = keys.next().value;
  const queryParams: Record<string, string> = {};
  while (key) {
    queryParams[key] = urlParams.get(key) as string;
    key = keys.next().value;
  }
  return queryParams;
}

export function convertObjectToQueryParams(object: any): string {
  if (!_.isNil(object)) {
    const paramArray: string[] = _.map(_.keys(object), (key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(object[key]);
    });
    return "?" + _.join(paramArray, "&");
  } else {
    return "";
  }
}

export const retryPromise = (
  fn: () => Promise<any>,
  retriesLeft = 5,
  interval = 1000
): Promise<any> => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch(() => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            return Promise.reject({
              code: ERROR_CODES.SERVER_ERROR,
              message: createMessage(ERROR_500),
              show: false,
            });
          }

          // Passing on "reject" is the important part
          retryPromise(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
};

export const getRandomPaletteColor = (colorPalette: string[]) => {
  return colorPalette[Math.floor(Math.random() * colorPalette.length)];
};

/**
 * Convert a string into camelCase
 * @param sourceString input string
 * @returns camelCase string
 */
export const getCamelCaseString = (sourceString: string) => {
  let out = "";
  // Split the input string to separate words using RegEx
  const regEx =
    /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
  const words = sourceString.match(regEx);
  if (words) {
    words.forEach(function (el, idx) {
      const add = el.toLowerCase();
      out += idx === 0 ? add : add[0].toUpperCase() + add.slice(1);
    });
  }

  return out;
};

/*
 * gets the page url
 *
 * Note: for edit mode, the page will have different url ( contains '/edit' at the end )
 *
 * @param page
 * @returns
 */
export const getPageURL = (
  page: Page,
  appMode: APP_MODE | undefined,
  currentApplicationDetails: ApplicationPayload | undefined
) => {
  return trimQueryString(
    viewerURL({
      applicationSlug: currentApplicationDetails?.slug || PLACEHOLDER_APP_SLUG,
      pageSlug: page.slug || PLACEHOLDER_PAGE_SLUG,
      pageId: page.pageId,
    })
  );
};

export const replacePluginIcon = (url: string) => {
  return url
    ?.replace("https://s3.us-east-2.amazonaws.com/assets.appsmith.com", "")
    ?.replace("https://assets.appsmith.com", "")
    ?.replace(/\.png$/g, ".svg");
};
