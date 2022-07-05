import React, { useCallback, useState } from "react";
import { Text, View, ScrollView } from "@tarojs/components";
import {
  Cell,
  Image,
  Button,
  Checkbox,
  SwipeCell,
  Stepper,
} from "@taroify/core";
import { PhotoOutlined, ShoppingCartOutlined, PhotoFail } from "@taroify/icons";
import _ from "lodash";
import styled from "styled-components";
import Empty from "../../EmptyContent";

export interface ListComponentProps {
  enableCheckbox: boolean;
  enableSwipe: boolean;
  list: any[];
  contentType: "I_N_D_P_B" | "I_N_D" | "I_N_D_P";
  urlKey: string;
  titleKey: string;
  descriptionKey: string;
  priceKey?: string;
  checkedKey?: string;
  controlType?: "TEXT" | "BUTTON" | "STEPPER";
  controlTextKey?: string;
  buttonText?: string;
  defaultNumKey?: string;
  inset?: boolean;
  width: string;
  height: string;
  titleColor?: string;
  descriptionColor?: string;
  priceColor?: string;
  textColor?: string;
  buttonColor?: string;
  onItemClicked: (
    item: any,
    type: "ITEM" | "BUTTON" | "STEPPER" | "CHECKBOX" | "DELETE",
  ) => void;
  runAction: (acton: string) => void;
  emptyPic?: string;
  emptyText?: string;
  enableEmptyButton?: boolean;
  emptyButtonText?: string;
  emptyButtonAction?: string;
}

const ColCell = styled(Cell)`
  & .taroify-cell__value {
    display: flex;
    flex: 1;
  }

  & .taroify-checkbox {
    margin-right: 10px;
  }
`;

const FreeImage = styled(Image)<{
  width: string;
  height: string;
}>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  pointer-events: none;
`;

const RowCenter = styled(View)`
  flex: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
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

const ControlText = styled(Text)<{
  color?: string;
}>`
  color: ${(props) => props.color || "#333"};
  font-size: 16px;
`;

const BuyButton = styled(Button)<{
  bgColor?: string;
}>`
  background-color: ${(props) => props.bgColor || "#03b365"};
  color: #fff;
  font-size: 14px;
  padding: 0 8px;

  & .taroify-button__icon--right {
    margin-right: 0;
  }
`;

const SwipeCellContainer = styled.div`
  & .taroify-swipe-cell__actions {
    right: -1px;

    .taroify-button {
      height: 100%;
    }
  }
`;

const Center = styled(View)`
  align-self: center;
`;

const ListComponent = (props: ListComponentProps) => {
  const [moved, setMoved] = useState(false);
  const {
    enableCheckbox,
    enableSwipe,
    list,
    contentType,
    urlKey,
    titleKey,
    descriptionKey,
    priceKey,
    checkedKey,
    buttonText,
    controlType,
    controlTextKey,
    defaultNumKey,
    inset,
    width,
    height,
    titleColor,
    descriptionColor,
    priceColor,
    buttonColor,
    textColor,
    onItemClicked,
    runAction,
    emptyPic,
    emptyText,
    enableEmptyButton,
    emptyButtonText,
    emptyButtonAction,
  } = props;
  const items = _.isArray(list) ? list : [];
  const noPrice = contentType === "I_N_D";
  const hasControl = contentType === "I_N_D_P_B";

  const onClickButton = (item: any) => (e: any) => {
    e.stopPropagation();
    onItemClicked(item, "BUTTON");
  };

  const onClickItem = (item: any) => (e: any) => {
    onItemClicked(item, "ITEM");
  };

  const onStepperChanged = (item: any) => (v: any) => {
    if (defaultNumKey) {
      onItemClicked(
        {
          ...item,
          [defaultNumKey]: v,
        },
        "STEPPER",
      );
    }
  };

  const onCheckChanged = (item: any) => (v: any) => {
    if (checkedKey) {
      onItemClicked(
        {
          ...item,
          [checkedKey]: v,
        },
        "CHECKBOX",
      );
    }
  };

  const stopPropagation = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  const notMe = {
    onTouchStart: stopPropagation,
    onTouchEnd: stopPropagation,
    onTouchMove: stopPropagation,
  };

  const makeCell = (item: any, index: number) => {
    const url = item?.[urlKey];
    const image = url ? (
      <FreeImage
        src={url}
        height={height}
        width={width}
        mode="aspectFit"
        fallback={<PhotoFail />}
      />
    ) : (
      <PhotoOutlined
        size={height > width ? height : width}
        style={{ height, width }}
      />
    );

    const title = item?.[titleKey] || "";
    let description = item?.[descriptionKey] || "描述";
    description = _.isArray(description) ? description.join(", ") : description;
    const price = `￥${item?.[priceKey || ""] || "168"}`;
    const controlText = item?.[controlTextKey || ""] || "x 3";
    const defaultNum = item?.[defaultNumKey || ""] || 1;
    const priceView = <Price color={priceColor}>{price}</Price>;
    const checked = item?.[checkedKey || ""] || false;
    const checkbox = enableCheckbox ? (
      <Checkbox
        name={index}
        checked={checked}
        onChange={onCheckChanged(item)}
        {...notMe}
      />
    ) : null;
    let control = null;
    switch (controlType) {
      case "TEXT":
        control = <ControlText color={textColor}>{controlText}</ControlText>;
        break;
      case "BUTTON":
        control = (
          <BuyButton
            bgColor={buttonColor}
            size="mini"
            shape="round"
            onClick={onClickButton(item)}
          >
            {buttonText || <ShoppingCartOutlined />}
          </BuyButton>
        );
        break;
      case "STEPPER":
        control = (
          <Stepper
            value={defaultNum}
            size={28}
            onChange={onStepperChanged(item)}
            onClick={stopPropagation}
            longPress={false}
          />
        );
        break;
    }
    return (
      <ColCell
        onClick={enableSwipe ? undefined : onClickItem(item)}
        key={index}
      >
        <Center onClick={stopPropagation}>{checkbox}</Center>
        {image}
        <RowCenter>
          <Title color={titleColor}>{title}</Title>
          <View>
            <Description color={descriptionColor}>{description}</Description>
          </View>
          {noPrice ? null : (
            <Container>
              {priceView}
              {hasControl ? <View {...notMe}>{control}</View> : null}
            </Container>
          )}
        </RowCenter>
      </ColCell>
    );
  };

  const onClickDelete = (item: any) => (e: any) => {
    e.stopPropagation();
    onItemClicked(item, "DELETE");
  };

  const swipeTouchEnd = (item: any) => () => {
    if (!moved) {
      onClickItem(item)({});
    }
    setMoved(false);
  };

  const swipeTouchMove = () => {
    if (!moved) {
      setMoved(true);
    }
  };

  const makeSwipe = (content: React.ReactNode, item: any, index: number) => {
    return (
      <SwipeCellContainer
        key={index + `${item?.id}`}
        onTouchMove={stopPropagation}
        onMouseMove={stopPropagation}
      >
        <SwipeCell
          onTouchEnd={swipeTouchEnd(item)}
          onTouchMove={swipeTouchMove}
        >
          {content}
          <SwipeCell.Actions side="right" {...notMe}>
            <Button
              variant="contained"
              shape="square"
              color="danger"
              onClick={onClickDelete(item)}
            >
              删除
            </Button>
          </SwipeCell.Actions>
        </SwipeCell>
      </SwipeCellContainer>
    );
  };

  const makeCheckboxGroup = (content: React.ReactNode) => {
    if (enableCheckbox) {
      return <Checkbox.Group>{content}</Checkbox.Group>;
    }
    return content;
  };

  const cellGroup = (
    <Cell.Group inset={inset}>
      {items.map((item, index) => {
        let content = makeCell(item, index);
        if (enableSwipe) {
          content = makeSwipe(content, item, index);
        }
        return content;
      })}
    </Cell.Group>
  );

  if (!items.length) {
    return (
      <Empty
        text={emptyText}
        pic={emptyPic}
        enableButton={enableEmptyButton}
        buttonText={emptyButtonText}
        onClick={() => runAction(emptyButtonAction || "")}
      />
    );
  }

  return (
    <ScrollView style={{ height: "100%" }} scrollY>
      {makeCheckboxGroup(cellGroup)}
    </ScrollView>
  );
};

export default ListComponent;
