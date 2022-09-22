import AppsmithConsole from "utils/AppsmithConsole";
import {
  ActionTriggerType,
  CopyToClipboardDescription,
} from "entities/DataTree/actionTriggers";
import { ActionValidationError } from "sagas/ActionExecution/errorUtils";
import { getType, Types } from "utils/TypeHelpers";
import Taro from "@tarojs/taro";

export default function copySaga(
  payload: CopyToClipboardDescription["payload"]
) {
  if (typeof payload.data !== "string") {
    throw new ActionValidationError(
      ActionTriggerType.COPY_TO_CLIPBOARD,
      "data",
      Types.STRING,
      getType(payload.data)
    );
  }
  Taro.setClipboardData({
    data: payload.data,
    success: () => {
      AppsmithConsole.info({
        text: `copyToClipboard('${payload.data}') was triggered`,
      });
    },
  });
}
