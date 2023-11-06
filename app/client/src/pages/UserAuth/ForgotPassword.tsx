import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import type { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router-dom";
import type { InjectedFormProps } from "redux-form";
import { change, reduxForm, formValueSelector } from "redux-form";
import { toast } from "design-system";
import StyledForm from "components/editorComponents/Form";
import { FormActions, FormMessagesContainer } from "./StyledComponents";
import {
  ALREADY_HAVE_AN_ACCOUNT,
  SIGNUP_PAGE_LOGIN_LINK_TEXT,
  FORGOT_PASSWORD_PAGE_EMAIL_INPUT_PLACEHOLDER,
  FORGOT_PASSWORD_PAGE_SUBMIT_BUTTON_TEXT,
  FORGOT_PASSWORD_PAGE_TITLE,
  FORM_VALIDATION_EMPTY_EMAIL,
  FORM_VALIDATION_INVALID_EMAIL,
  FORGOT_PASSWORD_SUCCESS_TEXT,
  FORGOT_PASSWORD_PAGE_LOGIN_LINK,
  createMessage,
} from "@appsmith/constants/messages";
import { AUTH_LOGIN_URL } from "constants/routes";
import { FORGOT_PASSWORD_FORM_NAME } from "@appsmith/constants/forms";
import FormTextField from "components/utils/ReduxFormTextField";
import { FormGroup } from "design-system-old";
import { Button, Link, Callout } from "design-system";
import { isEmail, isEmptyString } from "utils/formhelpers";
import type { ForgotPasswordFormValues } from "./helpers";
import { forgotPasswordSubmitHandler } from "./helpers";
import { getAppsmithConfigs } from "@appsmith/configs";
import Container from "./Container";
import EmailSVGIcon from "ce/components/svg/Email";
import { message } from "antd";

const { mailEnabled } = getAppsmithConfigs();

const validate = (values: ForgotPasswordFormValues) => {
  const errors: ForgotPasswordFormValues = {};
  if (!values.email || isEmptyString(values.email)) {
    errors.email = createMessage(FORM_VALIDATION_EMPTY_EMAIL);
  } else if (!isEmail(values.email)) {
    errors.email = createMessage(FORM_VALIDATION_INVALID_EMAIL);
  }
  return errors;
};

type ForgotPasswordProps = InjectedFormProps<
  ForgotPasswordFormValues,
  { emailValue: string }
> &
  RouteComponentProps<{ email: string }> & { emailValue: string };

export const ForgotPassword = (props: ForgotPasswordProps) => {
  const { error, handleSubmit, submitFailed, submitSucceeded, submitting } =
    props;
  const dispatch = useDispatch();

  useEffect(() => {
    if (submitSucceeded) {
      props.reset();
      dispatch(change(FORGOT_PASSWORD_FORM_NAME, "email", ""));
    }
  }, [props.emailValue]);

  const submit = () => {
    if (mailEnabled) {
      message.open({
        type: "success",
        duration: 5,
        content: `密码重置链接已经发送到你的邮箱 ${props.emailValue} ，请查收确认`,
        className: "my-msg",
      });
    }
    props.reset();
  };

  console.log("submitSucceeded", submitSucceeded);

  return (
    <Container
      subtitle={
        <Link
          className="text-sm justify-center"
          startIcon="arrow-left-line"
          target="_self"
          to={AUTH_LOGIN_URL}
        >
          {createMessage(FORGOT_PASSWORD_PAGE_LOGIN_LINK)}
        </Link>
      }
      title={createMessage(FORGOT_PASSWORD_PAGE_TITLE)}
    >
      <FormMessagesContainer>
        {!mailEnabled && (
          <Callout
            kind="warning"
            links={[
              {
                to: "https://docs.pageplug.cn/%E5%AD%A6%E4%B9%A0%E6%96%87%E6%A1%A3/%E9%85%8D%E7%BD%AE%E9%82%AE%E7%AE%B1%E6%9C%8D%E5%8A%A1",
                target: "_blank",
                children: "如何配置？",
              },
            ]}
          >
            系统未开通邮件服务，不能正常发送重置邮件
          </Callout>
        )}
        {submitFailed && error && <Callout kind="warning">{error}</Callout>}
      </FormMessagesContainer>
      <StyledForm onSubmit={handleSubmit(forgotPasswordSubmitHandler)}>
        <FormGroup intent={error ? "danger" : "none"}>
          <FormTextField
            disabled={submitting}
            name="email"
            placeholder={createMessage(
              FORGOT_PASSWORD_PAGE_EMAIL_INPUT_PLACEHOLDER,
            )}
            startIcon="null"
          />
          <EmailSVGIcon className="icon-position w-4" />
        </FormGroup>
        <FormActions>
          <Button
            isDisabled={!(mailEnabled && isEmail(props.emailValue))}
            isLoading={submitting}
            size="md"
            type="submit"
            onClick={submit}
          >
            {createMessage(FORGOT_PASSWORD_PAGE_SUBMIT_BUTTON_TEXT)}
          </Button>
        </FormActions>
      </StyledForm>
      {/* 底部提示 */}
      <div className="flex-middle myfont">
        {createMessage(ALREADY_HAVE_AN_ACCOUNT)}
        <Link
          className="t--sign-up t--signup-link pl-[var(--ads-v2\-spaces-3)] fs-16 a_link"
          kind="primary"
          target="_self"
          to={AUTH_LOGIN_URL}
        >
          {createMessage(SIGNUP_PAGE_LOGIN_LINK_TEXT)}
        </Link>
      </div>
    </Container>
  );
};

const selector = formValueSelector(FORGOT_PASSWORD_FORM_NAME);

export default connect((state, props: ForgotPasswordProps) => {
  const queryParams = new URLSearchParams(props.location.search);
  return {
    initialValues: {
      email: queryParams.get("email") || "",
    },
    emailValue: selector(state, "email"),
  };
})(
  reduxForm<ForgotPasswordFormValues, { emailValue: string }>({
    validate,
    form: FORGOT_PASSWORD_FORM_NAME,
    touchOnBlur: true,
  })(withRouter(ForgotPassword)),
);
