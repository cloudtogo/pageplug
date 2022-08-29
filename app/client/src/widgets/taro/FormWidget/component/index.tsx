import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "@tarojs/components";
import { Form, Button, Cell } from "@taroify/core";
import { FormInstance } from "@taroify/core/form";
import styled from "styled-components";
import { theme } from "constants/DefaultTheme";
import _ from "lodash";
import PickerField from "./PickerField";
import InputField from "./InputField";
import SwitchField from "./SwitchField";
import RateField from "./RateField";
import StepperField from "./StepperField";
import RadioField from "./RadioField";
import CheckboxField from "./CheckboxField";
import AddressField from "./AddressField";
import UploaderField from "./UploaderField";

const Container = styled(ScrollView)<{
  color?: string;
}>`
  width: 100%;
  height: 100%;

  --primary-color: ${(props) => props.color || theme.colors.primary};
  --rate-icon-full-color: ${(props) => props.color || theme.colors.primary};
  --loading-color: #fff;

  .taroify-button__loading--right {
    margin-right: 24px;
  }
`;

export interface FormComponentProps {
  fields: Array<{
    id: string;
    label: string;
    widgetId: string;
    name: string;
    required: boolean;
    fieldType:
      | "input"
      | "switch"
      | "radio"
      | "checkbox"
      | "picker"
      | "address"
      | "stepper"
      | "rate"
      | "uploader";
    inputType?: "input" | "password";
    options?: Array<{
      label: string;
      value: string;
    }>;
    placeholder?: string;
    uploadMax?: number;
  }>;
  inset?: boolean;
  buttonText?: string;
  themeColor?: string;
  defaultValues?: Record<string, any>;
  onFormSubmit: (data: any) => void;
  isLoading: boolean;
}

const FormComponent = (props: FormComponentProps) => {
  const {
    fields,
    buttonText,
    inset,
    themeColor,
    onFormSubmit,
    defaultValues,
    isLoading,
  } = props;
  const formRef = useRef<FormInstance>();
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    if (defaultValues) {
      formRef.current?.setValues(defaultValues);
    } else {
      formRef.current?.reset();
      setUpdateKey(updateKey + 1);
    }
  }, [defaultValues]);

  return (
    <Container scrollY color={themeColor}>
      <Form
        ref={formRef}
        key={updateKey}
        defaultValues={defaultValues}
        onSubmit={(e) => onFormSubmit(e.detail.value)}
      >
        <Cell.Group inset={!!inset}>
          {fields.map((field, index) => {
            const {
              label,
              name,
              required,
              fieldType,
              inputType,
              options,
              placeholder,
              uploadMax,
            } = field;
            let props: any = { label, name, required, placeholder };
            if (fieldType === "input") {
              props = {
                label,
                name,
                required,
                inputType,
                placeholder,
              };
              return <InputField {...props} key={index} />;
            } else if (fieldType === "switch") {
              return <SwitchField {...props} key={index} />;
            } else if (fieldType === "rate") {
              return <RateField {...props} key={index} />;
            } else if (fieldType === "stepper") {
              return <StepperField {...props} key={index} />;
            } else if (fieldType === "radio") {
              props = {
                label,
                name,
                required,
                placeholder,
                options,
              };
              return <RadioField {...props} key={index} />;
            } else if (fieldType === "checkbox") {
              props = {
                label,
                name,
                required,
                placeholder,
                options,
              };
              return <CheckboxField {...props} key={index} />;
            } else if (fieldType === "address") {
              return <AddressField {...props} key={index} />;
            } else if (fieldType === "picker") {
              props = {
                label,
                name,
                required,
                placeholder,
                options,
              };
              return <PickerField {...props} key={index} />;
            } else if (fieldType === "uploader") {
              props = { label, name, required, uploadMax };
              return <UploaderField {...props} key={index} />;
            }
            return null;
          })}
        </Cell.Group>
        <View style={{ margin: "32px 16px" }}>
          <Button
            shape="round"
            block
            color="primary"
            formType="submit"
            loading={isLoading}
          >
            {buttonText || "提交"}
          </Button>
        </View>
      </Form>
    </Container>
  );
};

export default FormComponent;
