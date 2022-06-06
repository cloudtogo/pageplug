import React, { useEffect, useRef, useState } from "react";
import { View } from "@tarojs/components";
import { Form, Button, Cell } from "@taroify/core";
import { FormInstance } from "@taroify/core/form";
import { styled } from "linaria/react";
import { taroifyTheme } from "constants/DefaultTheme";
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

const ThemedForm = styled(Form)<{
  color?: string;
}>`
  width: 100%;
  height: 100%;

  --primary-color: ${(props) => props.color || taroifyTheme.primaryColor};
  --rate-icon-full-color: ${(props) =>
    props.color || taroifyTheme.primaryColor};
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
    <ThemedForm
      ref={formRef}
      key={updateKey}
      color={themeColor}
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
          let props: any = { label, name, required, placeholder, key: index };
          if (fieldType === "input") {
            props = {
              label,
              name,
              required,
              inputType,
              placeholder,
              key: index,
            };
            return <InputField {...props} />;
          } else if (fieldType === "switch") {
            return <SwitchField {...props} />;
          } else if (fieldType === "rate") {
            return <RateField {...props} />;
          } else if (fieldType === "stepper") {
            return <StepperField {...props} />;
          } else if (fieldType === "radio") {
            props = {
              label,
              name,
              required,
              placeholder,
              options,
              key: index,
            };
            return <RadioField {...props} />;
          } else if (fieldType === "checkbox") {
            props = {
              label,
              name,
              required,
              placeholder,
              options,
              key: index,
            };
            return <CheckboxField {...props} />;
          } else if (fieldType === "address") {
            return <AddressField {...props} />;
          } else if (fieldType === "picker") {
            props = {
              label,
              name,
              required,
              placeholder,
              options,
              key: index,
            };
            return <PickerField {...props} />;
          } else if (fieldType === "uploader") {
            props = { label, name, required, uploadMax, key: index };
            return <UploaderField {...props} />;
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
    </ThemedForm>
  );
};

export default FormComponent;
