import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Trigger from "rc-trigger";
import { Button } from "antd";
import { Icon } from "@blueprintjs/core";
import { Resizable } from "react-resizable";
import Handle from "./handler";
import Draggable from "react-draggable";
import { getPanelStyle, savePanelStyle } from "utils/AppUtils";

const Wrapper = styled.div`
  position: fixed;
  // top: 50%;
  left: 12%;
  z-index: 10;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;
  border-radius: 8px;
  background: #fff;
`;

const WrapperOverLay = styled.div`
  position: fixed;
  z-index: 10;
  border: 1px solid pink;
  border-radius: 8px;
`;
const HeaderWrapper = styled.div`
  cursor: move;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d7d9e0;
  border-radius: 8px 8px 0 0;
`;
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  color: #222222;
`;
const BodyWrapper = styled.div`
  height: calc(100% - 40px);
`;

type Position = {
  xRate: number;
  yRate: number;
};
const CodeEditorPanel = (props: any) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<Position>({
    xRate: 150,
    yRate: 150,
  });
  const panelStyle = useMemo(() => getPanelStyle(), [props.editor]);
  const [size, setSize] = useState({
    w: panelStyle.codeEditor.w,
    h: panelStyle.codeEditor.h,
  });

  const onDrag = (e: any, data: any) => {
    setCurrentPosition({ xRate: data.lastX, yRate: data.lastY });
  };

  const onHandleVisible = (v: boolean) => {
    setVisible(v);
    props.onPanelVisibleChange && props.onPanelVisibleChange(v);
  };

  return (
    <Trigger
      popupVisible={visible}
      action={["click"]}
      zIndex={50}
      popupStyle={{ opacity: 1, display: visible ? "block" : "none" }}
      maskClosable={true}
      onPopupVisibleChange={(visible) => onHandleVisible(visible)}
      // afterPopupVisibleChange={(visible) => props.onVisibleChange(visible)}
      popup={() => (
        <WrapperOverLay id="code-portal">
          <Draggable
            position={{
              x: currentPosition.xRate,
              y: currentPosition.yRate,
            }}
            onDrag={onDrag}
            handle="strong"
          >
            <Resizable
              width={size.w}
              height={size.h}
              onResize={(event, { size }) => {
                setSize({ w: size.width, h: size.height });
              }}
              onResizeStop={() =>
                savePanelStyle({
                  ...panelStyle,
                  codeEditor: { w: size.w, h: size.h },
                })
              }
              handle={Handle}
              resizeHandles={["s", "e", "se"]}
              minConstraints={[480, 360]}
            >
              <Wrapper style={{ width: size.w + "px", height: size.h + "px" }}>
                <strong className="cursor-move">
                  <HeaderWrapper>
                    <TitleWrapper>
                      <Icon icon="drag-handle-vertical" />
                      <span>{props.source}</span>
                    </TitleWrapper>
                    <Button
                      type="text"
                      size="small"
                      onClick={() => onHandleVisible(false)}
                    >
                      <span className="">
                        <Icon icon="minimize" />
                      </span>
                    </Button>
                  </HeaderWrapper>
                </strong>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <BodyWrapper>{props.editor}</BodyWrapper>
                </div>
              </Wrapper>
            </Resizable>
          </Draggable>
        </WrapperOverLay>
      )}
    >
      <div
        className={`absolute right-0 bottom-1 flex justify-end ${
          !props.isShow ? "hidden" : ""
        }`}
      >
        <Button
          className="border-l border-t border-slate-500"
          size="small"
          type="text"
          onClick={() => onHandleVisible(true)}
        >
          <span className="text-gray-500 rotate-90">
            <Icon icon="expand-all" />
          </span>
        </Button>
      </div>
    </Trigger>
  );
};

export default CodeEditorPanel;
