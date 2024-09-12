import React, { useCallback } from "react";
import { Button, Flex, SegmentedControl, Tooltip } from "design-system";
import {
  createMessage,
  EDITOR_PANE_TEXTS,
  MAXIMIZE_BUTTON_TOOLTIP,
} from "ee/constants/messages";
import {
  EditorEntityTab,
  EditorState,
  EditorViewMode,
  EditorSubTab,
} from "ee/entities/IDE/constants";
import history from "utils/history";
import { globalAddURL } from "ee/RouteBuilder";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentEditorState, useSegmentNavigation } from "../../hooks";
import styled from "styled-components";
import { useFeatureFlag } from "utils/hooks/useFeatureFlag";
import { FEATURE_FLAG } from "ee/entities/FeatureFlag";
import { widgetListURL, builderURL } from "ee/RouteBuilder";
import { getIDEViewMode, getIsSideBySideEnabled } from "selectors/ideSelectors";
import { setIdeEditorViewMode } from "actions/ideActions";
import { useLocation } from "react-router";
import AnalyticsUtil from "ee/utils/AnalyticsUtil";
import { useCurrentAppState } from "../../hooks";
import { getCurrentBasePageId } from "selectors/editorSelectors";

const Container = styled(Flex)`
  #editor-pane-segment-control {
    max-width: 247px;
  }

  button {
    flex-shrink: 0;
    flex-basis: auto;
  }
`;

const SegmentedHeader = () => {
  const dispatch = useDispatch();
  const isGlobalAddPaneEnabled = useFeatureFlag(
    FEATURE_FLAG.release_global_add_pane_enabled,
  );
  const isSideBySideEnabled = useSelector(getIsSideBySideEnabled);
  const editorMode = useSelector(getIDEViewMode);
  // const pageId = useSelector(getCurrentPageId);
  const pageId = useSelector(getCurrentBasePageId);
  const onAddButtonClick = () => {
    history.push(globalAddURL({ basePageId: pageId }));
  };
  const { segment } = useCurrentEditorState();
  const { onSegmentChange } = useSegmentNavigation();
  const loc = useLocation();
  const handleMaximizeButtonClick = useCallback(() => {
    AnalyticsUtil.logEvent("EDITOR_MODE_CHANGE", {
      to: EditorViewMode.FullScreen,
    });
    dispatch(setIdeEditorViewMode(EditorViewMode.FullScreen));
  }, []);

  const appState = useCurrentAppState();
  const options =
    appState === EditorState.EDITOR
      ? []
      : [
          {
            label: createMessage(EDITOR_PANE_TEXTS.queries_tab),
            value: EditorEntityTab.QUERIES,
          },
          {
            label: createMessage(EDITOR_PANE_TEXTS.js_tab),
            value: EditorEntityTab.JS,
          },
        ];

  const UIOptions = [
    {
      label: createMessage(EDITOR_PANE_TEXTS.widget_list_title),
      value: EditorSubTab.LIST,
    },
    {
      label: createMessage(EDITOR_PANE_TEXTS.widget_pool_title),
      value: EditorSubTab.POOL,
    },
  ];

  const closePoolView = useCallback(() => {
    history.push(widgetListURL({ basePageId: pageId }));
  }, [pageId]);

  const closeListView = useCallback(() => {
    history.push(builderURL({}));
  }, []);

  const onTypeChange = (type: string) => {
    if (type === EditorSubTab.LIST) {
      closePoolView();
    } else {
      closeListView();
    }
  };

  const activeTab: string = loc.pathname?.endsWith("/edit/widgets")
    ? EditorSubTab.LIST
    : EditorSubTab.POOL;

  const isEditLayoutView: boolean =
    loc.pathname?.endsWith("/edit/viewerlayout");
  if (isEditLayoutView) {
    return null;
  }
  
  return (
    <>
      {options.length ? (
        <Container
          alignItems="center"
          backgroundColor="var(--ads-v2-colors-control-track-default-bg)"
          className="ide-editor-left-pane__header"
          gap="spaces-2"
          justifyContent="space-between"
          padding="spaces-2"
        >
          <SegmentedControl
            id="editor-pane-segment-control"
            onChange={onSegmentChange}
            options={options}
            value={segment}
          />
          {isGlobalAddPaneEnabled ? (
            <Button
              className={"t--add-editor-button"}
              isIconButton
              kind="primary"
              onClick={onAddButtonClick}
              size="sm"
              startIcon="add-line"
            />
          ) : null}
          {isSideBySideEnabled &&
          editorMode === EditorViewMode.SplitScreen &&
          segment !== EditorEntityTab.UI ? (
            <Tooltip content={createMessage(MAXIMIZE_BUTTON_TOOLTIP)}>
              <Button
                id="editor-mode-maximize"
                isIconButton
                kind="tertiary"
                onClick={handleMaximizeButtonClick}
                startIcon="maximize-v3"
              />
            </Tooltip>
          ) : null}
        </Container>
      ) : null}

      <Container
        alignItems="center"
        backgroundColor="var(--ads-v2-colors-control-track-default-bg)"
        className="ide-editor-left-pane__header"
        gap="spaces-2"
        justifyContent="space-between"
        padding="spaces-2"
      >
        {appState === EditorState.EDITOR ? (
          <SegmentedControl
            id="editor-pane-segment-control"
            onChange={onTypeChange}
            options={UIOptions}
            value={activeTab}
          />
        ) : null}
      </Container>
    </>
  );
};

export default SegmentedHeader;
