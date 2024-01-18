import React, { lazy, Suspense } from "react";
// import styled from "styled-components";
import * as _ from "lodash";
import Skeleton from "components/utils/Skeleton";
import { contentConfig, styleConfig } from "./propertyConfig";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { retryPromise } from "utils/AppsmithUtils";

import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import { Colors } from "constants/Colors";
import type { AllChartData, ChartType } from "../constants";
import type { Stylesheet } from "entities/AppTheming";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import type { SetterConfig } from "entities/AppTheming";

import IconSVG from "../icon.svg";
import { WIDGET_TAGS } from "constants/WidgetConstants";
import type { AutocompletionDefinitions } from "WidgetProvider/constants";
import type { DerivedPropertiesMap } from "WidgetProvider/factory";
import { generateReactKey } from "widgets/WidgetUtils";
import { ECHART_TYPE_MAP } from "../constants";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import { ResponsiveBehavior } from "layoutSystems/common/utils/constants";

const DEFAUTL_CHART = {
  name: "",
  chartName: "秋季系列",
  chartType: "LINE_CHART",
  type: ECHART_TYPE_MAP["LINE_CHART"],
  data: [
    {
      value: 335,
      name: "衬衫",
    },
    {
      value: 234,
      name: "羊毛衫",
    },
    {
      value: 1548,
      name: "雪纺衫",
    },
    {
      value: 758,
      name: "裤子",
    },
    {
      value: 358,
      name: "高跟鞋",
    },
    {
      value: 658,
      name: "袜子",
    },
  ],
  xAxisName: "品类",
  yAxisName: "销量",
};
const defaultKey = generateReactKey();

const EchartComponent = lazy(async () =>
  retryPromise(
    async () =>
      import(
        /* webpackPrefetch: true, webpackChunkName: "charts" */ "../component"
      ),
  ),
);
class EchartWidget extends BaseWidget<EchartWidgetProps, WidgetState> {
  static type = "ECHART_WIDGET";

  static getConfig() {
    return {
      name: "Echarts", // The display name which will be made in uppercase and show in the widgets panel ( can have spaces )
      iconSVG: IconSVG,
      needsMeta: true, // Defines if this widget adds any meta properties
      tags: [WIDGET_TAGS.DISPLAY],
      searchTags: ["graph", "echart", "chart", "visualisations"],
    };
  }

  static getDefaults() {
    return {
      widgetName: "Echarts",
      mycustom: 2,
      rows: 32,
      columns: 24,
      version: 1,
      chartData: {
        [defaultKey]: {
          type: DEFAUTL_CHART.type,
          seriesName: DEFAUTL_CHART.chartName,
          data: DEFAUTL_CHART.data,
        },
      },
      chartType: DEFAUTL_CHART.chartType,
      chartName: DEFAUTL_CHART.name,
      xAxisName: DEFAUTL_CHART.xAxisName,
      yAxisName: DEFAUTL_CHART.yAxisName,
      allowScroll: false,
      animateLoading: false,
      customEchartConfig: {
        title: {
          text: "Referer of a Website",
          subtext: "Fake Data",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      responsiveBehavior: ResponsiveBehavior.Fill,
      minWidth: FILL_WIDGET_MIN_WIDTH,
    };
  }

  static getAutoLayoutConfig() {
    return {
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: () => {
            return {
              minWidth: "280px",
              minHeight: "300px",
            };
          },
        },
      ],
    };
  }

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

  getWidgetView() {
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
