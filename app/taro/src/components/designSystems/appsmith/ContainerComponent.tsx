import React, { ReactNode, useRef, RefObject } from "react";
import { styled } from "linaria/react";
import { ComponentProps } from "./BaseComponent";
import { Color } from "constants/Colors";

const StyledContainerComponent: any = styled.div`
  height: 100%;
  width: 100%;
  background: ${(props) => props.backgroundColor || "unset"};
  opacity: ${(props) => (props.resizeDisabled ? "0.8" : "1")};
  position: relative;
  box-shadow: ${(props) =>
    props.selected ? "0px 0px 0px 3px rgba(59,130,246,0.5)" : "none"};
  z-index: ${(props) => (props.focused ? "3" : props.selected ? "2" : "1")};
`;

function ContainerComponent(props: ContainerComponentProps) {
  const containerStyle = props.containerStyle || "card";
  const containerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  return (
    <StyledContainerComponent
      {...props}
      containerStyle={containerStyle}
      // Before you remove: generateClassName is used for bounding the resizables within this canvas
      // getCanvasClassName is used to add a scrollable parent.
      ref={containerRef}
    >
      {props.children}
    </StyledContainerComponent>
  );
}

export type ContainerStyle = "border" | "card" | "rounded-border" | "none";

export interface ContainerComponentProps extends ComponentProps {
  containerStyle?: ContainerStyle;
  children?: ReactNode;
  className?: string;
  backgroundColor?: Color;
  shouldScrollContents?: boolean;
  resizeDisabled?: boolean;
  selected?: boolean;
  focused?: boolean;
  minHeight?: number;
}

export default ContainerComponent;
