<<<<<<< HEAD
import type Color from "colorjs.io";
import type { ColorTypes } from "colorjs.io/types/src/color";
import { parse } from "../";

export class ColorsAccessor {
  private color: Color;

  constructor(color: ColorTypes) {
    this.color = parse(color);
=======
import Color from "colorjs.io";
import type { ColorTypes } from "colorjs.io/types/src/color";

export class ColorsAccessor {
  color: Color;

  constructor(color: ColorTypes) {
    this.color = new Color(color);
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f

    return this;
  }

<<<<<<< HEAD
  get hex() {
    return this.color.toString({ format: "hex" });
  }

=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
  /* Lightness */
  get isVeryDark() {
    return this.color.oklch.l < 0.3;
  }

  get isVeryLight() {
    return this.color.oklch.l > 0.93;
  }

  /* Chroma */
  get isAchromatic() {
    return this.color.oklch.c < 0.04;
  }

  get isColorful() {
    return this.color.oklch.c > 0.136;
  }

  /* Hue */
  get isCold() {
    return this.color.oklch.h >= 120 && this.color.oklch.h <= 300;
  }

  get isBlue() {
    return this.color.oklch.h >= 230 && this.color.oklch.h <= 270;
  }

  get isGreen() {
    return this.color.oklch.h >= 105 && this.color.oklch.h <= 165;
  }

  get isYellow() {
    return this.color.oklch.h >= 60 && this.color.oklch.h <= 75;
  }

  get isRed() {
    return this.color.oklch.h >= 29 && this.color.oklch.h <= 50;
  }

  get lightness() {
    return this.color.oklch.l;
  }

  get chroma() {
    return this.color.oklch.c;
  }

  get hue() {
    return this.color.oklch.h;
  }
}
