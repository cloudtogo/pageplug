import { lighten, setLch } from "../colorUtils";
import { ColorsAccessor } from "../ColorsAccessor";

import type { ColorTypes } from "colorjs.io/types/src/color";
import type { ColorModeTheme } from "./types";

export class DarkModeTheme implements ColorModeTheme {
  private readonly seedColor: string;
  private readonly seedLightness: number;
  private readonly seedChroma: number;
  private readonly seedHue: number;
  private readonly seedIsVeryDark: boolean;
  private readonly seedIsAchromatic: boolean;

  constructor(private color: ColorTypes) {
    const { chroma, hex, hue, isAchromatic, isVeryDark, lightness } =
      new ColorsAccessor(color);
    this.seedColor = hex;
    this.seedLightness = lightness;
    this.seedChroma = chroma;
    this.seedHue = hue;
    this.seedIsVeryDark = isVeryDark;
    this.seedIsAchromatic = isAchromatic;
  }

  public getColors = () => {
    return {
      // bg
      bg: this.bg.toString({ format: "hex" }),
      bgAccent: this.bgAccent.toString({ format: "hex" }),
      bgAccentHover: this.bgAccentHover.toString({ format: "hex" }),
      bgAccentActive: this.bgAccentActive.toString({ format: "hex" }),
      bgAccentSubtleHover: this.bgAccentSubtleHover.toString({ format: "hex" }),
      bgAccentSubtleActive: this.bgAccentSubtleActive.toString({
        format: "hex",
      }),
      bgAssistive: this.bgAssistive.toString({ format: "hex" }),
      // fg
      fg: this.fg.toString({ format: "hex" }),
      fgAccent: this.fgAccent.toString({ format: "hex" }),
      fgOnAccent: this.fgOnAccent.toString({ format: "hex" }),
      fgNegative: this.fgNegative,
      fgOnAssistive: this.fgOnAssistive.toString({ format: "hex" }),
      // bd
      bdAccent: this.bdAccent.toString({ format: "hex" }),
      bdFocus: this.bdFocus.toString({ format: "hex" }),
      bdNeutral: this.bdNeutral.toString({ format: "hex" }),
      bdNeutralHover: this.bdNeutralHover.toString({ format: "hex" }),
      bdNegative: this.bdNegative,
      bdNegativeHover: this.bdNegativeHover,
    };
  };

  /*
   * Background colors
   */
  private get bg() {
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

  private get bgAccent() {
    if (this.seedIsVeryDark) {
      return setLch(this.seedColor, {
        l: 0.3,
      });
    }

    return this.seedColor;
  }

  private get bgAccentHover() {
    return lighten(this.bgAccent, 1.06);
  }

  private get bgAccentActive() {
    return lighten(this.bgAccentHover, 0.9);
  }

  // used only for generating child colors, not used as a token
  private get bgAccentSubtle() {
    let currentColor = this.seedColor;

    if (this.seedLightness > 0.3) {
      currentColor = setLch(currentColor, {
        l: 0.3,
      });
    }

    if (this.seedChroma > 0.112 && !this.seedIsAchromatic) {
      currentColor = setLch(currentColor, {
        c: 0.112,
      });
    }

    return currentColor;
  }

  private get bgAccentSubtleHover() {
    return lighten(this.bgAccentSubtle, 1.06);
  }

  private get bgAccentSubtleActive() {
    return lighten(this.bgAccentSubtle, 0.9);
  }

  private get bgAssistive() {
    return this.fg.clone();
  }

  /*
   * Foreground colors
   */
  private get fg() {
    if (this.seedIsAchromatic) {
      return setLch(this.seedColor, {
        l: 0.965,
        c: 0,
      });
    }

    return setLch(this.seedColor, {
      l: 0.965,
      c: 0.024,
    });
  }

  private get fgAccent() {
    const color = this.seedColor.clone();

    if (this.bg.contrastAPCA(this.seedColor) >= -60) {
      if (this.seedIsAchromatic) {
        return setLch(this.seedColor, {
          l: 0.79,
          c: 0,
        });
      }

      return setLch(this.seedColor, {
        l: 0.79,
        c: 0.136,
      });
    }
    return color;
  }

  private get fgOnAccent() {
    const tint = this.seedColor.clone();
    const shade = this.seedColor.clone();

    if (this.seedIsAchromatic) {
      tint.oklch.c = 0;
      shade.oklch.c = 0;
    }

    tint.oklch.l = 0.94;
    shade.oklch.l = 0.27;

    if (-this.bgAccent.contrastAPCA(tint) < this.bgAccent.contrastAPCA(shade)) {
      return shade;
    }

    return tint;
  }

  private get fgNegative() {
    return "#d91921";
  }

  private get fgOnAssistive() {
    return this.bg.clone();
  }

  private get bdAccent() {
    const color = this.seedColor.clone();

    if (this.bg.contrastAPCA(this.seedColor) >= -25) {
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

    return this.seedColor;
  }

  private get bdNeutral() {
    const color = this.bdAccent.clone();

    color.oklch.c = 0.035;

    if (this.seedIsAchromatic) {
      color.oklch.c = 0;
    }

    if (this.bg.contrastAPCA(color) > -25) {
      color.oklch.l = color.oklch.l + 0.15;
    }

    return color;
  }

  private get bdNeutralHover() {
    const color = this.bdNeutral.clone();

    if (this.bdNeutral.oklch.l < 0.8) {
      color.oklch.l = color.oklch.l + 0.15;
    }

    if (this.bdNeutral.oklch.l >= 0.8 && this.bdNeutral.oklch.l < 0.9) {
      color.oklch.l = color.oklch.l + 0.1;
    }

    if (this.bdNeutral.oklch.l >= 0.9) {
      color.oklch.l = color.oklch.l - 0.25;
    }

    return color;
  }

  private get bdFocus() {
    let currentColor = this.seedColor;

    currentColor = setLch(currentColor, { h: this.seedHue - 180 });

    if (this.seedLightness < 0.4) {
      currentColor = setLch(currentColor, { l: 0.4 });
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
