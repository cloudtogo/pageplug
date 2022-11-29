import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  // getAppThemes,
  getAppThemingStack,
  // getSelectedAppTheme,
  getSelectedEchartTheme,
} from "selectors/appThemingSelectors";
import * as _ from "lodash";
import { echartThemes as ECHART_THEMES } from "./constants";
import { ThemeCard } from "./ThemeCard";
import { SettingSection } from "../SettingSection";
import ArrowLeft from "remixicon-react/ArrowLeftSLineIcon";
import { setAppThemingModeStackAction } from "actions/appThemingActions";

function EchartThemeSelector() {
  const dispatch = useDispatch();
  // const themes = useSelector(getAppThemes);
  const themingStack = useSelector(getAppThemingStack);
  const selectedEchartTheme = useSelector(getSelectedEchartTheme);

  /**
   * goes to previous screen in the pane
   */
  const onClickBack = () => {
    dispatch(setAppThemingModeStackAction(themingStack.slice(0, -1)));
  };

  /**
   * stores user saved themes
   */
  // const userSavedThemes = themes.filter(
  //   (theme) => theme.isSystemTheme === false,
  // );

  const userSavedThemes = {};

  /**
   * stores default system themes
   */
  const systemThemes = ECHART_THEMES;
  const currentTheme =
    ECHART_THEMES[selectedEchartTheme?.themeKey] || selectedEchartTheme;
  return (
    <div className="relative">
      <section className="sticky top-0 items-center justify-between bg-white z-1 ">
        <button
          className="inline-flex items-center px-3 py-2 space-x-1 text-gray-500 cursor-pointer t--theme-select-back-btn"
          onClick={onClickBack}
          type="button"
        >
          <ArrowLeft className="w-4 h-4 transition-all transform" />
          <h3 className="text-xs font-medium uppercase">返回</h3>
        </button>
        <SettingSection
          className="px-3 py-3 border-t border-b"
          isDefaultOpen={false}
          title="当前Echart主题"
        >
          <ThemeCard theme={currentTheme} />
        </SettingSection>
      </section>
      {_.size(userSavedThemes) > 0 && (
        <section className="relative px-3 py-3 space-y-3">
          <h3 className="text-base font-medium capitalize">你的Echart主题</h3>
          {_.map(userSavedThemes, (theme) => (
            <ThemeCard selectable theme={theme} />
          ))}
        </section>
      )}
      <section className="relative px-3 py-3 space-y-3">
        <h3 className="text-base font-medium capitalize">特色Echart主题</h3>
        {_.map(systemThemes, (theme: any) => (
          <ThemeCard selectable theme={theme} />
        ))}
      </section>
    </div>
  );
}

export default EchartThemeSelector;
