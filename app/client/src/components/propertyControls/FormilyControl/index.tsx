import React from "react";
import type { ControlProps } from "../BaseControl";
import BaseControl from "../BaseControl";
import { Drawer, Button } from "antd";
import { EyeOutlined, ToolOutlined } from "@ant-design/icons";
import styled from "styled-components";
import Designer from "./Designer";

const DrawerHeader = styled.div`
  position: relative;
`;
const Center = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  text-align: center;
`;

class FormilyControl extends BaseControl<ControlProps> {
  designerRef: any = React.createRef();
  state = {
    showEditor: false,
    workbenchType: "DESIGNABLE",
  };

  toggle = () => {
    const { showEditor } = this.state;
    this.setState({
      showEditor: !showEditor,
      workbenchType: "DESIGNABLE",
    });
  };

  onVisibleChanged = (visible: boolean) => {
    if (visible && this.designerRef.current) {
      try {
        const schema = JSON.parse(this.props.propertyValue);
        this.designerRef.current.setSchema(schema);
      } catch (e) {
        console.log("schema string parse failed :<", e);
      }
    }
  };

  handleOk = () => {
    const value =
      this.designerRef.current && this.designerRef.current.getSchema();
    this.updateProperty(this.props.propertyName, JSON.stringify(value));
    this.toggle();
  };

  toggleDesignerMode = () => {
    if (this.designerRef.current) {
      const workbenchType = this.state.workbenchType;
      const target = workbenchType === "DESIGNABLE" ? "PREVIEW" : "DESIGNABLE";
      this.designerRef.current.toggleWorkbench(target);
      this.setState({
        workbenchType: target,
      });
    }
  };

  render() {
    const { showEditor, workbenchType } = this.state;
    return (
      <div>
        <Button block onClick={this.toggle} type="primary">
          设计表单
        </Button>
        <Drawer
          afterOpenChange={this.onVisibleChanged}
          className="designable-drawer"
          footer={
            <div
              style={{
                textAlign: "center",
              }}
            >
              <Button onClick={this.toggle} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button onClick={this.handleOk} type="primary">
                保存
              </Button>
            </div>
          }
          height="100%"
          onClose={this.toggle}
          open={showEditor}
          placement="bottom"
          title={
            <DrawerHeader>
              <span>表单设计</span>
              <Center>
                <Button
                  icon={
                    workbenchType === "DESIGNABLE" ? (
                      <EyeOutlined rev={undefined} />
                    ) : (
                      <ToolOutlined rev={undefined} />
                    )
                  }
                  onClick={this.toggleDesignerMode}
                  shape="round"
                  size="small"
                  type="primary"
                >
                  {workbenchType === "DESIGNABLE" ? "预览" : "编辑"}
                </Button>
              </Center>
            </DrawerHeader>
          }
        >
          {showEditor ? <Designer ref={this.designerRef} /> : null}
        </Drawer>
      </div>
    );
  }

  static getControlType() {
    return "FORMILY_EDITOR";
  }
}

export default FormilyControl;
