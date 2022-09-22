import { styled } from "linaria/react";
import { css } from "linaria";
import { Colors } from "./Colors";

export const invisible = css`
  && > * {
    opacity: 0.6;
  }
`;

export const dark: any = {};
export const light: any = {};

export const theme: any = {
  smallHeaderHeight: "35px",
};

export const taroifyTheme = {
  primaryColor: Colors.MINT_GREEN,
  cellIconMarginLeft: "12rpx",
};

export default styled;
