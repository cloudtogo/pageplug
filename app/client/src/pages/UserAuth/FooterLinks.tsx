import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { getThirdPartyAuths } from "@appsmith/selectors/tenantSelectors";
import ThirdPartyAuth from "@appsmith/pages/UserAuth/ThirdPartyAuth";

const LineDiv = styled.div`
  box-sizing: border-box;
  margin: 0;
  border-top: 1px solid;
  border-color: #e1e5e5;
  width: 120px;
`;

const TextDiv = styled.div`
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  color: #00000066;
  font-size: 14px;
  width: 90px;
  overflow: hidden;
  line-height: 17px;
  white-space: nowrap;
`;

function FooterLinks() {
  const socialLoginList = useSelector(getThirdPartyAuths);
  return (
    <>
      <div
        className="flex-middle gap-4 py-2"
        style={{ width: "350px", marginLeft: "25px" }}
      >
        <LineDiv />
        <TextDiv>其他登录方式</TextDiv>
        <LineDiv />
      </div>
      {/* 第三方登录 */}
      {socialLoginList.length > 0 && (
        <div className="flex items-center justify-center gap-4 px-2 py-2">
          <ThirdPartyAuth logins={socialLoginList} type={"SIGNIN"} />
        </div>
      )}
    </>
  );
}

export default FooterLinks;
