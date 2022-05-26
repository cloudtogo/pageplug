import styled from "styled-components";
import { Color, Colors } from "./Colors";

export type IconProps = {
  width?: number;
  height?: number;
  color?: Color;
  background?: Color;
  onClick?: (e?: any) => void;
  className?: string;
  keepColors?: boolean;
  needBG?: boolean;
  disabled?: boolean;
  cursor?: "move" | "grab" | "default";
  style?: any;
};

export const IconWrapper = styled.div<IconProps>`
  &:focus {
    outline: none;
  }

  display: inline-flex;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  cursor: pointer;
  ${(props) =>
    props.needBG
      ? `
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url("data:image/svg+xml;utf8, %3Csvg width='100%25' height='100%25' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' %3E %3Cdefs%3E %3CclipPath id='shape'%3E %3Cpath fill='currentColor' d='M852.5,683.5Q793,867,596,905Q399,943,245.5,820Q92,697,101,504.5Q110,312,254,182Q398,52,588.5,101Q779,150,845.5,325Q912,500,852.5,683.5Z'%3E%3C/path%3E %3C/clipPath%3E %3C/defs%3E %3Cg clip-path='url(%23shape)'%3E %3Cpath fill='${window.encodeURIComponent(
        Colors.MINT_GREEN_LIGHT,
      )}' d='M852.5,683.5Q793,867,596,905Q399,943,245.5,820Q92,697,101,504.5Q110,312,254,182Q398,52,588.5,101Q779,150,845.5,325Q912,500,852.5,683.5Z' /%3E %3C/g%3E %3C/svg%3E");
      background-position-x: -2px;
    `
      : ""}
  cursor: ${(props) =>
    props.disabled
      ? "not-allowed"
      : props.onClick
      ? "pointer"
      : props.cursor ?? "default"};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  && svg {
    width: ${(props) => props.width || props.theme.fontSizes[6]}px;
    height: ${(props) => props.height || props.theme.fontSizes[6]}px;

    ${(props) =>
      !props.keepColors
        ? `
    path {
      fill: ${props.color || Colors.MINT_BLACK};
    }
    circle {
      fill: ${props.background || Colors.MINT_BLACK};
    }
    rect {
      fill: ${props.background || Colors.MINT_BLACK};
    }`
        : ""}
  }
`;
