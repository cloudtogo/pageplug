import React from "react";
import { Form, Stepper } from "@taroify/core";

export interface FieldProps {
  label: string;
  name: string;
  required: boolean;
}

function Field({ label, name, required }: FieldProps) {
  return (
    <Form.Item name={name} rules={[{ required, message: `请输入${label}` }]}>
      <Form.Label>{label}</Form.Label>
      <Form.Control>
        <Stepper />
      </Form.Control>
    </Form.Item>
  );
}

export default Field;
