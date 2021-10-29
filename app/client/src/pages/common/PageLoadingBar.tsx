import React from "react";
import styled from "styled-components";
import { theme } from "constants/DefaultTheme";

const StyledLoader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 4px;
  overflow-x: hidden;
  .line {
    position: absolute;
    opacity: 0.4;
    background: ${theme.colors.primary};
    width: 150%;
    height: 4px;
  }
  .subline {
    position: absolute;
    background: ${theme.colors.primary};
    height: 4px;
  }
  .inc {
    animation: increase 2s infinite;
  }
  @keyframes increase {
    from {
      left: -5%;
      width: 5%;
    }
    to {
      left: 130%;
      width: 100%;
    }
  }
`;

function PageLoadingBar() {
  return (
    <StyledLoader>
      <div className="line" />
      <div className="subline inc" />
    </StyledLoader>
  );
}

export default PageLoadingBar;
