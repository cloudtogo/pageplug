import { EMAIL_SETUP_DOC } from "constants/ThirdPartyConstants";
import { isEmail } from "utils/formhelpers";
import type { Dispatch } from "react";
import type { ReduxAction } from "@appsmith/constants/ReduxActionConstants";
import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import { isNil, omitBy } from "lodash";
import type { AdminConfigType } from "@appsmith/pages/AdminSettings/config/types";
import {
  SettingCategories,
  SettingSubtype,
  SettingTypes,
} from "@appsmith/pages/AdminSettings/config/types";

export const config: AdminConfigType = {
  icon: "mail-line",
  type: SettingCategories.EMAIL,
  controlType: SettingTypes.GROUP,
  title: "邮箱",
  canSave: true,
  settings: [
    {
      id: "APPSMITH_MAIL_READ_MORE",
      category: SettingCategories.EMAIL,
      controlType: SettingTypes.LINK,
      label: "如何配置？",
      url: EMAIL_SETUP_DOC,
    },
    {
      id: "APPSMITH_MAIL_HOST",
      category: SettingCategories.EMAIL,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "SMTP 主机",
      placeholder: "email-smtp.us-east-2.amazonaws.com",
    },
    {
      id: "APPSMITH_MAIL_PORT",
      category: SettingCategories.EMAIL,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.NUMBER,
      placeholder: "25",
      label: "SMTP 端口",
      validate: (value: string) => {
        const port = parseInt(value);
        if (value && (port < 0 || port > 65535)) {
          return "请输入有效端口";
        }
      },
    },
    {
      id: "APPSMITH_MAIL_FROM",
      category: SettingCategories.EMAIL,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "发件地址",
      placeholder: "admin@your.email",
      validate: (value: string) => {
        if (value && !isEmail(value)) {
          return "请输入有效邮箱地址";
        }
      },
      subText: "在发送邮件之前需要验证邮箱地址",
    },
    {
      id: "APPSMITH_REPLY_TO",
      category: SettingCategories.EMAIL,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "回复地址",
      placeholder: "admin@your.email",
      validate: (value: string) => {
        if (value && !isEmail(value)) {
          return "请输入有效邮箱地址";
        }
      },
      subText: "在发送邮件之前需要验证邮箱地址",
    },
    {
      id: "APPSMITH_MAIL_SMTP_TLS_ENABLED",
      category: SettingCategories.EMAIL,
      controlType: SettingTypes.TOGGLE,
      label: "TLS 安全连接",
    },
    {
      id: "APPSMITH_MAIL_USERNAME",
      category: SettingCategories.EMAIL,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "SMTP 用户名",
      isVisible: (values: Record<string, any>) => {
        return values && values["APPSMITH_MAIL_SMTP_TLS_ENABLED"];
      },
    },
    {
      id: "APPSMITH_MAIL_PASSWORD",
      category: SettingCategories.EMAIL,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.PASSWORD,
      label: "SMTP 密码",
      isVisible: (values: Record<string, any>) => {
        return values && values["APPSMITH_MAIL_SMTP_TLS_ENABLED"];
      },
    },
    {
      id: "APPSMITH_MAIL_TEST_EMAIL",
      category: SettingCategories.EMAIL,
      action: (dispatch: Dispatch<ReduxAction<any>>, settings: any = {}) => {
        dispatch &&
          dispatch({
            type: ReduxActionTypes.SEND_TEST_EMAIL,
            payload: omitBy(
              {
                smtpHost: settings["APPSMITH_MAIL_HOST"],
                smtpPort: settings["APPSMITH_MAIL_PORT"],
                fromEmail: settings["APPSMITH_MAIL_FROM"],
                username: settings["APPSMITH_MAIL_USERNAME"],
                password: settings["APPSMITH_MAIL_PASSWORD"],
              },
              isNil,
            ),
          });
      },
      controlType: SettingTypes.BUTTON,
      isDisabled: (settings: Record<string, any>) => {
        return (
          !settings ||
          !settings["APPSMITH_MAIL_HOST"] ||
          !settings["APPSMITH_MAIL_FROM"]
        );
      },
      text: "发送测试邮件",
    },
  ],
};
