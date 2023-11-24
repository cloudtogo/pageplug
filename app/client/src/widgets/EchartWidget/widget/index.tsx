import React, { lazy, Suspense } from "react";
// import styled from "styled-components";
import * as _ from "lodash";
import Skeleton from "components/utils/Skeleton";
import { contentConfig, styleConfig } from "./propertyConfig";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { retryPromise } from "utils/AppsmithUtils";

import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import type { DerivedPropertiesMap } from "utils/WidgetFactory";
import { Colors } from "constants/Colors";
import type { AllChartData, ChartType } from "../constants";
import type { Stylesheet } from "entities/AppTheming";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import type { AutocompletionDefinitions } from "widgets/constants";
import type { SetterConfig } from "entities/AppTheming";

const EchartComponent = lazy(() =>
  retryPromise(
    () =>
      import(
        /* webpackPrefetch: true, webpackChunkName: "charts" */ "../component"
      ),
  ),
);
class EchartWidget extends BaseWidget<EchartWidgetProps, WidgetState> {
  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "EChart widget is used to view the graphical representation of your data. EChart is the go-to widget for your data visualisation needs.",
      "!url": "https://echarts.apache.org/handbook/zh/get-started/",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      chartData: {
        seriesName: "string",
        data: "[$__chartDataPoint__$]",
      },
      xAxisName: "string",
      yAxisName: "string",
      selectedDataItem: "$__chartDataPoint__$",
    };
  }
  static getSetterConfig(): SetterConfig {
    return {
      __setters: {
        setVisibility: {
          path: "isVisible",
          type: "boolean",
        },
        setURL: {
          path: "docUrl",
          type: "string",
        },
      },
    };
  }
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

  static getStylesheetConfig(): Stylesheet {
    return {
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "{{appsmith.theme.boxShadow.appBoxShadow}}",
      accentColor: "{{appsmith.theme.colors.primaryColor}}",
      fontFamily: "{{appsmith.theme.fontFamily.appFont}}",
    };
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
          backgroundColor={this.props.backgroundColor}
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
          listener={this.props.listener}
          onDataPointClick={this.onDataPointClick}
          onInstance={this.getEchartInstance}
          onListener={this.listenerCallback}
          primaryColor={this.props.accentColor ?? Colors.ROYAL_BLUE_2}
          registerMapJsonUrl={this.props.registerMapJsonUrl}
          registerMapName={this.props.registerMapName}
          setAdaptiveYMin={this.props.setAdaptiveYMin}
          widgetId={this.props.widgetId}
          xAxisName={this.props.xAxisName}
          yAxisName={this.props.yAxisName}
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
