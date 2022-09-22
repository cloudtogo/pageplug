import { reduxBatch } from "@manaflair/redux-batch";
import { createStore, applyMiddleware, Middleware } from "redux";
import appReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "sagas";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";
import {
  ReduxAction,
  ReduxActionTypes,
} from "@appsmith/constants/ReduxActionConstants";
import { updateURLFactory } from "RouteBuilder";

const routeParamsMiddleware: Middleware =
  () => (next: any) => (action: ReduxAction<any>) => {
    switch (action.type) {
      case ReduxActionTypes.FETCH_APPLICATION_SUCCESS: {
        const { applicationVersion, id, slug } = action.payload;
        updateURLFactory({
          applicationId: id,
          applicationSlug: slug,
          applicationVersion,
        });
        break;
      }
      case ReduxActionTypes.SWITCH_CURRENT_PAGE_ID: {
        const id = action.payload.id;
        const slug = action.payload.slug;
        updateURLFactory({ pageId: id, pageSlug: slug });
        break;
      }
      case ReduxActionTypes.UPDATE_APPLICATION_SUCCESS:
        const { applicationVersion } = action.payload;
        updateURLFactory({ applicationVersion });
        break;
      default:
        break;
    }
    return next(action);
  };

export const newStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    appReducer,
    composeWithDevTools(
      reduxBatch,
      applyMiddleware(sagaMiddleware, routeParamsMiddleware),
      reduxBatch
    )
  );

  sagaMiddleware.run(rootSaga);
  return store;
};
