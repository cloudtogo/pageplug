import { Colors } from "constants/Colors";
import { Button } from "design-system";
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  z-index: 9;
  top: 0px;
  left: 0pc;
  height: 100%;
  width: 100%;
  background: #ffffff61;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 440px;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

const Header = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${Colors.GREY_900};
  margin-bottom: 12px;
`;

const ConnecData = styled(Button)`
  margin-bottom: 16px;
`;

export function ConnectDataOverlay(props: { onConnectData: () => void }) {
  return (
    <Wrapper>
      <Container>
        <Header className="t--cypress-table-overlay-header">
          连接你的数据或者使用简单的数据展示表格
        </Header>
        <ConnecData
          className="t--cypress-table-overlay-connectdata"
          onClick={props.onConnectData}
          size="md"
        >
          连接数据
        </ConnecData>
      </Container>
    </Wrapper>
  );
}
