import React from "react";
import { Form, Radio } from "@taroify/core";

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
        <Radio.Group direction="horizontal">
          {options?.map((o, index) => (
            <Radio name={o.value} key={index} style={{ marginBottom: "8px" }}>
              {o.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Control>
    </Form.Item>
  );
}

export default Field;
