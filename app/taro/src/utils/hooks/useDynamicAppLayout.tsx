import { ReduxActionTypes } from "constants/ReduxActionConstants";
import {
  DefaultLayoutType,
  layoutConfigurations,
  MAIN_CONTAINER_WIDGET_ID,
} from "constants/WidgetConstants";
import { debounce } from "lodash";
import { useCallback, useEffect } from "react";
import { AppState } from "reducers";
import { getWidget, getWidgets } from "sagas/selectors";
import {
  getCurrentApplicationLayout,
  getCurrentPageId,
} from "selectors/editorSelectors";
import { calculateDynamicHeight } from "utils/WidgetPropsUtils";
import Taro from "@tarojs/taro";

export const useDynamicAppLayout = (dispatch: any, useSelector: any) => {
  const { windowWidth: screenWidth } = Taro.getSystemInfoSync();
  const mainContainer = useSelector((state: AppState) =>
    getWidget(state, MAIN_CONTAINER_WIDGET_ID)
  );
  const currentPageId = useSelector(getCurrentPageId);
  const canvasWidgets = useSelector(getWidgets);
  const appLayout = useSelector(getCurrentApplicationLayout);

  const calculateFluidMaxWidth = (
    screenWidth: number,
    layoutMaxWidth: number
  ) => {
    const widthToFill = screenWidth;
    if (layoutMaxWidth < 0) {
      return widthToFill;
    } else {
      return widthToFill < layoutMaxWidth ? widthToFill : layoutMaxWidth;
    }
  };

  const resizeToLayout = (
    screenWidth: number,
    appLayout = { type: "FLUID" }
  ) => {
    const { type } = appLayout;
    const { minWidth = -1, maxWidth = -1 } =
      layoutConfigurations[type] || layoutConfigurations[DefaultLayoutType];
    const calculatedMinWidth = minWidth;
    const layoutWidth = calculateFluidMaxWidth(screenWidth, maxWidth);
    const { rightColumn } = mainContainer;
    if (
      (type === "FLUID" ||
        type === "MOBILE_FLUID" ||
        calculatedMinWidth <= layoutWidth) &&
      rightColumn !== layoutWidth
    ) {
      dispatch({
        type: ReduxActionTypes.UPDATE_CANVAS_LAYOUT,
        payload: {
          width: layoutWidth,
          height: mainContainer.minHeight,
        },
      });
    }
  };

  const debouncedResize = useCallback(debounce(resizeToLayout, 250), [
    mainContainer,
  ]);

  useEffect(() => {
    const calculatedMinHeight = calculateDynamicHeight(
      canvasWidgets,
      mainContainer.minHeight
    );
    if (calculatedMinHeight !== mainContainer.minHeight) {
      dispatch({
        type: ReduxActionTypes.UPDATE_CANVAS_LAYOUT,
        payload: {
          height: calculatedMinHeight,
          width: mainContainer.rightColumn,
        },
      });
    }
  }, [mainContainer.minHeight]);

  useEffect(() => {
    debouncedResize(screenWidth, appLayout);
  }, [screenWidth]);

  useEffect(() => {
    resizeToLayout(screenWidth, appLayout);
  }, [appLayout, currentPageId, mainContainer.rightColumn]);
};
