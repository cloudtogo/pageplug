import React from "react";
import BaseWidget from "widgets/BaseWidget";
import WidgetFactory from "./WidgetFactory";
import withMeta from "widgets/MetaHOC";
import { generateReactKey } from "./generators";
import { memoize } from "lodash";
import { WidgetFeatureProps } from "./WidgetFeatures";
import { WidgetConfiguration } from "widgets/constants";

const generateWidget = memoize(function getWidgetComponent(
  Widget: typeof BaseWidget,
  needsMeta: boolean
) {
  return needsMeta ? withMeta(Widget) : Widget;
});

export const registerWidget = (Widget: any, config: WidgetConfiguration) => {
  const ProfiledWidget = generateWidget(Widget, !!config.needsMeta);

  WidgetFactory.registerWidgetBuilder(
    config.type,
    {
      buildWidget(widgetData: any): JSX.Element {
        return <ProfiledWidget {...widgetData} key={widgetData.widgetId} />;
      },
    },
    config.properties.derived,
    config.properties.default,
    config.properties.meta,
    config.properties.config,
    config.features
  );
  configureWidget(config);
};

export const configureWidget = (config: WidgetConfiguration) => {
  let features = {};
  if (config.features && config.features.dynamicHeight) {
    features = Object.assign({}, WidgetFeatureProps.DYNAMIC_HEIGHT);
  }
  const _config: any = {
    ...features,
    ...config.defaults,
    type: config.type,
    hideCard: !!config.hideCard || !config.iconSVG,
    isDeprecated: !!config.isDeprecated,
    displayName: config.name,
    key: generateReactKey(),
    iconSVG: config.iconSVG,
    isCanvas: config.isCanvas,
    isMobile: config.isMobile,
  };

  // !!!!!!!!!
  // dispatch({
  //   type: ReduxActionTypes.ADD_WIDGET_CONFIG,
  //   payload: _config,
  // });

  WidgetFactory.storeWidgetConfig(config.type, _config);
};
