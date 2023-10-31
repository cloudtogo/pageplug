import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { Button } from "design-system";

import type { SocialLoginType } from "@appsmith/constants/SocialLogin";
import { getSocialLoginButtonProps } from "@appsmith/constants/SocialLogin";
import type { EventName } from "@appsmith/utils/analyticsUtilTypes";
import AnalyticsUtil from "utils/AnalyticsUtil";
import PerformanceTracker, {
  PerformanceTransactionName,
} from "utils/PerformanceTracker";
import Api from "api/Api";
import Github from "assets/images/Github.svg";
import Wechat from "assets/images/WeChat.svg";

const ThirdPartyAuthWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-item: center;
`;

const LogoImg = styled.img`
  width: 30px;
  vertical-align: bottom;
  display: inline-block;
  margin-right: 10px;
`;

const onWechatLoginClick = () => {
  const requestUrl = "v1/wxLogin/code";
  Api.get(requestUrl).then(({ data }) => {
    const url = data.redirectUrl;
    const newTab: any = window.open(url, "_self");
    newTab.focus();
  });
};

type SignInType = "SIGNIN" | "SIGNUP";

function SocialLoginButton(props: {
  logo?: string;
  name: string;
  url?: string;
  label?: string;
  type: SignInType;
}) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let url = props.url;
  const redirectUrl = queryParams.get("redirectUrl");
  if (redirectUrl != null) {
    url += `?redirectUrl=${encodeURIComponent(redirectUrl)}`;
  }
  // 后续添加
  const _map = [{ name: "Github", src: Github }];
  return (
    <a
      href={url}
      onClick={() => {
        let eventName: EventName = "LOGIN_CLICK";
        if (props.type === "SIGNUP") {
          eventName = "SIGNUP_CLICK";
        }
        PerformanceTracker.startTracking(
          eventName === "SIGNUP_CLICK"
            ? PerformanceTransactionName.SIGN_UP
            : PerformanceTransactionName.LOGIN_CLICK,
          { name: props.name.toUpperCase() },
        );
        AnalyticsUtil.logEvent(eventName, {
          loginMethod: props.name.toUpperCase(),
        });
      }}
    >
      <LogoImg
        src={_map.find((item) => item.name === props.name)?.src}
        alt="还没找到图片"
      />
    </a>
  );
}

export function ThirdPartyAuth(props: {
  logins: SocialLoginType[];
  type: SignInType;
}) {
  const socialLoginButtons = getSocialLoginButtonProps(props.logins)
    .filter((item) => item?.name !== "Wechat") // 滤除微信
    .map((item) => {
      return <SocialLoginButton key={item.name} {...item} type={props.type} />;
    });
  return (
    <ThirdPartyAuthWrapper>
      {props?.logins?.includes("wechat") && (
        <LogoImg src={Wechat} onClick={onWechatLoginClick} />
      )}
      {socialLoginButtons}
    </ThirdPartyAuthWrapper>
  );
}

export default ThirdPartyAuth;
