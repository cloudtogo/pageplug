// This file must be executed as early as possible to ensure the preloads are triggered ASAP
import "./preload-route-chunks";

import React from "react";
import "./wdyr";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import "@appsmith/ads-old/src/themes/default/index.css";
import "@appsmith/ads/src/__theme__/default/index.css";
import { ThemeProvider } from "styled-components";
import { taroifyTheme } from "constants/DefaultTheme";
import { appInitializer } from "utils/AppUtils";
import store, { runSagaMiddleware } from "./store";
import { LayersContext, Layers } from "constants/Layers";
import AppRouter from "ee/AppRouter";
import * as Sentry from "@sentry/react";
import { getCurrentThemeDetails } from "selectors/themeSelectors";
import { connect } from "react-redux";
import type { AppState } from "ee/reducers";
import { Toast } from "@appsmith/ads";
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
// import "@vant/touch-emulator";
// import "react-sortable-tree-patch-react-17/style.css";
import log from "loglevel";
import { getAppsmithConfigs } from "ee/configs";
import { PageViewTiming } from "@newrelic/browser-agent/features/page_view_timing";
import { PageViewEvent } from "@newrelic/browser-agent/features/page_view_event";
import { Agent } from "@newrelic/browser-agent/loaders/agent";

const { newRelic } = getAppsmithConfigs();
const { enableNewRelic } = newRelic;

const newRelicBrowserAgentConfig = {
  init: {
    distributed_tracing: { enabled: true },
    privacy: { cookies_enabled: true },
  },
  info: {
    beacon: newRelic.browserAgentEndpoint,
    errorBeacon: newRelic.browserAgentEndpoint,
    licenseKey: newRelic.browserAgentlicenseKey,
    applicationID: newRelic.applicationId,
    sa: 1,
  },
  loader_config: {
    accountID: newRelic.accountId,
    trustKey: newRelic.accountId,
    agentID: newRelic.applicationId,
    licenseKey: newRelic.browserAgentlicenseKey,
    applicationID: newRelic.applicationId,
  },
};

// The agent loader code executes immediately on instantiation.
// if (enableNewRelic) {
//   new Agent(
//     {
//       ...newRelicBrowserAgentConfig,
//       features: [PageViewTiming, PageViewEvent],
//     },
//     // The second argument agentIdentifier is not marked as optional in its type definition.
//     // Passing a null value throws an error as well. So we pass undefined.
//     undefined,
//   );
// }

const shouldAutoFreeze = process.env.NODE_ENV === "development";

setAutoFreeze(shouldAutoFreeze);
runSagaMiddleware();

appInitializer();

enableNewRelic &&
  (async () => {
    try {
      await import(
        /* webpackChunkName: "otlpTelemetry" */ 
        "./UITelemetry/auto-otel-web"
      );
    } catch (e) {
      log.error("Error loading telemetry script", e);
    }
  })();

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
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentTheme: any;
}> {
  render() {
    return (
      <ThemeProvider theme={this.props.currentTheme}>
        <Toast />
        <GlobalStyles />
        <AppErrorBoundary>
          <IntlProvider locale="zh-CN" messages={zhCN}>
            <StyleProvider hashPriority="high">
              <ConfigProvider
                locale={zhCNantd}
                theme={{
                  token: {
                    colorPrimary: "#27b7b7",
                  },
                  components: {
                    Menu: {
                      darkItemColor: "rgba(0, 0, 0, 0.8)",
                      darkItemHoverColor: "rgba(0, 0, 0, 0.8)",
                      darkItemSelectedColor: "#fff",
                      darkItemSelectedBg: "rgba(0, 0, 0, 0.09)",
                      darkSubMenuItemBg: "transparent",
                    },
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
// TODO: Fix this the next time the file is edited
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((window as any).Cypress) {
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).store = store;
}
