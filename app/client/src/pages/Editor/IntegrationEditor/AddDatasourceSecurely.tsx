import React from "react";
import styled from "styled-components";
import Secure from "assets/images/secure.svg";
import Datasource from "assets/images/undraw_data_source.svg";
import { Colors } from "constants/Colors";

const Wrapper = styled.div`
  border: 2px solid #d6d6d6;
  padding: 23px;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: ${(props) => props.theme.borderRadius};

  .datasource-img {
    height: 108px;
  }
`;

const HeadWrapper = styled.div`
  display: flex;
  align-items: center;
  & > img {
    margin-right: 10px;
  }
`;

const Header = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: ${Colors.OXFORD_BLUE};
`;

const Content = styled.p`
  margin: 12px 32px 0;
  color: ${Colors.OXFORD_BLUE};
  max-width: 360px;
  font-size: 14px;
  line-height: 20px;
`;

function AddDatasourceSecurely() {
  return (
    <Wrapper>
      <div>
        <HeadWrapper>
          <img src={Secure} />
          <Header>快速且安全的数据连接</Header>
        </HeadWrapper>
        <Content>
          立即连接数据源来构建您的工作流，您的全部数据都是加密传输，我们永远不会存储您的任何数据。
        </Content>
      </div>
      <img className="datasource-img" src={Datasource} />
    </Wrapper>
  );
}

export default AddDatasourceSecurely;
