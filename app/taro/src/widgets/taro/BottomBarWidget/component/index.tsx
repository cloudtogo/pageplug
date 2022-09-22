import React, { ReactNode, useContext } from "react";
import { styled } from "linaria/react";
import { getCanvasClassName } from "utils/generators";
import { Popup } from "@taroify/core";
import { PopupProps } from "@taroify/core/popup/popup";
import { getShowTabBar } from "selectors/editorSelectors";
import ReduxContext from "components/common/ReduxContext";
import { transformDynamicSize } from "utils/AppsmithUtils";

const Container = styled(Popup)<
  {
    height: number;
    showTabBar: boolean;
  } & PopupProps
>`
  height: calc(
    ${(props) => transformDynamicSize(props.height)} +
      ${(props) =>
        props.showTabBar ? "0px" : "constant(safe-area-inset-bottom)"}
  );
  height: calc(
    ${(props) => transformDynamicSize(props.height)} +
      ${(props) => (props.showTabBar ? "0px" : "env(safe-area-inset-bottom)")}
  );
  max-height: 200px;
  min-height: 80px;
  overflow: visible;
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
  height: number;
};

/* eslint-disable react/display-name */
export function BottomBarComponent(props: BottomBarComponentProps) {
  const { useSelector } = useContext(ReduxContext);
  const showTabBar = useSelector(getShowTabBar);
  return (
    <Container
      defaultOpen
      placement="bottom"
      height={props.height}
      duration={0}
      showTabBar={showTabBar}
    >
      <Popup.Backdrop open={false} closeable={false} />
      <Content className={`${getCanvasClassName()} ${props.className}`}>
        {props.children}
      </Content>
    </Container>
  );
}

export default BottomBarComponent;
