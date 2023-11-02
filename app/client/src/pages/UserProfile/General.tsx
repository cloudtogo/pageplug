import React, { useState } from "react";
import styled from "styled-components";
import { Button, Input, toast, Text } from "design-system";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "selectors/usersSelectors";
import { forgotPasswordSubmitHandler } from "pages/UserAuth/helpers";
import {
  FORGOT_PASSWORD_SUCCESS_TEXT,
  USER_DISPLAY_NAME_CHAR_CHECK_FAILED,
  USER_DISPLAY_NAME_PLACEHOLDER,
  USER_DISPLAY_PICTURE_PLACEHOLDER,
  USER_EMAIL_PLACEHOLDER,
  USER_RESET_PASSWORD,
} from "@appsmith/constants/messages";
import { logoutUser, updateUserDetails } from "actions/userActions";
import UserProfileImagePicker from "./UserProfileImagePicker";
import { Wrapper, FieldWrapper, LabelWrapper } from "./StyledComponents";
import { ANONYMOUS_USERNAME } from "constants/userConstants";
import { ALL_LANGUAGE_CHARACTERS_REGEX } from "constants/Regex";
import { createMessage } from "design-system-old/build/constants/messages";
import { notEmptyValidator, TextType } from "design-system-old";
import { getIsFormLoginEnabled } from "@appsmith/selectors/tenantSelectors";
import Api from "api/Api";

type ButtonProps = {
  wechatEnable?: boolean;
};

const BindButton = styled.button<ButtonProps>`
  width: ${(props) => (props.wechatEnable ? "135px" : "96px")};
  height: 32px;
  border: 1px solid ${(props) => (props.wechatEnable ? "#D4DAD9" : "#13c2c2")};
  border-radius: 4px;
  padding: 5px 15px;
  color: ${(props) => (props.wechatEnable ? "#D4DAD9" : "#13c2c2")};
`;

const nameValidator = (
  value: string,
): {
  isValid: boolean;
  message: string;
} => {
  const notEmpty = notEmptyValidator(value);
  if (!notEmpty.isValid) {
    return notEmpty;
  }
  if (!new RegExp(`^[${ALL_LANGUAGE_CHARACTERS_REGEX} 0-9.'-]+$`).test(value)) {
    return {
      isValid: false,
      message: createMessage(USER_DISPLAY_NAME_CHAR_CHECK_FAILED),
    };
  }
  return {
    isValid: true,
    message: "",
  };
};

function General() {
  const user = useSelector(getCurrentUser);
  const isFormLoginEnabled = useSelector(getIsFormLoginEnabled);
  const [name, setName] = useState(user?.name);
  const dispatch = useDispatch();
  const forgotPassword = async () => {
    try {
      await forgotPasswordSubmitHandler({ email: user?.email }, dispatch);
      toast.show(createMessage(FORGOT_PASSWORD_SUCCESS_TEXT, user?.email), {
        kind: "success",
      });
      dispatch(logoutUser());
    } catch (error) {
      toast.show((error as { _error: string })._error, {
        kind: "success",
      });
    }
  };
  const saveName = () => {
    name &&
      nameValidator(name).isValid &&
      dispatch(
        updateUserDetails({
          name,
        }),
      );
  };

  if (user?.email === ANONYMOUS_USERNAME) return null;

  const onBindwechatClick = () => {
    const requestUrl = "v1/wxLogin/code";
    Api.get(requestUrl).then(({ data }) => {
      const url = data.redirectUrl;
      const newWindow: any = window.open(url, "_self");
      newWindow.focus();
    });
  };
  const isWXBind = user?.authorizations?.some(
    (item) => item.source === "WECHAT",
  );
  return (
    <Wrapper>
      <FieldWrapper>
        <LabelWrapper>
          <Text kind="body-m">
            {createMessage(USER_DISPLAY_PICTURE_PLACEHOLDER)}
          </Text>
        </LabelWrapper>
        <div className="user-profile-image-picker">
          <UserProfileImagePicker />
        </div>
      </FieldWrapper>
      <FieldWrapper>
        <Input
          data-testid="t--display-name"
          defaultValue={name}
          isRequired
          label={createMessage(USER_DISPLAY_NAME_PLACEHOLDER)}
          labelPosition="top"
          onBlur={saveName}
          onChange={setName}
          onKeyPress={(ev: React.KeyboardEvent) => {
            if (ev.key === "Enter") {
              saveName();
            }
          }}
          placeholder={createMessage(USER_DISPLAY_NAME_PLACEHOLDER)}
          renderAs="input"
          size="md"
          type="text"
        />
      </FieldWrapper>
      <FieldWrapper>
        <Input
          data-testid="t--user-name"
          defaultValue={user?.email}
          isDisabled
          isReadOnly
          label={createMessage(USER_EMAIL_PLACEHOLDER)}
          labelPosition="top"
          placeholder={createMessage(USER_EMAIL_PLACEHOLDER)}
          renderAs="input"
          size="md"
          type="text"
        />
      </FieldWrapper>
      <FieldWrapper>
        <div
          style={{
            display: "flex",
            flex: "1 1 0%",
            justifyContent: "flex-end",
          }}
        >
          {isFormLoginEnabled && (
            <Button
              kind="secondary"
              onClick={forgotPassword}
              renderAs="a"
              size="md"
            >
              {createMessage(USER_RESET_PASSWORD)}
            </Button>
          )}
        </div>
      </FieldWrapper>
      <FieldWrapper>
        <LabelWrapper>
          <Text>微信</Text>
        </LabelWrapper>
        <div style={{ flexDirection: "column", display: "flex" }}>
          {
            <BindButton
              wechatEnable={isWXBind}
              onClick={onBindwechatClick}
              disabled={isWXBind}
            >
              {isWXBind ? "微信已绑定邮箱" : "绑定微信"}
            </BindButton>
          }
        </div>
      </FieldWrapper>
    </Wrapper>
  );
}

export default General;
