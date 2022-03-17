import React from "react";
import styled from "styled-components";
import { View } from "@tarojs/components";
import { Image } from "@taroify/core";
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

    & ~ taro-view-core {
      text-align: center;
      color: #666;
      font-size: 16px;
    }
  }
`;

export interface EmptyProps {
  text?: string;
  pic?: string;
}

const Empty = ({ text, pic }: EmptyProps) => {
  return (
    <EmptyContainer>
      <View>
        <Image
          mode="aspectFit"
          fallback={<PhotoFail />}
          src={pic || "https://img.icons8.com/stickers/344/aquarium.png"}
        />
        <View>{text || "暂无数据"}</View>
      </View>
    </EmptyContainer>
  );
};

export default Empty;
