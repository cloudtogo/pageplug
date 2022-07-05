import React from "react";
import { Form, Checkbox } from "@taroify/core";

export interface FieldProps {
  label: string;
  name: string;
  required: boolean;
  options: Array<{
    label: string;
    value: string;
  }>;
}

function Field({ label, name, required, options }: FieldProps) {
  return (
    <Form.Item name={name} rules={[{ required, message: `请选择${label}` }]}>
      <Form.Label>{label}</Form.Label>
      <Form.Control>
        <Checkbox.Group direction="horizontal">
          {options?.map((o, index) => (
            <Checkbox
              name={o.value}
              key={index}
              shape="square"
              style={{ marginBottom: "8px" }}
            >
              {o.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Control>
    </Form.Item>
  );
}

export default Field;
