import React, { isValidElement } from "react";
import clsx from "clsx";
import type { ActionBarIconProps } from "./PropsType";
import { createVanIconComponent } from "@taroify/icons/van";
import { Badge } from "@taroify/core";
import { createBEM } from "../../rvStyle/bem";

const ActionBarIcon: React.FC<ActionBarIconProps> = (props) => {
  const bem = createBEM("rv-action-bar-icon");

  const renderIcon = () => {
    const { badge, color, icon } = props;
    let iconContent = icon;
    if (typeof icon === "string") {
      const Icon = createVanIconComponent(icon);
      iconContent = <Icon color={color} size={20} />;
    }
    if (isValidElement(iconContent)) {
      return <Badge {...badge}>{iconContent}</Badge>;
    }
    return null;
  };

  return (
    <div
      className={clsx(props.className, bem())}
      onClick={props.onClick}
      role="button"
      style={props.style}
      tabIndex={0}
    >
      {renderIcon()}
      {props.children || props.text}
    </div>
  );
};

export default ActionBarIcon;
