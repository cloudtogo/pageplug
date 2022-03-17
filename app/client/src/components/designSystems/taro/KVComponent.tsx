import React, { CSSProperties } from "react";
import { Text, View, ScrollView } from "@tarojs/components";
import _ from "lodash";
import styled from "styled-components";
import { TextSize, TEXT_SIZES } from "constants/WidgetConstants";

export interface ListComponentProps {
  list: any[];
  kKey: string;
  vKey: string;
  inset?: boolean;
  layout: "h" | "hb" | "v";
  kColor: string;
  kSize: TextSize;
  kBold: boolean;
  kAlign: string;
  vColor: string;
  vSize: TextSize;
  vBold: boolean;
  vAlign: string;
  style?: CSSProperties;
}

const Container = styled(View)<{
  inset?: boolean;
}>`
  border-radius: ${(props) => (props.inset ? "0.6rem" : "unset")};
  margin: ${(props) => (props.inset ? "0 1.2rem" : "0")};
  background: #fff;
  padding: 12px 20px;
`;

const HItem = styled(View)`
  display: flex;
  flex-direction: row;
  margin: 12px 0;

  & > :first-child {
    margin-right: 12px;
    width: 25%;
    flex-shrink: 0;
  }
`;

const HBItem = styled(View)`
  display: flex;
  flex-direction: row;
  margin: 12px 0;
  justify-content: space-between;

  & > :first-child {
    flex-shrink: 0;
    margin-right: 12px;
    max-width: 50%;
  }
`;

const VItem = styled(View)`
  display: flex;
  flex-direction: column;
  margin: 16px 0;

  & > :first-child {
    margin-bottom: 4px;
  }
`;

const StyledText = styled(Text)<{
  color: string;
  size: TextSize;
  bold: boolean;
  align: string;
}>`
  color: ${(props) => props.color};
  font-size: ${(props) => TEXT_SIZES[props.size]};
  font-weight: ${(props) => (props.bold ? "bold" : "normal")};
  text-align: ${(props) => props.align};
`;

const ListComponent = (props: ListComponentProps) => {
  const {
    list,
    kKey,
    vKey,
    layout,
    inset,
    kColor,
    kSize,
    kBold,
    kAlign,
    vColor,
    vSize,
    vBold,
    vAlign,
    style,
  } = props;
  const items = _.isArray(list) ? list : [];
  let Item = HItem;
  if (layout === "hb") {
    Item = HBItem;
  } else if (layout === "v") {
    Item = VItem;
  }

  return (
    <ScrollView style={{ height: "100%" }} scrollY>
      <Container inset={inset} style={style}>
        {items.map((item, index) => {
          const k = item?.[kKey];
          const v = item?.[vKey];
          return (
            <Item key={index}>
              <StyledText
                color={kColor}
                size={kSize}
                bold={kBold}
                align={kAlign}
              >
                {k + ""}
              </StyledText>
              <StyledText
                color={vColor}
                size={vSize}
                bold={vBold}
                align={vAlign}
              >
                {v + ""}
              </StyledText>
            </Item>
          );
        })}
      </Container>
    </ScrollView>
  );
};

export default ListComponent;
