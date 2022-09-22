import { debounce } from "lodash";
import { useCallback, useEffect, useMemo } from "react";
import { getWidgets } from "sagas/selectors";
import {
  getCurrentPageId,
  getMainCanvasProps,
} from "selectors/editorSelectors";
import { scrollbarWidth } from "utils/helpers";
import { updateCanvasLayoutAction } from "actions/editorActions";
import { calculateDynamicHeight } from "utils/DSLMigrations";
import { getIsCanvasInitialized } from "selectors/mainCanvasSelectors";
import Taro from "@tarojs/taro";

export const useDynamicAppLayout = (dispatch: any, useSelector: any) => {
  const { windowWidth: screenWidth, windowHeight: screenHeight } =
    Taro.getSystemInfoSync();
  const mainCanvasProps = useSelector(getMainCanvasProps);
  const currentPageId = useSelector(getCurrentPageId);
  const canvasWidgets = useSelector(getWidgets);
  const isCanvasInitialized = useSelector(getIsCanvasInitialized);

  /**
   * calculates min height
   */
  const calculatedMinHeight = useMemo(() => {
    return calculateDynamicHeight(canvasWidgets, mainCanvasProps?.height);
  }, [mainCanvasProps]);

  const calculateCanvasWidth = () => {
    return screenWidth - scrollbarWidth();
  };

  const resizeToLayout = () => {
    const calculatedWidth = calculateCanvasWidth();
    const { width: rightColumn } = mainCanvasProps || {};

    if (rightColumn !== calculatedWidth || !isCanvasInitialized) {
      dispatch(
        updateCanvasLayoutAction(calculatedWidth, mainCanvasProps?.height)
      );
    }
  };

  const debouncedResize = useCallback(debounce(resizeToLayout, 250), [
    mainCanvasProps,
    screenWidth,
  ]);

  /**
   * when screen height is changed, update canvas layout
   */
  useEffect(() => {
    if (calculatedMinHeight !== mainCanvasProps?.height) {
      dispatch(
        updateCanvasLayoutAction(mainCanvasProps?.width, calculatedMinHeight)
      );
    }
  }, [screenHeight, mainCanvasProps?.height]);

  useEffect(() => {
    if (isCanvasInitialized) debouncedResize();
  }, [screenWidth]);

  useEffect(() => {
    resizeToLayout();
  }, [currentPageId, mainCanvasProps?.width]);

  return isCanvasInitialized;
};
