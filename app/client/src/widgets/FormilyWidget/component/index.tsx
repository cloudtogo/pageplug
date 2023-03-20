import React, { useMemo, useEffect, useCallback } from "react";
import { createForm } from "@formily/core";
import { createSchemaField } from "@formily/react";
import {
  Form,
  FormItem,
  DatePicker,
  Checkbox,
  Cascader,
  Editable,
  Input,
  NumberPicker,
  Switch,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,
  ArrayTable,
  ArrayCards,
  FormButtonGroup,
  FormDrawer,
  FormDialog,
} from "@formily/antd-v5";
import { Card, Slider, Rate, Button } from "antd";
import { FormType } from "widgets/FormilyWidget/widget";
import styled from "styled-components";
import _ from "lodash";

export const Text: React.FC<{
  value?: string;
  content?: string;
  mode?: "normal" | "h1" | "h2" | "h3" | "p";
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === "normal" || !mode ? "div" : mode;
  return React.createElement(tagName, props, value || content);
};

interface FormilyComponentProps {
  formType: FormType;
  title?: string;
  triggerLabel?: string;
  submitLabel?: string;
  showReset?: boolean;
  resetLabel?: string;
  schema: string;
  initValue: any;
  onFormSubmit: (data: any) => void;
  widgetId: string;
  modalWidth?: string;
  drawerWidth?: string;
}

const EmptyForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  background: #eee;
  min-height: 300px;
  margin-bottom: 24px;
  background-color: #fff;
  border-radius: 6px;
  opacity: 0.4;
  border: 1px dashed #666;
  background-image: repeating-radial-gradient(
      circle at 0 0,
      rgba(0, 0, 0, 0) 0,
      #ffffff 60px
    ),
    repeating-linear-gradient(#cfcfcf55, #cfcfcf);
`;

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% + 12px);
`;

const ScrollContent = styled.div`
  flex: 1;
  overflow: auto;
`;

const ScrollFooter = styled.div`
  border-top: 1px solid #f0f0f0;
  margin: 0 -24px;
  padding: 12px 24px 0;
`;

const SchemaField = createSchemaField({
  components: {
    Space,
    FormGrid,
    FormLayout,
    FormTab,
    FormCollapse,
    ArrayTable,
    ArrayCards,
    FormItem,
    DatePicker,
    Checkbox,
    Cascader,
    Editable,
    Input,
    NumberPicker,
    Switch,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    Submit,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload,
    Card,
    Slider,
    Rate,
    Text,
  },
});

const FormilyComponent = (props: FormilyComponentProps) => {
  const {
    title,
    formType,
    triggerLabel,
    submitLabel,
    showReset,
    resetLabel,
    initValue,
    onFormSubmit,
    widgetId,
    modalWidth,
    drawerWidth,
  } = props;
  const schema: {
    form?: any;
    schema?: any;
  } = useMemo(() => {
    try {
      return JSON.parse(props.schema);
    } catch (e) {
      console.log("schema json parse failed", e);
      return {};
    }
  }, [props.schema]);
  const form = useMemo(() => createForm(), [props.schema]);
  const formProps = schema.form || {};
  const isVertical = formProps.layout === "vertical";
  const submitText = submitLabel || "提交";
  const resetText = resetLabel || "重置";
  const triggerText = triggerLabel || "打开表单";
  const initFormValue = _.isObject(initValue) ? _.cloneDeep(initValue) : {};
  const resetForm = useCallback(() => {
    try {
      form.reset();
      form.setValues(initFormValue);
    } catch (e) {}
    return false;
  }, [form, initFormValue]);

  useEffect(() => {
    resetForm();
  }, [initFormValue]);

  const formContent = _.isUndefined(schema.schema) ? (
    <EmptyForm>开始设计表单吧 😉</EmptyForm>
  ) : (
    <SchemaField schema={schema.schema} />
  );

  const showDrawer = () => {
    FormDrawer({ title, width: drawerWidth || 520 }, widgetId, () => {
      return (
        <FormLayout {...formProps}>
          {formContent}
          <FormDrawer.Footer>
            <FormButtonGroup align="left">
              <Submit
                onSubmit={() => {
                  return Promise.resolve();
                }}
              >
                {submitText}
              </Submit>
              {showReset ? <Reset>{resetText}</Reset> : null}
            </FormButtonGroup>
          </FormDrawer.Footer>
        </FormLayout>
      );
    })
      .open({
        initialValues: initFormValue,
      })
      .then(onFormSubmit);
  };

  const showModal = () => {
    FormDialog(
      { title, okText: submitText, width: modalWidth || 520 },
      widgetId,
      () => {
        return (
          <FormLayout {...formProps}>
            {formContent}
            <FormDialog.Footer>
              {showReset ? <Reset>{resetText}</Reset> : null}
            </FormDialog.Footer>
          </FormLayout>
        );
      },
    )
      .open({
        initialValues: initFormValue,
      })
      .then(onFormSubmit);
  };

  if (formType === "MODAL") {
    return (
      <FormDialog.Portal id={widgetId}>
        <Button type="primary" block onClick={showModal}>
          {triggerText}
        </Button>
      </FormDialog.Portal>
    );
  }

  if (formType === "DRAWER") {
    return (
      <FormDrawer.Portal id={widgetId}>
        <Button type="primary" block onClick={showDrawer}>
          {triggerText}
        </Button>
      </FormDrawer.Portal>
    );
  }

  return (
    <Card
      title={title}
      style={{ height: "100%" }}
      bodyStyle={{ height: title ? "calc(100% - 54px)" : "100%" }}
    >
      <Form
        form={form}
        {...formProps}
        onAutoSubmit={(value) => {
          onFormSubmit(value);
          resetForm();
        }}
        className="full-height-form"
      >
        <ScrollContainer>
          <ScrollContent>{formContent}</ScrollContent>
          <ScrollFooter>
            {isVertical ? (
              <>
                <Submit block={!showReset}>{submitText}</Submit>
                {showReset ? (
                  <Reset style={{ marginLeft: 8 }}>{resetText}</Reset>
                ) : null}
              </>
            ) : showReset ? (
              <FormButtonGroup.FormItem>
                <Submit>{submitText}</Submit>
                <Reset onClick={resetForm}>{resetText}</Reset>
              </FormButtonGroup.FormItem>
            ) : (
              <FormButtonGroup.FormItem>
                <Submit block>{submitText}</Submit>
              </FormButtonGroup.FormItem>
            )}
          </ScrollFooter>
        </ScrollContainer>
      </Form>
    </Card>
  );
};

export default React.memo(FormilyComponent);
