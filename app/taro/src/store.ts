import { reduxBatch } from "@manaflair/redux-batch";
import { createStore, applyMiddleware } from "redux";
import appReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "sagas";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";

export const newStore = () => {
  const middleware = createSagaMiddleware();
  const store = createStore(
    appReducer,
    composeWithDevTools(
      reduxBatch,
      applyMiddleware(middleware),
      reduxBatch,
    ),
  );
  middleware.run(rootSaga);
  return store;
};
