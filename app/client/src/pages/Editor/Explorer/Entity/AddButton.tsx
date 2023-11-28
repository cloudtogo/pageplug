import React from "react";
import styled from "styled-components";
import { Button, Icon } from "design-system";

const Wrapper = styled.div`
  height: 36px;
  width: 30px;

  &.selected {
    background-color: var(--ads-v2-color-bg-muted);
    border-radius: var(--ads-v2-border-radius);
  }
`;

// const StyledButton = styled(Button)`
//   && {
//     height: 100%;
//     width: 100%;
//   }
// `;

const StyledIcon = styled(Icon)`
  && {
    height: 100%;
    width: 100%;
  }

  &:hover {
    background-color: #e3e6ea;
  }
`;

export const EntityAddButton = (props: {
  onClick?: () => void;
  className?: string;
}) => {
  const handleClick = (e: any) => {
    props.onClick && props.onClick();
    e.stopPropagation();
  };
  if (!props.onClick) return null;
  else {
    return (
      <Wrapper className={props.className}>
        {/* <StyledButton
          isIconButton
          kind="tertiary"
          onClick={handleClick}
          startIcon="plus"
        /> */}
        <StyledIcon name="plus" onClick={handleClick} size={"md"} />
      </Wrapper>
    );
  }
};

export default EntityAddButton;
