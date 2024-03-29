import React from "react";
import styled from "styled-components";
import Secure from "assets/images/secure.svg";
import AppsmithDatasource from "assets/images/appsmith-datasource.png";

const Wrapper = styled.div`
  border: 2px solid var(--ads-v2-color-border);
  border-radius: var(--ads-v2-border-radius);
  padding: 16px 23px;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: ${(props) => props.theme.borderRadius};

  .datasource-img {
    height: 128px;
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
  color: var(--ads-v2-color-fg);
`;

const Content = styled.p`
  margin-top: 8px;
  color: var(--ads-v2-color-fg);
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
          立即连接数据源来构建您的业务，您的全部数据都是加密传输，我们永远不会存储您的任何数据。
        </Content>
      </div>
      <img className="datasource-img" src={AppsmithDatasource} />
    </Wrapper>
  );
}

export default AddDatasourceSecurely;
