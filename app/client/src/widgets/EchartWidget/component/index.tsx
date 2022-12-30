/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState } from "react";
import * as _ from "lodash";
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
import useResizeObserver from "utils/hooks/useResizeObserver";
import { message } from "antd";

declare global {
  interface Window {
    BMAP_AK_NOT_CONFIGED: boolean;
  }
}

interface pointType {
  name: string | number;
  value: number;
}

type registerType = {
  name: string;
  url: string;
};

function customizer(objValue: any, srcValue: any) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
const DARK_THEMES = ["dark", "chalk", "transparent"];

function EchartComponent(props: EchartComponentProps) {
  const echartRef = useRef<any>();
  const echartInstance = useRef<any>();
  const selectedEchartTheme = useSelector(getSelectedEchartTheme);
  const [preChartTheme, setCurrentChart] = useState<EchartTheme | null>();
  const [registeredMap, setRegisteredMap] = useState<registerType>({
    name: "",
    url: "",
  });

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
  const hasBMap =
    chartType === "CUSTOM_CHART" &&
    customEchartConfig &&
    customEchartConfig.bmap;
  const showBMapKeyConfigTips = hasBMap && window.BMAP_AK_NOT_CONFIGED;

  const handleListener = () => {
    const { listener, onListener } = props;
    const _echartInstance = echartInstance.current;
    _.each(listener, (item: any) => {
      if (item.seriesName) {
        _echartInstance.off(item.seriesName);
        // console.log("注册监听事件", item.seriesName);
        _echartInstance.on(item.seriesName, (evt: any) => {
          // console.log("触发监听事件", item.seriesName);
          onListener && onListener(item.seriesName, evt);
        });
      }
    });
  };

  const handleEvent = () => {
    const _echartInstance = echartInstance.current;
    const { onDataPointClick } = props;
    if (onDataPointClick && _echartInstance) {
      _echartInstance.on("click", (evt: any) => {
        onDataPointClick(evt);
      });
    }
    handleListener();
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

  const registerMap = (cb?: () => void) => {
    if (
      registerMapName &&
      registerMapJsonUrl &&
      echartInstance.current &&
      (!_.isEqual(registeredMap.name, registerMapName) ||
        !_.isEqual(registeredMap.url, registerMapJsonUrl))
    ) {
      readBlob(registerMapJsonUrl)
        .then((resData) => {
          echarts.registerMap(registerMapName, resData);
          setRegisteredMap({
            name: registerMapName,
            url: registerMapJsonUrl,
          });
        })
        .finally(() => {
          initChartInstance(true);
          cb && cb();
        })
        .catch((e) => {
          message.error("GeoJSON 注册失败！");
          console.log(
            `%cregister [${registerMapName}] failed: ${registerMapJsonUrl}`,
            "color: #df9658;",
          );
          console.error(e);
        });
    } else {
      cb && cb();
    }
  };

  useEffect(() => {
    const { onInstance } = props;
    onInstance && echartInstance.current && onInstance(echartInstance.current);
  }, [echartInstance.current]);

  // init echart instance
  const initChartInstance = (flag?: boolean) => {
    let needReDraw = !!flag;
    const registerTheme: EchartTheme | undefined = selectedEchartTheme;
    let defaultTheme = _.get(registerTheme, "themeKey", "default");
    if (
      registerTheme &&
      _.get(preChartTheme, "themeKey") !== _.get(registerTheme, "themeKey")
    ) {
      registerEchartTheme(registerTheme.themeKey);
      defaultTheme = _.get(registerTheme, "themeKey");
      needReDraw = true;
    }
    if ((!echartInstance.current || needReDraw) && echartRef?.current) {
      echartInstance.current && echartInstance.current.dispose();
      echartInstance.current = echarts.init(echartRef?.current, defaultTheme);
    }
    echartInstance.current.clear();
    return echartInstance.current;
  };

  // props更新调用
  useEffect(() => {
    if (!chartData) {
      return;
    }
    const instance: any = initChartInstance();
    // 清空一下实例
    instance.clear();
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
    const usedMap: boolean =
      registerMapJsonUrl &&
      registerMapName &&
      chartType === "CUSTOM_CHART" &&
      customEchartConfig;

    try {
      if (usedMap) {
        registerMap(() => {
          console.log(
            `%cregister [${registerMapName}] successfully`,
            "color: green;",
          );
          echartInstance.current.clear();
          echartInstance.current.setOption(newOptions, true);
        });
      } else {
        echartInstance.current.clear();
        echartInstance.current.setOption(newOptions, true);
      }
    } catch (err) {}
    setCurrentChart(selectedEchartTheme);
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
  ]);

  // 点击事件handler
  useEffect(() => {
    const { listener } = props;
    return () => {
      echartInstance.current &&
        echartInstance.current.off("click", onDataPointClick);
      _.each(listener, (item: any) => {
        // console.log("取消监听事件", item.seriesName);
        echartInstance.current && echartInstance.current.off(item.seriesName);
      });
    };
  }, [onDataPointClick]);

  // bind event
  useEffect(() => {
    if (echartRef.current) {
      handleEvent();
    }
    return () => {
      if (echartInstance.current) {
        echartInstance.current.clear();
        echartInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (echartRef.current) {
      handleListener();
    }
  }, [props.listener]);

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

  useResizeObserver(echartRef.current, () => {
    echartInstance.current.resize();
  });

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
      {showBMapKeyConfigTips ? (
        <div className="text-red-600 w-full h-full absolute top-0 left-0">
          请在环境变量中配置百度地图 ak 密钥
          <a
            href="https://lbsyun.baidu.com/index.php?title=jspopularGL/guide/getkey"
            target="_blank"
            rel="noreferrer"
            className="pl-4"
          >
            申请百度地图密钥
          </a>
        </div>
      ) : null}
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
  listener?: string;
  onListener?: (type: string, cbdata?: any) => void;
}

export default EchartComponent;
