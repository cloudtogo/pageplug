import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Alignment, Button, Classes, Menu, MenuItem } from "@blueprintjs/core";
import { ItemListRenderer, ItemRenderer, Select } from "@blueprintjs/select";
import { createVanIconComponent } from "@taroify/icons/van";
import VantIcons from "./IconNames";
import BaseControl, { ControlProps } from "../BaseControl";
import { TooltipComponent } from "design-system";

const IconSelectContainerStyles = createGlobalStyle<{
  targetWidth: number | undefined;
}>`
  .bp3-select-popover {
    width: ${({ targetWidth }) => targetWidth}px;

    .bp3-input-group {
      margin: 5px !important;
    }
  }
`;

const StyledButton = styled(Button)`
  box-shadow: none !important;
  border: none !important;
  border-radius: 0;
  background-color: #ffffff !important;

  .van-icon.taroify-icon {
    font-size: 18px;
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

export interface IconSelectControlProps extends ControlProps {
  propertyValue?: string;
  onIconSelected?: (icon?: string) => void;
}

export interface IconSelectControlState {
  popoverTargetWidth: number | undefined;
}

const NONE = "无";
type IconType = string | typeof NONE;
const ICON_NAMES = VantIcons;
ICON_NAMES.push(NONE);

const TypedSelect = Select.ofType<IconType>();

const renderVantIcon = (icon: string) => {
  let vantIcon = null;
  if (icon !== NONE) {
    const VantIcon = createVanIconComponent(icon);
    vantIcon = <VantIcon />;
  }
  return vantIcon;
};

class IconSelectControl extends BaseControl<
  IconSelectControlProps,
  IconSelectControlState
> {
  private iconSelectTargetRef: React.RefObject<HTMLButtonElement>;
  private timer?: number;

  constructor(props: IconSelectControlProps) {
    super(props);
    this.iconSelectTargetRef = React.createRef();
    this.state = { popoverTargetWidth: 0 };
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      const iconSelectTargetElement = this.iconSelectTargetRef.current;
      // console.log(
      //   `target width: => `,
      //   iconSelectTargetElement?.getBoundingClientRect().width,
      // );
      this.setState((prevState: IconSelectControlState) => {
        return {
          ...prevState,
          popoverTargetWidth: iconSelectTargetElement?.getBoundingClientRect()
            .width,
        };
      });
    }, 0);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  public render() {
    const { propertyValue: iconName } = this.props;
    const { popoverTargetWidth } = this.state;
    return (
      <>
        <IconSelectContainerStyles targetWidth={popoverTargetWidth} />
        <TypedSelect
          className="icon-select-container"
          itemListRenderer={this.renderMenu}
          itemPredicate={this.filterIconName}
          itemRenderer={this.renderIconItem}
          items={ICON_NAMES}
          noResults={<MenuItem disabled text="未找到相关内容" />}
          onItemSelect={this.handleIconChange}
          popoverProps={{ minimal: true }}
        >
          <StyledButton
            alignText={Alignment.LEFT}
            className={Classes.TEXT_OVERFLOW_ELLIPSIS}
            elementRef={this.iconSelectTargetRef}
            fill
            icon={renderVantIcon(iconName || "")}
            rightIcon="caret-down"
            text={iconName || NONE}
          />
        </TypedSelect>
      </>
    );
  }

  private renderMenu: ItemListRenderer<IconType> = ({
    items,
    itemsParentRef,
    renderItem,
  }) => {
    const renderedItems = items.map(renderItem).filter((item) => item != null);

    return <StyledMenu ulRef={itemsParentRef}>{renderedItems}</StyledMenu>;
  };

  private renderIconItem: ItemRenderer<string | typeof NONE> = (
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

  private filterIconName = (query: string, iconName: string | typeof NONE) => {
    if (iconName === NONE || query === "") {
      return true;
    }
    return iconName.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  private handleIconChange = (icon: IconType) => {
    const finalIcon = icon === NONE ? undefined : icon;
    this.props.onIconSelected
      ? this.props.onIconSelected(finalIcon)
      : this.updateProperty(this.props.propertyName, finalIcon);
  };

  static getControlType() {
    return "VANT_ICON_SELECT";
  }
}

export default IconSelectControl;
