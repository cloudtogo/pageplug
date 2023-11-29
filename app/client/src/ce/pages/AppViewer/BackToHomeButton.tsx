/* eslint-disable @typescript-eslint/no-restricted-imports */
import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AppsIcon from "remixicon-react/AppsLineIcon";
import { getSelectedAppTheme } from "selectors/appThemingSelectors";
import type { NavigationSetting } from "constants/AppConstants";
import { NAVIGATION_SETTINGS } from "constants/AppConstants";
import { getCurrentApplication } from "selectors/applicationSelectors";
import {
  getMenuItemBackgroundColorOnHover,
  getMenuItemTextColor,
} from "pages/AppViewer/utils";
import styled from "styled-components";
import { TooltipComponent } from "design-system-old";
import classNames from "classnames";

type BackToHomeButtonProps = {
  primaryColor: string;
  navColorStyle: NavigationSetting["colorStyle"];
  forSidebar?: boolean;
  isLogoVisible?: boolean;
  setIsLogoVisible?: (isLogoVisible: boolean) => void;
};

const StyledAppIcon = styled(AppsIcon)<
  BackToHomeButtonProps & {
    borderRadius: string;
  }
>`
  color: ${({ navColorStyle, primaryColor }) =>
    getMenuItemTextColor(primaryColor, navColorStyle, true)};
  border-radius: ${({ borderRadius }) => borderRadius};
  transition: all 0.3s ease-in-out;
  margin-top: ${({ forSidebar }) => (forSidebar ? " -3px" : "-2px")};
  width: 100%;
`;

export const StyledLink = styled(Link)<BackToHomeButtonProps>`
  min-width: max-content;

  img {
    width: 100%;
    max-width: 4rem;
    max-height: 1.5rem;
  }

  &:hover {
    svg {
      background-color: ${({ navColorStyle, primaryColor }) =>
        getMenuItemBackgroundColorOnHover(primaryColor, navColorStyle)};

      ${({ navColorStyle, primaryColor }) => {
        if (navColorStyle !== NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT) {
          return `color: ${getMenuItemTextColor(primaryColor, navColorStyle)};`;
        }
      }};
    }
  }
`;

function BackToHomeButton(props: BackToHomeButtonProps) {
  const {
    forSidebar,
    isLogoVisible,
    navColorStyle,
    primaryColor,
    setIsLogoVisible,
  } = props;
  const selectedTheme = useSelector(getSelectedAppTheme);
  const currentApp = useSelector(getCurrentApplication);

  const viewerLayout = currentApp?.viewerLayout;
  const initState = useMemo(() => {
    let init = {
      logoUrl: "",
      color: "",
    };
    if (viewerLayout) {
      try {
        const current = JSON.parse(viewerLayout);
        init = {
          logoUrl: current.logoUrl,
          color: current.color,
        };
      } catch (e) {
        // console.log(e);
      }
    }
    return init;
  }, [viewerLayout]);
  const appLogo =
    initState.logoUrl || "https://img.icons8.com/doodle/2x/koala.png";
  useEffect(() => {
    if (setIsLogoVisible) {
      setIsLogoVisible(false);
    }
  }, []);

  return (
    <TooltipComponent content="Back to apps" position="bottom-left">
      <StyledLink
        className={classNames({
          "flex items-center gap-2 group t--back-to-home hover:no-underline":
            true,
          "mr-2": !isLogoVisible,
          "mb-2 mr-3": isLogoVisible,
        })}
        navColorStyle={navColorStyle}
        primaryColor={primaryColor}
        to="/applications"
      >
        {appLogo ? (
          <img alt="app logo" className="p-0.5 w-8 h-8" src={appLogo} />
        ) : (
          <StyledAppIcon
            borderRadius={selectedTheme.properties.borderRadius.appBorderRadius}
            className="p-1 w-7 h-7"
            forSidebar={forSidebar}
            navColorStyle={navColorStyle}
            primaryColor={primaryColor}
          />
        )}
      </StyledLink>
    </TooltipComponent>
  );
}

export default BackToHomeButton;
