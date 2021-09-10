import React from "react";
import styled from "styled-components";
import PageContent from "./components/PageContent";
import { getTypographyByKey } from "../../../constants/DefaultTheme";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const HeadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 50px;
`;

const Heading = styled.h1`
  font-size: 40px;
  font-style: normal;
  font-weight: 500;
  line-height: 48px;
  letter-spacing: 0px;
  text-align: center;
  margin: 0;
  font-family: ${(props) => props.theme.fonts.text};
`;

const SubHeading = styled.p`
  ${(props) => getTypographyByKey(props, "p1")};
  margin: 20px 0px;
  color: #000000;
`;

function GeneratePage() {
  const isGenerateFormPage = window.location.pathname.includes("/form");
  const heading = isGenerateFormPage ? "快速向导" : "新建页面";

  return (
    <Container>
      <HeadingContainer>
        <Heading> {heading}</Heading>
      </HeadingContainer>
      {isGenerateFormPage ? (
        <SubHeading>自动为你的数据创建增删改查页面</SubHeading>
      ) : null}

      <PageContent />
    </Container>
  );
}

export default GeneratePage;
