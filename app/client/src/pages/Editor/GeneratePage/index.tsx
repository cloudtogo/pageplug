import React from "react";
import styled from "styled-components";
import PageContent from "./components/PageContent";
import { Text } from "design-system";
import { BackButton } from "components/utils/helperComponents";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  padding: var(--ads-v2-spaces-7);
`;

const HeadingContainer = styled.div`
  display: flex;
  padding-top: var(--ads-v2-spaces-4);
`;

const Header = styled.div`
  width: 100%;

  > a {
    margin: 0;
  }
`;

function GeneratePage() {
  const isGenerateFormPage = window.location.pathname.includes("/form");
  const heading = isGenerateFormPage ? "快速向导" : "新建页面";

  return (
    <Container>
      {isGenerateFormPage ? (
        <Header>
          <BackButton />
        </Header>
      ) : null}

      <HeadingContainer>
        <Text kind="heading-l">{heading}</Text>
      </HeadingContainer>
      {isGenerateFormPage ? (
        <Text renderAs="p">自动为你的数据创建增删改查页面</Text>
      ) : null}

      <PageContent />
    </Container>
  );
}

export default GeneratePage;
