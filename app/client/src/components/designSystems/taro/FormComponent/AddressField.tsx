import React, { useRef, useState } from "react";
import { ArrowRight } from "@taroify/icons";
import { Form, AreaPicker, Input } from "@taroify/core";
import { FormItemInstance } from "@taroify/core/form";
import PortalPopup from "./PortalPopup";
import { areaList } from "@vant/area-data";

export interface FieldProps {
  label: string;
  name: string;
  required: boolean;
  placeholder?: string;
}

function PickerField({ label, name, required, placeholder }: FieldProps) {
  const itemRef = useRef<FormItemInstance>();
  const [open, setOpen] = useState(false);

  const current = itemRef.current?.getValue();
  let currentLabel: any = undefined;
  if (current?.length === 3) {
    const provinceList: any = areaList.province_list;
    const cityList: any = areaList.city_list;
    const countryList: any = areaList.county_list;
    currentLabel = [
      provinceList[current[0]],
      cityList[current[1]],
      countryList[current[2]],
    ].join("");
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
        <AreaPicker
          onCancel={() => setOpen(false)}
          onConfirm={(newValue) => {
            itemRef.current?.setValue(newValue);
            setOpen(false);
          }}
        >
          <AreaPicker.Toolbar>
            <AreaPicker.Button>取消</AreaPicker.Button>
            <AreaPicker.Button>确认</AreaPicker.Button>
          </AreaPicker.Toolbar>
          <AreaPicker.Columns>{areaList}</AreaPicker.Columns>
        </AreaPicker>
      </PortalPopup>
    </>
  );
}

export default PickerField;
