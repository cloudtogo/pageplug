import React, { ReactNode } from "react";
import { styled } from 'linaria/react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

const ErrorBoundaryContainer = styled.div`
  height: 100%;
  width: 100%;

  > div {
    height: 100%;
    width: 100%;
  }
`;

const RetryLink = styled.span`
  color: #000;
  cursor: pointer;
`;

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error({ error, errorInfo });
  }

  render() {
    return (
      <ErrorBoundaryContainer>
        {this.state.hasError ? (
          <p>
            出现错误了
            <br />
            <RetryLink onClick={() => this.setState({ hasError: false })}>
              点击重试
            </RetryLink>
          </p>
        ) : (
          this.props.children
        )}
      </ErrorBoundaryContainer>
    );
  }
}

export default ErrorBoundary;
