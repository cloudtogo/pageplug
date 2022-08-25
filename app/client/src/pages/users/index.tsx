import React from "react";
import { useHistory } from "react-router-dom";
import { WORKSPACE_INVITE_USERS_PAGE_URL } from "constants/routes";
import PageSectionHeader from "pages/common/PageSectionHeader";
import Button from "components/editorComponents/Button";
import PageWrapper from "pages/common/PageWrapper";

export function WorkspaceMembers() {
  const history = useHistory();

  return (
    <PageWrapper displayName="小伙伴们">
      <PageSectionHeader>
        <h2>小伙伴们</h2>
        <Button
          filled
          icon="plus"
          iconAlignment="left"
          intent="primary"
          onClick={() => history.push(WORKSPACE_INVITE_USERS_PAGE_URL)}
          text="邀请小伙伴"
        />
      </PageSectionHeader>
    </PageWrapper>
  );
}

export default WorkspaceMembers;
