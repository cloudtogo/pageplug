import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { AppState } from "reducers";
import { isMobileLayout } from "selectors/editorSelectors";
import { fetchApplicationPreviewWxaCode } from "actions/applicationActions";
import { Colors } from "constants/Colors";
import QRCode from "qrcode.react";
import Spinner from "components/editorComponents/Spinner";

const Container = styled.div`
  position: absolute;
  right: calc(50% - 450px);
  top: 32px;
`;

const Card = styled.div`
  border-radius: 16px;
  background: #fff;
  border: 2px solid ${Colors.MINT_GREEN};
  padding: 12px;
  overflow: hidden;
  backdrop-filter: blur(6px);
`;

const Title = styled.h3`
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;

const CODE_SIZE = 150;

const WxaCodeContainer = styled.div`
  width: ${CODE_SIZE}px;
  height: ${CODE_SIZE}px;
  display: flex;
  justify-content: center;
  align-items: center;

  & img {
    width: 100%;
    height: 100%;
  }
`;

const LoadFail = styled.div`
  border: 4px dashed #d0d0d0;
  width: 150px;
  height: 150px;
  background: #f1f1f1;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: red;

  & span {
    font-size: 16px;
    margin-bottom: 8px;
  }
`;

export type PreviewQRCodeProps = {
  appId?: string;
  imageData: string;
  isLoading: boolean;
  loadFailed: boolean;
  isMobile: boolean;
  fetchWxaCode: (appId: string) => void;
};

const PreviewQRCode = ({
  appId,
  imageData,
  isLoading,
  loadFailed,
  isMobile,
  fetchWxaCode,
}: PreviewQRCodeProps) => {
  if (!isMobile) {
    return null;
  }
  return (
    <Container>
      <Card>
        <Title>小程序端</Title>
        <WxaCodeContainer>
          {isLoading ? (
            <Spinner size={40} />
          ) : loadFailed ? (
            <LoadFail>
              <span>加载失败</span>
              <a onClick={() => appId && fetchWxaCode(appId)}>刷新</a>
            </LoadFail>
          ) : imageData ? (
            <img src={imageData} />
          ) : null}
        </WxaCodeContainer>
      </Card>
      {/* <Card style={{ marginTop: 32 }}>
        <Title>H5端</Title>
        <QRCode value="https://www.cloudtogo.cn" size={CODE_SIZE} />
      </Card> */}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  appId: state.ui.applications.currentApplication?.id,
  isLoading: state.ui.applications.isFetchingPreviewWxaCode,
  loadFailed: state.ui.applications.previewWxaCodeFailed,
  imageData: state.ui.applications.previewWxaCode,
  isMobile: isMobileLayout(state),
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchWxaCode: (appId: string) =>
    dispatch(fetchApplicationPreviewWxaCode(appId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviewQRCode);
