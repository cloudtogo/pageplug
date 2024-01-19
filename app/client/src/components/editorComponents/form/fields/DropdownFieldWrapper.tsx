import React, { useEffect, useState } from "react";
import type { SelectOptionProps } from "design-system";
import { Select, Option } from "design-system";

type DropdownFieldWrapperProps = SelectOptionProps & { placeholder?: string };

function DropdownFieldWrapper(props: DropdownFieldWrapperProps) {
  const selectedValueHandler = () => {
    return props.input?.value?.value ?? props.input?.value;
  };
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
  }>({
    value: selectedValueHandler(),
  });
  const onSelectHandler = (value?: string) => {
    setSelectedOption(value ? { value } : { value: "GET" });
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
          <Option key={option.value} value={option.value}>
            {option.value}
          </Option>
        );
      })}
    </Select>
  );
}

export default DropdownFieldWrapper;
