import React, { useRef, useState } from "react";
import { ArrowRight } from "@taroify/icons";
import { Form, Picker, Input } from "@taroify/core";
import { FormItemInstance } from "@taroify/core/form";
import PortalPopup from "./PortalPopup";
import _ from "lodash";

export interface FieldProps {
  label: string;
  name: string;
  required: boolean;
  options: Array<{
    label: string;
    value: string;
  }>;
  placeholder?: string;
}

function PickerField({
  label,
  name,
  required,
  options,
  placeholder,
}: FieldProps) {
  const itemRef = useRef<FormItemInstance>();
  const [open, setOpen] = useState(false);

  const current = itemRef.current?.getValue();
  let currentLabel: any = undefined;
  if (current?.length === 1) {
    currentLabel = _.find(options, { value: current[0] })?.label;
  }

  return (
    <>
      <Form.Item
        ref={itemRef}
        name={name}
        clickable
        rightIcon={<ArrowRight />}
        rules={[{ required, message: `请选择${label}` }]}
      >
        <Form.Label>{label}</Form.Label>
        <Form.Control>
          <Input
            readonly
            placeholder={placeholder || `请选择${label}`}
            onClick={() => setOpen(true)}
            value={currentLabel}
          />
        </Form.Control>
      </Form.Item>
      <PortalPopup
        mountOnEnter={false}
        open={open}
        rounded
        placement="bottom"
        onClose={setOpen}
      >
        <Picker
          onCancel={() => setOpen(false)}
          onConfirm={(v) => {
            itemRef.current?.setValue(v);
            setOpen(false);
          }}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            {options?.map((o, index) => (
              <Picker.Option key={index} value={o.value}>
                {o.label}
              </Picker.Option>
            ))}
          </Picker.Column>
        </Picker>
      </PortalPopup>
    </>
  );
}

export default PickerField;
