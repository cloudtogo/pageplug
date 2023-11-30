import React, { useEffect, useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import type { InjectedFormProps, DecoratedFormProps } from "redux-form";
import { reduxForm, formValueSelector, isDirty } from "redux-form";
import {
  LOGIN_FORM_NAME,
  LOGIN_FORM_EMAIL_FIELD_NAME,
  LOGIN_FORM_PASSWORD_FIELD_NAME,
} from "@appsmith/constants/forms";
import { FORGOT_PASSWORD_URL, SETUP, SIGN_UP_URL } from "constants/routes";
import {
  LOGIN_PAGE_TITLE,
  LOGIN_PAGE_EMAIL_INPUT_LABEL,
  LOGIN_PAGE_PASSWORD_INPUT_LABEL,
  LOGIN_PAGE_PASSWORD_INPUT_PLACEHOLDER,
  LOGIN_PAGE_EMAIL_INPUT_PLACEHOLDER,
  FORM_VALIDATION_EMPTY_PASSWORD,
  FORM_VALIDATION_INVALID_EMAIL,
  LOGIN_PAGE_LOGIN_BUTTON_TEXT,
  LOGIN_PAGE_FORGOT_PASSWORD_TEXT,
  LOGIN_PAGE_SIGN_UP_LINK_TEXT,
  LOGIN_PAGE_INVALID_CREDS_ERROR,
  LOGIN_PAGE_INVALID_CREDS_FORGOT_PASSWORD_LINK,
  NEW_TO_APPSMITH,
  createMessage,
  LOGIN_PAGE_SUBTITLE,
} from "@appsmith/constants/messages";
import { FormGroup } from "design-system-old";
import { Button, Link, Callout } from "design-system";
import { message } from "antd";
import FormTextField from "components/utils/ReduxFormTextField";
import ThirdPartyAuth from "@appsmith/pages/UserAuth/ThirdPartyAuth";
import { ThirdPartyLoginRegistry } from "pages/UserAuth/ThirdPartyLoginRegistry";
import { isEmail, isEmptyString } from "utils/formhelpers";
import type { LoginFormValues } from "pages/UserAuth/helpers";

import { SpacedSubmitForm, FormActions } from "pages/UserAuth/StyledComponents";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { LOGIN_SUBMIT_PATH } from "@appsmith/constants/ApiConstants";
import PerformanceTracker, {
  PerformanceTransactionName,
} from "utils/PerformanceTracker";
import { getIsSafeRedirectURL } from "utils/helpers";
import { getCurrentUser } from "selectors/usersSelectors";
import Container from "pages/UserAuth/Container";
import {
  getThirdPartyAuths,
  getIsFormLoginEnabled,
  getIsFormSignupEnable,
} from "@appsmith/selectors/tenantSelectors";
import Helmet from "react-helmet";
import { useHtmlPageTitle } from "@appsmith/utils";
import FooterLinks from "pages/UserAuth/FooterLinks";
import { FormIcons } from "icons/FormIcons";
import styled, { css } from "styled-components";

export const LoginForm = styled.div`
  input {
    padding-left: 30px;
  }
`;

const CommonIconStyles = css`
  position: absolute;
  top: 18px;
  left: 8px;
`;

export const StyledEmailIcon = styled(FormIcons.EMAIL_ICON)`
  ${CommonIconStyles}
  &&& svg {
    path {
      fill: none;
    }
  }
`;

export const StyledEyeOnIcon = styled(FormIcons.EYE_ON_ICON)`
  ${CommonIconStyles}
  &&& svg {
    cursor: pointer;
    path {
      fill: #8a9997;
    }
  }
`;

export const StyledEyeOffIcon = styled(FormIcons.EYE_OFF_ICON)`
  ${CommonIconStyles}
  &&& svg {
    cursor: pointer;
    path {
      fill: #8a9997;
    }
  }
`;

const validate = (values: LoginFormValues, props: ValidateProps) => {
  const errors: LoginFormValues = {};
  const email = values[LOGIN_FORM_EMAIL_FIELD_NAME] || "";
  const password = values[LOGIN_FORM_PASSWORD_FIELD_NAME];
  const { isPasswordFieldDirty, touch } = props;
  if (!password || isEmptyString(password)) {
    isPasswordFieldDirty && touch?.(LOGIN_FORM_PASSWORD_FIELD_NAME);
    errors[LOGIN_FORM_PASSWORD_FIELD_NAME] = createMessage(
      FORM_VALIDATION_EMPTY_PASSWORD,
    );
  }
  if (!isEmptyString(email) && !isEmail(email)) {
    touch?.(LOGIN_FORM_EMAIL_FIELD_NAME);
    errors[LOGIN_FORM_EMAIL_FIELD_NAME] = createMessage(
      FORM_VALIDATION_INVALID_EMAIL,
    );
  }

  return errors;
};

type LoginFormProps = {
  emailValue: string;
} & InjectedFormProps<LoginFormValues, { emailValue: string }>;

type ValidateProps = {
  isPasswordFieldDirty?: boolean;
} & DecoratedFormProps<
  LoginFormValues,
  { emailValue: string; isPasswordFieldDirty?: boolean }
>;

export function Login(props: LoginFormProps) {
  const { emailValue: email, error, valid } = props;
  const isFormValid = valid && email && !isEmptyString(email);
  const location = useLocation();
  const isFormLoginEnabled = useSelector(getIsFormLoginEnabled);
  const isFormSignupEnabled = useSelector(getIsFormSignupEnable);
  const socialLoginList = useSelector(getThirdPartyAuths);
  const queryParams = new URLSearchParams(location.search);
  const htmlPageTitle = useHtmlPageTitle();
  const invalidCredsForgotPasswordLinkText = createMessage(
    LOGIN_PAGE_INVALID_CREDS_FORGOT_PASSWORD_LINK,
  );
  let showError = false;
  let errorMessage = "";
  const currentUser = useSelector(getCurrentUser);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (showError) {
      message.open({
        type: "error",
        duration: 5,
        content: "密码校验失败，请重试，或者点击下面的按钮重置密码",
        className: "my-msg",
      });
    }
  }, []);

  if (currentUser?.emptyInstance) {
    return <Redirect to={SETUP} />;
  }
  if (queryParams.get("error")) {
    errorMessage = queryParams.get("message") || queryParams.get("error") || "";
    showError = true;
  }
  let loginURL = "/api/v1/" + LOGIN_SUBMIT_PATH;
  let signupURL = SIGN_UP_URL;
  const redirectUrl = queryParams.get("redirectUrl");
  if (redirectUrl != null && getIsSafeRedirectURL(redirectUrl)) {
    const encodedRedirectUrl = encodeURIComponent(redirectUrl);
    loginURL += `?redirectUrl=${encodedRedirectUrl}`;
    signupURL += `?redirectUrl=${encodedRedirectUrl}`;
  }

  let forgotPasswordURL = `${FORGOT_PASSWORD_URL}`;
  if (props.emailValue && !isEmptyString(props.emailValue)) {
    forgotPasswordURL += `?email=${props.emailValue}`;
  }

  // 第三方登录
  const footerSection = (
    <div className="w-[min(400px,80%)] rounded-[var(--ads-v2\-border-radius)]  border-[color:var(--ads-v2\-color-border)] .login-bg">
      <FooterLinks />
    </div>
  );

  return (
    <Container
      footer={footerSection}
      subtitle={createMessage(LOGIN_PAGE_SUBTITLE)}
      title={createMessage(LOGIN_PAGE_TITLE)}
    >
      <Helmet>
        <title>{htmlPageTitle}</title>
      </Helmet>
      {/* 错误信息 改用弹窗 */}
      {/* {showError && (
        <Callout
          kind="error"
          links={
            !!errorMessage
              ? undefined
              : [
                  {
                    children: invalidCredsForgotPasswordLinkText,
                    to: FORGOT_PASSWORD_URL,
                  },
                ]
          }
        >
          {!!errorMessage && errorMessage !== "true"
            ? errorMessage
            : createMessage(LOGIN_PAGE_INVALID_CREDS_ERROR)}
        </Callout>
      )} */}
      {/* 账号密码 */}
      {isFormLoginEnabled && (
        <>
          <SpacedSubmitForm action={loginURL} method="POST">
            <FormGroup intent={error ? "danger" : "none"}>
              <LoginForm>
                <FormTextField
                  autoFocus
                  className="pp-height login-form"
                  name={LOGIN_FORM_EMAIL_FIELD_NAME}
                  placeholder={createMessage(
                    LOGIN_PAGE_EMAIL_INPUT_PLACEHOLDER,
                  )}
                  type="email"
                />
              </LoginForm>
              <StyledEmailIcon height={15} width={15} />
            </FormGroup>
            <FormGroup intent={error ? "danger" : "none"}>
              <LoginForm>
                <FormTextField
                  className="pp-height"
                  name={LOGIN_FORM_PASSWORD_FIELD_NAME}
                  placeholder={createMessage(
                    LOGIN_PAGE_PASSWORD_INPUT_PLACEHOLDER,
                  )}
                  type={isShowPassword ? "text" : "password"}
                />
              </LoginForm>
              {isShowPassword ? (
                <StyledEyeOnIcon
                  height={15}
                  onClick={() => setIsShowPassword(false)}
                  width={15}
                />
              ) : (
                <StyledEyeOffIcon
                  height={15}
                  onClick={() => setIsShowPassword(true)}
                  width={15}
                />
              )}
            </FormGroup>

            <FormActions>
              <Button
                className="pp-height pp-font"
                isDisabled={!isFormValid}
                kind="primary"
                onClick={() => {
                  PerformanceTracker.startTracking(
                    PerformanceTransactionName.LOGIN_CLICK,
                  );
                  AnalyticsUtil.logEvent("LOGIN_CLICK", {
                    loginMethod: "EMAIL",
                  });
                }}
                size="md"
                type="submit"
              >
                {createMessage(LOGIN_PAGE_LOGIN_BUTTON_TEXT)}
              </Button>
            </FormActions>
          </SpacedSubmitForm>
          {/* 底部提示 */}
          <div className="flex-space-between">
            {isFormSignupEnabled ? (
              <div className="flex myfont">
                {createMessage(NEW_TO_APPSMITH)}
                <Link
                  className="a_link t--sign-up t--signup-link pl-[var(--ads-v2\-spaces-3)] fs-16"
                  kind="primary"
                  target="_self"
                  to={signupURL}
                >
                  {createMessage(LOGIN_PAGE_SIGN_UP_LINK_TEXT)}
                </Link>
              </div>
            ) : (
              <div />
            )}
            <div>
              <Link
                className="justify-center fs-16 a_link"
                target="_self"
                to={forgotPasswordURL}
              >
                {createMessage(LOGIN_PAGE_FORGOT_PASSWORD_TEXT)}
              </Link>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

const selector = formValueSelector(LOGIN_FORM_NAME);
export default connect((state) => ({
  emailValue: selector(state, LOGIN_FORM_EMAIL_FIELD_NAME),
  isPasswordFieldDirty: isDirty(LOGIN_FORM_NAME)(
    state,
    LOGIN_FORM_PASSWORD_FIELD_NAME,
  ),
}))(
  reduxForm<LoginFormValues, { emailValue: string }>({
    validate,
    touchOnBlur: false,
    form: LOGIN_FORM_NAME,
  })(Login),
);
