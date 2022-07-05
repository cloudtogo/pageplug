import React, { useContext, useMemo } from "react";
import clsx from "clsx";
import { ActionBarProps } from "./PropsType";
import ActionBarContext from "./ActionBarContext";
import { BEM, createBEM } from "../../rvStyle/bem";

const ActionBar: React.FC<ActionBarProps> = (props: any) => {
  const bem = createBEM("rv-action-bar");
  const children = useMemo(() => React.Children.toArray(props.children), [
    props.children,
  ]);

  return (
    <ActionBarContext.Provider value={{ parent: { children } }}>
      <div
        className={clsx(props.className, bem(), {
          "rv-safe-area-bottom": props.safeAreaInsetBottom,
        })}
        style={props.style}
      >
        {React.Children.toArray(props.children)
          .filter(Boolean)
          .map((child: any, index: number) =>
            React.cloneElement(child, {
              index,
            }),
          )}
      </div>
    </ActionBarContext.Provider>
  );
};

ActionBar.defaultProps = {
  safeAreaInsetBottom: true,
};

export default ActionBar;
