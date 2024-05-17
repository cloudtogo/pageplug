import React from "react";
import { Text, Button } from "design-system";
import { useSelector } from "react-redux";

import CardList from "pages/Applications/CardList";
import { PaddingWrapper } from "pages/Applications/CommonElements";
import { NoAppsFound } from "@appsmith/pages/Applications";
import ApplicationCard from "pages/Applications/ApplicationCard";
import type { ApplicationPayload } from "@appsmith/constants/ReduxActionConstants";
import type { UpdateApplicationPayload } from "@appsmith/api/ApplicationApi";
import {
  APPLICATIONS,
  APPLICATION_CARD_LIST_ZERO_STATE,
  createMessage,
} from "@appsmith/constants/messages";
import { getIsFetchingApplications } from "@appsmith/selectors/selectedWorkspaceSelectors";
import { getIsCreatingApplicationByWorkspaceId, } from "@appsmith/selectors/applicationSelectors";
import { getAssetUrl } from "@appsmith/utils/airgapHelpers";
import { ASSETS_CDN_URL } from "constants/ThirdPartyConstants";

interface ApplicationCardListProps {
  applications: ApplicationPayload[];
  canInviteToWorkspace: boolean;
  enableImportExport: boolean;
  hasCreateNewApplicationPermission: boolean;
  hasManageWorkspacePermissions: boolean;
  isMobile?: boolean;
  workspaceId: string;
  onClickAddNewButton: (workspaceId: string, isMobile: boolean) => void;
  onClickAddMobileNewButton: (workspaceId: string, isMobile: boolean) => void;
  deleteApplication: (applicationId: string) => void;
  updateApplicationDispatch: (
    id: string,
    data: UpdateApplicationPayload,
  ) => void;
}

function ApplicationCardList({
  applications,
  canInviteToWorkspace,
  deleteApplication,
  enableImportExport,
  hasCreateNewApplicationPermission,
  hasManageWorkspacePermissions,
  isMobile,
  onClickAddMobileNewButton,
  onClickAddNewButton,
  updateApplicationDispatch,
  workspaceId,
}: ApplicationCardListProps) {
  const isCreatingApplication = Boolean(
    useSelector(getIsCreatingApplicationByWorkspaceId(workspaceId)),
  );
  const isFetchingApplications = useSelector(getIsFetchingApplications);

  return (
    <CardList
      isLoading={isFetchingApplications}
      isMobile={isMobile}
      title={createMessage(APPLICATIONS)}
    >
      {applications.map((application: any) => {
        return (
          <PaddingWrapper isMobile={isMobile} key={application.id}>
            <ApplicationCard
              application={application}
              delete={deleteApplication}
              enableImportExport={enableImportExport}
              isFetchingApplications={isFetchingApplications}
              isMobile={isMobile}
              key={application.id}
              permissions={{
                hasCreateNewApplicationPermission,
                hasManageWorkspacePermissions,
                canInviteToWorkspace,
              }}
              update={updateApplicationDispatch}
              workspaceId={workspaceId}
            />
          </PaddingWrapper>
        );
      })}
      {applications.length === 0 && (
        <NoAppsFound>
          <img
            className="mb-7"
            src={getAssetUrl(`${ASSETS_CDN_URL}/no-applications.svg`)}
          />
          <Text kind="heading-xs">
            {createMessage(APPLICATION_CARD_LIST_ZERO_STATE)}
          </Text>
          {/* below component is duplicate. This is because of cypress test were failing */}
          {hasCreateNewApplicationPermission && (
            <div className="flex justify-between" style={{ width: 272 }}>
              <Button
                className="t--new-button createnew"
                isLoading={isCreatingApplication}
                onClick={() => onClickAddNewButton(workspaceId, false)}
                size="md"
                startIcon={"plus"}
              >
                创建桌面应用
              </Button>
              <Button
                className="t--new-button createnew"
                isLoading={isCreatingApplication}
                onClick={() => onClickAddMobileNewButton(workspaceId, true)}
                size="md"
                startIcon={"plus"}
              >
                创建移动应用
              </Button>
            </div>
          )}
        </NoAppsFound>
      )}
    </CardList>
  );
}

export default ApplicationCardList;
