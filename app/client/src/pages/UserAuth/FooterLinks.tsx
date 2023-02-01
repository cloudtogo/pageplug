import React from "react";
import styled from "styled-components";
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
    <div className="flex items-center justify-center gap-4 px-2 py-2">
      <FooterLink href="https://github.com/cloudtogo/pageplug" target="_blank">
        <GithubImg src={githubIcon} /> PagePlug <Red>❤</Red>
      </FooterLink>
    </div>
  );
}

export default FooterLinks;
