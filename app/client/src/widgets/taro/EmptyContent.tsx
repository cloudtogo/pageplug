import React from "react";
import styled from "styled-components";
import { View } from "@tarojs/components";
import { Image, Button } from "@taroify/core";
import { PhotoFail } from "@taroify/icons";

const EmptyContainer = styled(View)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .taroify-image {
    width: 200px;
    height: 200px;
  }
`;

const EmptyText = styled(View)`
  text-align: center;
  color: #666;
  font-size: 16px;
`;

const EmptyButton = styled(Button)`
  margin-top: 8px;
`;

export interface EmptyProps {
  text?: string;
  pic?: string;
  enableButton?: boolean;
  buttonText?: string;
  onClick: () => void;
}

const Empty = ({
  text,
  pic,
  enableButton,
  buttonText,
  onClick,
}: EmptyProps) => {
  return (
    <EmptyContainer>
      <View>
        <Image
          mode="aspectFit"
          fallback={<PhotoFail />}
          src={pic || "https://img.icons8.com/stickers/344/aquarium.png"}
        />
        <EmptyText>{text || "暂无数据"}</EmptyText>
        {enableButton ? (
          <EmptyButton onClick={onClick} color="primary" block>
            {buttonText || "登录"}
          </EmptyButton>
        ) : null}
      </View>
    </EmptyContainer>
  );
};

export default Empty;
