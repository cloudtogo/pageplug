import { DataTree } from "entities/DataTree/dataTreeFactory";
// import { ENTITY_TYPE, Message } from "entities/AppsmithConsole";
// import {
//   getEntityNameAndPropertyPath,
//   isAction,
//   isWidget,
// } from "workers/evaluationUtils";
import {
  EvalError,
  EvalErrorTypes,
  EvaluationError,
  getEvalErrorPath,
  getEvalValuePath,
  PropertyEvalErrorTypeDebugMessage,
  PropertyEvaluationErrorType,
} from "utils/DynamicBindingUtils";
import _ from "lodash";
// import LOG_TYPE from "../entities/AppsmithConsole/logtype";
// import dayjs from "dayjs";
import { put, select } from "redux-saga/effects";
import {
  ReduxAction,
  ReduxActionTypes,
  ReduxActionWithoutPayload,
} from "constants/ReduxActionConstants";
import log from "loglevel";
// import { AppState } from "reducers";
// import { logDebuggerErrorAnalytics } from "actions/debuggerActions";
// import store from "../store";

// polyfill
const performance = Date;

// const getDebuggerErrors = (state: AppState) => state.ui.debugger.errors;

// function getLatestEvalPropertyErrors(
//   currentDebuggerErrors: Record<string, Message>,
//   dataTree: DataTree,
//   evaluationOrder: Array<string>,
// ) {
//   const updatedDebuggerErrors: Record<string, Message> = {
//     ...currentDebuggerErrors,
//   };

//   for (const evaluatedPath of evaluationOrder) {
//     const { entityName, propertyPath } = getEntityNameAndPropertyPath(
//       evaluatedPath,
//     );
//     const entity = dataTree[entityName];
//     if (isWidget(entity) || isAction(entity)) {
//       if (propertyPath in entity.logBlackList) {
//         continue;
//       }
//       const allEvalErrors: EvaluationError[] = _.get(
//         entity,
//         getEvalErrorPath(evaluatedPath, false),
//         [],
//       );
//       const evaluatedValue = _.get(
//         entity,
//         getEvalValuePath(evaluatedPath, false),
//       );
//       const evalErrors = allEvalErrors.filter(
//         (error) => error.errorType !== PropertyEvaluationErrorType.LINT,
//       );
//       const idField = isWidget(entity) ? entity.widgetId : entity.actionId;
//       const nameField = isWidget(entity) ? entity.widgetName : entity.name;
//       const entityType = isWidget(entity)
//         ? ENTITY_TYPE.WIDGET
//         : ENTITY_TYPE.ACTION;
//       const debuggerKey = idField + "-" + propertyPath;
//       // if dataTree has error but debugger does not -> add
//       // if debugger has error and data tree has error -> update error
//       // if debugger has error but data tree does not -> remove
//       // if debugger or data tree does not have an error -> no change

//       if (evalErrors.length) {
//         // TODO Rank and set the most critical error
//         const error = evalErrors[0];
//         const errorMessages = evalErrors.map((e) => ({
//           message: e.errorMessage,
//         }));

//         if (!(debuggerKey in updatedDebuggerErrors)) {
//           store.dispatch(
//             logDebuggerErrorAnalytics({
//               eventName: "DEBUGGER_NEW_ERROR",
//               entityId: idField,
//               entityName: nameField,
//               entityType,
//               propertyPath,
//               errorMessages,
//             }),
//           );
//         }

//         const analyticsData = isWidget(entity)
//           ? {
//               widgetType: entity.type,
//             }
//           : {};

//         // Add or update
//         updatedDebuggerErrors[debuggerKey] = {
//           logType: LOG_TYPE.EVAL_ERROR,
//           text: PropertyEvalErrorTypeDebugMessage[error.errorType](
//             propertyPath,
//           ),
//           messages: errorMessages,
//           severity: error.severity,
//           timestamp: dayjs().format("hh:mm:ss"),
//           source: {
//             id: idField,
//             name: nameField,
//             type: entityType,
//             propertyPath: propertyPath,
//           },
//           state: {
//             [propertyPath]: evaluatedValue,
//           },
//           analytics: analyticsData,
//         };
//       } else if (debuggerKey in updatedDebuggerErrors) {
//         store.dispatch(
//           logDebuggerErrorAnalytics({
//             eventName: "DEBUGGER_RESOLVED_ERROR",
//             entityId: idField,
//             entityName: nameField,
//             entityType,
//             propertyPath:
//               updatedDebuggerErrors[debuggerKey].source?.propertyPath ?? "",
//             errorMessages: updatedDebuggerErrors[debuggerKey].messages ?? [],
//           }),
//         );
//         // Remove
//         delete updatedDebuggerErrors[debuggerKey];
//       }
//     }
//   }
//   return updatedDebuggerErrors;
// }

export function* evalErrorHandler(
  errors: EvalError[],
  dataTree?: DataTree,
  evaluationOrder?: Array<string>,
): any {
  // if (dataTree && evaluationOrder) {
  //   const currentDebuggerErrors: Record<string, Message> = yield select(
  //     getDebuggerErrors,
  //   );
  //   const evalPropertyErrors = getLatestEvalPropertyErrors(
  //     currentDebuggerErrors,
  //     dataTree,
  //     evaluationOrder,
  //   );

  //   yield put({
  //     type: ReduxActionTypes.DEBUGGER_UPDATE_ERROR_LOGS,
  //     payload: evalPropertyErrors,
  //   });
  // }

  errors.forEach((error) => {
    switch (error.type) {
      case EvalErrorTypes.CYCLICAL_DEPENDENCY_ERROR: {
        log.debug(error);
        if (error.context) {
          // Add more info about node for the toast
          // Toaster.show({
          //   text: `${error.message} Node was: ${node}`,
          //   variant: Variant.danger,
          // });
        }
        break;
      }
      case EvalErrorTypes.EVAL_TREE_ERROR: {
        log.debug(error);
        // Toaster.show({
        //   text: createMessage(ERROR_EVAL_ERROR_GENERIC),
        //   variant: Variant.danger,
        // });
        break;
      }
      case EvalErrorTypes.BAD_UNEVAL_TREE_ERROR: {
        // Sentry.captureException(error);
        break;
      }
      case EvalErrorTypes.EVAL_TRIGGER_ERROR: {
        log.debug(error);
        // Toaster.show({
        //   text: createMessage(ERROR_EVAL_TRIGGER, error.message),
        //   variant: Variant.danger,
        //   showDebugButton: true,
        // });
        break;
      }
      case EvalErrorTypes.EVAL_PROPERTY_ERROR: {
        log.debug(error);
        break;
      }
      default: {
        // Sentry.captureException(error);
        log.debug(error);
      }
    }
  });
}

export function* postEvalActionDispatcher(
  actions: Array<ReduxAction<unknown> | ReduxActionWithoutPayload>,
) {
  for (const action of actions) {
    yield put(action);
  }
}
