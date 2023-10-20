import React, { useState } from "react";
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
} from "@appsmith/selectors/tenantSelectors";
import Helmet from "react-helmet";
import { useHtmlPageTitle } from "@appsmith/utils";
import FooterLinks from "pages/UserAuth/FooterLinks";
import EmailSVGIcon from "ce/components/svg/Email";
import PasswordSVGIcon from "ce/components/svg/Password";

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
  const socialLoginList = useSelector(getThirdPartyAuths);
  const queryParams = new URLSearchParams(location.search);
  const htmlPageTitle = useHtmlPageTitle();
  const invalidCredsForgotPasswordLinkText = createMessage(
    LOGIN_PAGE_INVALID_CREDS_FORGOT_PASSWORD_LINK,
  );
  let showError = false;
  let errorMessage = "";
  const currentUser = useSelector(getCurrentUser);
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
  const footerSection = isFormLoginEnabled && (
    <div className="w-[min(400px,80%)] rounded-[var(--ads-v2\-border-radius)]  border-[color:var(--ads-v2\-color-border)] .login-bg">
      <FooterLinks />
    </div>
  );

  const [isShowPassword, setIsShowPassword] = useState(false);
  const showPassword = () => {
    setIsShowPassword(!isShowPassword);
  }

  return (
    <Container
      footer={footerSection}
      subtitle={createMessage(LOGIN_PAGE_SUBTITLE)}
      title={createMessage(LOGIN_PAGE_TITLE)}
    >
      <Helmet>
        <title>{htmlPageTitle}</title>
      </Helmet>
      {/* 错误信息 */}
      {showError && (
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
      )}
      {/* 账号密码 */}
      {isFormLoginEnabled && (
        <>
          <SpacedSubmitForm action={loginURL} method="POST">
            <FormGroup
              intent={error ? "danger" : "none"}
            >
              <FormTextField
                autoFocus
                name={LOGIN_FORM_EMAIL_FIELD_NAME}
                placeholder={createMessage(LOGIN_PAGE_EMAIL_INPUT_PLACEHOLDER)}
                type="email"
                startIcon="null"
              />
              <EmailSVGIcon className="relative top-[-27px] right-[-6px] w-4"/>
            </FormGroup>
            <FormGroup
              intent={error ? "danger" : "none"}
            >
              <FormTextField
                name={LOGIN_FORM_PASSWORD_FIELD_NAME}
                placeholder={createMessage(
                  LOGIN_PAGE_PASSWORD_INPUT_PLACEHOLDER,
                )}
                type={isShowPassword ? "text" : "password"}
                startIcon={isShowPassword ? "eye-on" : "null"}
              />
              <PasswordSVGIcon className="relative top-[-25px] right-[-6px] w-4" showPassword={showPassword} />
            </FormGroup>

            <FormActions>
              <Button
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
          <div className="flex-space-between">
            <div className="flex myfont">
              {createMessage(NEW_TO_APPSMITH)}
              <Link
                className="t--sign-up t--signup-link pl-[var(--ads-v2\-spaces-3)] fs-16"
                kind="primary"
                target="_self"
                to={signupURL}
              >
                {createMessage(LOGIN_PAGE_SIGN_UP_LINK_TEXT)}
              </Link>
            </div>
            <div>
              <Link
                className="justify-center fs-16"
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
