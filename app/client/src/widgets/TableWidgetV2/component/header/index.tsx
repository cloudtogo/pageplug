import React from "react";
// import Actions from "./actions";
import TopActions, { topActionsPropsType } from "./top_actions";
import BottomActions, { bottomActionsPropsType } from "./bottom_actions";
import { Banner, BannerPropType } from "./banner";

export function TableHeader_Top(props: topActionsPropsType & BannerPropType) {
  const {
    accentColor,
    borderRadius,
    boxShadow,
    disabledAddNewRowSave,
    isAddRowInProgress,
    onAddNewRowAction,
    ...ActionProps
  } = props;

  return isAddRowInProgress ? (
    <Banner
      accentColor={accentColor}
      borderRadius={borderRadius}
      boxShadow={boxShadow}
      disabledAddNewRowSave={disabledAddNewRowSave}
      isAddRowInProgress={isAddRowInProgress}
      onAddNewRowAction={onAddNewRowAction}
    />
  ) : (
    <TopActions
      accentColor={accentColor}
      borderRadius={borderRadius}
      boxShadow={boxShadow}
      {...ActionProps}
    />
  );
}

export function TableHeader_Bottom(
  props: bottomActionsPropsType & BannerPropType,
) {
  const {
    accentColor,
    borderRadius,
    boxShadow,
    disabledAddNewRowSave,
    isAddRowInProgress,
    onAddNewRowAction,
    ...ActionProps
  } = props;

  return isAddRowInProgress ? (
    <Banner
      accentColor={accentColor}
      borderRadius={borderRadius}
      boxShadow={boxShadow}
      disabledAddNewRowSave={disabledAddNewRowSave}
      isAddRowInProgress={isAddRowInProgress}
      onAddNewRowAction={onAddNewRowAction}
    />
  ) : (
    <BottomActions
      accentColor={accentColor}
      borderRadius={borderRadius}
      boxShadow={boxShadow}
      {...ActionProps}
    />
  );
}
// export default TableHeader;
