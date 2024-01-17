import React, { Component } from "react";
import styled from "styled-components";
import AppCrashImage from "assets/images/404-image.png";
import * as Sentry from "@sentry/react";
import log from "loglevel";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { Button } from "design-system";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: calc(100vh - ${(props) => props.theme.headerHeight});
  .bold-text {
    font-weight: ${(props) => props.theme.fontWeights[3]};
    font-size: 24px;
  }
  .page-unavailable-img {
    width: 35%;
  }
  .button-position {
    margin: auto;
  }
`;

class AppErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    log.error({ error, errorInfo });
    Sentry.captureException(error);
    AnalyticsUtil.logEvent("APP_CRASH", { error, errorInfo });
    this.setState({
      hasError: true,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Wrapper>
          <img alt="App crashed" src={AppCrashImage} />
          <div>
            <p className="bold-text">糟了! 发生错误了</p>
            <p>
              请点击下面的按钮重试 <br />
              如果问题依然存在，请联系我们
            </p>
            <br />
            <Button onClick={() => window.location.reload()} size="md">
              重试
            </Button>
          </div>
        </Wrapper>
      );
    }
    // eslint-disable-next-line react/prop-types
    return this.props.children;
  }
}

export default AppErrorBoundary;
