import { createReducer } from "utils/AppsmithUtils";
import {
  ReduxActionTypes,
  ReduxAction,
  ReduxActionErrorTypes,
} from "constants/ReduxActionConstants";
import {
  Datasource,
  DatasourceStructure,
  MockDatasource,
} from "entities/Datasource";

export interface DatasourceDataState {
  list: Datasource[];
  loading: boolean;
  isTesting: boolean;
  isDeleting: boolean;
  fetchingDatasourceStructure: boolean;
  isRefreshingStructure: boolean;
  structure: Record<string, DatasourceStructure>;
  isFetchingMockDataSource: false;
  mockDatasourceList: any[];
}

const initialState: DatasourceDataState = {
  list: [],
  loading: false,
  isTesting: false,
  isDeleting: false,
  fetchingDatasourceStructure: false,
  isRefreshingStructure: false,
  structure: {},
  isFetchingMockDataSource: false,
  mockDatasourceList: [],
};

const datasourceReducer = createReducer(initialState, {
  [ReduxActionTypes.FETCH_MOCK_DATASOURCES_INIT]: (
    state: DatasourceDataState,
  ) => {
    return { ...state, isFetchingMockDataSource: true };
  },
  [ReduxActionTypes.FETCH_MOCK_DATASOURCES_SUCCESS]: (
    state: DatasourceDataState,
    action: ReduxAction<any>,
  ) => {
    const mockDatasourceList = action.payload as MockDatasource[];
    return { ...state, isFetchingMockDataSource: false, mockDatasourceList };
  },
  [ReduxActionErrorTypes.FETCH_MOCK_DATASOURCES_ERROR]: (
    state: DatasourceDataState,
  ) => {
    return { ...state, isFetchingMockDataSource: false };
  },
  [ReduxActionTypes.ADD_MOCK_DATASOURCES_INIT]: (
    state: DatasourceDataState,
  ) => {
    return { ...state, loading: true };
  },
  [ReduxActionTypes.ADD_MOCK_DATASOURCES_SUCCESS]: (
    state: DatasourceDataState,
    action: ReduxAction<Datasource>,
  ) => {
    return {
      ...state,
      loading: false,
      list: state.list.concat(action.payload),
    };
  },
  [ReduxActionErrorTypes.FETCH_MOCK_DATASOURCES_ERROR]: (
    state: DatasourceDataState,
  ) => {
    return { ...state, loading: false };
  },
  [ReduxActionTypes.FETCH_DATASOURCES_INIT]: (state: DatasourceDataState) => {
    return { ...state, loading: true };
  },
  [ReduxActionTypes.CREATE_DATASOURCE_INIT]: (state: DatasourceDataState) => {
    return { ...state, loading: true };
  },
  [ReduxActionTypes.CREATE_DATASOURCE_FROM_FORM_INIT]: (
    state: DatasourceDataState,
  ) => {
    return { ...state, loading: true };
  },
  [ReduxActionTypes.UPDATE_DATASOURCE_INIT]: (state: DatasourceDataState) => {
    return { ...state, loading: true };
  },
  [ReduxActionTypes.TEST_DATASOURCE_INIT]: (state: DatasourceDataState) => {
    return { ...state, isTesting: true };
  },
  [ReduxActionTypes.DELETE_DATASOURCE_INIT]: (state: DatasourceDataState) => {
    return { ...state, isDeleting: true };
  },
  [ReduxActionTypes.REFRESH_DATASOURCE_STRUCTURE_INIT]: (
    state: DatasourceDataState,
  ) => {
    return { ...state, isRefreshingStructure: true };
  },
  [ReduxActionTypes.FETCH_DATASOURCE_STRUCTURE_INIT]: (
    state: DatasourceDataState,
  ) => {
    return { ...state, fetchingDatasourceStructure: true };
  },
  [ReduxActionTypes.FETCH_DATASOURCE_STRUCTURE_SUCCESS]: (
    state: DatasourceDataState,
    action: ReduxAction<{ data: DatasourceStructure; datasourceId: string }>,
  ) => {
    return {
      ...state,
      fetchingDatasourceStructure: false,
      structure: {
        ...state.structure,
        [action.payload.datasourceId]: action.payload.data,
      },
    };
  },
  [ReduxActionTypes.REFRESH_DATASOURCE_STRUCTURE_SUCCESS]: (
    state: DatasourceDataState,
    action: ReduxAction<{ data: DatasourceStructure; datasourceId: string }>,
  ) => {
    return {
      ...state,
      isRefreshingStructure: false,
      structure: {
        ...state.structure,
        [action.payload.datasourceId]: action.payload.data,
      },
    };
  },
  [ReduxActionErrorTypes.FETCH_DATASOURCE_STRUCTURE_ERROR]: (
    state: DatasourceDataState,
  ) => {
    return {
      ...state,
      fetchingDatasourceStructure: false,
    };
  },
  [ReduxActionTypes.FETCH_DATASOURCES_SUCCESS]: (
    state: DatasourceDataState,
    action: ReduxAction<Datasource[]>,
  ) => {
    return {
      ...state,
      loading: false,
      list: action.payload,
    };
  },
  [ReduxActionTypes.TEST_DATASOURCE_SUCCESS]: (
    state: DatasourceDataState,
    action: ReduxAction<{
      show: boolean;
      id?: string;
      messages?: Array<string>;
      error?: any;
    }>,
  ): DatasourceDataState => {
    if (action.payload.id) {
      const list = state.list.map((datasource) => {
        if (datasource.id === action.payload.id) {
          return { ...datasource, messages: action.payload.messages };
        }
        return datasource;
      });
      return {
        ...state,
        isTesting: false,
        list: list,
      };
    }
    return {
      ...state,
      isTesting: false,
    };
  },
  [ReduxActionTypes.DELETE_DATASOURCE_SUCCESS]: (
    state: DatasourceDataState,
    action: ReduxAction<Datasource>,
  ) => {
    return {
      ...state,
      isDeleting: false,
      list: state.list.filter(
        (datasource) => datasource.id !== action.payload.id,
      ),
    };
  },
  [ReduxActionTypes.CREATE_DATASOURCE_SUCCESS]: (
    state: DatasourceDataState,
    action: ReduxAction<Datasource>,
  ) => {
    return {
      ...state,
      loading: false,
      list: state.list.concat(action.payload),
    };
  },
  [ReduxActionTypes.UPDATE_DATASOURCE_SUCCESS]: (
    state: DatasourceDataState,
    action: ReduxAction<Datasource>,
  ): DatasourceDataState => {
    return {
      ...state,
      loading: false,
      list: state.list.map((datasource) => {
        if (datasource.id === action.payload.id) return action.payload;

        return datasource;
      }),
    };
  },
  [ReduxActionTypes.SAVE_DATASOURCE_NAME_SUCCESS]: (
    state: DatasourceDataState,
    action: ReduxAction<Datasource>,
  ): DatasourceDataState => {
    return {
      ...state,
      loading: false,
      list: state.list.map((datasource) => {
        if (datasource.id === action.payload.id) return action.payload;

        return datasource;
      }),
    };
  },
  [ReduxActionErrorTypes.CREATE_DATASOURCE_ERROR]: (
    state: DatasourceDataState,
  ) => {
    return {
      ...state,
      loading: false,
    };
  },
  [ReduxActionErrorTypes.DELETE_DATASOURCE_ERROR]: (
    state: DatasourceDataState,
  ) => {
    return { ...state, isDeleting: false };
  },
  [ReduxActionErrorTypes.TEST_DATASOURCE_ERROR]: (
    state: DatasourceDataState,
    action: ReduxAction<{
      show: boolean;
      id?: string;
      messages?: Array<string>;
      error?: any;
    }>,
  ): DatasourceDataState => {
    if (action.payload.id) {
      const list = state.list.map((datasource) => {
        if (datasource.id === action.payload.id) {
          return { ...datasource, messages: action.payload.messages };
        }
        return datasource;
      });
      return {
        ...state,
        isTesting: false,
        list: list,
      };
    }
    return {
      ...state,
      isTesting: false,
    };
  },
  [ReduxActionErrorTypes.UPDATE_DATASOURCE_ERROR]: (
    state: DatasourceDataState,
  ): DatasourceDataState => {
    return {
      ...state,
      loading: false,
    };
  },
  [ReduxActionErrorTypes.REFRESH_DATASOURCE_STRUCTURE_ERROR]: (
    state: DatasourceDataState,
  ) => {
    return {
      ...state,
      isRefreshingStructure: false,
    };
  },
});

export default datasourceReducer;
