import styled from "styled-components";
import { Colors } from "constants/Colors";

export const EntityTogglesWrapper = styled.div`
  &&& {
    width: 100%;
    height: 100%;
    font-size: ${(props) => props.theme.fontSizes[4]}px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${Colors.MINT_GREEN};
    cursor: pointer;
    svg,
    svg path {
      fill: ${Colors.MINT_GREEN};
      cursor: pointer;
    }

    &:hover {
      background: ${Colors.MINT_GREEN};
      svg,
      svg path {
        fill: ${Colors.WHITE};
      }
      color: ${Colors.WHITE};
    }
  }
`;
