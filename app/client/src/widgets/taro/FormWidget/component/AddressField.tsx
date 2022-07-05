import React, { useEffect, useRef, useState } from "react";
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

const provinceList: any = areaList.province_list;
const cityList: any = areaList.city_list;
const countyList: any = areaList.county_list;

const hiddenStyle = {
  height: 0,
  padding: 0,
};

function PickerField({ label, name, required, placeholder }: FieldProps) {
  const itemRef = useRef<FormItemInstance>();
  const provinceNameRef = useRef<FormItemInstance>();
  const cityNameRef = useRef<FormItemInstance>();
  const countyNameRef = useRef<FormItemInstance>();
  const [open, setOpen] = useState(false);
  const [areaValue, setAreaValue] = useState<string[]>();
  const current = itemRef.current?.getValue();

  useEffect(() => {
    if (current) {
      const currentProvince = current.substr(0, 2) + "0000";
      const currentCity = current.substr(0, 4) + "00";
      setAreaValue([currentProvince, currentCity, current]);
    }
  }, [current]);

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
          {(props) => {
            let currentLabel = "";
            const county = props.value;
            if (county?.length === 6) {
              const province = county.substr(0, 2) + "0000";
              const city = county.substr(0, 4) + "00";
              currentLabel = [
                provinceList[province],
                cityList[city],
                countyList[county],
              ].join("");
            }
            return (
              <Input
                readonly
                placeholder={placeholder || `请选择${label}`}
                onClick={() => setOpen(true)}
                value={currentLabel}
              />
            );
          }}
        </Form.Control>
      </Form.Item>
      <Form.Item name="province" ref={provinceNameRef} style={hiddenStyle}>
        <Input readonly />
      </Form.Item>
      <Form.Item name="city" ref={cityNameRef} style={hiddenStyle}>
        <Input readonly />
      </Form.Item>
      <Form.Item name="county" ref={countyNameRef} style={hiddenStyle}>
        <Input readonly />
      </Form.Item>
      <PortalPopup
        mountOnEnter={false}
        open={open}
        rounded
        placement="bottom"
        onClose={setOpen}
      >
        <AreaPicker
          value={areaValue}
          onCancel={() => setOpen(false)}
          onConfirm={(newValue) => {
            itemRef.current?.setValue(newValue[2]);
            provinceNameRef.current?.setValue(provinceList[newValue[0]]);
            cityNameRef.current?.setValue(cityList[newValue[1]]);
            countyNameRef.current?.setValue(countyList[newValue[2]]);
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
