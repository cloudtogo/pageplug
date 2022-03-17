import React from "react";
import { Form, Input } from "@taroify/core";

export interface FieldProps {
  label: string;
  name: string;
  required: boolean;
  inputType: "text" | "number" | "idcard" | "digit" | "password";
  placeholder?: string;
}

function Field({ label, name, required, inputType, placeholder }: FieldProps) {
  const isPassword = inputType === "password";
  return (
    <Form.Item name={name} rules={[{ required, message: `请填写${label}` }]}>
      <Form.Label>{label}</Form.Label>
      <Form.Control>
        <Input
          type={isPassword ? "text" : inputType}
          password={isPassword}
          placeholder={placeholder || label}
        />
      </Form.Control>
    </Form.Item>
  );
}

export default Field;
