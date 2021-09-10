/*Huge thanks to @tobiasahlin at http://tobiasahlin.com/spinkit/ */

import React from "react";
import styled from "styled-components";

const Spinner = styled.div`
  width: 30px;
  text-align: center;
  && > div {
    width: 6px;
    height: 6px;
    margin: 0 1px;
    background-color: ${(props) => props.theme.colors.info.main};

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  && .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  && .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }

  @-webkit-keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
    }
  }

  @keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
`;

type Props = {
  className?: string;
};

function ThreeDotLoading(props: Props) {
  return (
    <Spinner className={props.className}>
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </Spinner>
  );
}

export default ThreeDotLoading;
