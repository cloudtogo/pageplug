import React, { useMemo } from "react";
import { Popover } from "antd";
import { Menu, MenuItem, Button } from "@blueprintjs/core";
import styled from "styled-components";
import {
  NONE,
  SAFE_ICON_NAMES,
} from "components/propertyControls/taro/IconNames";
import { createVanIconComponent } from "@taroify/icons/van";

export interface IconSelectProps {
  iconName?: string;
  onIconSelected?: (icon?: string) => void;
}

const StyledButton = styled(Button)`
  box-shadow: none !important;
  border: none !important;
  border-radius: 0;
  background: none !important;
  padding-left: 0;
  height: 24px;
  width: 48px;

  .van-icon.taroify-icon {
    font-size: 18px;
    margin-right: 4px;
  }

  > span.bp3-icon-caret-down {
    color: rgb(169, 167, 167);
  }
`;

const StyledMenu = styled(Menu)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(50px, auto);
  gap: 8px;
  max-height: 170px !important;
  padding-left: 3px !important;
  padding-right: 3px !important;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
    background-color: #eeeeee;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #939090;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  flex-direction: column;
  align-items: center;
  padding: 8px 5px;

  &:active,
  &:hover,
  &.bp3-active {
    background-color: #eeeeee !important;
  }

  .van-icon.taroify-icon {
    margin-right: 0;
    font-size: 20px;
    color: #555 !important;
  }
  > div {
    width: 100%;
    text-align: center;
    color: #939090 !important;
  }
`;

export const renderVantIcon = (icon: string) => {
  let vantIcon = null;
  if (icon !== NONE) {
    const VantIcon = createVanIconComponent(icon);
    vantIcon = <VantIcon />;
  }
  return vantIcon;
};

const IconSelect = ({ iconName, onIconSelected }: any) => {
  const handleClick = (targetIcon: string) => {
    onIconSelected && onIconSelected(targetIcon);
  };

  const content = useMemo(() => {
    return (
      <StyledMenu>
        {SAFE_ICON_NAMES.map((icon) => {
          return (
            <StyledMenuItem
              active={icon === iconName}
              icon={icon === NONE ? undefined : renderVantIcon(icon)}
              key={icon}
              onClick={() => handleClick(icon)}
              text={icon === NONE ? NONE : undefined}
            />
          );
        })}
      </StyledMenu>
    );
  }, [iconName]);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      style={{
        display: "inline-block",
      }}
    >
      <Popover
        content={content}
        overlayInnerStyle={{ padding: 0 }}
        trigger="click"
      >
        <StyledButton
          icon={renderVantIcon(iconName || "")}
          rightIcon="caret-down"
          text={iconName ? "" : NONE}
        />
      </Popover>
    </div>
  );
};

export default React.memo(
  IconSelect,
  (prevProps, nextProps) => prevProps.iconName === nextProps.iconName,
);
