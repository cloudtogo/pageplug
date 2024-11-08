import React from "react";
import styled from "styled-components";
import type { SocialLoginType } from "ee/constants/SocialLogin";
import { getSocialLoginButtonProps } from "ee/utils/signupHelpers";
import type { EventName } from "ee/utils/analyticsUtilTypes";
import AnalyticsUtil from "ee/utils/AnalyticsUtil";
import { useLocation } from "react-router-dom";
import { Button } from "@appsmith/ads";
import { isTenantConfig } from "ee/utils/adminSettingsHelpers";
import { useSelector } from "react-redux";
import { getTenantConfig } from "ee/selectors/tenantSelectors";
import { ThirdPartyLogin } from "ee/utils";

const ThirdPartyAuthWrapper = styled.div`
  display: flex;
  gap: var(--ads-v2-spaces-3);
  flex-wrap: wrap;
`;

const StyledButton = styled(Button)`
  flex: 1 0 171px;
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

const handleClick = (url: any, isDingtalk: boolean) => {
  ThirdPartyLogin(url);
};

type SignInType = "SIGNIN" | "SIGNUP";

const startIcon: {
  [key: string]: string;
} = {
  Google: "google-colored",
  Github: "github-fill",
};

function SocialLoginButton(props: {
  logo?: string;
  name: string;
  url?: string;
  type: SignInType;
}) {
  const tenantConfiguration = useSelector(getTenantConfig);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let url = props.url;
  const redirectUrl = queryParams.get("redirectUrl");
  if (redirectUrl != null) {
    url += `?redirectUrl=${encodeURIComponent(redirectUrl)}`;
  }
  const { logo, name, url: requestUrl } = props;
  const needRequest = ["wechat", "wecom"].includes(name);
  let buttonLabel = props.name;

  if (props.name && isTenantConfig(props.name)) {
    buttonLabel = tenantConfiguration[props.name];
  }
  return (
    <a
      href={!needRequest ? url : "#"}
      onClick={() => {
        let eventName: EventName = "LOGIN_CLICK";
        if (props.type === "SIGNUP") {
          eventName = "SIGNUP_CLICK";
        }
        AnalyticsUtil.logEvent(eventName, {
          loginMethod: props.name.toUpperCase(),
        });
      }}
    >
      <LogoImg
        alt="还没找到图片"
        onClick={
          needRequest
            ? () => handleClick(requestUrl, name === "dingtalk")
            : () => null
        }
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
