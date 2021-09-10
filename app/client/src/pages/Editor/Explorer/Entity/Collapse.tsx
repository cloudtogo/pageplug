import React, { ReactNode } from "react";
import styled from "styled-components";
import { Collapse } from "@blueprintjs/core";
import { Colors } from "constants/Colors";

const TRACK_WIDTH = 1;

const CollapsedContainer = styled.div<{ step: number; active?: boolean }>`
  overflow: hidden;
`;
export function EntityCollapse(props: {
  children: ReactNode;
  isOpen: boolean;
  step: number;
  active?: boolean;
}) {
  if (!props.children) return null;
  return (
    <Collapse isOpen={props.isOpen}>
      <CollapsedContainer active={props.active} step={props.step}>
        {props.children}
      </CollapsedContainer>
    </Collapse>
  );
}

export default EntityCollapse;
