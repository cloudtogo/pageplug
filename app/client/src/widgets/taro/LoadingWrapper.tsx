import React from "react";
import { Skeleton } from "@taroify/core";
import styled from "styled-components";

const Loading = styled(Skeleton)`
  width: 100%;
  height: 100%;
  border-radius: 4px;
`;

const Wrapper = ({ isLoading, children }: Record<string, any>) => {
  if (isLoading) {
    return <Loading animation="pulse" />;
  }
  return children;
};

export default Wrapper;
