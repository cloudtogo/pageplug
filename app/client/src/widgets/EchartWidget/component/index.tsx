/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import "echarts-gl";
import * as _ from "lodash";
import "echarts/extension/bmap/bmap";
import macarons from "theme/echart/macarons.json";
import chalk from "theme/echart/chalk.json";
import walden from "theme/echart/walden.json";
import westeros from "theme/echart/westeros.json";
import { useSelector } from "react-redux";
import { EchartTheme } from "entities/AppTheming";
import { getSelectedEchartTheme } from "selectors/appThemingSelectors";
import { LabelOrientation, AllChartData } from "../constants";
import { NO_AXIS, ECHART_BASIC_OPTION, ECHART_TYPE_MAP } from "../constants";
import { convertStringFunciton } from "../widget/helper";
import { readBlob } from "utils/AppUtils";
import { message } from "antd";

interface pointType {
  name: string | number;
  value: number;
}

function customizer(objValue: any, srcValue: any) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
const DARK_THEMES = ["dark", "chalk", "transparent"];

function EchartComponent(props: EchartComponentProps) {
  const echartRef = useRef<any>();
  const echartInstance = useRef<any>();
  const [refreshflag, refresh] = useState<number>(0);
  const selectedEchartTheme = useSelector(getSelectedEchartTheme);
  const objectRef = useRef<any>();
  const [preChartTheme, setCurrentChart] = useState<EchartTheme | null>();

  const chartContainerId = props.widgetId + "-echart-container";

  const {
    onDataPointClick,
    chartType,
    chartName,
    xAxisName,
    yAxisName,
    chartData,
    customEchartConfig,
    borderRadius,
    boxShadow,
    backgroundColor,
    registerMapJsonUrl,
    registerMapName,
  } = props;

  const handleEvent = () => {
    const _echartInstance = echartInstance.current;
    const { onDataPointClick } = props;
    if (onDataPointClick && _echartInstance) {
      _echartInstance.on("click", (evt: any) => {
        onDataPointClick(evt);
      });
    }
  };

  const registerEchartTheme = (theme: string | undefined) => {
    switch (theme) {
      case "macarons":
        echarts.registerTheme("macarons", macarons);
        break;
      case "chalk":
        echarts.registerTheme("chalk", chalk);
        break;
      case "westeros":
        echarts.registerTheme("westeros", westeros);
        break;
      case "walden":
        echarts.registerTheme("walden", walden);
        break;
      default:
        break;
    }
  };

  const registerMap = () => {
    if (registerMapName && registerMapJsonUrl && echartInstance.current) {
      if (echarts.getMap(registerMapName)) {
        // already register
      } else {
        readBlob(registerMapJsonUrl)
          .then((resData) => {
            echarts.registerMap(registerMapName, resData);
          })
          .catch(() => {
            message.warn("地图注册失败");
          });
      }
    }
  };

  useEffect(() => {
    const { onInstance } = props;
    onInstance && echartInstance.current && onInstance(echartInstance.current);
  }, [echartInstance.current]);

  // props更新调用
  useEffect(() => {
    if (!chartData) {
      return;
    }
    if (!echartInstance.current && echartRef.current) {
      echartInstance.current = echarts.init(echartRef?.current, "default");
    }
    /*register theme*/
    const registerTheme: EchartTheme | undefined = selectedEchartTheme;
    if (preChartTheme !== registerTheme && registerTheme) {
      echartInstance.current.dispose();
      registerEchartTheme(registerTheme.themeKey);
      echartInstance.current = echarts.init(
        echartRef?.current,
        registerTheme.themeKey,
      );
    }

    if (echartInstance.current) {
      // 清空一下实例
      echartInstance.current.clear();
      const _seriesD = getSeriesAndXaxisData();
      let newOption: any = {
        title: {
          text: chartName,
        },
        xAxis: {
          name: xAxisName,
          data: _seriesD.xAxis,
        },
        yAxis: {
          name: yAxisName,
        },
        darkMode: true,
        series: _seriesD.series,
      };
      if (backgroundColor) {
        _.set(newOption, "backgroundColor", backgroundColor);
      }
      if (
        selectedEchartTheme &&
        DARK_THEMES.includes(selectedEchartTheme.themeKey)
      ) {
        _.set(newOption, "darkMode", true);
      }

      if (chartType === "CUSTOM_CHART" && customEchartConfig) {
        newOption = customEchartConfig;
      }

      _.mergeWith(newOption, ECHART_BASIC_OPTION, customizer);

      /**
       * 如果在opts.replaceMerge里指定组件类型，这类组件会进行替换合并。
       * 否则，会进行普通合并
       */
      const replaceMerge: string[] = [];

      if (NO_AXIS[chartType]) {
        replaceMerge.push("xAxis", "yAxis");
        _.set(newOption, "yAxis.show", false);
        _.set(newOption, "xAxis.show", false);
      } else {
        _.set(newOption, "yAxis.show", true);
        _.set(newOption, "xAxis.show", true);
      }
      const newOptions: any = convertStringFunciton(newOption);
      try {
        if (
          registerMapName &&
          !echarts.getMap(registerMapName) &&
          registerMapJsonUrl
        ) {
          registerMap();
          refresh(refreshflag + 1);
        } else {
          echartInstance.current.setOption(newOptions, { replaceMerge });
        }
      } catch (err) {}
      setCurrentChart(selectedEchartTheme);
    }
  }, [
    chartType,
    chartName,
    xAxisName,
    yAxisName,
    chartData,
    customEchartConfig,
    backgroundColor,
    selectedEchartTheme,
    registerMapName,
    registerMapJsonUrl,
    refreshflag,
  ]);

  useEffect(() => {
    registerMap();
  }, [registerMapJsonUrl, registerMapName]);

  // 点击事件handler
  useEffect(() => {
    return () => {
      echartInstance.current &&
        echartInstance.current.off("click", onDataPointClick);
    };
  }, [onDataPointClick]);

  // bind event
  useEffect(() => {
    if (echartRef.current) {
      handleEvent();
    }
  }, []);

  const getSeriesAndXaxisData = () => {
    const series: any[] = [];
    const xAxis: any[] = [];
    _.each(chartData, (c_data, c_key) => {
      if (chartType === "PIE_CHART") {
        series.push({
          ...c_data,
          id: c_key,
          name: c_data.seriesName,
          type: ECHART_TYPE_MAP[chartType],
          data: c_data.data.map((it: pointType) => {
            return {
              name: it.name,
              value: it.value,
            };
          }),
        });
      } else {
        series.push({
          ...c_data,
          id: c_key,
          name: c_data.seriesName,
          type: ECHART_TYPE_MAP[chartType],
          data: c_data.data.map((it: pointType) => {
            !xAxis.includes(it.name) && xAxis.push(it.name);
            return it.value;
          }),
        });
      }
    });
    return { xAxis, series };
  };

  useEffect(() => {
    objectRef.current.contentDocument.defaultView.addEventListener(
      "resize",
      () => {
        echartInstance.current.resize();
      },
    );
  }, [objectRef.current]);

  const style = {
    borderRadius,
    boxShadow,
  };
  return (
    <div
      className={`w-full h-full overflow-hidden relative ${
        _.includes(DARK_THEMES, selectedEchartTheme.themeKey)
          ? "bg-transparent"
          : "bg-white"
      }`}
      style={style}
    >
      <div id={chartContainerId} ref={echartRef} className="h-full w-full" />
      {/* 监听组件大小 */}
      <object
        ref={objectRef}
        tabIndex={-1}
        type="text/html"
        aria-hidden="true"
        data="about:blank"
        className="absolute block top-0 left-0 w-full h-full border-0 opacity-0 z-[-1000] pointer-events-none"
      />
    </div>
  );
}

export interface EchartComponentProps {
  widgetId?: string;
  allowScroll: boolean;
  chartData: AllChartData;
  chartName: string;
  chartType: string;
  customEchartConfig: any;
  isVisible?: boolean;
  isLoading: boolean;
  setAdaptiveYMin: boolean; // set adaptive YAxis
  labelOrientation?: LabelOrientation; // adjust xAxis label orientation
  onDataPointClick: (selectedDataPoint: any) => void;
  onInstance: (instance?: any) => void;
  xAxisName: string;
  yAxisName: string;
  borderRadius: string;
  boxShadow?: string;
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  registerMapJsonUrl?: string;
  registerMapName?: string;
}

export default EchartComponent;
