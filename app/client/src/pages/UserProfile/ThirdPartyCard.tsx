import React from "react";
import style from "styled-components";

const ContainerWrapper = style.div`
  display: flex;
  position: relative;
  -webkit-box-pack: justify;
  justify-content: space-between;
  margin-top: 10px;
  padding: 10px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  border-radius: 11px;
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
  }
`;

const ContentWrapper = style.div`
  display: flex;
  justify-content: space-between;
`;

const ImgWrapper = style.img`
`;

const DivWrapper = style.div`
  margin-left: 5px;

`;

export const TitleWrapper = style.h2`
  color: #230404;
  font-weight: 600;
`;

const TextWrapper = style.span`
  color: #928e8e;
`;

const ButtonWrapper = style.button<{
  isConneted: boolean | undefined;
}>`
  position: absolute;
  top: 17px;
  right: 8px;
  height: 30px;
  border: 2px solid ${(props) =>
    props.isConneted ? "#d4dad9" : "rgb(78 209 227 / 84%)"};
  padding: 0 5px;
  border-radius: 10px;
  color: ${(props) => (props.isConneted ? "#d4dad9" : "rgb(78 209 227 / 84%)")};
  transition: transform 0.3s ease;
  ${(props) =>
    !props.isConneted &&
    `
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    }
  `}
`;

export interface ThirdPartyCardProps {
  type: string;
  logo: any;
  handleClick: () => void;
  title: string;
  text: string;
  isConneted: boolean | undefined;
}

export const ThirdPartyCard = (props: Omit<ThirdPartyCardProps, "type">) => {
  const { handleClick, isConneted, logo, text, title } = props;
  return (
    <ContainerWrapper>
      <ContentWrapper>
        <ImgWrapper src={logo} />
        <DivWrapper>
          <TitleWrapper>{title}</TitleWrapper>
          <TextWrapper>{text}</TextWrapper>
        </DivWrapper>
      </ContentWrapper>
      <ButtonWrapper
        disabled={isConneted}
        isConneted={isConneted}
        onClick={handleClick}
      >
        {isConneted ? "已绑定" : "绑定"}
      </ButtonWrapper>
    </ContainerWrapper>
  );
};
