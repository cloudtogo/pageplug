<<<<<<< HEAD
import classNames from "classnames";
import { mergeProps } from "@react-aria/utils";
import { useFocusRing } from "@react-aria/focus";
import React, { forwardRef, useRef } from "react";
import { useCheckbox } from "@react-aria/checkbox";
=======
import { mergeProps } from "@react-aria/utils";
import { useFocusRing } from "@react-aria/focus";
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
import { useHover } from "@react-aria/interactions";
import CheckIcon from "remixicon-react/CheckLineIcon";
import { useToggleState } from "@react-stately/toggle";
import { useFocusableRef } from "@react-spectrum/utils";
<<<<<<< HEAD
import type { FocusableRef } from "@react-types/shared";
import SubtractIcon from "remixicon-react/SubtractLineIcon";
import { useVisuallyHidden } from "@react-aria/visually-hidden";
import type { SpectrumCheckboxProps } from "@react-types/checkbox";

export interface CheckboxProps extends SpectrumCheckboxProps {
  icon?: React.ReactNode;
  className?: string;
=======
import SubtractIcon from "remixicon-react/SubtractLineIcon";
import React, { forwardRef, useContext, useRef } from "react";
import { useVisuallyHidden } from "@react-aria/visually-hidden";
import type { FocusableRef, StyleProps } from "@react-types/shared";
import type { SpectrumCheckboxProps } from "@react-types/checkbox";
import { useCheckbox, useCheckboxGroupItem } from "@react-aria/checkbox";

import { CheckboxGroupContext } from "./context";

export interface CheckboxProps
  extends Omit<SpectrumCheckboxProps, keyof StyleProps> {
  icon?: React.ReactNode;
  className?: string;
  labelPosition?: "left" | "right";
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
}

export type CheckboxRef = FocusableRef<HTMLLabelElement>;

export const Checkbox = forwardRef((props: CheckboxProps, ref: CheckboxRef) => {
  const {
    className,
    icon = <CheckIcon />,
    isDisabled = false,
    isIndeterminate = false,
    children,
    autoFocus,
    validationState,
  } = props;
  const state = useToggleState(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const domRef = useFocusableRef(ref, inputRef);
  const { visuallyHiddenProps } = useVisuallyHidden();
  const { hoverProps, isHovered } = useHover({ isDisabled });
<<<<<<< HEAD
  const { inputProps } = useCheckbox(props, state, inputRef);
  const { focusProps, isFocusVisible } = useFocusRing({ autoFocus });

  const computedClassnames = classNames(className, {
    "is-disabled": isDisabled,
    "is-hovered": isHovered,
    "is-checked": state.isSelected,
    "is-indeterminate": isIndeterminate,
    "is-invalid": validationState === "invalid",
    "is-focused": isFocusVisible,
  });

  return (
    <label {...hoverProps} className={computedClassnames} ref={domRef}>
=======
  const { focusProps, isFocusVisible } = useFocusRing({ autoFocus });

  // The hooks will be swapped based on whether the checkbox is a part of a CheckboxGroup.
  // Although this approach is not conventional since hooks cannot usually be called conditionally,
  // it should be safe in this case since the checkbox is not expected to be added or removed from the group.
  const groupState = useContext(CheckboxGroupContext);
  const { inputProps } = groupState
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckboxGroupItem(
        {
          ...props,
          // Value is optional for standalone checkboxes, but required for CheckboxGroup items;
          // it's passed explicitly here to avoid typescript error (requires ignore).
          // @ts-expect-error value is required in checkbox group items
          value: props.value,
          // Only pass isRequired and validationState to react-aria if they came from
          // the props for this individual checkbox, and not from the group via context.
          isRequired: props.isRequired,
          validationState: props.validationState,
        },
        groupState,
        inputRef,
      )
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckbox(props, state, inputRef);

  const dataState = isIndeterminate
    ? "indeterminate"
    : inputProps.checked
    ? "checked"
    : "unchecked";

  return (
    <label
      {...hoverProps}
      className={className}
      data-disabled={isDisabled ? "" : undefined}
      data-focussed={isFocusVisible ? "" : undefined}
      data-hovered={isHovered ? "" : undefined}
      data-invalid={validationState === "invalid" ? "" : undefined}
      data-label=""
      data-state={dataState}
      ref={domRef}
    >
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      <input
        {...mergeProps(inputProps, visuallyHiddenProps, focusProps)}
        ref={inputRef}
      />
<<<<<<< HEAD
      <span aria-hidden="true" className="icon" role="presentation">
=======
      <span aria-hidden="true" data-icon="" role="presentation">
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
        {isIndeterminate ? <SubtractIcon /> : icon}
      </span>
      {children}
    </label>
  );
});
