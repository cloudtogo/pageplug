import { Message, Severity, LogActionPayload } from "entities/AppsmithConsole";
import dayjs from "dayjs";

function log(ev: Message) {
  // store.dispatch(debuggerLogInit(ev));
}

function getTimeStamp() {
  return dayjs().format("hh:mm:ss");
}

function info(ev: LogActionPayload) {
  log({
    ...ev,
    severity: Severity.INFO,
    timestamp: getTimeStamp(),
  });
}

function warning(ev: LogActionPayload) {
  log({
    ...ev,
    severity: Severity.WARNING,
    timestamp: getTimeStamp(),
  });
}

function error(ev: LogActionPayload) {
  log({
    ...ev,
    severity: Severity.ERROR,
    timestamp: getTimeStamp(),
  });
}

export default {
  info,
  warning,
  error,
};
