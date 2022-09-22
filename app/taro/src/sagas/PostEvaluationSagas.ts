import { DataTree } from "entities/DataTree/dataTreeFactory";
import { AnyReduxAction } from "@appsmith/constants/ReduxActionConstants";
import { EvalError, EvalErrorTypes } from "utils/DynamicBindingUtils";
import {
  createMessage,
  ERROR_EVAL_ERROR_GENERIC,
} from "@appsmith/constants/messages";
import _ from "lodash";
import { put } from "redux-saga/effects";
import log from "loglevel";
import Taro from "@tarojs/taro";

export function* evalErrorHandler(
  errors: EvalError[],
  dataTree?: DataTree,
  evaluationOrder?: Array<string>
): any {
  errors.forEach((error) => {
    switch (error.type) {
      case EvalErrorTypes.CYCLICAL_DEPENDENCY_ERROR: {
        if (error.context) {
          // Add more info about node for the toast
          const { node } = error.context;
          Taro.showModal({
            title: "出错啦 :(",
            content: `${error.message} 节点是: ${node}`,
            showCancel: false,
          });
        }
        break;
      }
      case EvalErrorTypes.EVAL_TREE_ERROR: {
        Taro.showModal({
          title: "出错啦 :(",
          content: createMessage(ERROR_EVAL_ERROR_GENERIC),
          showCancel: false,
        });
        break;
      }
      case EvalErrorTypes.BAD_UNEVAL_TREE_ERROR: {
        log.debug(error);
        break;
      }
      case EvalErrorTypes.EVAL_PROPERTY_ERROR: {
        log.debug(error);
        break;
      }
      case EvalErrorTypes.CLONE_ERROR: {
        log.debug(error);
        break;
      }
      case EvalErrorTypes.PARSE_JS_ERROR: {
        log.debug(error);
        break;
      }
      case EvalErrorTypes.EXTRACT_DEPENDENCY_ERROR: {
        log.debug(error);
        break;
      }
      default: {
        log.debug(error);
      }
    }
  });
}

export function* postEvalActionDispatcher(actions: Array<AnyReduxAction>) {
  for (const action of actions) {
    yield put(action);
  }
}
