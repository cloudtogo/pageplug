import React, { ReactNode } from "react";
import styled from "styled-components";
import { getCanvasClassName } from "utils/generators";
import { Popup } from "@taroify/core";
import { PopupProps } from "@taroify/core/popup/popup";

const Container = styled(Popup)<
  {
    height?: number;
  } & PopupProps
>`
  height: ${(props) => props.height}px;
  max-height: 200px;
  min-height: 80px;
  overflow: visible;
  width: 450px;
  left: unset;
  background: #fff;
  z-index: 1009;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

export type BottomBarComponentProps = {
  children: ReactNode;
  className?: string;
  height?: number;
};

/* eslint-disable react/display-name */
export function BottomBarComponent(props: BottomBarComponentProps) {
  return (
    <Container
      defaultOpen
      placement="bottom"
      height={props.height}
      duration={0}
    >
      <Popup.Backdrop
        open={false}
        closeable={false}
        style={{ left: "unset", right: "unset", width: "450px" }}
      />
      <Content className={`${getCanvasClassName()} ${props.className}`}>
        {props.children}
      </Content>
    </Container>
  );
}

export default BottomBarComponent;
