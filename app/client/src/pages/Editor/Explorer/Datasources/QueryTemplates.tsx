import React, { useCallback } from "react";
import styled from "styled-components";
import { Colors } from "constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { createActionRequest } from "actions/pluginActionActions";
import { AppState } from "reducers";
import { createNewQueryName } from "utils/AppsmithUtils";
import {
  getCurrentApplicationId,
  getCurrentPageId,
} from "selectors/editorSelectors";
import { QueryAction } from "entities/Action";
import { Classes } from "@blueprintjs/core";
import history from "utils/history";
import { Datasource, QueryTemplate } from "entities/Datasource";
import { INTEGRATION_TABS } from "constants/routes";
import { getDatasource } from "selectors/entitiesSelector";
import { integrationEditorURL } from "RouteBuilder";

const Container = styled.div`
  border-radius: ${(props) => props.theme.borderRadius};
  background-color: ${Colors.MINT_GRAY};
  color: ${Colors.MINT_BLACK};
  min-width: 160px;
  padding: 5px;
`;

const TemplateType = styled.div`
  color: ${Colors.MINT_BLACK};
  border-radius: ${(props) => props.theme.borderRadius};
  padding: 8px;
  &:hover {
    cursor: pointer;
    color: ${Colors.MINT_ORANGE};
    background: ${Colors.MINT_ORANGE_LIGHT};
  }
`;

type QueryTemplatesProps = {
  templates: QueryTemplate[];
  datasourceId: string;
};

export function QueryTemplates(props: QueryTemplatesProps) {
  const dispatch = useDispatch();
  const applicationId = useSelector(getCurrentApplicationId);
  const actions = useSelector((state: AppState) => state.entities.actions);
  const currentPageId = useSelector(getCurrentPageId);
  const dataSource: Datasource | undefined = useSelector((state: AppState) =>
    getDatasource(state, props.datasourceId),
  );
  const createQueryAction = useCallback(
    (template: QueryTemplate) => {
      const newQueryName = createNewQueryName(actions, currentPageId || "");
      const queryactionConfiguration: Partial<QueryAction> = {
        actionConfiguration: {
          body: template.body,
          pluginSpecifiedTemplates: template.pluginSpecifiedTemplates,
          formData: template.configuration,
          ...template.actionConfiguration,
        },
      };

      dispatch(
        createActionRequest({
          name: newQueryName,
          pageId: currentPageId,
          pluginId: dataSource?.pluginId,
          datasource: {
            id: props.datasourceId,
          },
          eventData: {
            actionType: "Query",
            from: "explorer-template",
            dataSource: dataSource?.name,
          },
          ...queryactionConfiguration,
        }),
      );
      history.push(
        integrationEditorURL({
          pageId: currentPageId,
          selectedTab: INTEGRATION_TABS.ACTIVE,
        }),
      );
    },
    [
      dispatch,
      actions,
      currentPageId,
      applicationId,
      props.datasourceId,
      dataSource,
    ],
  );

  return (
    <Container>
      {props.templates.map((template) => {
        return (
          <TemplateType
            className={Classes.POPOVER_DISMISS}
            key={template.title}
            onClick={() => createQueryAction(template)}
          >
            {template.title}
          </TemplateType>
        );
      })}
    </Container>
  );
}

export default QueryTemplates;
