import React, { useState } from "react";
import styled from "styled-components";
import {
  notEmptyValidator,
  Text,
  TextInput,
  TextType,
  Toaster,
  Variant,
} from "design-system-old";
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
import { getAppsmithConfigs } from "@appsmith/configs";
import { ANONYMOUS_USERNAME } from "constants/userConstants";
import { ALL_LANGUAGE_CHARACTERS_REGEX } from "constants/Regex";
import { createMessage } from "design-system-old/build/constants/messages";

const { disableLoginForm } = getAppsmithConfigs();

const ForgotPassword = styled.a`
  margin-top: 12px;
  border-bottom: 1px solid transparent;
  &:hover {
    cursor: pointer;
    text-decoration: none;
  }
  display: inline-block;
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
  const [name, setName] = useState(user?.name);
  const dispatch = useDispatch();
  const forgotPassword = async () => {
    try {
      await forgotPasswordSubmitHandler({ email: user?.email }, dispatch);
      Toaster.show({
        text: createMessage(FORGOT_PASSWORD_SUCCESS_TEXT, user?.email),
        variant: Variant.success,
      });
      dispatch(logoutUser());
    } catch (error) {
      Toaster.show({
        text: (error as { _error: string })._error,
        variant: Variant.success,
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

  return (
    <Wrapper>
      <FieldWrapper>
        <LabelWrapper>
<<<<<<< HEAD
          <Text type={TextType.H4}>头像</Text>
=======
          <Text type={TextType.H4}>
            {createMessage(USER_DISPLAY_PICTURE_PLACEHOLDER)}
          </Text>
>>>>>>> ed35f7e5726f0dd91816a1f9bde5f937938cc880
        </LabelWrapper>
        <UserProfileImagePicker />
      </FieldWrapper>
      <FieldWrapper>
        <LabelWrapper>
<<<<<<< HEAD
          <Text type={TextType.H4}>昵称</Text>
=======
          <Text type={TextType.H4}>
            {createMessage(USER_DISPLAY_NAME_PLACEHOLDER)}
          </Text>
>>>>>>> ed35f7e5726f0dd91816a1f9bde5f937938cc880
        </LabelWrapper>
        {
          <div style={{ flex: 1 }}>
            <TextInput
              cypressSelector="t--display-name"
              defaultValue={name}
              fill={false}
<<<<<<< HEAD
              onChange={onNameChange}
              placeholder="昵称"
              validator={notEmptyValidator}
=======
              onBlur={saveName}
              onChange={setName}
              onKeyPress={(ev: React.KeyboardEvent) => {
                if (ev.key === "Enter") {
                  saveName();
                }
              }}
              placeholder={createMessage(USER_DISPLAY_NAME_PLACEHOLDER)}
              validator={nameValidator}
>>>>>>> ed35f7e5726f0dd91816a1f9bde5f937938cc880
            />
          </div>
        }
      </FieldWrapper>
      <FieldWrapper>
        <LabelWrapper>
<<<<<<< HEAD
          <Text type={TextType.H4}>邮箱</Text>
=======
          <Text type={TextType.H4}>
            {createMessage(USER_EMAIL_PLACEHOLDER)}
          </Text>
>>>>>>> ed35f7e5726f0dd91816a1f9bde5f937938cc880
        </LabelWrapper>
        <div style={{ flexDirection: "column", display: "flex" }}>
          {<Text type={TextType.P1}>{user?.email}</Text>}

          {!disableLoginForm && (
<<<<<<< HEAD
            <ForgotPassword onClick={forgotPassword}>重置密码</ForgotPassword>
=======
            <ForgotPassword onClick={forgotPassword}>
              {createMessage(USER_RESET_PASSWORD)}
            </ForgotPassword>
>>>>>>> ed35f7e5726f0dd91816a1f9bde5f937938cc880
          )}
        </div>
      </FieldWrapper>
      {/* <InputWrapper>
        <LabelWrapper>
          <Text type={TextType.H4}>Website</Text>
        </LabelWrapper>
        <TextInput
          placeholder="Your website"
          onChange={() => null}
          defaultValue={""}
          cypressSelector="t--profile-website"
        />
      </InputWrapper> */}
    </Wrapper>
  );
}

export default General;
