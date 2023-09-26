import AppsmithConsole from "utils/AppsmithConsole";
import { ActionValidationError } from "sagas/ActionExecution/errorUtils";
import { getType, Types } from "utils/TypeHelpers";
import { select } from "redux-saga/effects";
import { isMobileLayout } from "selectors/applicationSelectors";
import Taro from "@tarojs/taro";
import { toast } from "design-system";
import type { TShowAlertDescription } from "workers/Evaluation/fns/showAlert";

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
  const isMobile: boolean = yield select(isMobileLayout);
  if (isMobile) {
    let iconStr: any = "none";
    if (payload.style === "success") {
      iconStr = "success";
    }
    if (payload.style === "loading") {
      iconStr = "loading";
    }
    Taro.showToast({
      icon: iconStr,
      title: payload.message,
    });
    return;
  }
  let kind: "success" | "info" | "warning" | "error" | undefined = undefined;
  switch (payload.style) {
    case "info":
      kind = "info";
      break;
    case "success":
      kind = "success";
      break;
    case "warning":
      kind = "warning";
      break;
    case "error":
      kind = "error";
      break;
  }
  toast.show(payload.message, {
    kind: kind,
  });
  AppsmithConsole.info({
    text: payload.style
      ? `showAlert('${payload.message}', '${payload.style}') was triggered`
      : `showAlert('${payload.message}') was triggered`,
  });
}
