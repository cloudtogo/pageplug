import React, { lazy, Suspense } from "react";
// import styled from "styled-components";
import * as _ from "lodash";
import Skeleton from "components/utils/Skeleton";
import { contentConfig, styleConfig } from "./propertyConfig";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { retryPromise } from "utils/AppsmithUtils";

import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { DerivedPropertiesMap } from "utils/WidgetFactory";
import { Colors } from "constants/Colors";
import { AllChartData, ChartType } from "../constants";

const EchartComponent = lazy(() =>
  retryPromise(() =>
    import(
      /* webpackPrefetch: true, webpackChunkName: "charts" */ "../component"
    ),
  ),
);
class EchartWidget extends BaseWidget<EchartWidgetProps, WidgetState> {
  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }

  static getPropertyPaneContentConfig() {
    return contentConfig;
  }

  static getPropertyPaneStyleConfig() {
    return styleConfig;
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      selectedDataItem: undefined,
      instance: null,
    };
  }

  onDataPointClick = (selectedDataItem: any) => {
    this.props.updateWidgetMetaProperty(
      "selectedDataItem",
      _.omit(selectedDataItem, "event"),
      {
        triggerPropertyName: "onDataPointClick",
        dynamicString: this.props.onDataPointClick,
        event: {
          type: EventType.ON_DATA_POINT_CLICK,
        },
      },
    );
  };

  listenerCallback = (eventName: string, callbackData: any) => {
    _.mapValues(this.props.listener, (item: any) => {
      if (item.seriesName === eventName && item.handler) {
        super.executeAction({
          triggerPropertyName: eventName,
          dynamicString: item.handler,
          event: {
            type: EventType.ON_ECHART_EVENT,
          },
          callbackData: [_.omit(callbackData, "event")],
        });
      }
    });
  };

  getEchartInstance = (instance: any) => {
    const params = {
      name: "instance",
      type: "custom",
      id: instance.id,
    };
    this.props.updateWidgetMetaProperty("instance", params);
  };

  getPageView() {
    return (
      <Suspense fallback={<Skeleton />}>
        <EchartComponent
          allowScroll={this.props.allowScroll}
          borderRadius={this.props.borderRadius}
          boxShadow={this.props.boxShadow}
          chartData={this.props.chartData}
          chartName={this.props.chartName}
          chartType={this.props.chartType}
          customEchartConfig={this.props.customEchartConfig}
          fontFamily={this.props.fontFamily ?? "Nunito Sans"}
          isLoading={this.props.isLoading}
          isVisible={this.props.isVisible}
          key={this.props.widgetId}
          labelOrientation={this.props.labelOrientation}
          primaryColor={this.props.accentColor ?? Colors.ROYAL_BLUE_2}
          backgroundColor={this.props.backgroundColor}
          setAdaptiveYMin={this.props.setAdaptiveYMin}
          widgetId={this.props.widgetId}
          xAxisName={this.props.xAxisName}
          yAxisName={this.props.yAxisName}
          onDataPointClick={this.onDataPointClick}
          onInstance={this.getEchartInstance}
          registerMapName={this.props.registerMapName}
          registerMapJsonUrl={this.props.registerMapJsonUrl}
          listener={this.props.listener}
          onListener={this.listenerCallback}
        />
      </Suspense>
    );
  }

  static getWidgetType(): string {
    return "ECHART_WIDGET";
  }
}

export interface EchartWidgetProps extends WidgetProps {
  chartType: ChartType;
  chartData: AllChartData;
  customEchartConfig: any;
  xAxisName: string;
  yAxisName: string;
  chartName: string;
  isVisible?: boolean;
  allowScroll: boolean;
  borderRadius: string;
  boxShadow?: string;
  accentColor?: string;
  fontFamily?: string;
  backgroundColor?: string;
  onDataPointClick?: string;
  registerMapName?: string;
  registerMapJsonUrl?: string;
  listener?: string;
  onListener?: void;
}

export default EchartWidget;
