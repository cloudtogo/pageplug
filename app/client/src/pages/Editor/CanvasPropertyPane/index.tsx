import * as Sentry from "@sentry/react";

import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { PopoverPosition } from "@blueprintjs/core";
import { useSelector } from "react-redux";
import { isMobileLayout } from "selectors/applicationSelectors";
import { MainContainerLayoutControl } from "../MainContainerLayoutControl";
import { Button, Category, Size, TooltipComponent } from "design-system-old";

import { openAppSettingsPaneAction } from "actions/appSettingsPaneActions";
<<<<<<< HEAD
<<<<<<< HEAD
import { AppPositionTypeControl, Title } from "../AppPositionTypeControl";
=======
=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
import ConversionButton from "../CanvasLayoutConversion/ConversionButton";
import { MainContainerLayoutControl } from "../MainContainerLayoutControl";
import {
  getIsAutoLayout,
  isAutoLayoutEnabled,
} from "selectors/editorSelectors";
import styled from "styled-components";
import { Colors } from "constants/Colors";
<<<<<<< HEAD
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f

const Title = styled.p`
  color: ${Colors.GRAY_800};
`;
export function CanvasPropertyPane() {
  const dispatch = useDispatch();

  const openAppSettingsPane = () => {
    dispatch(openAppSettingsPaneAction());
  };
<<<<<<< HEAD
<<<<<<< HEAD

  const isMobile = useSelector(isMobileLayout);
=======
  const isAutoLayoutFeatureEnabled = useSelector(isAutoLayoutEnabled);
  const isAutoLayout = useSelector(getIsAutoLayout);
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
=======
  const isAutoLayoutFeatureEnabled = useSelector(isAutoLayoutEnabled);
  const isAutoLayout = useSelector(getIsAutoLayout);
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
  return (
    <div className="relative ">
      <h3 className="px-4 py-3 text-sm font-medium uppercase">全局配置</h3>

      <div className="mt-3 space-y-6">
        <div className="px-4 space-y-2">
<<<<<<< HEAD
<<<<<<< HEAD
          {isMobile ? null : (
            <>
              <Title className="text-sm">画布尺寸</Title>
              <MainContainerLayoutControl />
            </>
          )}
          <AppPositionTypeControl />
=======
=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
          {!isAutoLayout && (
            <>
              <Title className="text-sm">Canvas Size</Title>
              <MainContainerLayoutControl />
            </>
          )}
          {isAutoLayoutFeatureEnabled && <ConversionButton />}
<<<<<<< HEAD
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
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
