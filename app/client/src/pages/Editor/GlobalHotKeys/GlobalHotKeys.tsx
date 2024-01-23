import React from "react";
import { connect } from "react-redux";
import type { AppState } from "@appsmith/reducers";
import { HotkeysTarget2 } from "@blueprintjs/core";
import {
  closePropertyPane,
  closeTableFilterPane,
  copyWidget,
  cutWidget,
  deleteSelectedWidget,
  groupWidgets,
  pasteWidget,
} from "actions/widgetActions";
import { selectWidgetInitAction } from "actions/widgetSelectionActions";
import { setGlobalSearchCategory } from "actions/globalSearchActions";
import { getSelectedText, isMacOrIOS } from "utils/helpers";
import { getLastSelectedWidget, getSelectedWidgets } from "selectors/ui";
import { MAIN_CONTAINER_WIDGET_ID } from "constants/WidgetConstants";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { WIDGETS_SEARCH_ID } from "constants/Explorer";
import { resetSnipingMode as resetSnipingModeAction } from "actions/propertyPaneActions";
import { showDebugger } from "actions/debuggerActions";

import { runActionViaShortcut } from "actions/pluginActionActions";
import type { SearchCategory } from "components/editorComponents/GlobalSearch/utils";
import {
  filterCategories,
  SEARCH_CATEGORY_ID,
} from "components/editorComponents/GlobalSearch/utils";
import { redoAction, undoAction } from "actions/pageActions";

import { getAppMode } from "@appsmith/selectors/applicationSelectors";
import type { APP_MODE } from "entities/App";

import {
  createMessage,
  SAVE_HOTKEY_TOASTER_MESSAGE,
} from "@appsmith/constants/messages";
import { setPreviewModeAction } from "actions/editorActions";
import { previewModeSelector } from "selectors/editorSelectors";
import { getExplorerPinned } from "selectors/explorerSelector";
import { setExplorerPinnedAction } from "actions/explorerActions";
import { setIsGitSyncModalOpen } from "actions/gitSyncActions";
import { GitSyncModalTab } from "entities/GitSync";
import { matchBuilderPath } from "constants/routes";
import { toggleInstaller } from "actions/JSLibraryActions";
import { SelectionRequestType } from "sagas/WidgetSelectUtils";
import { toast } from "design-system";
import { showDebuggerFlag } from "selectors/debuggerSelectors";
import { getIsFirstTimeUserOnboardingEnabled } from "selectors/onboardingSelectors";
import WalkthroughContext from "components/featureWalkthrough/walkthroughContext";
import { protectedModeSelector } from "selectors/gitSyncSelectors";

interface Props {
  copySelectedWidget: () => void;
  pasteCopiedWidget: (mouseLocation: { x: number; y: number }) => void;
  deleteSelectedWidget: () => void;
  cutSelectedWidget: () => void;
  groupSelectedWidget: () => void;
  setGlobalSearchCategory: (category: SearchCategory) => void;
  resetSnipingMode: () => void;
  openDebugger: () => void;
  closeProppane: () => void;
  closeTableFilterProppane: () => void;
  executeAction: () => void;
  selectAllWidgetsInit: () => void;
  deselectAllWidgets: () => void;
  selectedWidget?: string;
  selectedWidgets: string[];
  isDebuggerOpen: boolean;
  children: React.ReactNode;
  undo: () => void;
  redo: () => void;
  appMode?: APP_MODE;
  isPreviewMode: boolean;
  isProtectedMode: boolean;
  setPreviewModeAction: (shouldSet: boolean) => void;
  isExplorerPinned: boolean;
  isSignpostingEnabled: boolean;
  setExplorerPinnedAction: (shouldPinned: boolean) => void;
  showCommitModal: () => void;
  getMousePosition: () => { x: number; y: number };
  hideInstaller: () => void;
}

class GlobalHotKeys extends React.Component<Props> {
  public stopPropagationIfWidgetSelected(e: KeyboardEvent): boolean {
    const multipleWidgetsSelected =
      this.props.selectedWidgets && this.props.selectedWidgets.length;
    const singleWidgetSelected =
      this.props.selectedWidget &&
      this.props.selectedWidget != MAIN_CONTAINER_WIDGET_ID;
    if (
      (singleWidgetSelected || multipleWidgetsSelected) &&
      !getSelectedText()
    ) {
      e.preventDefault();
      e.stopPropagation();
      return true;
    }
    return false;
  }

  public onOnmnibarHotKeyDown(
    e: KeyboardEvent,
    categoryId: SEARCH_CATEGORY_ID = SEARCH_CATEGORY_ID.NAVIGATION,
  ) {
    e.preventDefault();

    // don't open omnibar if preview mode is on
    if (this.props.isPreviewMode) return;

    const category = filterCategories[categoryId];
    this.props.setGlobalSearchCategory(category);
    this.props.hideInstaller();
    AnalyticsUtil.logEvent("OPEN_OMNIBAR", {
      source: "HOTKEY_COMBO",
      category: category.title,
    });
  }

  private hotkeys = [
    {
      combo: "mod + f",
      global: true,
      label: "Search entities",
      onKeyDown: (e: any) => {
        const widgetSearchInput = document.getElementById(WIDGETS_SEARCH_ID);
        if (widgetSearchInput) {
          widgetSearchInput.focus();
          e.preventDefault();
          e.stopPropagation();
        }
      },
    },
    {
      allowInInput: true,
      combo: "mod + p",
      global: true,
      label: "Navigate",
      onKeyDown: (e: any) => {
        this.onOnmnibarHotKeyDown(e);
      },
    },
    {
      allowInInput: true,
      combo: "mod + plus",
      global: true,
      label: "Create new",
      onKeyDown: (e: any) => {
        this.onOnmnibarHotKeyDown(e, SEARCH_CATEGORY_ID.ACTION_OPERATION);
      },
    },
    {
      allowInInput: true,
      combo: "mod + k",
      global: true,
      label: "Show omnibar",
      onKeyDown: (e: any) => {
        this.onOnmnibarHotKeyDown(e, SEARCH_CATEGORY_ID.INIT);
      },
    },
    {
      allowInInput: true,
      combo: "mod + d",
      global: true,
      group: "Canvas",
      label: "Open Debugger",
      onKeyDown: () => {
        this.props.openDebugger();
        if (this.props.isDebuggerOpen) {
          AnalyticsUtil.logEvent("OPEN_DEBUGGER", {
            source: "CANVAS",
          });
        }
      },
      preventDefault: true,
    },
    {
      combo: "mod + c",
      global: true,
      group: "Canvas",
      label: "Copy widget",
      onKeyDown: (e: any) => {
        if (this.stopPropagationIfWidgetSelected(e)) {
          this.props.copySelectedWidget();
        }
      },
    },
    {
      combo: "mod + v",
      global: true,
      group: "Canvas",
      label: "Paste widget",
      onKeyDown: () => {
        if (matchBuilderPath(window.location.pathname)) {
          this.props.pasteCopiedWidget(
            this.props.getMousePosition() || { x: 0, y: 0 },
          );
        }
      },
    },
    {
      combo: "backspace",
      global: true,
      group: "Canvas",
      label: "Delete widget",
      onKeyDown: (e: any) => {
        if (this.stopPropagationIfWidgetSelected(e) && isMacOrIOS()) {
          this.props.deleteSelectedWidget();
        }
      },
    },
    {
      combo: "del",
      group: "Canvas",
      label: "Delete widget",
      onKeyDown: (e: any) => {
        if (this.stopPropagationIfWidgetSelected(e)) {
          this.props.deleteSelectedWidget();
        }
      },
    },
    {
      combo: "mod + x",
      group: "Canvas",
      label: "Cut Widget",
      onKeyDown: (e: any) => {
        if (this.stopPropagationIfWidgetSelected(e)) {
          this.props.cutSelectedWidget();
        }
      },
    },
    {
      combo: "mod + a",
      group: "Canvas",
      label: "Select all Widget",
      onKeyDown: (e: any) => {
        if (matchBuilderPath(window.location.pathname)) {
          this.props.selectAllWidgetsInit();
          e.preventDefault();
        }
      },
    },
    {
      combo: "esc",
      group: "Canvas",
      label: "Deselect all Widget",
      onKeyDown: (e: any) => {
        this.props.resetSnipingMode();
        this.props.deselectAllWidgets();
        this.props.closeProppane();
        this.props.closeTableFilterProppane();
        e.preventDefault();
        this.props.setPreviewModeAction(false);
      },
    },
    {
      combo: "v",
      global: true,
      label: "Edit Mode",
      onKeyDown: (e: any) => {
        this.props.resetSnipingMode();
        e.preventDefault();
      },
    },
    {
      allowInInput: true,
      combo: "mod + enter",
      global: true,
      label: "Execute Action",
      onKeyDown: this.props.executeAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      combo: "mod + z",
      global: true,
      label: "Undo change in canvas",
      onKeyDown: this.props.undo,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      combo: "mod + shift + z",
      global: true,
      label: "Redo change in canvas",
      onKeyDown: this.props.redo,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      combo: "mod + y",
      global: true,
      label: "Redo change in canvas",
      onKeyDown: this.props.redo,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      combo: "mod + g",
      group: "Canvas",
      label: "Cut Widgets for grouping",
      onKeyDown: (e: any) => {
        if (this.stopPropagationIfWidgetSelected(e)) {
          this.props.groupSelectedWidget();
        }
      },
    },
    {
      combo: "mod + s",
      global: true,
      label: "Save progress",
      onKeyDown: () => {
        toast.show(createMessage(SAVE_HOTKEY_TOASTER_MESSAGE), {
          kind: "info",
        });
      },
      preventDefault: true,
      stopPropagation: true,
    },
    {
      combo: "p",
      global: true,
      label: "Preview Mode",
      onKeyDown: () => {
        this.props.setPreviewModeAction(!this.props.isPreviewMode);
      },
    },
    {
      combo: "mod + /",
      label: "Pin/Unpin Entity Explorer",
      onKeyDown: () => {
        this.props.setExplorerPinnedAction(!this.props.isExplorerPinned);
        this.props.hideInstaller();
      },
    },
    {
      combo: "ctrl + shift + g",
      label: "Show git commit modal",
      onKeyDown: () => {
        this.props.showCommitModal();
      },
    },
  ];

  public render() {
    return (
      <HotkeysTarget2 hotkeys={this.hotkeys}>
        {({ handleKeyDown, handleKeyUp }) => (
          <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex={0}>
            <div>{this.props.children}</div>
          </div>
        )}
      </HotkeysTarget2>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  selectedWidget: getLastSelectedWidget(state),
  selectedWidgets: getSelectedWidgets(state),
  isDebuggerOpen: showDebuggerFlag(state) as boolean,
  appMode: getAppMode(state),
  isPreviewMode: previewModeSelector(state),
  isProtectedMode: protectedModeSelector(state),
  isExplorerPinned: getExplorerPinned(state),
  isSignpostingEnabled: getIsFirstTimeUserOnboardingEnabled(state),
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    copySelectedWidget: () => dispatch(copyWidget(true)),
    pasteCopiedWidget: (mouseLocation: { x: number; y: number }) =>
      dispatch(pasteWidget(false, mouseLocation)),
    deleteSelectedWidget: () => dispatch(deleteSelectedWidget(true)),
    cutSelectedWidget: () => dispatch(cutWidget()),
    groupSelectedWidget: () => dispatch(groupWidgets()),
    setGlobalSearchCategory: (category: SearchCategory) =>
      dispatch(setGlobalSearchCategory(category)),
    resetSnipingMode: () => dispatch(resetSnipingModeAction()),
    openDebugger: () => dispatch(showDebugger()),
    closeProppane: () => dispatch(closePropertyPane()),
    closeTableFilterProppane: () => dispatch(closeTableFilterPane()),
    selectAllWidgetsInit: () =>
      dispatch(selectWidgetInitAction(SelectionRequestType.All)),
    deselectAllWidgets: () =>
      dispatch(selectWidgetInitAction(SelectionRequestType.Empty)),
    executeAction: () => dispatch(runActionViaShortcut()),
    undo: () => dispatch(undoAction()),
    redo: () => dispatch(redoAction()),
    setPreviewModeAction: (shouldSet: boolean) =>
      dispatch(setPreviewModeAction(shouldSet)),
    setExplorerPinnedAction: (shouldSet: boolean) =>
      dispatch(setExplorerPinnedAction(shouldSet)),
    showCommitModal: () =>
      dispatch(
        setIsGitSyncModalOpen({
          isOpen: true,
          tab: GitSyncModalTab.DEPLOY,
        }),
      ),
    hideInstaller: () => dispatch(toggleInstaller(false)),
  };
};

GlobalHotKeys.contextType = WalkthroughContext;

export default connect(mapStateToProps, mapDispatchToProps)(GlobalHotKeys);
