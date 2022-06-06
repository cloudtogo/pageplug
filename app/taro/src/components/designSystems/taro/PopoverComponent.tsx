import React, { ReactNode, useEffect, useContext } from "react";
import { styled } from "linaria/react";
import { getCanvasClassName } from "utils/generators";
import { Popup } from "@taroify/core";
import { Cross } from "@taroify/icons";
import { PopupProps } from "@taroify/core/popup/popup";
import { getShowTabBar } from "selectors/editorSelectors";
import ReduxContext from "components/common/ReduxContext";
import { transformDynamicSize } from "utils/AppsmithUtils";

const PopupContainer = styled(Popup)<
  {
    height?: number;
    showTabBar?: boolean;
  } & PopupProps
>`
  height: calc(
    ${(props) => transformDynamicSize(props.height)}px +
      ${(props) =>
        props.showTabBar ? "0px" : "constant(safe-area-inset-bottom)"}
  );
  height: calc(
    ${(props) => transformDynamicSize(props.height)}px +
      ${(props) => (props.showTabBar ? "0px" : "env(safe-area-inset-bottom)")}
  );
  overflow: visible;
  width: 100%;
  background: #fff;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

export type ModalComponentProps = {
  isOpen: boolean;
  onClose: (e: any) => void;
  onModalClose?: () => void;
  children: ReactNode;
  className?: string;
  canOutsideClickClose: boolean;
  rounded?: boolean;
  height?: number;
};

/* eslint-disable react/display-name */
export function ModalComponent(props: ModalComponentProps) {
  const { useSelector } = useContext(ReduxContext);
  const showTabBar = useSelector(getShowTabBar);
  useEffect(() => {
    return () => {
      if (props.onModalClose) props.onModalClose();
    };
  }, []);
  return (
    <PopupContainer
      open={props.isOpen}
      onClose={props.onClose}
      placement="bottom"
      height={props.height}
      rounded={props.rounded}
      showTabBar={showTabBar}
    >
      <Popup.Backdrop closeable={props.canOutsideClickClose} />
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
