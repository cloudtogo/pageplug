import React from "react";
import { createPortal } from "react-dom";
import { Popup } from "@taroify/core";
import { PopupProps } from "@taroify/core/popup/popup";
import styled from "styled-components";

const PopupContainer = styled(Popup)`
  width: 450px;
  left: unset;

  & ~ .taroify-backdrop {
    width: 450px;
    left: unset;
    right: unset;
    top: 0;
  }
`;

function PortalPopup({ children, ref, ...props }: PopupProps) {
  const popup = <PopupContainer {...props}>{children}</PopupContainer>;
  return createPortal(
    popup,
    document.getElementById("art-board") || document.body,
  );
}

export default PortalPopup;
