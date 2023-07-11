<<<<<<< HEAD
import { contrast, lighten, setLch } from "../colorUtils";
import { ColorsAccessor } from "../ColorsAccessor";

=======
import { ColorsAccessor } from "../ColorsAccessor";

import type Color from "colorjs.io";
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
import type { ColorTypes } from "colorjs.io/types/src/color";
import type { ColorModeTheme } from "./types";

export class DarkModeTheme implements ColorModeTheme {
<<<<<<< HEAD
  private readonly seedColor: string;
=======
  private readonly seedColor: Color;
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
  private readonly seedLightness: number;
  private readonly seedChroma: number;
  private readonly seedHue: number;
  private readonly seedIsVeryDark: boolean;
  private readonly seedIsAchromatic: boolean;

  constructor(private color: ColorTypes) {
<<<<<<< HEAD
    const { chroma, hex, hue, isAchromatic, isVeryDark, lightness } =
      new ColorsAccessor(color);
    this.seedColor = hex;
=======
    const {
      chroma,
      color: seedColor,
      hue,
      isAchromatic,
      isVeryDark,
      lightness,
    } = new ColorsAccessor(color);
    this.seedColor = seedColor;
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
    this.seedLightness = lightness;
    this.seedChroma = chroma;
    this.seedHue = hue;
    this.seedIsVeryDark = isVeryDark;
    this.seedIsAchromatic = isAchromatic;
  }

  public getColors = () => {
    return {
<<<<<<< HEAD
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
      bdFocus: this.bdFocus,
      bdNeutral: this.bdNeutral,
      bdNeutralHover: this.bdNeutralHover,
=======
      bg: this.bg.toString({ format: "hex" }),
      bgAccent: this.bgAccent.toString({ format: "hex" }),
      bgAccentHover: this.bgAccentHover.toString({ format: "hex" }),
      bgAccentActive: this.bgAccentActive.toString({ format: "hex" }),
      bgAccentSubtleHover: this.bgAccentSubtleHover.toString({ format: "hex" }),
      bgAccentSubtleActive: this.bgAccentSubtleActive.toString({
        format: "hex",
      }),
      fg: this.fg.toString({ format: "hex" }),
      fgAccent: this.fgAccent.toString({ format: "hex" }),
      fgOnAccent: this.fgOnAccent.toString({ format: "hex" }),
      fgNegative: this.fgNegative,
      bdAccent: this.bdAccent.toString({ format: "hex" }),
      bdFocus: this.bdFocus.toString({ format: "hex" }),
      bdNeutral: this.bdNeutral.toString({ format: "hex" }),
      bdNeutralHover: this.bdNeutralHover.toString({ format: "hex" }),
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      bdNegative: this.bdNegative,
      bdNegativeHover: this.bdNegativeHover,
    };
  };

  /*
   * Background colors
   */
  private get bg() {
<<<<<<< HEAD
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
=======
    const color = this.seedColor.clone();

    if (this.seedIsAchromatic) {
      color.oklch.l = 0.15;
      color.oklch.c = 0;
      return color;
    }

    color.oklch.l = 0.15;
    color.oklch.c = 0.064;
    return color;
  }

  private get bgAccent() {
    const color = this.seedColor.clone();

    if (this.seedIsVeryDark) {
      color.oklch.l = 0.3;
      return color;
    }

    return color;
  }

  private get bgAccentHover() {
    return this.bgAccent.clone().lighten(0.06);
  }

  private get bgAccentActive() {
    return this.bgAccentHover.clone().darken(0.1);
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
  }

  // used only for generating child colors, not used as a token
  private get bgAccentSubtle() {
<<<<<<< HEAD
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
=======
    const color = this.seedColor.clone();

    if (this.seedLightness > 0.3) {
      color.oklch.l = 0.3;
    }

    if (this.seedChroma > 0.112 && !this.seedIsAchromatic) {
      color.oklch.c = 0.112;
    }

    return color;
  }

  private get bgAccentSubtleHover() {
    return this.bgAccentSubtle.clone().lighten(0.06);
  }

  private get bgAccentSubtleActive() {
    return this.bgAccentSubtleHover.clone().darken(0.1);
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
  }

  /*
   * Foreground colors
   */
  private get fg() {
<<<<<<< HEAD
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
    if (contrast(this.seedColor, this.bg) <= 60) {
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

    return this.seedColor;
  }

  private get fgOnAccent() {
    if (contrast(this.seedColor, this.bg) <= 40) {
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

  private get bdAccent() {
    if (contrast(this.seedColor, this.bg) <= 15) {
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
    if (contrast(this.seedColor, this.bg) >= -25 && !this.seedIsAchromatic) {
      return setLch(this.seedColor, {
        c: 0.008,
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

  private get bdNeutralHover() {
    return lighten(this.bdNeutral, 1.06);
  }

  private get bdFocus() {
    let currentColor = this.seedColor;

    currentColor = setLch(currentColor, { h: this.seedHue - 180 });

    if (this.seedLightness < 0.4) {
      currentColor = setLch(currentColor, { l: 0.4 });
    }

    return currentColor;
=======
    const color = this.seedColor.clone();

    if (this.seedIsAchromatic) {
      color.oklch.l = 0.965;
      color.oklch.c = 0;
      return color;
    }

    color.oklch.l = 0.965;
    color.oklch.c = 0.024;
    return color;
  }

  private get fgAccent() {
    const color = this.seedColor.clone();

    if (this.seedColor.contrastAPCA(this.bg) <= 60) {
      if (this.seedIsAchromatic) {
        color.oklch.l = 0.79;
        color.oklch.c = 0;
        return color;
      }

      color.oklch.l = 0.79;
      color.oklch.c = 0.136;
      return color;
    }

    return color;
  }

  private get fgOnAccent() {
    const color = this.seedColor.clone();

    if (this.seedColor.contrastAPCA(this.bg) <= 40) {
      if (this.seedIsAchromatic) {
        color.oklch.l = 0.985;
        color.oklch.c = 0;
        return color;
      }

      color.oklch.l = 0.985;
      color.oklch.c = 0.016;
      return color;
    }

    if (this.seedIsAchromatic) {
      color.oklch.l = 0.15;
      color.oklch.c = 0;
      return color;
    }

    color.oklch.l = 0.15;
    color.oklch.c = 0.064;
    return color;
  }

  private get fgNegative() {
    return "#d91921";
  }

  private get bdAccent() {
    const color = this.seedColor.clone();

    if (this.seedColor.contrastAPCA(this.bg) <= 15) {
      if (this.seedIsAchromatic) {
        color.oklch.l = 0.985;
        color.oklch.c = 0;
        return color;
      }

      color.oklch.l = 0.985;
      color.oklch.c = 0.016;
      return color;
    }

    return color;
  }

  private get bdNeutral() {
    const color = this.seedColor.clone();

    if (this.seedColor.contrastAPCA(this.bg) >= -25 && !this.seedIsAchromatic) {
      color.oklch.c = 0.008;
      return color;
    }

    if (this.seedIsAchromatic) {
      color.oklch.l = 0.15;
      color.oklch.c = 0;
      return color;
    }

    color.oklch.l = 0.15;
    color.oklch.c = 0.064;
    return color;
  }

  private get bdNeutralHover() {
    return this.bdNeutral.clone().lighten(0.06);
  }

  private get bdFocus() {
    const color = this.seedColor.clone();

    color.oklch.h = this.seedHue - 180;

    if (this.seedLightness < 0.4) {
      color.oklch.l = 0.4;
    }

    return color;
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
  }

  private get bdNegative() {
    return "#d91921";
  }

  private get bdNegativeHover() {
    return "#b90707";
  }
}
