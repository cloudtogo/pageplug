import React from "react";
import styled from "styled-components";
import { debounce } from "lodash";
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
} from "@appsmith/constants/messages";
import { logoutUser, updateUserDetails } from "actions/userActions";
import UserProfileImagePicker from "./UserProfileImagePicker";
import { Wrapper, FieldWrapper, LabelWrapper } from "./StyledComponents";
import { ANONYMOUS_USERNAME } from "constants/userConstants";
import { ALL_LANGUAGE_CHARACTERS_REGEX } from "constants/Regex";
import { createMessage } from "design-system-old/build/constants/messages";
import { getIsFormLoginEnabled } from "@appsmith/selectors/tenantSelectors";

const ForgotPassword = styled.a`
  margin-top: 12px;
  border-bottom: 1px solid transparent;
  &:hover {
    cursor: pointer;
    text-decoration: none;
  }
  display: inline-block;
`;

function General() {
  const user = useSelector(getCurrentUser);
  const isFormLoginEnabled = useSelector(getIsFormLoginEnabled);
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

  const timeout = 1000;
  const onNameChange = debounce((newName: string) => {
    dispatch(
      updateUserDetails({
        name: newName,
      }),
    );
  }, timeout);

  if (user?.email === ANONYMOUS_USERNAME) return null;

  return (
    <Wrapper>
      <FieldWrapper>
        <LabelWrapper>
          <Text type={TextType.H4}>头像</Text>
        </LabelWrapper>
        <UserProfileImagePicker />
      </FieldWrapper>
      <FieldWrapper>
        <LabelWrapper>
          <Text type={TextType.H4}>昵称</Text>
        </LabelWrapper>
        {
          <div style={{ flex: 1 }}>
            <TextInput
              cypressSelector="t--display-name"
              defaultValue={user?.name}
              fill={false}
              onChange={onNameChange}
              placeholder="昵称"
              validator={notEmptyValidator}
            />
          </div>
        }
      </FieldWrapper>
      <FieldWrapper>
        <LabelWrapper>
          <Text type={TextType.H4}>邮箱</Text>
        </LabelWrapper>
        <div style={{ flexDirection: "column", display: "flex" }}>
          {<Text type={TextType.P1}>{user?.email}</Text>}

          {isFormLoginEnabled && (
            <ForgotPassword onClick={forgotPassword}>
            重置密码
            </ForgotPassword>
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
