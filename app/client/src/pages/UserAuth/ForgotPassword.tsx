/* eslint-disable @typescript-eslint/no-restricted-imports */
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
  createMessage,
  FORGOT_PASSWORD_PAGE_SUB_TITLE,
} from "ee/constants/messages";
import { AUTH_LOGIN_URL } from "constants/routes";
import { FORGOT_PASSWORD_FORM_NAME } from "ee/constants/forms";
import FormTextField from "components/utils/ReduxFormTextField";
import { FormGroup } from "@appsmith/ads-old";
import { Button, Link, Callout, Icon } from "@appsmith/ads";
import { isEmail, isEmptyString } from "utils/formhelpers";
import type { ForgotPasswordFormValues } from "./helpers";
import { forgotPasswordSubmitHandler } from "./helpers";
import { getAppsmithConfigs } from "ee/configs";
import Container from "./Container";
import EmailSVGIcon from "ce/components/svg/Email";
import { message } from "antd";
import styled, { css } from "styled-components";
import {LoginForm, StyledEmailIcon} from "./Login"
export const FormBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  a > span {
    font-size: 16px;
  }
`;

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

  useEffect(() => {
    if (!mailEnabled) {
      message.open({
        type: "error",
        duration: 30,
        content: `系统未开通邮件服务，不能正常发送重置邮件`,
        className: "my-msg",
      });
    } else {
      message.open({
        type: "success",
        duration: 10,
        content: `您的邮箱服务已配置，可正常发送邮件`,
        className: "my-msg",
      });
    }
    return () => {
      message.destroy();
    };
  }, []);

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
        {submitFailed && error && <Callout kind="warning">{error}</Callout>}
      </FormMessagesContainer>
      <StyledForm onSubmit={handleSubmit(forgotPasswordSubmitHandler)}>
        <FormGroup intent={error ? "danger" : "none"} style={{ position: "relative"}}>
          <LoginForm>
            <FormTextField
              disabled={submitting}
              name="email"
              placeholder={createMessage(
                FORGOT_PASSWORD_PAGE_EMAIL_INPUT_PLACEHOLDER,
              )}
              className="pp-height"
            />
          </LoginForm>
          <StyledEmailIcon height={15} width={15} />
        </FormGroup>
        <FormActions>
          <Button
            isDisabled={!(mailEnabled && isEmail(props.emailValue))}
            isLoading={submitting}
            size="md"
            type="submit"
            className="pp-height pp-font"
          >
            {createMessage(FORGOT_PASSWORD_PAGE_SUBMIT_BUTTON_TEXT)}
          </Button>
        </FormActions>
      </StyledForm>
      {/* 底部提示 */}
      <FormBottom>
        {createMessage(ALREADY_HAVE_AN_ACCOUNT)}
        <Link
          className="t--sign-up t--signup-link"
          kind="primary"
          target="_self"
          to={AUTH_LOGIN_URL}
        >
          {createMessage(SIGNUP_PAGE_LOGIN_LINK_TEXT)}
        </Link>
      </FormBottom>
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
