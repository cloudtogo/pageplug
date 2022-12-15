import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import * as Sentry from "@sentry/react";
import { PopoverPosition } from "@blueprintjs/core";
import { TooltipComponent, Button, Size, Category } from "design-system";
import { useSelector } from "react-redux";
import { isMobileLayout } from "selectors/editorSelectors";
import EchartThemeEditor from "../ThemePropertyPane/Echart/EchartThemeEditor";
import { Colors } from "constants/Colors";
import { MainContainerLayoutControl } from "../MainContainerLayoutControl";
import { openAppSettingsPaneAction } from "actions/appSettingsPaneActions";

const Title = styled.p`
  color: ${Colors.GRAY_800};
`;

export function CanvasPropertyPane() {
  const dispatch = useDispatch();

  const openAppSettingsPane = () => {
    dispatch(openAppSettingsPaneAction());
  };

  const isMobile = useSelector(isMobileLayout);
  return (
    <div className="relative ">
      <h3 className="px-4 py-3 text-sm font-medium uppercase">全局配置</h3>

      <div className="mt-3 space-y-6">
        <div className="px-4 space-y-2">
          {isMobile ? null : (
            <>
              <Title className="text-sm">画布尺寸</Title>
              <MainContainerLayoutControl />
            </>
          )}
          <TooltipComponent
            content={
              isMobile ? null : (
                <>
                  <p className="text-center">更新应用主题、URL</p>
                  <p className="text-center">和其他设置</p>
                </>
              )
            }
            position={PopoverPosition.BOTTOM}
          >
            <Button
              category={Category.secondary}
              fill
              id="t--app-settings-cta"
              onClick={openAppSettingsPane}
              size={Size.medium}
              text="应用设置"
            />
          </TooltipComponent>
        </div>
        <EchartThemeEditor />
      </div>
    </div>
  );
}

CanvasPropertyPane.displayName = "CanvasPropertyPane";

export default Sentry.withProfiler(CanvasPropertyPane);
