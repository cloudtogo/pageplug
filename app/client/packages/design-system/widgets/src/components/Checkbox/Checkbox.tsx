import React, { forwardRef } from "react";

import type {
  CheckboxRef as HeadlessCheckboxRef,
  CheckboxProps as HeadlessCheckboxProps,
} from "@design-system/headless";

import { Text } from "../Text";
import { StyledCheckbox } from "./index.styled";

<<<<<<< HEAD
export type CheckboxProps = HeadlessCheckboxProps & {
  labelPosition?: "left" | "right";
};
=======
export type CheckboxProps = HeadlessCheckboxProps;
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f

export const Checkbox = forwardRef(
  (props: CheckboxProps, ref: HeadlessCheckboxRef) => {
    const { children, labelPosition = "right", ...rest } = props;

    return (
      <StyledCheckbox labelPosition={labelPosition} ref={ref} {...rest}>
<<<<<<< HEAD
        {children && <Text className="label">{children}</Text>}
=======
        {children && (
          <div className="label">
            <Text>{children}</Text>
          </div>
        )}
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      </StyledCheckbox>
    );
  },
);
