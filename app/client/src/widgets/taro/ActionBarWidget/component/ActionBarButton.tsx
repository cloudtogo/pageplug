import React, { useContext, useMemo } from "react";
import clsx from "clsx";
import { ActionBarButtonProps } from "./PropsType";
import { Button } from "@taroify/core";
import ActionBarContext from "./ActionBarContext";
import { BEM, createBEM } from "../../rvStyle/bem";

const ActionBarButton: React.FC<ActionBarButtonProps> = (props) => {
  const { type, icon, text, color, loading, disabled, index } = props;
  const bem = createBEM("rv-action-bar-button");
  const { parent } = useContext(ActionBarContext);

  const isFirst = useMemo(() => {
    if (parent && typeof index !== "undefined") {
      const prev = parent.children[index - 1];
      return !(prev && "isButton" in prev.type);
    }
    return false;
  }, [index, parent]);

  const isLast = useMemo(() => {
    if (parent && typeof index !== "undefined") {
      const next = parent.children[index + 1];
      return !(next && "isButton" in next.type);
    }
    return false;
  }, [index, parent]);

  const style = {
    "--rv-action-bar-theme-color": color || "unset",
    ...props.style,
  };

  return (
    <Button
      className={clsx(
        props.className,
        bem([
          type,
          {
            last: isLast,
            first: isFirst,
          },
        ]),
      )}
      style={style}
      size="large"
      icon={icon}
      color={type}
      loading={loading}
      disabled={disabled}
      onClick={props.onClick}
    >
      {props.children ? props.children : text}
    </Button>
  );
};

const ActionBarButtonNameSpace = Object.assign(ActionBarButton, {
  isButton: true,
});

export default ActionBarButtonNameSpace;
