import type { ReactNode } from "react";
import React, { useEffect } from "react";
import styled from "styled-components";
import { getCanvasClassName } from "utils/generators";
import { Popup } from "@taroify/core";
import { Cross } from "@taroify/icons";
import type { PopupProps } from "@taroify/core/popup/popup";

const PopupContainer = styled(Popup)<
  {
    height?: number;
  } & PopupProps
>`
  height: ${(props) => props.height}px;
  overflow: visible;
  width: 450px;
  left: unset;
  background: #fff;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

export interface ModalComponentProps {
  isOpen: boolean;
  onClose: (e: any) => void;
  onModalClose?: () => void;
  children: ReactNode;
  className?: string;
  canOutsideClickClose: boolean;
  rounded?: boolean;
  height?: number;
}

/* eslint-disable react/display-name */
export function ModalComponent(props: ModalComponentProps) {
  useEffect(() => {
    return () => {
      if (props.onModalClose) props.onModalClose();
    };
  }, []);
  return (
    <PopupContainer
      height={props.height}
      onClose={props.onClose}
      open={props.isOpen}
      placement="bottom"
      rounded={props.rounded}
    >
      <Popup.Backdrop
        closeable={props.canOutsideClickClose}
        style={{ left: "unset", right: "unset", top: "0", width: "450px" }}
      />
      <Popup.Close>
        <Cross size="24px" style={{ zIndex: 2 }} />
      </Popup.Close>
      <Content className={`${getCanvasClassName()} ${props.className}`}>
        {props.children}
      </Content>
    </PopupContainer>
  );
}

export default ModalComponent;
