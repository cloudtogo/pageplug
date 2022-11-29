/* eslint-disable @typescript-eslint/ban-types */
import * as _ from "lodash";

function updater_customer(params: string) {
  return new Function("return " + params)();
}

/**
 * convert string function to funciton
 * @param data object with string function
 * @returns object with function
 */
export function convertStringFunciton(temp: any) {
  const data = _.cloneDeep(temp);
  function traverse(params: any, path: string) {
    for (const key in params) {
      const current_path = `${path}${path ? "." : ""}${key}`;
      if (
        typeof params[key] === "string" &&
        params[key].trimStart().startsWith("function")
      ) {
        _.update(data, current_path, updater_customer);
      } else if (typeof params[key] === "object") {
        traverse(params[key], current_path);
      }
    }
  }
  traverse(temp, "");
  return data;
}
