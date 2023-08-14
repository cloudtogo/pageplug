import { contrast, lighten, setLch } from "../colorUtils";
import { ColorsAccessor } from "../ColorsAccessor";

import type { ColorTypes } from "colorjs.io/types/src/color";
import type { ColorModeTheme } from "./types";

export class LightModeTheme implements ColorModeTheme {
  private readonly seedColor: string;
  private readonly seedLightness: number;
  private readonly seedChroma: number;
  private readonly seedHue: number;
  private readonly seedIsAchromatic: boolean;
  private readonly seedIsCold: boolean;
  private readonly seedIsVeryLight: boolean;
  private readonly seedIsYellow: boolean;

  constructor(private color: ColorTypes) {
    const {
      chroma,
      color: seedColor,
      hue,
      isAchromatic,
      isCold,
      isVeryLight,
      isYellow,
      lightness,
    } = new ColorsAccessor(color);
    this.seedColor = seedColor;
    this.seedLightness = lightness;
    this.seedChroma = chroma;
    this.seedHue = hue;
    this.seedIsAchromatic = isAchromatic;
    this.seedIsCold = isCold;
    this.seedIsVeryLight = isVeryLight;
    this.seedIsYellow = isYellow;
  }

  public getColors = () => {
    return {
      bg: this.bg,
      bgAccent: this.bgAccent,
      bgAccentHover: this.bgAccentHover,
      bgAccentActive: this.bgAccentActive,
      bgAccentSubtleHover: this.bgAccentSubtleHover,
      bgAccentSubtleActive: this.bgAccentSubtleActive,
      fg: this.fg,
      fgAccent: this.fgAccent,
      fgOnAccent: this.fgOnAccent,
      bdAccent: this.bdAccent,
      bdNeutral: this.bdNeutral,
      bdNeutralHover: this.bdNeutralHover,
      bdFocus: this.bdFocus,
      bdNegative: this.bdNegative,
      bdNegativeHover: this.bdNegativeHover,
    };
  };

  /*
   * Background colors
   */
  private get bg() {
    let currentColor = this.seedColor;

    if (this.seedIsVeryLight) {
      currentColor = setLch(currentColor, {
        l: 0.9,
      });
    }

    if (!this.seedIsVeryLight) {
      currentColor = setLch(currentColor, {
        l: 0.985,
      });
    }

    if (this.seedIsCold) {
      currentColor = setLch(currentColor, {
        c: 0.009,
      });
    }

    if (!this.seedIsCold) {
      currentColor = setLch(currentColor, {
        c: 0.007,
      });
    }

    if (this.seedIsAchromatic) {
      currentColor = setLch(currentColor, {
        c: 0,
      });
    }

    return currentColor;
  }

  private get bgAccent() {
    let currentColor = this.seedColor;

    if (this.seedIsVeryLight) {
      currentColor = setLch(currentColor, {
        l: 0.975,
      });
    }

    return currentColor;
  }

  private get bgAccentHover() {
    const color = this.bgAccent.clone();

    if (this.seedLightness < 0.06) {
      color.oklch.l = this.seedLightness + 0.28;
    }

    if (this.seedLightness > 0.06 && this.seedLightness < 0.14) {
      color.oklch.l = this.seedLightness + 0.2;
    }

    if (
      this.seedLightness >= 0.14 &&
      this.seedLightness < 0.25 &&
      this.seedIsCold
    ) {
      color.oklch.l = this.seedLightness + 0.1;
    }

    if (
      this.seedLightness >= 0.14 &&
      this.seedLightness < 0.21 &&
      !this.seedIsCold
    ) {
      color.oklch.l = this.seedLightness + 0.13;
    }

    if (this.seedLightness >= 0.21 && this.seedLightness < 0.4) {
      color.oklch.l = this.seedLightness + 0.09;
    }

    if (this.seedLightness >= 0.4 && this.seedLightness < 0.7) {
      color.oklch.l = this.seedLightness + 0.05;
    }

    if (this.seedLightness >= 0.7) {
      color.oklch.l = this.seedLightness + 0.03;
    }

    if (this.seedIsVeryLight && this.seedIsYellow) {
      color.oklch.l = 0.945;
      color.oklch.c = this.seedChroma * 0.93;
      color.oklch.h = this.seedHue;
    }

    if (this.seedIsVeryLight && !this.seedIsYellow) {
      color.oklch.l = 0.95;
      color.oklch.c = this.seedChroma * 1.15;
      color.oklch.h = this.seedHue;
    }

    return color;
  }

  private get bgAccentActive() {
    return lighten(this.bgAccent, 0.9);
  }

  // used only for generating child colors, not used as a token
  private get bgAccentSubtle() {
    let currentColor = this.seedColor;

    if (this.seedLightness < 0.94) {
      currentColor = setLch(currentColor, {
        l: 0.94,
      });
    }

    if (this.seedChroma > 0.1 && this.seedIsCold) {
      currentColor = setLch(currentColor, {
        c: 0.1,
      });
    }

    if (this.seedChroma > 0.06 && !this.seedIsCold) {
      currentColor = setLch(currentColor, {
        c: 0.06,
      });
    }

    if (this.seedIsAchromatic) {
      currentColor = setLch(currentColor, {
        c: 0,
      });
    }

    return currentColor;
  }

  private get bgAccentSubtleHover() {
    return lighten(this.bgAccentSubtle, 1.02);
  }

  private get bgAccentSubtleActive() {
    return lighten(this.bgAccentSubtle, 0.99);
  }

  /*
   * Foreground colors
   */
  private get fg() {
    if (this.seedIsAchromatic) {
      return setLch(this.seedColor, {
        l: 0.12,
        c: 0,
      });
    }

    return setLch(this.seedColor, {
      l: 0.12,
      c: 0.032,
    });
  }

  private get fgAccent() {
    if (contrast(this.seedColor, this.bg) >= -60) {
      if (this.seedIsAchromatic) {
        return setLch(this.seedColor, {
          l: 0.25,
          c: 0,
        });
      }

      return setLch(this.seedColor, {
        l: 0.25,
        c: 0.064,
      });
    }

    return this.seedColor;
  }

  private get fgOnAccent() {
    if (contrast(this.seedColor, this.bg) <= -60) {
      if (this.seedIsAchromatic) {
        return setLch(this.seedColor, {
          l: 0.985,
          c: 0,
        });
      }

      return setLch(this.seedColor, {
        l: 0.985,
        c: 0.016,
      });
    }

    if (this.seedIsAchromatic) {
      return setLch(this.seedColor, {
        l: 0.15,
        c: 0,
      });
    }

    return setLch(this.seedColor, {
      l: 0.15,
      c: 0.064,
    });
  }

  /*
   * Border colors
   */
  private get bdAccent() {
    if (contrast(this.seedColor, this.bg) >= -25) {
      if (this.seedIsAchromatic) {
        return setLch(this.seedColor, {
          l: 0.15,
          c: 0,
        });
      }

      return setLch(this.seedColor, {
        l: 0.15,
        c: 0.064,
      });
    }

    return this.seedColor;
  }

  private get bdNeutral() {
    const color = this.bdAccent.clone();

    color.oklch.c = 0.035;

    if (this.seedIsAchromatic) {
      color.oklch.c = 0;
    }

    if (this.bg.contrastAPCA(color) < 25) {
      color.oklch.l = color.oklch.l - 0.2;
    }

    return color;
  }

  private get bdNeutralHover() {
    const color = this.bdNeutral.clone();

    if (this.bdNeutral.oklch.l < 0.06) {
      color.oklch.l = color.oklch.l + 0.6;
    }

    if (this.bdNeutral.oklch.l >= 0.06 && this.bdNeutral.oklch.l < 0.25) {
      color.oklch.l = color.oklch.l + 0.4;
    }

    if (this.bdNeutral.oklch.l >= 0.25 && this.bdNeutral.oklch.l < 0.5) {
      color.oklch.l = color.oklch.l + 0.25;
    }

    if (this.bdNeutral.oklch.l >= 0.5) {
      color.oklch.l = color.oklch.l + 0.1;
    }

    return color;
  }

  private get bdFocus() {
    let currentColor = this.seedColor;

    currentColor = setLch(currentColor, { h: this.seedHue - 180 });

    if (this.seedLightness > 0.7) {
      currentColor = setLch(currentColor, { l: 0.7 });
    }

    return currentColor;
  }

  private get bdNegative() {
    return "#d91921";
  }

  private get bdNegativeHover() {
    return "#b90707";
  }
}
