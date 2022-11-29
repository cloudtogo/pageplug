import { last } from "lodash";
import classNames from "classnames";
import styled from "styled-components";
import * as _ from "lodash";
import * as Sentry from "@sentry/react";
import React, { useState } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
// import DeleteIcon from "remixicon-react/DeleteBinLineIcon";

import { updateApplication } from "actions/applicationActions";

import {
  AppThemingMode,
  getAppThemingStack,
  // getAppThemes,
  // getSelectedEchartTheme,
} from "selectors/appThemingSelectors";
import { AppTheme, EchartTheme } from "entities/AppTheming";
// import AnalyticsUtil from "utils/AnalyticsUtil";
// import DeleteThemeModal from "../DeleteThemeModal";
import { getComplementaryGrayscaleColor } from "widgets/WidgetUtils";
import { getCurrentApplicationId } from "selectors/editorSelectors";

/**
 * ----------------------------------------------------------------------------
 * TYPES
 *-----------------------------------------------------------------------------
 */
type ThemeCard = React.PropsWithChildren<{
  theme: EchartTheme;
  isSelected?: boolean;
  className?: string;
  selectable?: boolean;
  deletable?: boolean;
}>;

const MainContainer = styled.main<{ backgroundColor: string }>`
  background: ${({ backgroundColor }) => backgroundColor};
`;

const HeaderContainer = styled.main<{ primaryColor: string }>`
  background-color: ${({ primaryColor }) => primaryColor};
  color: ${({ primaryColor }) => getComplementaryGrayscaleColor(primaryColor)};
`;

const MainText = styled.main<{ backgroundColor: string }>`
  color: ${({ backgroundColor }) =>
    getComplementaryGrayscaleColor(backgroundColor)};
`;

const MainTextTransparentBg = styled.main<{ backgroundColor: string }>`
  background: #fff;
  background-image: linear-gradient(
      45deg,
      #e7e7e7 25%,
      transparent 0,
      transparent 75%,
      #e7e7e7 0
    ),
    linear-gradient(
      45deg,
      #e7e7e7 25%,
      transparent 0,
      transparent 75%,
      #e7e7e7 0
    );
  background-position: 0 0, 15px 15px;
  background-size: 30px 30px;
`;

const ThemeColorCircle = styled.main<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

/**
 * ----------------------------------------------------------------------------
 * COMPONENT
 *-----------------------------------------------------------------------------
 */
export function ThemeCard(props: ThemeCard) {
  const { selectable, theme } = props;
  const dispatch = useDispatch();
  // const selectedEchart = useSelector(getSelectedEchartTheme);
  const themingStack = useSelector(getAppThemingStack);
  const themingMode = last(themingStack);
  const applicationId = useSelector(getCurrentApplicationId);
  const isThemeSelectionMode =
    themingMode === AppThemingMode.ECHART_THEME_SELECTION;

  // colors
  const userDefinedColors = _.slice(theme.color, 0, 6);
  const backgroundColor = theme.backgroundColor;

  /**
   * fires action for changing theme
   *
   * NOTE: since we are same card in theme edit and theme selection,
   * we don't need to fire the action in theme edit mode on click on the card
   */

  const changeSelectedTheme = () => {
    const data = {
      id: applicationId,
      chartTheme: theme.themeKey,
    };
    if (isThemeSelectionMode && selectable) {
      dispatch(updateApplication(applicationId, data));
      message.success(`Echart主题已切换为 ${theme.themeKey} 风格主题`);
    }
  };

  const TRANSPARENT_BG = ["transparent", "rgba(0,0,0,0)"];

  const MainWrap: any =
    backgroundColor === "transparent" ? MainTextTransparentBg : MainContainer;
  return (
    <div className="space-y-1 group">
      {selectable && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-600 break-all">
            {props.theme.displayName}
          </h3>
        </div>
      )}
      <div
        className={classNames({
          "border relative group transition-all t--theme-card": true,
          "overflow-hidden": !selectable,
          "hover:shadow-xl cursor-pointer": selectable,
        })}
        onClick={changeSelectedTheme}
      >
        <MainWrap backgroundColor={backgroundColor}>
          <section className="flex justify-between px-3 pt-3">
            <MainText
              backgroundColor={
                TRANSPARENT_BG.includes(backgroundColor || "")
                  ? "white"
                  : backgroundColor
              }
              className="text-base"
            >
              {theme.themeKey}
            </MainText>
            <div className="flex items-center space-x-2">
              {userDefinedColors.map((colorKey: any, index: number) => (
                <ThemeColorCircle
                  backgroundColor={colorKey}
                  className="w-4 h-4 border rounded-full"
                  key={index}
                />
              ))}
            </div>
          </section>
          <section className="p-2">
            <div className="flex space-x-2" />
          </section>
        </MainWrap>
        <aside
          className={`absolute bottom-0 left-0 right-0 items-center justify-center hidden  bg-gray-900/80 ${
            selectable ? "group-hover:flex" : ""
          }`}
        >
          <div className="py-1 text-xs tracking-wide text-white uppercase">
            使用这个主题
          </div>
        </aside>
        {props.children}
      </div>
    </div>
  );
}

ThemeCard.displayName = "ThemeCard";

export default Sentry.withProfiler(ThemeCard);
