import React from "react";
import { Form, Switch } from "@taroify/core";

export interface FieldProps {
  label: string;
  name: string;
  required: boolean;
}

function Field({ label, name }: FieldProps) {
  return (
    <Form.Item name={name} defaultValue={false}>
      <Form.Label>{label}</Form.Label>
      <Form.Control>
        <Switch size={26} />
      </Form.Control>
    </Form.Item>
  );
}

export default Field;
