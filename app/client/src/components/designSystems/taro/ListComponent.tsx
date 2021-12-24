import React, { useState } from "react";
import { Text, View, ScrollView } from "@tarojs/components";
import { Cell, Image, Button } from "@taroify/core";
import { PhotoOutlined, ShoppingCartOutlined } from "@taroify/icons";
import _ from "lodash";
import styled from "styled-components";

export interface ListComponentProps {
  list: any[];
  contentType: "I_N_D_P_B" | "I_N_D" | "I_N_D_P";
  urlKey: string;
  titleKey: string;
  descriptionKey: string;
  priceKey?: string;
  buttonText?: string;
  inset?: boolean;
  width: string;
  height: string;
  titleColor?: string;
  descriptionColor?: string;
  priceColor?: string;
  buttonColor?: string;
}

const FreeImage = styled(Image)<{
  width: string;
  height: string;
}>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const RowCenter = styled(View)`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled(Text)<{
  color?: string;
}>`
  color: ${(props) => props.color || "#646566"};
  font-size: 16px;
`;

const Description = styled(Text)<{
  color?: string;
}>`
  color: ${(props) => props.color || "#646566"};
  font-size: 14px;
`;

const Container = styled(View)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

const Price = styled(Text)<{
  color?: string;
}>`
  color: ${(props) => props.color || "#DD4B34"};
  font-size: 14px;
`;

const BuyButton = styled(Button)<{
  bgColor?: string;
}>`
  background-color: ${(props) => props.bgColor || "#03b365"};
  color: #fff;
  font-size: 14px;
  padding: 0 8px;
`;

const ListComponent = (props: ListComponentProps) => {
  const {
    list,
    contentType,
    urlKey,
    titleKey,
    descriptionKey,
    priceKey,
    buttonText,
    inset,
    width,
    height,
    titleColor,
    descriptionColor,
    priceColor,
    buttonColor,
  } = props;
  const items = _.isArray(list) ? list : [];
  const noPrice = contentType === "I_N_D";
  const hasButton = contentType === "I_N_D_P_B";

  const onClickButton = (item: any) => (e: any) => {
    e.stopPropagation();
  };

  const onClickItem = (item: any) => (e: any) => {
    console.log(item);
  };

  return (
    <ScrollView style={{ height: "100%" }} scrollY>
      <Cell.Group inset={inset}>
        {items.map((item, index) => {
          const url = item[urlKey];
          const title = item[titleKey] || "";
          const description = item[descriptionKey] || "描述";
          const price = `￥${item[priceKey || ""] || "168"}`;
          const image = url ? (
            <FreeImage
              src={url}
              height={height}
              width={width}
              mode="aspectFill"
            />
          ) : (
            <PhotoOutlined
              size={height > width ? height : width}
              style={{ height, width }}
            />
          );
          const priceView = <Price color={priceColor}>{price}</Price>;
          return (
            <Cell key={index} onClick={onClickItem(item)} icon={image}>
              <RowCenter>
                <Title color={titleColor}>{title}</Title>
                <View>
                  <Description color={descriptionColor}>
                    {description}
                  </Description>
                </View>
                {noPrice ? null : (
                  <Container>
                    {priceView}
                    {hasButton ? (
                      <BuyButton
                        bgColor={buttonColor}
                        size="mini"
                        shape="round"
                        onClick={onClickButton(item)}
                      >
                        {buttonText || <ShoppingCartOutlined />}
                      </BuyButton>
                    ) : null}
                  </Container>
                )}
              </RowCenter>
            </Cell>
          );
        })}
      </Cell.Group>
    </ScrollView>
  );
};

export default ListComponent;
