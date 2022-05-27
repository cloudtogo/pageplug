import React, { useMemo, forwardRef, useImperativeHandle } from "react";
import {
  Designer,
  Workspace,
  OutlineTreeWidget,
  ResourceWidget,
  HistoryWidget,
  StudioPanel,
  CompositePanel,
  WorkspacePanel,
  ViewportPanel,
  ViewPanel,
  SettingsPanel,
  ComponentTreeWidget,
} from "@designable/react";
import {
  SettingsForm,
  setNpmCDNRegistry,
} from "@designable/react-settings-form";
import {
  transformToSchema,
  transformToTreeNode,
} from "@designable/formily-transformer";
import {
  createDesigner,
  GlobalRegistry,
  WorkbenchTypes,
} from "@designable/core";
import { PreviewWidget } from "./PreviewWidget";
import {
  Form,
  Field,
  Input,
  Select,
  TreeSelect,
  Cascader,
  Radio,
  Checkbox,
  Slider,
  Rate,
  NumberPicker,
  Transfer,
  Password,
  DatePicker,
  TimePicker,
  Upload,
  Switch,
  Text,
  Card,
  ArrayCards,
  ObjectContainer,
  ArrayTable,
  Space,
  FormTab,
  FormCollapse,
  FormLayout,
  FormGrid,
} from "@designable/formily-antd";

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
        return transformToSchema(engine.getCurrentTree());
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
          <CompositePanel.Item title="panels.Component" icon="Component">
            <ResourceWidget
              title="sources.Inputs"
              sources={[
                Input,
                Password,
                NumberPicker,
                Rate,
                Slider,
                Select,
                TreeSelect,
                Cascader,
                Transfer,
                Checkbox,
                Radio,
                DatePicker,
                TimePicker,
                Upload,
                Switch,
                ObjectContainer,
              ]}
            />
            <ResourceWidget
              title="sources.Layouts"
              sources={[
                Card,
                FormGrid,
                FormTab,
                FormLayout,
                FormCollapse,
                Space,
              ]}
            />
            <ResourceWidget
              title="sources.Arrays"
              sources={[ArrayCards, ArrayTable]}
            />
            <ResourceWidget title="sources.Displays" sources={[Text]} />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
            <OutlineTreeWidget />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.History" icon="History">
            <HistoryWidget />
          </CompositePanel.Item>
        </CompositePanel>
        <Workspace id="form">
          <WorkspacePanel>
            <ViewportPanel style={{ height: "100%" }}>
              <ViewPanel type="DESIGNABLE">
                {() => (
                  <ComponentTreeWidget
                    components={{
                      Form,
                      Field,
                      Input,
                      Select,
                      TreeSelect,
                      Cascader,
                      Radio,
                      Checkbox,
                      Slider,
                      Rate,
                      NumberPicker,
                      Transfer,
                      Password,
                      DatePicker,
                      TimePicker,
                      Upload,
                      Switch,
                      Text,
                      Card,
                      ArrayCards,
                      ArrayTable,
                      Space,
                      FormTab,
                      FormCollapse,
                      FormGrid,
                      FormLayout,
                      ObjectContainer,
                    }}
                  />
                )}
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
