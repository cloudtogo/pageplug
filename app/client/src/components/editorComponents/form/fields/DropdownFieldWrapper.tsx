import React, { useEffect, useState } from "react";
import type { SelectOptionProps } from "@appsmith/ads";
import { Select, Option } from "@appsmith/ads";

type DropdownFieldWrapperProps = SelectOptionProps & { placeholder?: string };

function DropdownFieldWrapper(props: DropdownFieldWrapperProps) {
  const selectedValueHandler = () => {
    return props.input?.value?.value ?? props.input?.value;
  };
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedOption, setSelectedOption] = useState<any>({
    value: selectedValueHandler(),
  });
  const onSelectHandler = (value?: string) => {
    setSelectedOption(value ? { value } : { value: "GET" });
    props.input.onChange({ value: value });
  };

  useEffect(() => {
    setSelectedOption({ value: selectedValueHandler() });
  }, [props.input.value, props.placeholder]);

  return (
    <Select
      className={props.className}
      isDisabled={props.disabled}
      onSelect={onSelectHandler}
      placeholder={props.placeholder}
      value={selectedOption.value}
    >
      {props.options.map((option: SelectOptionProps) => {
        return (
          <Option key={option.id} value={option.value}>
            {option.label || option.value}
          </Option>
        );
      })}
    </Select>
  );
}

export default DropdownFieldWrapper;
