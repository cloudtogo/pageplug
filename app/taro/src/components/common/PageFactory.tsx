import React from "react";
import {
  Provider,
  createStoreHook,
  createDispatchHook,
  createSelectorHook,
} from "react-redux";
import { newStore } from "store";
import AppViewer from "./AppViewer";
import ReduxContext from "./ReduxContext";

const Page = () => {
  const context: any = React.createContext(null);
  const useStore = createStoreHook(context);
  const useDispatch = createDispatchHook(context);
  const useSelector = createSelectorHook(context);
  const store = newStore();
  const contextValue = {
    useStore,
    useSelector,
    useDispatch,
    context,
  };
  return (
    <ReduxContext.Provider value={contextValue}>
      <Provider store={store} context={context}>
        <AppViewer />
      </Provider>
    </ReduxContext.Provider>
  );
};

export default Page;
