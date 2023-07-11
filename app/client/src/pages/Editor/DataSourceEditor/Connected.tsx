import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import type { AppState } from "@appsmith/reducers";
import { getDatasource, getPlugin } from "selectors/entitiesSelector";
import { Colors } from "constants/Colors";
import { HeaderIcons } from "icons/HeaderIcons";
import styled from "styled-components";
import NewActionButton from "./NewActionButton";

import { hasCreateDatasourceActionPermission } from "@appsmith/utils/permissionHelpers";
import { getPagePermissions } from "selectors/editorSelectors";

const ConnectedText = styled.div`
  color: ${Colors.OXFORD_BLUE};
  font-size: 17px;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const Header = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

<<<<<<< HEAD
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #d0d7dd;
  padding: 24px 20px;
`;

=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
function Connected({
  errorComponent,
  hideDatasourceRenderSection = false,
  showDatasourceSavedText = true,
}: {
  errorComponent?: JSX.Element | null;
  hideDatasourceRenderSection?: boolean;
  showDatasourceSavedText?: boolean;
}) {
  const params = useParams<{ datasourceId: string }>();

  const datasource = useSelector((state: AppState) =>
    getDatasource(state, params.datasourceId),
  );

  const plugin = useSelector((state: AppState) =>
    getPlugin(state, datasource?.pluginId ?? ""),
  );

  const datasourcePermissions = datasource?.userPermissions || [];

  const pagePermissions = useSelector(getPagePermissions);

  const canCreateDatasourceActions = hasCreateDatasourceActionPermission([
    ...datasourcePermissions,
    ...pagePermissions,
  ]);

  return (
    <>
      {showDatasourceSavedText && (
        <Header>
          <ConnectedText>
            <HeaderIcons.SAVE_SUCCESS
              color={Colors.GREEN}
              height={30}
              width={30}
            />
            <div style={{ marginLeft: "12px" }}>数据源已连接</div>
          </ConnectedText>
          <NewActionButton
            datasource={datasource}
            disabled={!canCreateDatasourceActions}
            eventFrom="datasource-pane"
            plugin={plugin}
          />
        </Header>
      )}
      {errorComponent}
<<<<<<< HEAD
      <div style={{ marginTop: showDatasourceSavedText ? "30px" : "" }}>
        {!isNil(currentFormConfig) &&
        !isNil(datasource) &&
        !hideDatasourceRenderSection ? (
          <RenderDatasourceInformation
            config={currentFormConfig[0]}
            datasource={datasource}
          />
        ) : undefined}
      </div>
    </Wrapper>
=======
    </>
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
  );
}

export default Connected;
