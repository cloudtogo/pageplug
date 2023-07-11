import React, { useCallback, useEffect, useRef, useState } from "react";
import { getActionBlocks, getCallExpressions } from "@shared/ast";
import type { ActionCreatorProps, ActionTree } from "./types";
import {
<<<<<<< HEAD
<<<<<<< HEAD
  JsFileIconV2,
  jsFunctionIcon,
} from "pages/Editor/Explorer/ExplorerIcons";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@appsmith/reducers";
import {
  getDataTreeForActionCreator,
  getWidgetOptionsTree,
} from "sagas/selectors";
import {
  getCurrentApplicationId,
  getCurrentPageId,
} from "selectors/editorSelectors";
import { isMobileLayout } from "selectors/applicationSelectors";
import {
  getActionsForCurrentPage,
  getJSCollectionsForCurrentPage,
  getPageListAsOptions,
} from "selectors/entitiesSelector";
import {
  getModalDropdownList,
  getNextModalName,
} from "selectors/widgetSelectors";
import Fields from "./Fields";
import { ENTITY_TYPE } from "entities/DataTree/dataTreeFactory";
import { getEntityNameAndPropertyPath } from "@appsmith/workers/Evaluation/evaluationUtils";
import type { JSCollectionData } from "reducers/entityReducers/jsActionsReducer";
import { createNewJSCollection } from "actions/jsPaneActions";
import type { JSAction, Variable } from "entities/JSCollection";
import {
  CLEAR_INTERVAL,
  CLEAR_STORE,
  CLOSE_MODAL,
  COPY_TO_CLIPBOARD,
  createMessage,
  DOWNLOAD,
  EXECUTE_A_QUERY,
  EXECUTE_JS_FUNCTION,
  GET_GEO_LOCATION,
  NAVIGATE_TO,
  NO_ACTION,
  OPEN_MODAL,
  POST_MESSAGE,
  REMOVE_VALUE,
  RESET_WIDGET,
  SET_INTERVAL,
  SHOW_MESSAGE,
  STOP_WATCH_GEO_LOCATION,
  STORE_VALUE,
  WATCH_GEO_LOCATION,
} from "@appsmith/constants/messages";
import { setGlobalSearchCategory } from "actions/globalSearchActions";
import { filterCategories, SEARCH_CATEGORY_ID } from "../GlobalSearch/utils";
import type { ActionDataState } from "reducers/entityReducers/actionsReducer";
import { selectFeatureFlags } from "selectors/usersSelectors";
import type FeatureFlags from "entities/FeatureFlags";
import { isValidURL } from "utils/URLUtils";
import { ACTION_ANONYMOUS_FUNC_REGEX, ACTION_TRIGGER_REGEX } from "./regex";
import {
  NAVIGATE_TO_TAB_OPTIONS,
  AppsmithFunction,
  FieldType,
} from "./constants";
import type {
  SwitchType,
  ActionCreatorProps,
  GenericFunction,
  DataTreeForActionCreator,
} from "./types";
=======
=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
  getCodeFromMoustache,
  getSelectedFieldFromValue,
  isEmptyBlock,
} from "./utils";
import { diff } from "deep-diff";
import Action from "./viewComponents/Action";
import { useSelector } from "react-redux";
import { selectEvaluationVersion } from "@appsmith/selectors/applicationSelectors";
import { generateReactKey } from "../../../utils/generators";
import { useApisQueriesAndJsActionOptions } from "./helpers";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { getActionTypeLabel } from "./viewComponents/ActionBlockTree/utils";
<<<<<<< HEAD
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f

export const ActionCreatorContext = React.createContext<{
  label: string;
  selectBlock: (id: string) => void;
  selectedBlockId?: string;
}>({
  label: "",
  selectBlock: () => {
    return;
  },
  selectedBlockId: "",
});

<<<<<<< HEAD
<<<<<<< HEAD
const mobileHiddenActionMap = {
  [AppsmithFunction.download]: true,
  [AppsmithFunction.resetWidget]: true,
  [AppsmithFunction.getGeolocation]: true,
  [AppsmithFunction.watchGeolocation]: true,
  [AppsmithFunction.stopWatchGeolocation]: true,
  [AppsmithFunction.postMessage]: true,
};

const getBaseOptions = (featureFlags: FeatureFlags, isMobile?: boolean) => {
  const { JS_EDITOR: isJSEditorEnabled } = featureFlags;
  if (isJSEditorEnabled) {
    const jsOption = baseOptions.find(
      (option: any) => option.value === AppsmithFunction.jsFunction,
    );
    if (!jsOption) {
      baseOptions.splice(2, 0, {
        label: createMessage(EXECUTE_JS_FUNCTION),
        value: AppsmithFunction.jsFunction,
      });
    }
  }
  if (isMobile) {
    // hide some actions in mobile app
    return baseOptions.filter((o: any) => !mobileHiddenActionMap[o.value]);
  }
  return baseOptions;
};

function getFieldFromValue(
  value: string | undefined,
  activeTabNavigateTo: SwitchType,
  getParentValue?: (changeValue: string) => string,
  dataTree?: DataTreeForActionCreator,
  isMobile?: boolean,
): any[] {
  const fields: any[] = [];
  if (!value) {
    return [
      {
        field: FieldType.ACTION_SELECTOR_FIELD,
        getParentValue,
        value,
      },
    ];
  }
  let entity;
  if (isString(value)) {
    const trimmedVal = value && value.replace(/(^{{)|(}}$)/g, "");
    const entityProps = getEntityNameAndPropertyPath(trimmedVal);
    entity = dataTree && dataTree[entityProps.entityName];
  }
  if (entity && "ENTITY_TYPE" in entity) {
    if (entity.ENTITY_TYPE === ENTITY_TYPE.ACTION) {
      fields.push({
        field: FieldType.ACTION_SELECTOR_FIELD,
        getParentValue,
        value,
      });
      const matches = [...value.matchAll(ACTION_TRIGGER_REGEX)];
      if (matches.length) {
        const funcArgs = matches[0][2];
        const args = [...funcArgs.matchAll(ACTION_ANONYMOUS_FUNC_REGEX)];
        const successArg = args[0];
        const errorArg = args[1];
        let successValue;
        if (successArg && successArg.length > 0) {
          successValue = successArg[1] !== "{}" ? `{{${successArg[1]}}}` : ""; //successArg[1] + successArg[2];
        }
        const successFields = getFieldFromValue(
          successValue,
          activeTabNavigateTo,
          (changeValue: string) => {
            const matches = [...value.matchAll(ACTION_TRIGGER_REGEX)];
            const args = [
              ...matches[0][2].matchAll(ACTION_ANONYMOUS_FUNC_REGEX),
            ];
            const errorArg = args[1] ? args[1][0] : "() => {}";
            const successArg = changeValue.endsWith(")")
              ? `() => ${changeValue}`
              : `() => {}`;

            return value.replace(
              ACTION_TRIGGER_REGEX,
              `{{$1(${successArg}, ${errorArg})}}`,
            );
          },
          dataTree,
          isMobile,
=======
const ActionCreator = React.forwardRef(
  (props: ActionCreatorProps, ref: any) => {
    const [actions, setActions] = useState<Record<string, string>>(() => {
      const blocks = getActionBlocks(
        getCodeFromMoustache(props.value),
        window.evaluationVersion,
      );

      const res = blocks.reduce(
        (acc: Record<string, string>, value: string) => ({
          ...acc,
          [generateReactKey()]: value,
        }),
        {},
      );

=======
const ActionCreator = React.forwardRef(
  (props: ActionCreatorProps, ref: any) => {
    const [actions, setActions] = useState<Record<string, string>>(() => {
      const blocks = getActionBlocks(
        getCodeFromMoustache(props.value),
        window.evaluationVersion,
      );

      const res = blocks.reduce(
        (acc: Record<string, string>, value: string) => ({
          ...acc,
          [generateReactKey()]: value,
        }),
        {},
      );

>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      return res;
    });

    const updatedIdRef = useRef<string>("");
    const previousBlocks = useRef<string[]>([]);
    const evaluationVersion = useSelector(selectEvaluationVersion);

    const actionOptions = useApisQueriesAndJsActionOptions(() => null);

    useEffect(() => {
      setActions((prev) => {
        const newActions: Record<string, string> = {};
        const newBlocks: string[] = getActionBlocks(
          getCodeFromMoustache(props.value),
          evaluationVersion,
<<<<<<< HEAD
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
        );

        let prevIdValuePairs = Object.entries(prev);

        // We make sure that code blocks from previous render retain the same id
        // We are sure that the order of the blocks will be the same
        newBlocks.forEach((block) => {
          const prevIdValuePair = prevIdValuePairs.find(
            ([, value]) => value === block,
          );
          if (prevIdValuePair) {
            newActions[prevIdValuePair[0]] = block;

=======
        );

        let prevIdValuePairs = Object.entries(prev);

        // We make sure that code blocks from previous render retain the same id
        // We are sure that the order of the blocks will be the same
        newBlocks.forEach((block) => {
          const prevIdValuePair = prevIdValuePairs.find(
            ([, value]) => value === block,
          );
          if (prevIdValuePair) {
            newActions[prevIdValuePair[0]] = block;

>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
            // Filter out the id value pair so that it's not used again
            prevIdValuePairs = prevIdValuePairs.filter(
              ([id]) => id !== prevIdValuePair[0],
            );
<<<<<<< HEAD
<<<<<<< HEAD
          },
          dataTree,
          isMobile,
        );
        errorFields[0].label = "onError";
        fields.push(errorFields);
      }
      return fields;
    }
    if (entity.ENTITY_TYPE === ENTITY_TYPE.JSACTION) {
      const matches = [...value.matchAll(ACTION_TRIGGER_REGEX)];
      if (matches.length === 0) {
        //when format doesn't match but it is function from js object
        fields.push({
          field: FieldType.ACTION_SELECTOR_FIELD,
          getParentValue,
          value,
          args: [],
        });
      } else if (matches.length) {
        const entityPropertyPath = matches[0][1];
        const { propertyPath } =
          getEntityNameAndPropertyPath(entityPropertyPath);
        const path = propertyPath && propertyPath.replace("()", "");
        const argsProps =
          path &&
          entity.meta &&
          entity.meta[path] &&
          entity.meta[path].arguments;
        fields.push({
          field: FieldType.ACTION_SELECTOR_FIELD,
          getParentValue,
          value,
          args: argsProps ? argsProps : [],
        });
        if (argsProps && argsProps.length > 0) {
          for (let i = 0; i < argsProps.length; i++) {
            fields.push({
              field: FieldType.ARGUMENT_KEY_VALUE_FIELD,
              getParentValue,
              value,
              label: argsProps[i].name,
              index: i,
            });
          }
        }
      }
      return fields;
    }
  }
  fields.push({
    field: FieldType.ACTION_SELECTOR_FIELD,
    getParentValue,
    value,
  });
  if (value.indexOf("navigateTo") !== -1) {
    if (!isMobile) {
      fields.push({
        field: FieldType.PAGE_NAME_AND_URL_TAB_SELECTOR_FIELD,
      });
    }

    if (activeTabNavigateTo.id === NAVIGATE_TO_TAB_OPTIONS.PAGE_NAME) {
      fields.push({
        field: FieldType.PAGE_SELECTOR_FIELD,
      });
    } else {
      fields.push({
        field: FieldType.URL_FIELD,
        isMobile,
      });
    }

    fields.push({
      field: FieldType.QUERY_PARAMS_FIELD,
    });
    if (!isMobile) {
      fields.push({
        field: FieldType.NAVIGATION_TARGET_FIELD,
      });
    }
  }

  if (value.indexOf("showModal") !== -1) {
    fields.push({
      field: FieldType.SHOW_MODAL_FIELD,
    });
  }
  if (value.indexOf("closeModal") !== -1) {
    fields.push({
      field: FieldType.CLOSE_MODAL_FIELD,
    });
  }
  if (value.indexOf("showAlert") !== -1) {
    fields.push(
      {
        field: FieldType.ALERT_TEXT_FIELD,
      },
      {
        field: FieldType.ALERT_TYPE_SELECTOR_FIELD,
        isMobile,
      },
    );
  }
  if (value.indexOf("storeValue") !== -1) {
    fields.push(
      {
        field: FieldType.KEY_TEXT_FIELD,
      },
      {
        field: FieldType.VALUE_TEXT_FIELD,
      },
    );
  }
  if (value.indexOf("removeValue") !== -1) {
    fields.push({
      field: FieldType.KEY_TEXT_FIELD,
    });
  }
  if (value.indexOf("resetWidget") !== -1) {
    fields.push(
      {
        field: FieldType.WIDGET_NAME_FIELD,
      },
      {
        field: FieldType.RESET_CHILDREN_FIELD,
      },
    );
  }
  if (value.indexOf("download") !== -1) {
    fields.push(
      {
        field: FieldType.DOWNLOAD_DATA_FIELD,
      },
      {
        field: FieldType.DOWNLOAD_FILE_NAME_FIELD,
      },
      {
        field: FieldType.DOWNLOAD_FILE_TYPE_FIELD,
      },
    );
  }
  if (value.indexOf("copyToClipboard") !== -1) {
    fields.push({
      field: FieldType.COPY_TEXT_FIELD,
    });
  }
  if (value.indexOf("setInterval") !== -1) {
    fields.push(
      {
        field: FieldType.CALLBACK_FUNCTION_FIELD,
      },
      {
        field: FieldType.DELAY_FIELD,
      },
      {
        field: FieldType.ID_FIELD,
=======
          } else if (childUpdate.current && updatedIdRef?.current) {
            // Child updates come with the id of the block that was updated
            newActions[updatedIdRef.current] = block;
            prevIdValuePairs = prevIdValuePairs.filter(
              ([id]) => id !== updatedIdRef.current,
            );
            updatedIdRef.current = "";
            childUpdate.current = false;
          } else {
            // If the block is not present in the previous blocks, it's a new block
            // We need to check if the block is a result of an edit
            // If it is, we need to retain the id of the previous block
            // This is to ensure that the undo/redo stack is not broken
            const differences = diff(previousBlocks.current, newBlocks);
            if (differences?.length === 1 && differences[0].kind === "E") {
              const edit = differences[0];
              //@ts-expect-error fix later
              const prevBlock = edit.lhs as string;
              const prevIdValuePair = prevIdValuePairs.find(
                ([, value]) => value === prevBlock,
              );
              if (prevIdValuePair) {
                newActions[prevIdValuePair[0]] = block;
                prevIdValuePairs = prevIdValuePairs.filter(
                  ([id]) => id !== prevIdValuePair[0],
                );
                return;
              }
            }
            newActions[generateReactKey()] = block;
          }
        });
        previousBlocks.current = [...newBlocks];
        updatedIdRef.current = "";
        childUpdate.current = false;
        return newActions;
      });
    }, [props.value]);

    const save = useCallback(
      (newActions) => {
        props.onValueChange(
          Object.values(newActions).length > 0
            ? `{{${Object.values(newActions).filter(Boolean).join("\n")}}}`
            : "",
          false,
        );
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
      },
      [props.onValueChange],
    );

    /** This variable will be set for all changes that happen from the Action blocks
     * It will be unset for all the changes that happen from the parent components (Undo/Redo)
     */
    const childUpdate = React.useRef(false);

    const handleActionChange = (id: string) => (value: string) => {
      const newValueWithoutMoustache = getCodeFromMoustache(value);
      const newActions = { ...actions };
      updatedIdRef.current = id;
      childUpdate.current = true;
      if (newValueWithoutMoustache) {
        newActions[id] = newValueWithoutMoustache;
        const prevValue = actions[id];
        const option = getSelectedFieldFromValue(
          newValueWithoutMoustache,
          actionOptions,
        );

        const actionType = (option?.type ||
          option?.value) as ActionTree["actionType"];

<<<<<<< HEAD
  let finalList: TreeDropdownOption[] = [
    {
      label: "新建弹窗",
      value: "Modal",
      id: "create",
      icon: "plus",
      className: "t--create-modal-btn",
      onSelect: (option: TreeDropdownOption, setter?: GenericFunction) => {
        const modalName = nextModalName;
        if (setter) {
          setter({
            value: `${modalName}`,
          });
          dispatch(createModalAction(modalName));
        }
      },
    },
  ];

  finalList = finalList.concat(
    (useSelector(getModalDropdownList) || []) as TreeDropdownOption[],
  );

  return finalList;
}

function getIntegrationOptionsWithChildren(
  pageId: string,
  applicationId: string,
  plugins: any,
  options: TreeDropdownOption[],
  actions: ActionDataState,
  jsActions: Array<JSCollectionData>,
  createIntegrationOption: TreeDropdownOption,
  dispatch: any,
  featureFlags: FeatureFlags,
) {
  const { JS_EDITOR: isJSEditorEnabled } = featureFlags;
  const createJSObject: TreeDropdownOption = {
    label: "新建 JS 对象",
    value: "JSObject",
    id: "create",
    icon: "plus",
    className: "t--create-js-object-btn",
    onSelect: () => {
      dispatch(createNewJSCollection(pageId, "ACTION_SELECTOR"));
    },
  };
  const queries = actions.filter(
    (action) => action.config.pluginType === PluginType.DB,
  );
  const apis = actions.filter(
    (action) =>
      action.config.pluginType === PluginType.API ||
      action.config.pluginType === PluginType.SAAS ||
      action.config.pluginType === PluginType.REMOTE,
  );
  const option = options.find(
    (option) => option.value === AppsmithFunction.integration,
  );
=======
        // If the previous value was empty, we're adding a new action
        if (prevValue === "") {
          AnalyticsUtil.logEvent("ACTION_ADDED", {
            actionType: getActionTypeLabel(actionType),
            code: newValueWithoutMoustache,
            callback: null,
          });
=======
          } else if (childUpdate.current && updatedIdRef?.current) {
            // Child updates come with the id of the block that was updated
            newActions[updatedIdRef.current] = block;
            prevIdValuePairs = prevIdValuePairs.filter(
              ([id]) => id !== updatedIdRef.current,
            );
            updatedIdRef.current = "";
            childUpdate.current = false;
          } else {
            // If the block is not present in the previous blocks, it's a new block
            // We need to check if the block is a result of an edit
            // If it is, we need to retain the id of the previous block
            // This is to ensure that the undo/redo stack is not broken
            const differences = diff(previousBlocks.current, newBlocks);
            if (differences?.length === 1 && differences[0].kind === "E") {
              const edit = differences[0];
              //@ts-expect-error fix later
              const prevBlock = edit.lhs as string;
              const prevIdValuePair = prevIdValuePairs.find(
                ([, value]) => value === prevBlock,
              );
              if (prevIdValuePair) {
                newActions[prevIdValuePair[0]] = block;
                prevIdValuePairs = prevIdValuePairs.filter(
                  ([id]) => id !== prevIdValuePair[0],
                );
                return;
              }
            }
            newActions[generateReactKey()] = block;
          }
        });
        previousBlocks.current = [...newBlocks];
        updatedIdRef.current = "";
        childUpdate.current = false;
        return newActions;
      });
    }, [props.value]);

    const save = useCallback(
      (newActions) => {
        props.onValueChange(
          Object.values(newActions).length > 0
            ? `{{${Object.values(newActions).filter(Boolean).join("\n")}}}`
            : "",
          false,
        );
      },
      [props.onValueChange],
    );

    /** This variable will be set for all changes that happen from the Action blocks
     * It will be unset for all the changes that happen from the parent components (Undo/Redo)
     */
    const childUpdate = React.useRef(false);

    const handleActionChange = (id: string) => (value: string) => {
      const newValueWithoutMoustache = getCodeFromMoustache(value);
      const newActions = { ...actions };
      updatedIdRef.current = id;
      childUpdate.current = true;
      if (newValueWithoutMoustache) {
        newActions[id] = newValueWithoutMoustache;
        const prevValue = actions[id];
        const option = getSelectedFieldFromValue(
          newValueWithoutMoustache,
          actionOptions,
        );

        const actionType = (option?.type ||
          option?.value) as ActionTree["actionType"];

        // If the previous value was empty, we're adding a new action
        if (prevValue === "") {
          AnalyticsUtil.logEvent("ACTION_ADDED", {
            actionType: getActionTypeLabel(actionType),
            code: newValueWithoutMoustache,
            callback: null,
          });
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
        } else {
          const prevRootCallExpression = getCallExpressions(
            actions[id],
            evaluationVersion,
          )[0];
          const newRootCallExpression = getCallExpressions(
            newValueWithoutMoustache,
            evaluationVersion,
          )[0];
<<<<<<< HEAD
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f

          // We don't want the modified event to be triggered when the success/failure
          // callbacks are modified/added/removed
          // So, we check if the root call expression is the same
          if (prevRootCallExpression?.code !== newRootCallExpression?.code) {
            AnalyticsUtil.logEvent("ACTION_MODIFIED", {
              actionType: getActionTypeLabel(actionType),
              code: newValueWithoutMoustache,
              callback: null,
            });
          }
        }
      } else {
        const option = getSelectedFieldFromValue(newActions[id], actionOptions);
        const actionType = (option?.type ||
          option?.value) as ActionTree["actionType"];
        AnalyticsUtil.logEvent("ACTION_DELETED", {
          actionType: getActionTypeLabel(actionType),
          code: newActions[id],
          callback: null,
        });
        delete newActions[id];
        !actions[id] && setActions(newActions);
      }
      save(newActions);
    };

<<<<<<< HEAD
<<<<<<< HEAD
function useIntegrationsOptionTree() {
  const pageId = useSelector(getCurrentPageId) || "";
  const applicationId = useSelector(getCurrentApplicationId) as string;
  const featureFlags = useSelector(selectFeatureFlags);
  const dispatch = useDispatch();
  const plugins = useSelector((state: AppState) => {
    return state.entities.plugins.list;
  });
  const pluginGroups: any = useMemo(() => keyBy(plugins, "id"), [plugins]);
  const actions = useSelector(getActionsForCurrentPage);
  const jsActions = useSelector(getJSCollectionsForCurrentPage);
  const isMobile = useSelector(isMobileLayout);

  return getIntegrationOptionsWithChildren(
    pageId,
    applicationId,
    pluginGroups,
    getBaseOptions(featureFlags, isMobile),
    actions,
    jsActions,
    {
      label: "新建查询",
      value: "datasources",
      id: "create",
      icon: "plus",
      className: "t--create-datasources-query-btn",
      onSelect: () => {
        dispatch(
          setGlobalSearchCategory(
            filterCategories[SEARCH_CATEGORY_ID.ACTION_OPERATION],
          ),
        );
      },
    },
    dispatch,
    featureFlags,
  );
}
=======
    // We need a unique id for each action when it's mapped
    // We can't use index for obvious reasons
    // We can't use the action value itself because it's not unique and changes on action change
    const [selectedBlockId, selectBlock] = useState<string | undefined>(
      undefined,
    );

    const id = useRef<string>("");
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44

    useEffect(() => {
      if (!id.current) return;
      const children = ref.current?.children || [];
      const lastChildElement = children[children.length - 1];
      lastChildElement?.scrollIntoView({ block: "nearest" });
      selectBlock(id.current);
      id.current = "";
    }, [actions]);

    useEffect(() => {
=======
    // We need a unique id for each action when it's mapped
    // We can't use index for obvious reasons
    // We can't use the action value itself because it's not unique and changes on action change
    const [selectedBlockId, selectBlock] = useState<string | undefined>(
      undefined,
    );

    const id = useRef<string>("");

    useEffect(() => {
      if (!id.current) return;
      const children = ref.current?.children || [];
      const lastChildElement = children[children.length - 1];
      lastChildElement?.scrollIntoView({ block: "nearest" });
      selectBlock(id.current);
      id.current = "";
    }, [actions]);

    useEffect(() => {
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      if (props.additionalControlData?.showEmptyBlock) {
        addBlock();
        props.additionalControlData?.setShowEmptyBlock(false);
      }
    }, [props.additionalControlData]);

<<<<<<< HEAD
<<<<<<< HEAD
const ActionCreator = React.forwardRef(
  (props: ActionCreatorProps, ref: any) => {
    const NAVIGATE_TO_TAB_SWITCHER: Array<SwitchType> = [
      {
        id: "page-name",
        text: "页面名称",
        action: () => {
          setActiveTabNavigateTo(NAVIGATE_TO_TAB_SWITCHER[0]);
        },
      },
      {
        id: "url",
        text: "URL",
        action: () => {
          setActiveTabNavigateTo(NAVIGATE_TO_TAB_SWITCHER[1]);
        },
      },
    ];

    const [activeTabNavigateTo, setActiveTabNavigateTo] = useState(
      NAVIGATE_TO_TAB_SWITCHER[isValueValidURL(props.value) ? 1 : 0],
    );
    const dataTree = useSelector(getDataTreeForActionCreator);
    const integrationOptionTree = useIntegrationsOptionTree();
    const widgetOptionTree = useSelector(getWidgetOptionsTree);
    const modalDropdownList = useModalDropdownList();
    const isMobile = useSelector(isMobileLayout);
    const pageDropdownOptions = useSelector(getPageListAsOptions);
    const fields = getFieldFromValue(
      props.value,
      activeTabNavigateTo,
      undefined,
      dataTree,
      isMobile,
=======
    const addBlock = useCallback(() => {
      const hasAnEmptyBlock = Object.entries(actions).find(([, action]) =>
        isEmptyBlock(action),
      );
      if (hasAnEmptyBlock) {
        selectBlock(hasAnEmptyBlock[0]);
        const children = ref.current?.children || [];
        const lastChildElement = children[children.length - 1];
        lastChildElement?.scrollIntoView({
          block: "nearest",
        });
        return;
      }
      const newActions = { ...actions };
      id.current = generateReactKey();
      newActions[id.current] = "";
      setActions(newActions);
    }, [actions, save]);

    const contextValue = React.useMemo(
      () => ({ label: props.action, selectedBlockId, selectBlock }),
      [selectedBlockId, props.action, selectBlock],
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
=======
    const addBlock = useCallback(() => {
      const hasAnEmptyBlock = Object.entries(actions).find(([, action]) =>
        isEmptyBlock(action),
      );
      if (hasAnEmptyBlock) {
        selectBlock(hasAnEmptyBlock[0]);
        const children = ref.current?.children || [];
        const lastChildElement = children[children.length - 1];
        lastChildElement?.scrollIntoView({
          block: "nearest",
        });
        return;
      }
      const newActions = { ...actions };
      id.current = generateReactKey();
      newActions[id.current] = "";
      setActions(newActions);
    }, [actions, save]);

    const contextValue = React.useMemo(
      () => ({ label: props.action, selectedBlockId, selectBlock }),
      [selectedBlockId, props.action, selectBlock],
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
    );

    return (
      <ActionCreatorContext.Provider value={contextValue}>
        <div className="flex flex-col gap-[2px]" ref={ref}>
          {Object.entries(actions).map(([id, value], index) => (
            <Action
              code={value}
              id={id}
              index={index}
              key={id}
              onChange={handleActionChange(id)}
            />
          ))}
        </div>
      </ActionCreatorContext.Provider>
    );
  },
);

ActionCreator.displayName = "ActionCreator";

export default ActionCreator;
