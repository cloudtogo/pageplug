import { EMPTY_CANVAS_HINTS, createMessage } from "ee/constants/messages";
import { useCurrentAppState } from "pages/Editor/IDE/hooks";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { isAirgapped } from "ee/utils/airgapHelpers";
import { useFeatureFlag } from "utils/hooks/useFeatureFlag";
import {
  combinedPreviewModeSelector,
  getIsMobileCanvasLayout,
  getOccupiedSpacesSelectorForContainer,
} from "selectors/editorSelectors";
import { isMobileLayout } from "selectors/applicationSelectors";
import { FEATURE_FLAG } from "ee/entities/FeatureFlag";
import { EditorState as IDEAppState } from "ee/entities/IDE/constants";
import EmptyCanvas from "assets/images/undraw_blank_canvas-1.svg";
import styled from "styled-components";

const EmptyContainer = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  width: 400px;
  height: 400px;
  margin-top: -180px;
  margin-left: -200px;
  text-align: center;

  & h2 {
    color: #666;
    margin-top: 28px;
  }

  & img {
    height: 100%;
    width: 100%;
  }
`;

function Onboarding() {
  const isMobileCanvas = useSelector(getIsMobileCanvasLayout);
  const isTaroWdsCanvas = useSelector(isMobileLayout);
  const appState = useCurrentAppState();
  const isAirgappedInstance = isAirgapped();

  const showStarterTemplatesInsteadofBlankCanvas = useFeatureFlag(
    FEATURE_FLAG.ab_show_templates_instead_of_blank_canvas_enabled,
  );
  const releaseDragDropBuildingBlocks = useFeatureFlag(
    FEATURE_FLAG.release_drag_drop_building_blocks_enabled,
  );

  const shouldShowStarterTemplates = useMemo(
    () =>
      showStarterTemplatesInsteadofBlankCanvas &&
      !isMobileCanvas &&
      !isTaroWdsCanvas &&
      !isAirgappedInstance &&
      // This is to hide starter building blocks once building blocks are available in the explorer
      !releaseDragDropBuildingBlocks,
    [
      showStarterTemplatesInsteadofBlankCanvas,
      isMobileCanvas,
      isTaroWdsCanvas,
      isAirgappedInstance,
      releaseDragDropBuildingBlocks,
    ],
  );

  if (shouldShowStarterTemplates && appState === IDEAppState.EDITOR)
    return (
      <EmptyContainer>
        <img src={EmptyCanvas} style={{ opacity: 0.5 }} />
        <h2>开始构建你的应用</h2>
      </EmptyContainer>
    );
  else if (!shouldShowStarterTemplates && appState === IDEAppState.EDITOR)
    return (
      <EmptyContainer>
        <img src={EmptyCanvas} style={{ opacity: 0.5 }} />
        <h2>开始构建你的应用</h2>
      </EmptyContainer>
    );
  else return null;
}

// function Onboarding() {
//   return (
//     <h2 className="absolute top-0 left-0 right-0 flex items-end h-108 justify-center text-2xl font-bold text-gray-300">
//       {createMessage(EMPTY_CANVAS_HINTS.DRAG_DROP_WIDGET_HINT)}
//     </h2>
//   );
// }

export default Onboarding;
