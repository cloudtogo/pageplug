import styled, { css } from "styled-components";
import { Checkbox as HeadlessCheckbox } from "@design-system/headless";

import type { CheckboxProps } from ".";

// Note: these styles will shared across radio, checkbox and toggle components
// so we will be moving the types (labelPosition) and styles to a common place
export const labelStyles = css<Pick<CheckboxProps, "labelPosition">>`
  position: relative;
  display: flex;
  gap: var(--spacing-2);
<<<<<<< HEAD
  width: 100%;
=======
  cursor: pointer;
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f

  ${({ labelPosition }) => css`
    justify-content: ${labelPosition === "left" ? "space-between" : undefined};
    flex-direction: ${labelPosition === "left" ? "row-reverse" : "row"};
  `};

<<<<<<< HEAD
  .label {
=======
  &[data-label] {
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
    min-height: calc(5 * var(--sizing-root-unit));
    display: flex;
    align-items: center;
  }
<<<<<<< HEAD
=======

  /**
  * ----------------------------------------------------------------------------
  * DISABLED
  *-----------------------------------------------------------------------------
  */
  &[data-disabled] {
    pointer-events: none;
    opacity: var(--opacity-disabled);
  }
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
`;

export const StyledCheckbox = styled(HeadlessCheckbox)<CheckboxProps>`
  ${labelStyles}

<<<<<<< HEAD
  .icon {
=======
  [data-icon] {
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
    width: calc(5 * var(--sizing-root-unit));
    height: calc(5 * var(--sizing-root-unit));
    border-width: var(--border-width-1);
    border-style: solid;
    border-radius: var(--border-radius-1);
    border-color: var(--color-bd-neutral);
    color: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    flex-shrink: 0;
  }

<<<<<<< HEAD
  &.is-hovered:not(.is-disabled) .icon {
=======
  &[data-hovered]:not([data-disabled]) [data-icon] {
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
    border-color: var(--color-bd-neutral-hover);
  }

  /**
 * ----------------------------------------------------------------------------
 * CHECKED  AND INDETERMINATE - BUT NOT DISABLED
 *-----------------------------------------------------------------------------
 */
<<<<<<< HEAD
  &.is-checked .icon,
  &.is-indeterminate .icon {
=======
  &[data-state="checked"] [data-icon],
  &[data-state="indeterminate"] [data-icon] {
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
    background-color: var(--color-bg-accent);
    border-color: var(--color-bg-accent);
    color: var(--color-fg-on-accent);
  }

<<<<<<< HEAD
  &.is-hovered.is-checked:not(.is-disabled) .icon,
  &.is-hovered.is-indeterminate:not(.is-disabled) .icon {
=======
  &[data-hovered][data-state="checked"]:not([data-disabled]) [data-icon],
  &[data-hovered][data-state="indeterminate"]:not([data-disabled]) [data-icon] {
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
    border-color: var(--color-bg-accent-hover);
    background-color: var(--color-bg-accent-hover);
    color: var(--color-fg-on-accent);
  }

  /**
  * ----------------------------------------------------------------------------
<<<<<<< HEAD
  * DISABLED
  *-----------------------------------------------------------------------------
  */
  &.is-disabled {
    cursor: not-allowed;
  }

  &.is-disabled {
    opacity: var(--opacity-disabled);
  }

  /**
  * ----------------------------------------------------------------------------
  * FOCUS
  *-----------------------------------------------------------------------------
  */
  &.is-focused .icon {
=======
  * FOCUS
  *-----------------------------------------------------------------------------
  */
  &[data-focused] [data-icon] {
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
    box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-bd-focus);
  }

  /**
 * ----------------------------------------------------------------------------
 * ERROR ( INVALID )
 *-----------------------------------------------------------------------------
 */
<<<<<<< HEAD
  &.is-invalid .icon {
    border-color: var(--color-bd-negative);
  }

  &.is-hovered.is-invalid .icon {
=======
  &[data-invalid] [data-icon] {
    border-color: var(--color-bd-negative);
  }

  &[data-hovered][data-invalid] [data-icon] {
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
    border-color: var(--color-bd-negative-hover);
  }
`;
