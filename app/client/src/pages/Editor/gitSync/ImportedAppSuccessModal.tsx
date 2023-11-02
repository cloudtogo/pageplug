import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  createMessage,
  APPLICATION_IMPORT_SUCCESS,
  APPLICATION_IMPORT_SUCCESS_DESCRIPTION,
} from "@appsmith/constants/messages";
import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "design-system";
import type { AppState } from "@appsmith/reducers";
import type { User } from "constants/userConstants";

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const StyledModalContent = styled(ModalContent)`
  width: 640px;
`;

function ImportedApplicationSuccessModal() {
  const importedAppSuccess = localStorage.getItem("importApplicationSuccess");
  // const isOpen = importedAppSuccess === "true";
  const [isOpen, setIsOpen] = useState(importedAppSuccess === "true");
  const currentUser = useSelector(
    (state: AppState): User | undefined => state.ui?.users?.currentUser,
  );

  const onClose = (open: boolean) => {
    if (!open) {
      close();
    }
  };

  const close = () => {
    setIsOpen(false);
    localStorage.setItem("importApplicationSuccess", "false");
  };

  return (
    <Modal onOpenChange={onClose} open={isOpen}>
      <StyledModalContent className={"t--import-app-success-modal"}>
        <ModalHeader>数据源配置</ModalHeader>
        <ModalBody>
          <BodyContainer>
            <Icon
              color="var(--ads-v2-color-fg-success)"
              name="success"
              size={"lg"}
            />
            <Text kind="heading-m">
              {createMessage(
                APPLICATION_IMPORT_SUCCESS,
                currentUser?.name || currentUser?.username,
              )}
            </Text>
            <Text>{createMessage(APPLICATION_IMPORT_SUCCESS_DESCRIPTION)}</Text>
          </BodyContainer>
        </ModalBody>
        <ModalFooter>
          <Button
            className="t--import-success-modal-got-it"
            onClick={() => {
              close();
            }}
            size={"md"}
          >
            好的
          </Button>
        </ModalFooter>
      </StyledModalContent>
    </Modal>
  );
}

export default ImportedApplicationSuccessModal;
