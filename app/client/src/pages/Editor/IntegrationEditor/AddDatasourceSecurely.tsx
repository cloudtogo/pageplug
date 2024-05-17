import React from "react";
import styled from "styled-components";
import { Flex, Text } from "design-system";
import { getAssetUrl } from "@appsmith/utils/airgapHelpers";
import { ASSETS_CDN_URL } from "constants/ThirdPartyConstants";
import {
  createMessage,
  DATASOURCE_SECURELY_TITLE,
} from "@appsmith/constants/messages";

const Wrapper = styled(Flex)`
  background: var(--ads-v2-color-blue-100);
  border-radius: var(--ads-v2-border-radius);
  padding: var(--ads-v2-spaces-7);
  align-items: center;
`;

function AddDatasourceSecurely() {
  return (
    <Wrapper>
      <img
        alt={createMessage(DATASOURCE_SECURELY_TITLE)}
        src={getAssetUrl(`${ASSETS_CDN_URL}/secure-lock.svg`)}
      />
      <Flex flexDirection="column" ml="spaces-4">
        <Text color="var(--ads-v2-color-gray-700)" kind="heading-m">
          {createMessage(DATASOURCE_SECURELY_TITLE)}
        </Text>
        <Text color="var(--ads-v2-color-gray-600)" kind="body-m">
          连接数据源以开始构建工作流。您的密码会以<u>AES-256加密</u>方式加密，我们不存储您的任何数据。
        </Text>
      </Flex>
    </Wrapper>
  );
}

export default AddDatasourceSecurely;
