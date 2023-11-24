import { promisify } from "./utils/Promisify";

function callFuncFnDescriptor(
  widgetName: string,
  funcName: string,
  options?: any,
) {
  return {
    type: "CALL_FUNC" as const,
    payload: {
      widgetName,
      funcName,
      options,
    },
  };
}

export type TCallFuncArgs = Parameters<typeof callFuncFnDescriptor>;
export type TCallFuncDescription = ReturnType<typeof callFuncFnDescriptor>;
export type TCallFuncActionType = TCallFuncDescription["type"];

export async function echartCallFunc(
  ...args: Parameters<typeof callFuncFnDescriptor>
) {
  return promisify(callFuncFnDescriptor)(...args);
}
