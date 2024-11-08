import type { NavigationSetting } from "constants/AppConstants";
import { NAVIGATION_SETTINGS } from "constants/AppConstants";
import styled from "styled-components";
import {
  getMenuContainerBackgroundColor,
  getMenuItemTextColor,
  getSecondMenuItemBackgroundColorOnHover,
} from "../utils";

export const Container = styled.div<{
  primaryColor: string;
  navColorStyle: NavigationSetting["colorStyle"];
}>`
  width: 100%;
  align-items: center;
  background-color: ${({ navColorStyle, primaryColor }) =>
    getMenuContainerBackgroundColor(primaryColor, navColorStyle)};

  ${({ navColorStyle, theme }) => {
    const isLightColorStyle =
      navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT;

    if (isLightColorStyle) {
      return `
        border-bottom: 1px solid ${theme.colors.header.tabsHorizontalSeparator};
      `;
    }
  }}

  // padding: 0px 20px;
  .ant-menu-horizontal > li.ant-menu-item,
  .ant-menu-horizontal > li.ant-menu-submenu {
    margin: 0px 8px;
    padding: 4px 8px;
  }

  .ant-menu-horizontal {
    line-height: 24px;
    height: 100%;
    padding-inline: 8px;
    padding-block: 8px;
    border-bottom: none;
  }
  .ant-menu-dark > .ant-menu,
  .ant-menu-dark {
    background-color: ${({ navColorStyle, primaryColor }) =>
      getMenuContainerBackgroundColor(primaryColor, navColorStyle)} !important;
  }
  .ant-menu-dark > .ant-menu-submenu-selected,
  .ant-menu-dark > .ant-menu-submenu-active,
  .ant-menu-vertical > .ant-menu-submenu-selected {
    background-color: ${({ navColorStyle, primaryColor }) =>
      getSecondMenuItemBackgroundColorOnHover(
        primaryColor,
        navColorStyle,
      )} !important;
  }

  .ant-menu-dark > .ant-menu-submenu-selected,
  .ant-menu-vertical > .ant-menu-submenu-selected {
    background-color: ${({ navColorStyle, primaryColor }) =>
      getSecondMenuItemBackgroundColorOnHover(
        primaryColor,
        navColorStyle,
      )} !important;
  }
  ${({ navColorStyle, primaryColor, theme }) => `
  .ant-menu-inline > .ant-menu-item-selected, 
  .ant-menu-dark .ant-menu-item-selected,
  .ant-menu-dark > .ant-menu-item-active
  {
    background-color:  ${getSecondMenuItemBackgroundColorOnHover(
      primaryColor,
      navColorStyle,
    )} !important;
    color: ${getMenuItemTextColor(
      primaryColor,
      navColorStyle,
      false,
      "active",
    )} !important;
  }
  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: ${getMenuItemTextColor(
      primaryColor,
      navColorStyle,
      false,
      "active",
    )} !important;
  }
  .ant-menu-dark:not(.ant-menu-horizontal) .ant-menu-item:not(.ant-menu-item-selected):hover, 
  .ant-menu-dark>.ant-menu:not(.ant-menu-horizontal) .ant-menu-item:not(.ant-menu-item-selected):hover{
    color: #fff !important;
  }
  .ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected::after, 
  .ant-menu-light.ant-menu-horizontal >.ant-menu-item:hover::after,
  .ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu:hover::after,
  .ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-selected::after,
  .ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-selected::after,
  .ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-selected::after {
    border-color: ${getMenuItemTextColor(
      primaryColor,
      navColorStyle,
      false,
      "active",
    )} !important;
  }
  .ant-menu-item, .ant-menu-submenu-title, .ant-menu-submenu, .ant-menu-submenu-open,.ant-menu-submenu-selected {
    border-radius: 2px !important;
  }
`}

  & {
    .scroll-arrows svg path,
    .scroll-arrows svg:hover path {
      fill: ${({ navColorStyle, primaryColor }) =>
        getMenuItemTextColor(primaryColor, navColorStyle, true)};
      stroke: ${({ navColorStyle, primaryColor }) =>
        getMenuItemTextColor(primaryColor, navColorStyle, true)};
    }
  }
  .ant-menu-overflow-item.ant-menu-overflow-item-rest {
    display: flex;
  }
`;

export const ScrollBtnContainer = styled.div<{
  visible: boolean;
  primaryColor: string;
  navColorStyle: NavigationSetting["colorStyle"];
}>`
  cursor: pointer;
  display: flex;
  position: absolute;
  height: 100%;
  padding: 0 10px;

  & > span {
    background: ${({ navColorStyle, primaryColor }) =>
      getMenuContainerBackgroundColor(primaryColor, navColorStyle)};
    position: relative;
    z-index: 1;
  }

  ${(props) =>
    props.visible
      ? `
      visibility: visible;
      opacity: 1;
      z-index: 1;
      transition: visibility 0s linear 0s, opacity 300ms;
    `
      : `
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s linear 300ms, opacity 300ms;
    `}
`;
