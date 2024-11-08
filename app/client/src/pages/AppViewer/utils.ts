import type { NavigationSetting } from "constants/AppConstants";
import { NAVIGATION_SETTINGS } from "constants/AppConstants";
import { Colors } from "constants/Colors";
import tinycolor from "tinycolor2";
import {
  calculateHoverColor,
  getComplementaryGrayscaleColor,
  isLightColor,
  lightenColor,
} from "widgets/WidgetUtils";
import { viewerURL } from "ee/RouteBuilder";

// Menu Item Background Color - Active
export const getMenuItemBackgroundColorWhenActive = (
  color: string,
  navColorStyle: NavigationSetting["colorStyle"] = NAVIGATION_SETTINGS
    .COLOR_STYLE.LIGHT,
) => {
  const colorHsl = tinycolor(color).toHsl();

  switch (navColorStyle) {
    case NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT: {
      if (isLightColor(color)) {
        colorHsl.l -= 0.1;

        return tinycolor(colorHsl).toHexString();
      } else {
        colorHsl.l += 0.35;
        colorHsl.a = 0.3;

        return tinycolor(colorHsl).toHex8String();
      }
    }
    case NAVIGATION_SETTINGS.COLOR_STYLE.THEME: {
      return calculateHoverColor(color);
    }
  }
};

// Menu Item Background Color - Hover
export const getMenuItemBackgroundColorOnHover = (
  color: string,
  navColorStyle: NavigationSetting["colorStyle"] = NAVIGATION_SETTINGS
    .COLOR_STYLE.LIGHT,
) => {
  if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT) {
    return "var(--ads-v2-color-bg-subtle)";
  } else if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.THEME) {
    return tinycolor(calculateHoverColor(color)).toHexString();
  }
};

export const getSecondMenuItemBackgroundColorOnHover = (
  color: string,
  navColorStyle: NavigationSetting["colorStyle"] = NAVIGATION_SETTINGS
    .COLOR_STYLE.LIGHT,
) => {
  if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.THEME) {
    return "rgba(255,255,255,0.08)";
  } else if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT) {
    return addOverlayEffect(calculateHoverColor(color), 0.9);
  }
};

// Menu Item Text Color - Default, Hover, Active
// Menu Item Text Color - Default, Hover, Active
export const getMenuItemTextColor = (
  color: string,
  navColorStyle: NavigationSetting["colorStyle"] = NAVIGATION_SETTINGS
    .COLOR_STYLE.LIGHT,
  isDefaultState = false,
  status?: "hover" | "active" | "default"
) => {
  switch (navColorStyle) {
    case NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT: {
      const resultantColor: tinycolor.ColorFormats.HSLA | string =
        tinycolor(color).toHsl();
      if (isDefaultState) {
        return Colors.GREY_9;
      }

      if (isLightColor(color)) {
        resultantColor.l += 0.05;
        resultantColor.s -= 0.05;
        return tinycolor(resultantColor).toHexString();
      } else {
        if (resultantColor.l <= 0.05) {
          /**
           * if the color is close to black, it will have a near transparent background
           * due to the getMenuItemBackgroundColorWhenActive function.
           * Therefore, only black text will be accessible and suitable in this case.
           */
          return Colors.BLACK;
        } else if (resultantColor.l > 0.05 && resultantColor.l <= 0.15) {
          // if the color is extremely dark
          return "rgba(0, 0, 0, 0.8)";
        } else {
          resultantColor.l -= 0.1;
          return tinycolor(resultantColor).toHexString();
        }
      }
    }
    case NAVIGATION_SETTINGS.COLOR_STYLE.THEME: {
      if (isDefaultState) {
        return getComplementaryGrayscaleColor(color);
      }
      if (!isLightColor(color) && !status) { // default
        return "rgba(255, 255, 255, 0.8)"
      }
      if (!isLightColor(color) && status !== "default") { // hover active
        return lightenColor(color, "40");
      }
      return addOverlayEffect(color, 0);
    }
  }
};

// Menu Container Background Color
export const getMenuContainerBackgroundColor = (
  color: string,
  navColorStyle: NavigationSetting["colorStyle"] = NAVIGATION_SETTINGS
    .COLOR_STYLE.LIGHT,
) => {
  if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT) {
    return Colors.WHITE;
  } else if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.THEME) {
    return color;
  }
};

export const getApplicationNameTextColor = (
  color: string,
  navColorStyle: NavigationSetting["colorStyle"] = NAVIGATION_SETTINGS
    .COLOR_STYLE.LIGHT,
) => {
  if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT) {
    return Colors.GREY_9;
  } else if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.THEME) {
    return getComplementaryGrayscaleColor(color);
  }
};

export const getSignInButtonStyles = (
  color: string,
  navColorStyle: NavigationSetting["colorStyle"] = NAVIGATION_SETTINGS
    .COLOR_STYLE.LIGHT,
) => {
  const styles = {
    background: Colors.WHITE,
    backgroundOnHover: Colors.GRAY_100,
    color: Colors.BLACK,
  };

  if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT) {
    styles.background = color;
    styles.color = getComplementaryGrayscaleColor(color);
  } else if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.THEME) {
    styles.background = getComplementaryGrayscaleColor(color);
    styles.color = isLightColor(color) ? Colors.WHITE : color;
  }

  styles.backgroundOnHover = calculateHoverColor(styles.background, false);

  return styles;
};

const getIconType = (icon: any) => (icon ? `icon-${icon}` : undefined);

export const makeRouteNode =
  (pagesMap: any, newTree: any[], hideRow: any[]) => (node: any) => {
    let item: any;
    const icon = getIconType(node.icon);
    if (node.isPage) {
      if (pagesMap[node.title]) {
        item = {
          name: node.title,
          icon,
          path: viewerURL({
            basePageId: pagesMap[node.title].pageId,
          }),
        };
        pagesMap[node.title].visited = true;
      }
    } else if (node.children) {
      const routes: any = [];
      node.children.forEach(makeRouteNode(pagesMap, routes, hideRow));
      item = {
        name: node.title,
        icon,
        path: "/",
        routes,
      };
    } else {
      item = {
        name: node.title,
        icon,
        path: "/",
      };
    }
    if (item) {
      if (!hideRow.find((hn) => hn.pageId === node.pageId)) {
        newTree.push(item);
      }
    }
  };

export function findPathNodes(treeArray: any[], leafNode: string) {
  const pathNodes: any[] = [];

  function traverse(node: any, path: any) {
    if (!node) return;
    path.push(node.key);

    if (node.title === leafNode) {
      pathNodes.push(...path);
      return;
    }

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        traverse(node.children[i], path);
      }
    }

    path.pop();
  }

  for (let i = 0; i < treeArray.length; i++) {
    traverse(treeArray[i], []);
  }

  return pathNodes;
}

function addOverlayEffect(baseColor: string, opacity: number) {
  // 创建一个新的颜色，将其设置为基础颜色和蒙层颜色的叠加效果
  const overlayColor = `rgba(255, 255, 255, ${opacity})`;
  let _baseColor = baseColor;
  if (baseColor.includes("hsl")) {
    _baseColor = tinycolor(baseColor).toHexString();
  }
  if (baseColor.includes("rgb")) {
    _baseColor = tinycolor(baseColor).toHexString();
  }
  // 将基础颜色和蒙层颜色进行叠加
  const combinedColor = blendColors(_baseColor, overlayColor);

  return combinedColor;
}

// 辅助函数：将两个颜色进行叠加
function blendColors(color1: string, color2: string) {
  const rgbaColor1: any = hexToRgba(color1);
  const rgbaColor2: any = parseRgba(color2);
  const blendedColor = {
    r: Math.round(
      rgbaColor1.r * (1 - rgbaColor2.a) + rgbaColor2.r * rgbaColor2.a,
    ),
    g: Math.round(
      rgbaColor1.g * (1 - rgbaColor2.a) + rgbaColor2.g * rgbaColor2.a,
    ),
    b: Math.round(
      rgbaColor1.b * (1 - rgbaColor2.a) + rgbaColor2.b * rgbaColor2.a,
    ),
    a: 1,
  };

  return rgbaToHex(blendedColor);
}

function hexToRgb(hexColor: any) {
  // 去除可能包含的 # 号
  hexColor = hexColor.replace("#", "");
  // 拆分十六进制颜色值为 R、G、B 分量
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // 返回 RGB 颜色对象
  return { r, g, b };
}

// 辅助函数：将十六进制颜色转换为RGBA颜色
function hexToRgba(hexColor: any) {
  const rgbColor = hexToRgb(hexColor);

  return {
    r: rgbColor.r,
    g: rgbColor.g,
    b: rgbColor.b,
    a: 1,
  };
}

// 辅助函数：解析RGBA颜色字符串
function parseRgba(rgbaColor: string) {
  const regex = /^rgba?\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/i;
  const result = rgbaColor.match(regex);

  if (result) {
    return {
      r: parseInt(result[1], 10),
      g: parseInt(result[2], 10),
      b: parseInt(result[3], 10),
      a: parseFloat(result[4]),
    };
  }

  return null;
}

// 辅助函数：将RGBA颜色转换为十六进制颜色
function rgbaToHex(rgbaColor: { r: any; g: any; b: any; a?: number }) {
  const { b, g, r } = rgbaColor;
  return rgbToHex(r, g, b);
}

// 辅助函数：将RGB颜色转换为十六进制颜色
function rgbToHex(r: any, g: any, b: any) {
  const toHex = (c: { toString: (arg0: number) => any }) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

