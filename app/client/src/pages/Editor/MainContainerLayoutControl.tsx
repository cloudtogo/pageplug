import { updateApplicationLayout } from "actions/applicationActions";
import Dropdown from "components/ads/Dropdown";
import Icon, { IconName, IconSize } from "components/ads/Icon";
import { Colors } from "constants/Colors";
import React from "react";
import { useDispatch } from "react-redux";
import {
  AppLayoutConfig,
  SupportedLayouts,
} from "reducers/entityReducers/pageListReducer";
import {
  getCurrentApplicationId,
  getCurrentApplicationLayout,
} from "selectors/editorSelectors";
import { useSelector } from "store";
import styled from "styled-components";
import { noop } from "utils/AppsmithUtils";
import ToggleLayoutEditorButton from "./ToggleLayoutEditorButton";

interface AppsmithLayoutConfigOption {
  name: string;
  type: SupportedLayouts;
  icon?: IconName;
}

export const AppsmithDefaultLayout: AppLayoutConfig = {
  type: "DESKTOP",
};

const AppsmithLayouts: AppsmithLayoutConfigOption[] = [
  {
    name: "桌面宽度",
    ...AppsmithDefaultLayout,
    icon: "desktop",
  },
  // {
  //   name: "Tablet(Large)",
  //   type: "TABLET_LARGE",
  //   icon: "tablet",
  // },
  {
    name: "平板宽度",
    type: "TABLET",
    icon: "tablet",
  },
  // {
  //   name: "手机宽度",
  //   type: "MOBILE",
  //   icon: "mobile",
  // },
  {
    name: "自适应宽度",
    type: "FLUID",
    icon: "fluid",
  },
];

const LayoutControlWrapper = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  .bp3-popover-target {
    pointer-events: none;
  }
  .layout-control {
    pointer-events: all;
    cursor: pointer;
    font-size: 14px;
    border: none;
    box-shadow: none;
  }
`;

const EmptyBlock = styled.div`
  height: 30px;
`;

export function MainContainerLayoutControl() {
  const appId = useSelector(getCurrentApplicationId);
  const appLayout = useSelector(getCurrentApplicationLayout);
  const isMobile = appLayout?.type === "MOBILE_FLUID";
  const layoutOptions = AppsmithLayouts.map((each) => {
    return {
      ...each,
      iconSize: IconSize.SMALL,
      iconColor: Colors.BLACK,
      value: each.name,
      onSelect: () =>
        updateAppLayout({
          type: each.type,
        }),
    };
  });
  const selectedLayout = appLayout
    ? layoutOptions.find((each) => each.type === appLayout.type)
    : layoutOptions[0];

  const dispatch = useDispatch();
  const updateAppLayout = (layoutConfig: AppLayoutConfig) => {
    const { type } = layoutConfig;
    dispatch(
      updateApplicationLayout(appId || "", {
        appLayout: {
          type,
        },
      }),
    );
  };

  if (isMobile) {
    return <EmptyBlock />;
  }
  return (
    <LayoutControlWrapper>
      <ToggleLayoutEditorButton />
      <div className="layout-control t--layout-control-wrapper">
        <Dropdown
          SelectedValueNode={({ selected }) => {
            return (
              <Icon
                fillColor={Colors.BLACK}
                name={selected.icon}
                size={selected.iconSize || IconSize.SMALL}
              />
            );
          }}
          optionWidth="120"
          className="layout-control"
          onSelect={noop}
          options={layoutOptions}
          selected={selectedLayout || layoutOptions[0]}
          showDropIcon={false}
          width={"30px"}
        />
      </div>
    </LayoutControlWrapper>
  );
}
