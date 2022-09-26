import React from "react";
import * as Sentry from "@sentry/react";
import { useSelector } from "react-redux";
import { isMobileLayout } from "selectors/editorSelectors";

import { MainContainerLayoutControl } from "../MainContainerLayoutControl";
import ThemeEditor from "../ThemePropertyPane/ThemeEditor";
import styled from "styled-components";
import { Colors } from "constants/Colors";

const Title = styled.p`
  color: ${Colors.GRAY_800};
`;

type Props = {
  skipThemeEditor?: boolean;
};

export function CanvasPropertyPane(props: Props) {
  const isMobile = useSelector(isMobileLayout);
  return (
    <div className="relative ">
      <h3 className="px-4 py-3 text-sm font-medium uppercase">全局配置</h3>

      <div className="mt-3 space-y-6">
        {isMobile ? null : (
          <div className="px-4 space-y-2">
            <Title className="text-sm">画布尺寸</Title>
            <MainContainerLayoutControl />
          </div>
        )}

        {!props.skipThemeEditor && <ThemeEditor />}
      </div>
    </div>
  );
}

CanvasPropertyPane.displayName = "CanvasPropertyPane";

export default Sentry.withProfiler(CanvasPropertyPane);
