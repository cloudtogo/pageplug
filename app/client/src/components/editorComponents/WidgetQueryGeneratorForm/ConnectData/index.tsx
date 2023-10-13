import React from "react";

import { StyledButton } from "../styles";
import { useConnectData } from "./useConnectData";

export function ConnectData() {
  const { disabled, isLoading, onClick, show } = useConnectData();

  if (show) {
    return (
      <StyledButton
        data-testId="t--one-click-binding-connect-data"
        isDisabled={disabled}
        isLoading={isLoading}
        onClick={onClick}
        size="md"
      >
        连接数据
      </StyledButton>
    );
  } else {
    return null;
  }
}
