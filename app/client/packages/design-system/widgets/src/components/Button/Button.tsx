import React, { forwardRef } from "react";
<<<<<<< HEAD
import { Text } from "../Text";
import { Spinner } from "../Spinner";
import { StyledButton } from "./index.styled";
import type { fontFamilyTypes } from "../../utils/typography";
=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
import type {
  ButtonProps as HeadlessButtonProps,
  ButtonRef as HeadlessButtonRef,
} from "@design-system/headless";

<<<<<<< HEAD
=======
import { Text } from "../Text";
import { Spinner } from "../Spinner";
import { StyledButton } from "./index.styled";
import type { fontFamilyTypes } from "../../utils/typography";

>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
export type ButtonVariants = "primary" | "secondary" | "tertiary";

export interface ButtonProps extends Omit<HeadlessButtonProps, "className"> {
  /**
   *  @default primary
   */
  variant?: ButtonVariants;
<<<<<<< HEAD
  children?: React.ReactNode;
  isDisabled?: boolean;
=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
  isLoading?: boolean;
  fontFamily?: fontFamilyTypes;
  isFitContainer?: boolean;
  isFocused?: boolean;
<<<<<<< HEAD
=======
  iconPosition?: "start" | "end";
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
}

export const Button = forwardRef(
  (props: ButtonProps, ref: HeadlessButtonRef) => {
    const {
      children,
      fontFamily,
      isFitContainer = false,
      isLoading,
      // eslint-disable-next-line -- TODO add onKeyUp when the bug is fixedhttps://github.com/adobe/react-spectrum/issues/4350
      onKeyUp,
      variant = "primary",
      ...rest
    } = props;

<<<<<<< HEAD
    return (
      <StyledButton
        data-fit-container={isFitContainer}
        data-focus={isFocused}
        data-loading={isLoading}
=======
    const renderChildren = () => {
      if (isLoading) {
        return <Spinner />;
      }

      return (
        <Text fontFamily={fontFamily} lineClamp={1}>
          {children}
        </Text>
      );
    };

    return (
      <StyledButton
        data-fit-container={isFitContainer ? "" : undefined}
        data-loading={isLoading ? "" : undefined}
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
        data-variant={variant}
        ref={ref}
        {...rest}
      >
<<<<<<< HEAD
        {isLoading && <Spinner />}

        {!isLoading && (
          <Text fontFamily={fontFamily} lineClamp={1}>
            {children}
          </Text>
        )}
=======
        {renderChildren()}
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      </StyledButton>
    );
  },
);
