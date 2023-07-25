import React, { useMemo, forwardRef, useImperativeHandle } from "react";
import {
  Designer,
  Workspace,
  OutlineTreeWidget,
  ResourceListWidget,
  HistoryWidget,
  StudioPanel,
  CompositePanel,
  WorkspacePanel,
  ViewportPanel,
  ViewPanel,
  SettingsPanel,
  ComponentTreeWidget,
} from "@pind/designable-react";
import {
  SettingsForm,
  setNpmCDNRegistry,
} from "@pind/designable-react-settings-form";
import {
  transformToSchema,
  transformToTreeNode,
} from "@pind/designable-formily-transformer";
import type { WorkbenchTypes } from "@pind/designable-core";
import { createDesigner, GlobalRegistry } from "@pind/designable-core";
import { PreviewWidget } from "./PreviewWidget";
import { sources } from "@pind/designable-formily-antd";

setNpmCDNRegistry("//unpkg.com");

GlobalRegistry.registerDesignerLocales({
  "zh-CN": {
    sources: {
      Inputs: "输入控件",
      Layouts: "布局组件",
      Arrays: "自增组件",
      Displays: "展示组件",
    },
  },
  "en-US": {
    sources: {
      Inputs: "Inputs",
      Layouts: "Layouts",
      Arrays: "Arrays",
      Displays: "Displays",
    },
  },
});

const FormilyDesigner = (props: any, ref: any) => {
  const engine = useMemo(
    () =>
      createDesigner({
        rootComponentName: "Form",
      }),
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      getSchema: () => {
        //@ts-ignore
        return transformToSchema(engine?.getCurrentTree());
      },
      setSchema: (schema: any) => {
        engine.setCurrentTree(transformToTreeNode(schema));
      },
      toggleWorkbench: (type: WorkbenchTypes) => {
        engine.workbench.setWorkbenchType(type);
      },
      workbenchType: engine.workbench.type,
    }),
    [engine],
  );

  return (
    <Designer engine={engine}>
      <StudioPanel>
        <CompositePanel>
          <CompositePanel.Item icon="Component" title="panels.Component">
            <ResourceListWidget sources={Object.values({ ...sources })} />
          </CompositePanel.Item>
          <CompositePanel.Item icon="Outline" title="panels.OutlinedTree">
            <OutlineTreeWidget />
          </CompositePanel.Item>
          <CompositePanel.Item icon="History" title="panels.History">
            <HistoryWidget />
          </CompositePanel.Item>
        </CompositePanel>
        <Workspace id="form">
          <WorkspacePanel>
            <ViewportPanel style={{ height: "100%" }}>
              <ViewPanel type="DESIGNABLE">
                {() => <ComponentTreeWidget components={{ ...sources }} />}
              </ViewPanel>
              <ViewPanel type="PREVIEW">
                {(tree) => <PreviewWidget tree={tree} />}
              </ViewPanel>
            </ViewportPanel>
          </WorkspacePanel>
        </Workspace>
        <SettingsPanel title="panels.PropertySettings">
          <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
        </SettingsPanel>
      </StudioPanel>
    </Designer>
  );
};

export default forwardRef(FormilyDesigner);
