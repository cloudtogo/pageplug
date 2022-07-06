import React from "react";
import { Swiper, Image } from "@taroify/core";
import { PhotoFail } from "@taroify/icons";
import _ from "lodash";
import styled from "styled-components";

interface SwiperComponentProps {
  list: any[];
  urlKey: string;
}

const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fff;
  background: var(--primary-color);
  height: 100%;
`;

const SwiperComponent = (props: SwiperComponentProps) => {
  const { list, urlKey } = props;
  const items = _.isArray(list) ? list : [];
  const key = urlKey + items.length;
  return (
    <Swiper style={{ height: "100%", width: "100%" }} autoplay={4000} key={key}>
      <Swiper.Indicator />
      {items.map((item, index) => {
        const url = _.isString(item) ? item : item?.[urlKey];
        const content = url ? (
          <Image
            src={url}
            mode="aspectFit"
            fallback={<PhotoFail />}
            style={{ pointerEvents: "none" }}
          />
        ) : (
          <Empty>{index + 1}</Empty>
        );
        return <Swiper.Item key={index}>{content}</Swiper.Item>;
      })}
    </Swiper>
  );
};

export default SwiperComponent;
