import React from "react";

const noop = () => {};
const ReduxContext = React.createContext<{
  useStore: any;
  useSelector: any;
  useDispatch: any;
  context: any;
}>({
  useStore: noop,
  useSelector: noop,
  useDispatch: noop,
  context: null,
});
export default ReduxContext;
