import { Toaster, ToastTypeOptions, Variant } from "design-system-old";
import AppsmithConsole from "utils/AppsmithConsole";
import {
  ActionValidationError,
  TriggerFailureError,
} from "sagas/ActionExecution/errorUtils";
import { getType, Types } from "utils/TypeHelpers";
import { select } from "redux-saga/effects";
import { isMobileLayout } from "selectors/applicationSelectors";
import Taro from "@tarojs/taro";
import { TShowAlertDescription } from "workers/Evaluation/fns/showAlert";

export default function* showAlertSaga(action: TShowAlertDescription) {
  const { payload } = action;
  if (typeof payload.message !== "string") {
    throw new ActionValidationError(
      "SHOW_ALERT",
      "message",
      Types.STRING,
      getType(payload.message),
    );
  }

  const isMobile = yield select(isMobileLayout);
  if (isMobile) {
    Taro.showToast({
      icon: payload.style,
      title: payload.message,
    });
    return;
  }

  let variant;
  switch (payload.style) {
    case "info":
      variant = Variant.info;
      break;
    case "success":
      variant = Variant.success;
      break;
    case "warning":
      variant = Variant.warning;
      break;
    case "error":
      variant = Variant.danger;
      break;
  }
  if (payload.style && !variant) {
    throw new TriggerFailureError(
      `Toast type needs to be a one of ${Object.values(ToastTypeOptions).join(
        ", ",
      )}`,
    );
  }
  Toaster.show({
    text: payload.message,
    variant: variant,
  });
  AppsmithConsole.info({
    text: payload.style
      ? `showAlert('${payload.message}', '${payload.style}') was triggered`
      : `showAlert('${payload.message}') was triggered`,
  });
}
