import React from "react";
import styled from "styled-components";
import {
  PRIVACY_POLICY_LINK,
  TERMS_AND_CONDITIONS_LINK,
  createMessage,
} from "constants/messages";
import githubIcon from "assets/icons/help/github-icon.svg";

const FooterLink = styled.a`
  cursor: pointer;
  text-decoration: none;
  :hover {
    text-decoration: underline;
    color: ${(props) => props.theme.colors.text.normal};
  }
  font-weight: ${(props) => props.theme.typography.releaseList.fontWeight};
  font-size: ${(props) => props.theme.typography.releaseList.fontSize}px;
  line-height: ${(props) => props.theme.typography.releaseList.lineHeight}px;
  letter-spacing: ${(props) =>
    props.theme.typography.releaseList.letterSpacing}px;
  color: #000 !important;
`;

const FooterLinksContainer = styled.div`
  padding: ${(props) => props.theme.spaces[9]}px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  max-width: 240px;
`;

const Red = styled.span`
  color: red;
`;

const GithubImg = styled.img`
  width: 24px;
  vertical-align: bottom;
  display: inline-block;
`;

function FooterLinks() {
  return (
    <FooterLinksContainer>
      {/* <FooterLink href="/privacy-policy.html" target="_blank">
        {createMessage(PRIVACY_POLICY_LINK)}
      </FooterLink>
      <FooterLink href="/terms-and-conditions.html" target="_blank">
        {createMessage(TERMS_AND_CONDITIONS_LINK)}
      </FooterLink> */}
      <FooterLink href="https://github.com/cloudtogo/pageplug" target="_blank">
        <GithubImg src={githubIcon} /> PagePlug <Red>❤</Red>
      </FooterLink>
    </FooterLinksContainer>
  );
}

export default FooterLinks;
