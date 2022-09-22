import {
  ActionTriggerType,
  ShowAlertActionDescription,
} from "entities/DataTree/actionTriggers";
import { ActionValidationError } from "sagas/ActionExecution/errorUtils";
import { getType, Types } from "utils/TypeHelpers";
import Taro from "@tarojs/taro";

export default function* showAlertSaga(
  payload: ShowAlertActionDescription["payload"]
) {
  if (typeof payload.message !== "string") {
    throw new ActionValidationError(
      ActionTriggerType.SHOW_ALERT,
      "message",
      Types.STRING,
      getType(payload.message)
    );
  }
  Taro.showToast({
    icon: payload.style,
    title: payload.message,
  });
}
