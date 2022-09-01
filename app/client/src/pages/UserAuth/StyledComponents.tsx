import styled from "styled-components";
import { Link } from "react-router-dom";
import Form from "components/editorComponents/Form";
import { Card } from "@blueprintjs/core";
import { getTypographyByKey } from "constants/DefaultTheme";

export const AuthContainer = styled.section`
  position: absolute;
  width: 100%;
  height: ${(props) => `calc(100vh - ${props.theme.headerHeight})`};
  background-color: ${(props) => props.theme.colors.auth.background};
  background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='50.41' height='87' patternTransform='scale(2) rotate(30)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M25.3 87L12.74 65.25m0 14.5h-25.12m75.18 0H37.68M33.5 87l25.28-43.5m-50.23 29l4.19 7.25L16.92 87h-33.48m33.48 0h16.75-8.37zM8.55 72.5L16.92 58m50.06 29h-83.54m79.53-50.75L50.4 14.5M37.85 65.24L50.41 43.5m0 29l12.56-21.75m-50.24-14.5h25.12zM33.66 29l4.2 7.25 4.18 7.25M33.67 58H16.92l-4.18-7.25M-8.2 72.5l20.92-36.25L33.66 0m25.12 72.5H42.04l-4.19-7.26L33.67 58l4.18-7.24 4.19-7.25M33.67 29l8.37-14.5h16.74m0 29H8.38m29.47 7.25H12.74M50.4 43.5L37.85 21.75m-.17 58L25.12 58M12.73 36.25L.18 14.5M0 43.5l-12.55-21.75M24.95 29l12.9-21.75M12.4 21.75L25.2 0M12.56 7.25h-25.12m75.53 0H37.85M58.78 43.5L33.66 0h33.5m-83.9 0h83.89M33.32 29H16.57l-4.18-7.25-4.2-7.25m.18 29H-8.37M-16.74 0h33.48l-4.18 7.25-4.18 7.25H-8.37m8.38 58l12.73-21.75m-25.3 14.5L0 43.5m-8.37-29l21.1 36.25 20.94 36.24M8.37 72.5H-8.36'  stroke-width='1' stroke='hsla(171, 62%, 45%, 0.09)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
`;

export const AuthCardContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  padding: ${(props) => props.theme.authCard.padding}px 0;
`;

export const AuthCard = styled(Card)`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.auth.cardBackground};
  padding: ${(props) => props.theme.spaces[15]}px 64px;
  width: ${(props) => props.theme.authCard.width}px;
  border: none;
  box-shadow: ${(props) => props.theme.colors.auth.boxShadow};
  border-radius: 6px;
  h1 {
    text-align: center;
    padding: 0;
    margin: 0;
    ${(props) => getTypographyByKey(props, "cardHeader")}
    color: ${(props) => props.theme.colors.auth.headingText};
  }
  & .form-message-container {
    width: ${(props) => props.theme.authCard.formMessageWidth}px;
    align-self: center;
    text-align: center;
  }
  .form-message-container ~ .form-message-container {
    margin-top: ${(props) => props.theme.spaces[4]}px;
  }
  & > div {
    margin-bottom: ${(props) => props.theme.spaces[14]}px;
  }
  & > div:last-child,
  & > div:empty {
    margin-bottom: 0;
  }
`;

export const AuthCardHeader = styled.header`
  & {
    h1 {
      font-size: ${(props) => props.theme.fontSizes[6]}px;
      white-space: nowrap;
      font-weight: 500;
    }
    h5 {
      font-size: ${(props) => props.theme.fontSizes[4]}px;
    }
    margin-bottom: ${(props) => props.theme.authCard.dividerSpacing}px;
  }
`;

export const AuthCardNavLink = styled(Link)`
  border-bottom: 1px solid transparent;
  color: ${(props) => props.theme.colors.auth.link};
  &:hover {
    border-bottom: 1px solid ${(props) => props.theme.colors.auth.link};
    text-decoration: none;
    color: ${(props) => props.theme.colors.auth.link};
  }
`;

export const AuthCardFooter = styled.footer`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  align-items: baseline;
  margin-top: ${(props) => props.theme.authCard.dividerSpacing}px;
`;

export const AuthCardBody = styled.div`
  & a {
    margin-top: ${(props) => props.theme.spaces[8]}px;
    font-size: ${(props) => props.theme.fontSizes[2]}px;
  }
`;

export const SpacedForm = styled(Form)``;

export const SpacedSubmitForm = styled.form`
  & a {
    font-size: ${(props) => props.theme.fontSizes[3]}px;
  }
  &:only-child {
    margin-right: 0;
  }
`;

export const FormActions = styled.div`
  display: flex;
  & button {
    flex: 1;
  }
  justify-content: space-between;
  align-items: baseline;
  margin-top: ${(props) => props.theme.spaces[5]}px;
  & > label {
    margin-right: ${(props) => props.theme.spaces[11]}px;
  }
`;

export const SignUpLinkSection = styled.div`
  ${(props) => getTypographyByKey(props, "cardSubheader")}
  color: ${(props) => props.theme.colors.auth.text};
  text-align: center;
`;

export const ForgotPasswordLink = styled.div`
  ${(props) => getTypographyByKey(props, "cardSubheader")}
  color: ${(props) => props.theme.colors.auth.text};
  text-align: center;
  margin-top: ${(props) => props.theme.spaces[11]}px;
  & a {
    color: ${(props) => props.theme.colors.auth.text};
  }
`;

export const FormMessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BlackAuthCardNavLink = styled(AuthCardNavLink)`
  color: #000;
  border-bottom: 1px solid transparent;
  &:hover {
    color: #000;
    border-bottom: 1px solid #000;
  }
`;
