import React, { useMemo, forwardRef, useImperativeHandle } from "react";
import { useEffect } from "react";
import {
  Designer,
  Workspace,
  OutlineTreeWidget,
  DragSourceWidget,
  HistoryWidget,
  MainPanel,
  CompositePanel,
  WorkspacePanel,
  ViewportPanel,
  ViewPanel,
  SettingsPanel,
  ComponentTreeWidget,
} from "@designable/react";
import { transformToSchema, transformToTreeNode } from "@designable/formily";
import { SettingsForm } from "@designable/react-settings-form";
import {
  createDesigner,
  GlobalRegistry,
  WorkbenchTypes,
} from "@designable/core";
import {
  createDesignableField,
  createDesignableForm,
} from "@formily/designable-antd";
import PreviewWidget from "./PreviewWidget";
const CompositePanelItem: any = CompositePanel.Item;

GlobalRegistry.registerDesignerLocales({
  "zh-CN": {
    sources: {
      Inputs: "输入控件",
      Layouts: "布局组件",
      Arrays: "自增组件",
    },
  },
  "en-US": {
    sources: {
      Inputs: "Inputs",
      Layouts: "Layouts",
      Arrays: "Arrays",
    },
  },
});

const Root = createDesignableForm({
  registryName: "Root",
});

const DesignableField = createDesignableField({
  registryName: "DesignableField",
});

const FormilyDesigner = (props: any, ref: any) => {
  const engine = useMemo(() => createDesigner(), []);
  console.log("designer render");

  useEffect(() => {
    console.log("desginer init");
    return () => {
      console.log("desginer destory");
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      getSchema: () => {
        return transformToSchema(engine.getCurrentTree(), {
          designableFieldName: "DesignableField",
          designableFormName: "Root",
        });
      },
      setSchema: (schema: any) => {
        engine.setCurrentTree(
          transformToTreeNode(schema, {
            designableFieldName: "DesignableField",
            designableFormName: "Root",
          }),
        );
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
      <MainPanel>
        <CompositePanel>
          <CompositePanelItem title="panels.Component" icon="Component">
            <DragSourceWidget title="sources.Inputs" name="inputs" />
            <DragSourceWidget title="sources.Layouts" name="layouts" />
            <DragSourceWidget title="sources.Arrays" name="arrays" />
          </CompositePanelItem>
          <CompositePanelItem title="panels.OutlinedTree" icon="Outline">
            <OutlineTreeWidget />
          </CompositePanelItem>
          <CompositePanelItem title="panels.History" icon="History">
            <HistoryWidget />
          </CompositePanelItem>
        </CompositePanel>
        <Workspace id="form">
          <WorkspacePanel>
            <ViewportPanel>
              <ViewPanel type="DESIGNABLE">
                {() => {
                  console.log("DESIGNABLE show !");
                  return (
                    <ComponentTreeWidget
                      components={{
                        Root,
                        DesignableField,
                      }}
                    />
                  );
                }}
              </ViewPanel>
              <ViewPanel type="PREVIEW">
                {(tree) => {
                  console.log("PREVIEW show !");
                  return <PreviewWidget tree={tree} />;
                }}
              </ViewPanel>
            </ViewportPanel>
          </WorkspacePanel>
        </Workspace>
        <SettingsPanel title="panels.PropertySettings">
          <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
        </SettingsPanel>
      </MainPanel>
    </Designer>
  );
};

export default forwardRef(FormilyDesigner);
