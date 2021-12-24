import React from "react";
import { Button } from "@taroify/core";

interface ButtonComponentProps {
  text?: string;
  color?: string;
  onClick?: any;
  rounded?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const ButtonComponent = ({
  text,
  color,
  onClick,
  rounded,
  isDisabled,
  isLoading,
}: ButtonComponentProps) => {
  const style = {
    height: "100%",
    backgroundColor: color || "var(--primary-color)",
    color: "#fff",
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
