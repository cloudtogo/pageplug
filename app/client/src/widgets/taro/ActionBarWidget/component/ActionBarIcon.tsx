import React, { isValidElement } from "react";
import clsx from "clsx";
import { ActionBarIconProps } from "./PropsType";
import { createVanIconComponent } from "@taroify/icons/van";
import { Badge } from "@taroify/core";
import { BEM, createBEM } from "../../rvStyle/bem";

const ActionBarIcon: React.FC<ActionBarIconProps> = (props) => {
  const bem = createBEM("rv-action-bar-icon");

  const renderIcon = () => {
    const { badge, icon, color } = props;
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
      role="button"
      className={clsx(props.className, bem())}
      style={props.style}
      tabIndex={0}
      onClick={props.onClick}
    >
      {renderIcon()}
      {props.children || props.text}
    </div>
  );
};

export default ActionBarIcon;
