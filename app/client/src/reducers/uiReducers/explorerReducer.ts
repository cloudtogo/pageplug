import { createReducer } from "utils/AppsmithUtils";
import {
  ReduxAction,
  ReduxActionTypes,
  ReduxActionErrorTypes,
} from "constants/ReduxActionConstants";

export interface ExplorerReduxState {
  updatingEntity?: string;
  updateEntityError?: string;
  editingEntityName?: string;
}
const initialState: ExplorerReduxState = {};

const setUpdatingEntity = (
  state: ExplorerReduxState,
  action: ReduxAction<{ id: string }>,
) => {
  return { updatingEntity: action.payload.id, updateEntityError: undefined };
};

const setEntityUpdateError = (state: ExplorerReduxState) => {
  return { updatingEntity: undefined, updateEntityError: state.updatingEntity };
};

const setEntityUpdateSuccess = () => {
  return {};
};

const setUpdatingDatasourceEntity = (
  state: ExplorerReduxState,
  action: ReduxAction<{ id: string }>,
) => {
  const pathParts = window.location.pathname.split("/");
  const pageId = pathParts[pathParts.indexOf("pages") + 1];

  if (!state.updatingEntity?.includes(action.payload.id)) {
    return {
      updatingEntity: `${action.payload.id}-${pageId}`,
      updateEntityError: undefined,
    };
  }

  return state;
};

const explorerReducer = createReducer(initialState, {
  [ReduxActionTypes.FETCH_PAGE_INIT]: setUpdatingEntity,
  [ReduxActionErrorTypes.FETCH_PAGE_ERROR]: setEntityUpdateError,
  [ReduxActionTypes.FETCH_PAGE_SUCCESS]: setEntityUpdateSuccess,

  [ReduxActionTypes.CLONE_PAGE_INIT]: setUpdatingEntity,
  [ReduxActionErrorTypes.CLONE_PAGE_ERROR]: setEntityUpdateError,
  [ReduxActionTypes.CLONE_PAGE_SUCCESS]: setEntityUpdateSuccess,

  [ReduxActionTypes.MOVE_ACTION_INIT]: setUpdatingEntity,
  [ReduxActionErrorTypes.MOVE_ACTION_ERROR]: setEntityUpdateError,
  [ReduxActionTypes.MOVE_ACTION_SUCCESS]: setEntityUpdateSuccess,

  [ReduxActionTypes.COPY_ACTION_INIT]: setUpdatingEntity,
  [ReduxActionErrorTypes.COPY_ACTION_ERROR]: setEntityUpdateError,
  [ReduxActionTypes.COPY_ACTION_SUCCESS]: setEntityUpdateSuccess,

  [ReduxActionTypes.DELETE_ACTION_INIT]: setUpdatingEntity,
  [ReduxActionErrorTypes.DELETE_ACTION_ERROR]: setEntityUpdateError,
  [ReduxActionTypes.DELETE_ACTION_SUCCESS]: setEntityUpdateSuccess,

  [ReduxActionTypes.DELETE_DATASOURCE_INIT]: setUpdatingDatasourceEntity,
  [ReduxActionErrorTypes.DELETE_DATASOURCE_ERROR]: setEntityUpdateError,
  [ReduxActionTypes.DELETE_DATASOURCE_SUCCESS]: setEntityUpdateSuccess,

  [ReduxActionTypes.UPDATE_DATASOURCE_INIT]: setUpdatingDatasourceEntity,
  [ReduxActionErrorTypes.UPDATE_DATASOURCE_ERROR]: setEntityUpdateError,
  [ReduxActionTypes.UPDATE_DATASOURCE_SUCCESS]: setEntityUpdateSuccess,

  [ReduxActionTypes.FETCH_DATASOURCE_STRUCTURE_INIT]: setUpdatingDatasourceEntity,
  [ReduxActionErrorTypes.FETCH_DATASOURCE_STRUCTURE_ERROR]: setEntityUpdateError,
  [ReduxActionTypes.FETCH_DATASOURCE_STRUCTURE_SUCCESS]: setEntityUpdateSuccess,

  [ReduxActionTypes.REFRESH_DATASOURCE_STRUCTURE_INIT]: setUpdatingDatasourceEntity,
  [ReduxActionErrorTypes.REFRESH_DATASOURCE_STRUCTURE_ERROR]: setEntityUpdateError,
  [ReduxActionTypes.REFRESH_DATASOURCE_STRUCTURE_SUCCESS]: setEntityUpdateSuccess,

  [ReduxActionTypes.UPDATE_PAGE_INIT]: setUpdatingEntity,
  [ReduxActionErrorTypes.UPDATE_PAGE_ERROR]: setEntityUpdateError,
  [ReduxActionTypes.UPDATE_PAGE_SUCCESS]: setEntityUpdateSuccess,

  [ReduxActionTypes.SET_DEFAULT_APPLICATION_PAGE_INIT]: setUpdatingEntity,
  [ReduxActionErrorTypes.SET_DEFAULT_APPLICATION_PAGE_ERROR]: setEntityUpdateError,
  [ReduxActionTypes.SET_DEFAULT_APPLICATION_PAGE_SUCCESS]: setEntityUpdateSuccess,

  [ReduxActionTypes.UPDATE_WIDGET_NAME_INIT]: setUpdatingEntity,
  [ReduxActionErrorTypes.UPDATE_WIDGET_NAME_ERROR]: setEntityUpdateError,
  [ReduxActionTypes.UPDATE_WIDGET_NAME_SUCCESS]: setEntityUpdateSuccess,

  [ReduxActionTypes.SAVE_ACTION_NAME_INIT]: setUpdatingEntity,
  [ReduxActionErrorTypes.SAVE_ACTION_NAME_ERROR]: setEntityUpdateError,
  [ReduxActionTypes.SAVE_ACTION_NAME_SUCCESS]: setEntityUpdateSuccess,

  [ReduxActionTypes.INIT_EXPLORER_ENTITY_NAME_EDIT]: (
    state: ExplorerReduxState,
    action: ReduxAction<{ id: string }>,
  ) => {
    return { editingEntityName: action.payload.id };
  },
  [ReduxActionTypes.END_EXPLORER_ENTITY_NAME_EDIT]: () => {
    return {};
  },
});

export default explorerReducer;
