import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Alignment, Button, Menu, MenuItem } from "@blueprintjs/core";
import { ItemListRenderer, ItemRenderer, Select } from "@blueprintjs/select";
import { createVanIconComponent } from "@taroify/icons/van";
import {
  NONE,
  SAFE_ICON_NAMES,
} from "components/propertyControls/taro/IconNames";
import { TooltipComponent } from "design-system";

const StyledButton = styled(Button)`
  box-shadow: none !important;
  border: none !important;
  border-radius: 0;
  background: none !important;
  padding-left: 0;

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
  padding-left: 5px !important;
  padding-right: 5px !important;

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
  padding: 13px 5px;

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

export interface IconSelectProps {
  iconName?: string;
  onIconSelected?: (icon?: string) => void;
}

type IconType = string | typeof NONE;

const TypedSelect = Select.ofType<IconType>();

const renderVantIcon = (icon: string) => {
  let vantIcon = null;
  if (icon !== NONE) {
    const VantIcon = createVanIconComponent(icon);
    vantIcon = <VantIcon />;
  }
  return vantIcon;
};

const IconSelect = ({ onIconSelected, iconName }: IconSelectProps) => {
  const renderMenu: ItemListRenderer<IconType> = ({
    items,
    itemsParentRef,
    renderItem,
  }) => {
    const renderedItems = items.map(renderItem).filter((item) => item != null);

    return <StyledMenu ulRef={itemsParentRef}>{renderedItems}</StyledMenu>;
  };

  const renderIconItem: ItemRenderer<string | typeof NONE> = (
    icon,
    { handleClick, modifiers },
  ) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <TooltipComponent content={icon} key={icon}>
        <StyledMenuItem
          active={modifiers.active}
          icon={icon === NONE ? undefined : renderVantIcon(icon)}
          key={icon}
          onClick={handleClick}
          text={icon === NONE ? NONE : undefined}
        />
      </TooltipComponent>
    );
  };

  const filterIconName = (query: string, iconName: string | typeof NONE) => {
    if (iconName === NONE || query === "") {
      return true;
    }
    return iconName.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  const handleIconChange = (icon: IconType) => {
    const finalIcon = icon === NONE ? undefined : icon;
    onIconSelected && onIconSelected(finalIcon);
  };

  return (
    <TypedSelect
      className="icon-select-container"
      itemListRenderer={renderMenu}
      itemPredicate={filterIconName}
      itemRenderer={renderIconItem}
      items={SAFE_ICON_NAMES}
      noResults={<MenuItem disabled text="未找到相关内容" />}
      onItemSelect={handleIconChange}
      popoverProps={{ minimal: true }}
    >
      <StyledButton
        icon={renderVantIcon(iconName || "")}
        rightIcon="caret-down"
        text={iconName ? "" : NONE}
      />
    </TypedSelect>
  );
};

export default IconSelect;
