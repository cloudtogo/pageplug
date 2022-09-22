import React, { useRef } from "react";
import { chooseImage } from "@tarojs/taro";
import { Form, Uploader } from "@taroify/core";
import { FormItemInstance } from "@taroify/core/form";

export interface FieldProps {
  label: string;
  name: string;
  required: boolean;
  uploadMax: number;
}

function UploaderField({ label, name, required, uploadMax }: FieldProps) {
  const itemRef = useRef<FormItemInstance>();

  function onUpload() {
    chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
    }).then(({ tempFiles }) => {
      itemRef.current?.setValue([
        ...(itemRef.current?.getValue() || []),
        {
          url: tempFiles[0].path,
          type: tempFiles[0].type,
          name: tempFiles[0].originalFileObj?.name,
        },
      ]);
    });
  }

  return (
    <Form.Item
      ref={itemRef}
      name={name}
      rules={[{ required, message: `请上传${label}` }]}
    >
      <Form.Label>{label}</Form.Label>
      <Form.Control>
        <Uploader multiple maxFiles={uploadMax} onUpload={onUpload} />
      </Form.Control>
    </Form.Item>
  );
}

export default UploaderField;
