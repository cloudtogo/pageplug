import React from "react";
import { Button } from "@taroify/core";
import { FontWeight } from "design-system";

interface ButtonComponentProps {
  text?: string;
  color?: string;
  textColor?: string;
  fontSize?: string;
  isBold?: boolean;
  onClick?: any;
  rounded?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const ButtonComponent = ({
  text,
  color,
  textColor,
  fontSize,
  isBold,
  onClick,
  rounded,
  isDisabled,
  isLoading,
}: ButtonComponentProps) => {
  const style = {
    height: "100%",
    backgroundColor: color || "var(--primary-color)",
    color: textColor || "#fff",
    fontSize: fontSize || "20px",
    fontWeight: isBold ? FontWeight.BOLD : undefined,
    "--loading-color": textColor || "#fff",
  };
  const shape = rounded ? "round" : "square";
  return (
    <Button
      disabled={isDisabled}
      loading={!!isLoading}
      block
      style={style}
      onClick={onClick}
      shape={shape}
    >
      {text || "好的"}
    </Button>
  );
};

export default ButtonComponent;
