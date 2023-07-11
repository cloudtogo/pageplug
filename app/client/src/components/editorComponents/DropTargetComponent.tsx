import type { AppState } from "@appsmith/reducers";
import {
  GridDefaults,
  MAIN_CONTAINER_WIDGET_ID,
} from "constants/WidgetConstants";
import equal from "fast-deep-equal/es6";
import type { Context, PropsWithChildren } from "react";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { getCanvasSnapRows } from "utils/WidgetPropsUtils";
import { calculateDropTargetRows } from "./DropTargetUtils";
import DragLayerComponent from "./DragLayerComponent";
import { useDispatch } from "react-redux";
import { useShowPropertyPane } from "utils/hooks/dragResizeHooks";
import {
  getOccupiedSpacesSelectorForContainer,
  isAutoLayoutEnabled,
  previewModeSelector,
} from "selectors/editorSelectors";
import { useWidgetSelection } from "utils/hooks/useWidgetSelection";
import EmptyCanvas from "assets/images/undraw_blank_canvas.svg";
import { getDragDetails } from "sagas/selectors";
import { useAutoHeightUIState } from "utils/hooks/autoHeightUIHooks";
import {
  checkContainersForAutoHeightAction,
  updateDOMDirectlyBasedOnAutoHeightAction,
} from "actions/autoHeightActions";

import {
  isAutoHeightEnabledForWidget,
  isAutoHeightEnabledForWidgetWithLimits,
} from "widgets/WidgetUtils";
import { getIsAppSettingsPaneWithNavigationTabOpen } from "selectors/appSettingsPaneSelectors";

type DropTargetComponentProps = PropsWithChildren<{
  snapColumnSpace: number;
  widgetId: string;
  parentId?: string;
  noPad?: boolean;
  bottomRow: number;
  minHeight: number;
  useAutoLayout?: boolean;
  isMobile?: boolean;
  mobileBottomRow?: number;
}>;

const StyledDropTarget = styled.div`
  transition: height 100ms ease-in;
  width: 100%;
  position: relative;
  background: none;
  user-select: none;
  z-index: 1;
`;

const EmptyContainer = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  width: 400px;
  height: 400px;
  margin-top: -180px;
  margin-left: -200px;
  text-align: center;
  opacity: 0.5;

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
  return (
    <EmptyContainer>
      {/* <CanvasEmpty /> */}
      <img src={EmptyCanvas} />
      <h2>开始构建你的应用</h2>
      <p style={{ margin: "18px 0 0" }}>点击“组件”右侧 + 按钮添加组件</p>
      <p>点击“数据源”右侧 + 按钮添加数据源</p>
    </EmptyContainer>
  );
}

/*
  This context will provide the function which will help the draglayer and resizablecomponents trigger
  an update of the main container's rows
*/
export const DropTargetContext: Context<{
  updateDropTargetRows?: (
    widgetIdsToExclude: string[],
    widgetBottomRow: number,
  ) => number | false;
}> = createContext({});

/**
 * This function sets the height in pixels to the provided ref to the number of rows
 * @param ref : The ref to the dropTarget so that we can update the height
 * @param currentRows : Number of rows to set the height
 */
const updateHeight = (
  ref: React.MutableRefObject<HTMLDivElement | null>,
  currentRows: number,
) => {
  if (ref.current) {
    const height = currentRows * GridDefaults.DEFAULT_GRID_ROW_HEIGHT;
    ref.current.style.height = `${height}px`;
    ref.current
      .closest(".scroll-parent")
      ?.scrollTo({ top: height, behavior: "smooth" });
  }
};

function useUpdateRows(
  bottomRow: number,
  widgetId: string,
  parentId?: string,
  mobileBottomRow?: number,
  isMobile?: boolean,
  isAutoLayoutActive?: boolean,
) {
  // This gives us the number of rows
  const snapRows = getCanvasSnapRows(
    bottomRow,
    mobileBottomRow,
    isMobile,
    isAutoLayoutActive,
  );
  // Put the existing snap rows in a ref.
  const rowRef = useRef(snapRows);

  const dropTargetRef = useRef<HTMLDivElement>(null);

  // The occupied spaces in this canvas. It is a data structure which has the rect values of each child.
  const selectOccupiedSpaces = useCallback(
    getOccupiedSpacesSelectorForContainer(widgetId),
    [widgetId],
  );

  // Call the selector above.
  const occupiedSpacesByChildren = useSelector(selectOccupiedSpaces, equal);
  /*
   * If the parent has auto height enabled, or if the current widget is the MAIN_CONTAINER_WIDGET_ID
   */
  const isParentAutoHeightEnabled = useSelector((state: AppState) => {
    return parentId
      ? !isAutoHeightEnabledForWidgetWithLimits(
          state.entities.canvasWidgets[parentId],
        ) &&
          isAutoHeightEnabledForWidget(state.entities.canvasWidgets[parentId])
      : false;
  });
  const dispatch = useDispatch();
  // Function which computes and updates the height of the dropTarget
  // This is used in a context and hence in one of the children of this dropTarget
  const updateDropTargetRows = (
    widgetIdsToExclude: string[],
    widgetBottomRow: number,
  ) => {
    // Compute expected number of rows this drop target must have
    const newRows = calculateDropTargetRows(
      widgetIdsToExclude,
      widgetBottomRow,
      occupiedSpacesByChildren,
      widgetId,
    );
    // If the current number of rows in the drop target is less
    // than the expected number of rows in the drop target
    if (rowRef.current < newRows) {
      // Set the new value locally
      rowRef.current = newRows;
      // If the parent container like widget has auto height enabled
      // We'd like to immediately update the parent's height
      // based on the auto height computations
      // This also updates any "dropTargets" that need to change height
      // hence, this and the `updateHeight` function are mutually exclusive.
      if (isParentAutoHeightEnabled && parentId) {
        dispatch(updateDOMDirectlyBasedOnAutoHeightAction(parentId, newRows));
      } else {
        // Basically, we don't have auto height triggering, so the dropTarget height should be updated using
        // the `updateHeight` function
        // The difference here is that the `updateHeight` function only updates the "canvas" or the "dropTarget"
        // and doesn't effect the parent container

        // We can't update the height of the "Canvas" or "dropTarget" using this function
        // in the previous if clause, because, there could be more "dropTargets" updating
        // and this information can only be computed using auto height

        updateHeight(dropTargetRef, rowRef.current);
      }
      return newRows;
    }
    return false;
  };
  // memoizing context values
  const contextValue = useMemo(() => {
    return {
      updateDropTargetRows,
    };
  }, [updateDropTargetRows, occupiedSpacesByChildren]);

  /** EO PREPARE CONTEXT */
  return { contextValue, dropTargetRef, rowRef };
}

export function DropTargetComponent(props: DropTargetComponentProps) {
  // Get if this is in preview mode.
  const isPreviewMode = useSelector(previewModeSelector);
  const isAppSettingsPaneWithNavigationTabOpen = useSelector(
    getIsAppSettingsPaneWithNavigationTabOpen,
  );
  const isAutoLayoutActive = useSelector(isAutoLayoutEnabled);
  const { contextValue, dropTargetRef, rowRef } = useUpdateRows(
    props.bottomRow,
    props.widgetId,
    props.parentId,
    props.mobileBottomRow,
    props.isMobile,
    isAutoLayoutActive,
  );

  // Are we currently resizing?
  const isResizing = useSelector(
    (state: AppState) => state.ui.widgetDragResize.isResizing,
  );
  // Are we currently dragging?
  const isDragging = useSelector(
    (state: AppState) => state.ui.widgetDragResize.isDragging,
  );
  // Are we changing the auto height limits by dragging the signifiers?
  const { isAutoHeightWithLimitsChanging } = useAutoHeightUIState();

  const dispatch = useDispatch();

  // dragDetails contains of info needed for a container jump:
  // which parent the dragging widget belongs,
  // which canvas is active(being dragged on),
  // which widget is grabbed while dragging started,
  // relative position of mouse pointer wrt to the last grabbed widget.
  const dragDetails = useSelector(getDragDetails);

  const { draggedOn } = dragDetails;

  // All the widgets in this canvas
  const childWidgets: string[] | undefined = useSelector(
    (state: AppState) => state.entities.canvasWidgets[props.widgetId]?.children,
  );

  // This shows the property pane
  const showPropertyPane = useShowPropertyPane();

  const { deselectAll, focusWidget } = useWidgetSelection();

  // Everytime we get a new bottomRow, or we toggle shouldScrollContents
  // we call this effect
  useEffect(() => {
    const snapRows = getCanvasSnapRows(
      props.bottomRow,
      props.mobileBottomRow,
      props.isMobile,
      isAutoLayoutActive,
    );
    // If the current ref is not set to the new snaprows we've received (based on bottomRow)
    if (rowRef.current !== snapRows && !isDragging && !isResizing) {
      rowRef.current = snapRows;
      updateHeight(dropTargetRef, snapRows);

      // If we're done dragging, and the parent has auto height enabled
      // It is possible that the auto height has not triggered yet
      // because the user has released the mouse button but not placed the widget
      // In these scenarios, the parent's height needs to be updated
      // in the same way as the auto height would have done
      if (props.parentId) {
        dispatch(checkContainersForAutoHeightAction());
      }
    }
  }, [
    props.widgetId,
    props.bottomRow,
    props.mobileBottomRow,
    props.isMobile,
    props.parentId,
    isDragging,
    isResizing,
  ]);

  const handleFocus = (e: React.MouseEvent<HTMLElement>) => {
    // Making sure that we don't deselect the widget
    // after we are done dragging the limits in auto height with limits

    const selectionDiv = `div-selection-${MAIN_CONTAINER_WIDGET_ID}`;
    const mainCanvasId = `canvas-selection-${MAIN_CONTAINER_WIDGET_ID}`;
    const isTargetMainCanvas =
      (e.target as HTMLDivElement).dataset.testid === selectionDiv ||
      (e.target as HTMLDivElement).dataset.testid === mainCanvasId;

    if (!isResizing && !isDragging && !isAutoHeightWithLimitsChanging) {
      // Check if Target is the MainCanvas
      if (isTargetMainCanvas) {
        deselectAll();
        focusWidget && focusWidget(props.widgetId);
        showPropertyPane && showPropertyPane();
        e.preventDefault();
      } else {
        // Prevent onClick from Bubbling out of the Canvas to the WidgetEditor for any other widget except the MainCanvas
        e.stopPropagation();
      }
    }
  };

  // Get the height for the drop target
  const height = `${rowRef.current * GridDefaults.DEFAULT_GRID_ROW_HEIGHT}px`;

  const dropTargetStyles = {
    height,
  };

  const shouldOnboard =
    !(childWidgets && childWidgets.length) && !isDragging && !props.parentId;

  // The drag layer is the one with the grid dots.
  // They need to show in certain scenarios
  const showDragLayer =
    ((isDragging && draggedOn === props.widgetId) ||
      isResizing ||
      isAutoHeightWithLimitsChanging) &&
    !isPreviewMode &&
    !isAppSettingsPaneWithNavigationTabOpen &&
    !props.useAutoLayout;

  const isMainContainer = props.widgetId === MAIN_CONTAINER_WIDGET_ID;

  return (
    <DropTargetContext.Provider value={contextValue}>
      <StyledDropTarget
        className={`t--drop-target drop-target-${
          props.parentId || MAIN_CONTAINER_WIDGET_ID
        }`}
        onClick={isMainContainer ? handleFocus : undefined}
        ref={dropTargetRef}
        style={dropTargetStyles}
      >
        {props.children}
        {shouldOnboard && <Onboarding />}
        {showDragLayer && (
          <DragLayerComponent
            noPad={props.noPad || false}
            parentColumnWidth={props.snapColumnSpace}
          />
        )}
      </StyledDropTarget>
    </DropTargetContext.Provider>
  );
}

export default DropTargetComponent;
