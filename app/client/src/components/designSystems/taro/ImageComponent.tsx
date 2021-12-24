import React from "react";
import { Image } from "@taroify/core";

interface ImageComponentProps {
  imageUrl: string;
  mode: any;
  onClick?: any;
  isCircle?: boolean;
  radius?: string;
}

const ImageComponent = ({
  imageUrl,
  mode,
  onClick,
  isCircle,
  radius,
}: ImageComponentProps) => {
  const style = {
    height: "100%",
    width: "100%",
    borderRadius: radius,
  };
  return (
    <Image
      src={imageUrl}
      style={style}
      mode={mode}
      onClick={onClick}
      round={isCircle}
    />
  );
};

export default ImageComponent;
