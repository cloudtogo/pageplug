import React, { useContext, useMemo } from "react";
import clsx from "clsx";
import type { ActionBarButtonProps } from "./PropsType";
import { Button } from "@taroify/core";
import ActionBarContext from "./ActionBarContext";
import { createBEM } from "../../rvStyle/bem";

const ActionBarButton: React.FC<ActionBarButtonProps> = (props) => {
  const { color, disabled, icon, index, loading, text, type } = props;
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
      color={type}
      disabled={disabled}
      icon={icon}
      loading={loading}
      onClick={props.onClick}
      size="large"
      style={style}
    >
      {props.children ? props.children : text}
    </Button>
  );
};

const ActionBarButtonNameSpace = Object.assign(ActionBarButton, {
  isButton: true,
});

export default ActionBarButtonNameSpace;
