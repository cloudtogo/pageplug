import React from "react";
import { Form, Rate } from "@taroify/core";

export interface FieldProps {
  label: string;
  name: string;
  required: boolean;
}

function Field({ label, name, required }: FieldProps) {
  return (
    <Form.Item name={name} rules={[{ required, message: `请选择${label}` }]}>
      <Form.Label>{label}</Form.Label>
      <Form.Control>
        <Rate />
      </Form.Control>
    </Form.Item>
  );
}

export default Field;
