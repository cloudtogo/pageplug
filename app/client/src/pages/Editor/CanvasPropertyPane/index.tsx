import * as Sentry from "@sentry/react";

import React from "react";
import { useDispatch } from "react-redux";

import { PopoverPosition } from "@blueprintjs/core";
import { useSelector } from "react-redux";
import { isMobileLayout } from "selectors/applicationSelectors";
import { MainContainerLayoutControl } from "../MainContainerLayoutControl";
import { Button, Category, Size, TooltipComponent } from "design-system-old";

import { openAppSettingsPaneAction } from "actions/appSettingsPaneActions";
import { AppPositionTypeControl, Title } from "../AppPositionTypeControl";

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
          <AppPositionTypeControl />
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
      </div>
    </div>
  );
}

CanvasPropertyPane.displayName = "CanvasPropertyPane";

export default Sentry.withProfiler(CanvasPropertyPane);
