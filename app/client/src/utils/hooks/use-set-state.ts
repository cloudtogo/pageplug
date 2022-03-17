import React, { useCallback } from "react";
import useRefState from "./use-ref-state";
import useUnmountedRef from "./use-unmounted-ref";

const useSetState = <T extends Record<string, unknown>>(
  initialState: T = {} as T,
): [
  T,
  (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void,
  React.MutableRefObject<T>,
] => {
  const unmountedRef = useUnmountedRef();
  const [state, setState, ref] = useRefState<T>(initialState);

  const setMergeState = useCallback((patch) => {
    if (unmountedRef.current) return;
    setState((prevState) => ({
      ...prevState,
      ...(typeof patch === "function" ? patch(prevState) : patch),
    }));
  }, []);

  return [state, setMergeState, ref];
};

export default useSetState;
