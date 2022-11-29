import { EchartTheme } from "entities/AppTheming";

import macarons from "theme/echart/macarons.json";
import chalk from "theme/echart/chalk.json";
import walden from "theme/echart/walden.json";
import westeros from "theme/echart/westeros.json";

type echartsMap = {
  [key: string]: EchartTheme;
};

export const echartThemes: any = {
  macarons: {
    themeKey: "macarons",
    ...macarons,
  },
  chalk: {
    themeKey: "chalk",
    ...chalk,
  },
  walden: {
    themeKey: "walden",
    ...walden,
  },
  westeros: {
    themeKey: "westeros",
    ...westeros,
  },
  dark: {
    themeKey: "dark",
    backgroundColor: "#100c2a",
    color: [
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
      "#ea7ccc",
    ],
  },
  default: {
    themeKey: "default",
    backgroundColor: "#ffffff",
    color: [
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
      "#ea7ccc",
    ],
  },
  transparent: {
    themeKey: "transparent",
    backgroundColor: "transparent",
    color: [],
  },
};
