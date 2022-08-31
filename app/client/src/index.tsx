import React from "react";
import "./wdyr";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ThemeProvider, taroifyTheme } from "constants/DefaultTheme";
import { appInitializer } from "utils/AppUtils";
import { Slide } from "react-toastify";
import store from "./store";
import { LayersContext, Layers } from "constants/Layers";
import AppRouter from "./AppRouter";
import * as Sentry from "@sentry/react";
import { getCurrentThemeDetails, ThemeMode } from "selectors/themeSelectors";
import { connect } from "react-redux";
import { AppState } from "reducers";
import { setThemeMode } from "actions/themeActions";
import { StyledToastContainer } from "components/ads/Toast";
import localStorage from "utils/localStorage";
import "./assets/styles/index.css";
import "./index.less";
import "design-system/build/css/design-system.css";
import "./polyfills/corejs-add-on";
import AppErrorBoundary from "./AppErrorBoundry";
import GlobalStyles from "globalStyles";
// locale
import { ConfigProvider } from "antd";
import zhCNAntd from "antd/lib/locale/zh_CN";
import zhCN from "locales/zh-CN";
import { IntlProvider } from "react-intl";
import "moment/locale/zh-cn";
// enable autofreeze only in development
import { setAutoFreeze } from "immer";
const shouldAutoFreeze = process.env.NODE_ENV === "development";
setAutoFreeze(shouldAutoFreeze);
// taro-components polyfills
import { ConfigProvider as TaroifyTheme } from "@taroify/core";
import {
  applyPolyfills,
  defineCustomElements,
} from "@tarojs/components/loader";
import "@tarojs/components/dist/taro-components/taro-components.css";
import "./taroifyStyles";
applyPolyfills().then(() => {
  defineCustomElements(window);
});
// create taro runtime in React
import { createRouter } from "@tarojs/taro";
import { createReactApp } from "@tarojs/runtime";
class Empty extends React.Component {
  render() {
    return null;
  }
}
const inst = createReactApp(Empty, React, ReactDOM, {});
// createRouter(
//   inst,
//   {
//     routes: [],
//     router: {
//       mode: "browser",
//       basename: "",
//       pathname: "",
//     },
//   },
//   "react",
// );
// add touch emulator
import "@vant/touch-emulator";
import "react-sortable-tree-patch-react-17/style.css";

// app init
appInitializer();

// if (process.env.NODE_ENV === "development") {
//   import("./mocks/browser").then(({ worker }) => {
//     worker.start();
//   });
// }

function App() {
  return (
    <Sentry.ErrorBoundary fallback={"报错了:<"}>
      <Provider store={store}>
        <LayersContext.Provider value={Layers}>
          <ThemedAppWithProps />
        </LayersContext.Provider>
      </Provider>
    </Sentry.ErrorBoundary>
  );
}

class ThemedApp extends React.Component<{
  currentTheme: any;
  setTheme: (themeMode: ThemeMode) => void;
}> {
  componentDidMount() {
    if (localStorage.getItem("THEME") === "LIGHT") {
      this.props.setTheme(ThemeMode.LIGHT);
    }
  }
  render() {
    return (
      <ThemeProvider theme={this.props.currentTheme}>
        <StyledToastContainer
          autoClose={5000}
          closeButton={false}
          draggable={false}
          hideProgressBar
          pauseOnHover={false}
          transition={Slide}
        />
        <GlobalStyles />
        <AppErrorBoundary>
          <IntlProvider locale="zh-CN" messages={zhCN}>
            <ConfigProvider locale={zhCNAntd}>
              <TaroifyTheme theme={taroifyTheme}>
                <AppRouter />
              </TaroifyTheme>
            </ConfigProvider>
          </IntlProvider>
        </AppErrorBoundary>
      </ThemeProvider>
    );
  }
}
const mapStateToProps = (state: AppState) => ({
  currentTheme: getCurrentThemeDetails(state),
});
const mapDispatchToProps = (dispatch: any) => ({
  setTheme: (mode: ThemeMode) => {
    dispatch(setThemeMode(mode));
  },
});

const ThemedAppWithProps = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThemedApp);

ReactDOM.render(<App />, document.getElementById("root"));

// expose store when run in Cypress
if ((window as any).Cypress) {
  (window as any).store = store;
}
