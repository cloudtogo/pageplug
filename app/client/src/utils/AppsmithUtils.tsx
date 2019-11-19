import { ReduxAction } from "../constants/ReduxActionConstants";
import {
  SENTRY_PROD_CONFIG,
  SENTRY_STAGE_CONFIG,
  HOTJAR_PROD_HJID,
  HOTJAR_PROD_HJSV,
} from "../constants/ThirdPartyConstants";
import * as Sentry from "@sentry/browser";
import AnalyticsUtil from "./AnalyticsUtil";
import netlifyIdentity from "netlify-identity-widget";
import FontFaceObserver from "fontfaceobserver";
import PropertyControlRegistry from "./PropertyControlRegistry";
import WidgetBuilderRegistry from "./WidgetRegistry";
import { Property } from "../api/ActionAPI";
import { FlattenedWidgetProps } from "../reducers/entityReducers/canvasWidgetsReducer";
import _ from "lodash";
import moment from "moment-timezone";
import ValidationRegistry from "./ValidationRegistry";

export const createReducer = (
  initialState: any,
  handlers: { [type: string]: Function },
) => {
  return function reducer(state = initialState, action: ReduxAction<any>) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
};

export const appInitializer = () => {
  WidgetBuilderRegistry.registerWidgetBuilders();
  PropertyControlRegistry.registerPropertyControlBuilders();
  ValidationRegistry.registerInternalValidators();
  netlifyIdentity.init();
  moment.tz.setDefault(moment.tz.guess());
  switch (process.env.REACT_APP_ENVIRONMENT) {
    case "PRODUCTION":
      Sentry.init(SENTRY_PROD_CONFIG);
      AnalyticsUtil.initializeHotjar(HOTJAR_PROD_HJID, HOTJAR_PROD_HJSV);
      AnalyticsUtil.initializeSegment();
      break;
    case "STAGING":
      Sentry.init(SENTRY_STAGE_CONFIG);
      break;
    case "LOCAL":
      break;
  }

  const textFont = new FontFaceObserver("DM Sans");
  textFont
    .load()
    .then(() => {
      document.body.className += "fontLoaded";
    })
    .catch(err => {
      console.log(err);
    });
};

export const mapToPropList = (map: Record<string, string>): Property[] => {
  return _.map(map, (value, key) => {
    return { key: key, value: value };
  });
};

export const getNextWidgetName = (
  prefix: string,
  widgets: {
    [id: string]: FlattenedWidgetProps;
  },
) => {
  const regex = new RegExp(`^${prefix}(\\d+)$`);
  const usedIndices: number[] = Object.values(widgets).map(widget => {
    if (widget && widget.widgetName && regex.test(widget.widgetName)) {
      const name = widget.widgetName || "";
      const matches = name.match(regex);
      const ind =
        matches && Array.isArray(matches) ? parseInt(matches[1], 10) : 0;
      return Number.isNaN(ind) ? 0 : ind;
    }
    return 0;
  }) as number[];

  const lastIndex = Math.max(...usedIndices);

  return prefix + (lastIndex + 1);
};

export const noop = () => {};
