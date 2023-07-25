import React from "react";
import "./wdyr";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { taroifyTheme } from "constants/DefaultTheme";
import { appInitializer } from "utils/AppUtils";
import { Slide } from "react-toastify";
import store, { runSagaMiddleware } from "./store";
import { LayersContext, Layers } from "constants/Layers";
import AppRouter from "@appsmith/AppRouter";
import * as Sentry from "@sentry/react";
import { getCurrentThemeDetails } from "selectors/themeSelectors";
import { connect } from "react-redux";
import type { AppState } from "@appsmith/reducers";
import { StyledToastContainer } from "design-system-old";
import "./assets/styles/index.css";
import "./index.less";
import "design-system-old/build/css/design-system-old.css";
import "./polyfills";
import GlobalStyles from "globalStyles";
// locale
import { ConfigProvider } from "antd";
import zhCNantd from "antd/locale/zh_CN";
import zhCN from "locales/zh-CN";
import { IntlProvider } from "react-intl";
import "moment/locale/zh-cn";
import "dayjs/locale/zh-cn";
import { StyleProvider } from "@ant-design/cssinjs";
// enable autofreeze only in development
import { setAutoFreeze } from "immer";
import AppErrorBoundary from "./AppErrorBoundry";
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
// // create taro runtime in React
import { createReactApp } from "@tarojs/runtime";
class Empty extends React.Component {
  render() {
    return null;
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inst = createReactApp(Empty, React, ReactDOM, {});
// add touch emulator
import "@vant/touch-emulator";
import "react-sortable-tree-patch-react-17/style.css";

runSagaMiddleware();

appInitializer();

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
}> {
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
            <StyleProvider hashPriority="high">
              <ConfigProvider
                locale={zhCNantd}
                theme={{
                  token: {
                    colorPrimary: "#2cbba6",
                  },
                }}
              >
                <TaroifyTheme theme={taroifyTheme}>
                  <AppRouter />
                </TaroifyTheme>
              </ConfigProvider>
            </StyleProvider>
          </IntlProvider>
        </AppErrorBoundary>
      </ThemeProvider>
    );
  }
}
const mapStateToProps = (state: AppState) => ({
  currentTheme: getCurrentThemeDetails(state),
});

const ThemedAppWithProps = connect(mapStateToProps)(ThemedApp);

ReactDOM.render(<App />, document.getElementById("root"));

// expose store when run in Cypress
if ((window as any).Cypress) {
  (window as any).store = store;
}

// 测试taro
// import React from "react";
// import ReactDOM from "react-dom";

// import { View } from "@tarojs/components";
// function App() {
//   return <View></View>;
// }
// ReactDOM.render(<App />, document.getElementById("root"));
