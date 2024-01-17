import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

import type { SocialLoginType } from "@appsmith/constants/SocialLogin";
import { getSocialLoginButtonProps } from "@appsmith/constants/SocialLogin";
import type { EventName } from "@appsmith/utils/analyticsUtilTypes";
import AnalyticsUtil from "utils/AnalyticsUtil";
import PerformanceTracker, {
  PerformanceTransactionName,
} from "utils/PerformanceTracker";
import { ThirdPartyLogin } from "@appsmith/utils";

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

export const SocialLoginTypes = {
  GOOGLE: "google",
  GITHUB: "github",
  OIDC: "oidc",
};

const handleClick = (url: any) => {
  ThirdPartyLogin(url);
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
  const { logo, name, url: requestUrl } = props;
  const needRequest = ["wechat", "wecom"].includes(name);
  return (
    <a
      href={!needRequest ? url : "#"}
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
        alt="还没找到图片"
        onClick={needRequest ? () => handleClick(requestUrl) : () => null}
        src={logo}
      />
    </a>
  );
}

export function ThirdPartyAuth(props: {
  logins: SocialLoginType[];
  type: SignInType;
}) {
  const socialLoginButtons = getSocialLoginButtonProps(props.logins).map(
    (item) => {
      return <SocialLoginButton key={item.name} {...item} type={props.type} />;
    },
  );
  return <ThirdPartyAuthWrapper>{socialLoginButtons}</ThirdPartyAuthWrapper>;
}

export default ThirdPartyAuth;
