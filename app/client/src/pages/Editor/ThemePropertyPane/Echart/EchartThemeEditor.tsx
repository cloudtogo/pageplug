// import { createGlobalStyle } from "styled-components";
// import { get, startCase } from "lodash";
// import MoreIcon from "remixicon-react/MoreFillIcon";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useState } from "react";

import ThemeCard from "./ThemeCard";
import {
  AppThemingMode,
  getAppThemingStack,
  getSelectedEchartTheme,
} from "selectors/appThemingSelectors";
import {
  // resetThemeAction,
  setAppThemingModeStackAction,
  // updateSelectedAppThemeAction,
} from "actions/appThemingActions";
// import SettingSection from "../SettingSection";
import SaveThemeModal from "../SaveThemeModal";
// import { AppTheme } from "entities/AppTheming";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { Button, Category, Size } from "design-system";
// import { getCurrentApplicationId } from "selectors/editorSelectors";
import BetaCard from "components/editorComponents/BetaCard";

// const THEMING_BETA_CARD_POPOVER_CLASSNAME = `theming-beta-card-popover`;

function EchartThemeEditor() {
  const dispatch = useDispatch();
  // const applicationId = useSelector(getCurrentApplicationId);
  // const selectedTheme = useSelector(getSelectedAppTheme);
  const selectedEchartTheme = useSelector(getSelectedEchartTheme);
  const themingStack = useSelector(getAppThemingStack);
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);

  /**
   * sets the mode to THEME_EDIT
   */
  const onClickChangeThemeButton = useCallback(() => {
    AnalyticsUtil.logEvent("APP_THEMING_CHOOSE_THEME");

    dispatch(
      setAppThemingModeStackAction([
        ...themingStack,
        AppThemingMode.ECHART_THEME_SELECTION,
      ]),
    );
  }, [setAppThemingModeStackAction]);

  /**
   * on close save modal
   */
  const onCloseSaveModal = useCallback(() => {
    setSaveModalOpen(false);
  }, [setSaveModalOpen]);

  return (
    <>
      <div>
        <header className="px-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-normal capitalize">Echart主题配置</h3>
              <BetaCard />
            </div>
          </div>

          <ThemeCard theme={selectedEchartTheme}>
            <aside
              className={`absolute left-0 top-0 bottom-0 right-0 items-center justify-center hidden group-hover:flex  backdrop-filter bg-gray-900 bg-opacity-50 backdrop-blur-sm `}
            >
              <Button
                category={Category.primary}
                className="t--change-theme-btn"
                onClick={onClickChangeThemeButton}
                size={Size.medium}
                text="选择Echart主题"
              />
            </aside>
          </ThemeCard>
        </header>
      </div>
      <SaveThemeModal isOpen={isSaveModalOpen} onClose={onCloseSaveModal} />
    </>
  );
}

export default EchartThemeEditor;
