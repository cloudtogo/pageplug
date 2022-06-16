import React, { useState } from "react";
import Select from "react-select";

import { WrappedFieldInputProps } from "redux-form";
import { theme } from "constants/DefaultTheme";
import { SelectComponentsConfig } from "react-select/src/components";
import { LayersContext } from "../../../constants/Layers";

export type DropdownProps = {
  options: Array<{
    value: string;
    label?: string;
  }>;
  input: WrappedFieldInputProps;
  placeholder: string;
  width?: number | string;
  isSearchable?: boolean;
  isDisabled?: boolean;
  customSelectStyles?: any;
  maxMenuHeight: number;
  components?: SelectComponentsConfig<any>;
};

const selectStyles = {
  placeholder: (provided: any) => ({
    ...provided,
    color: "#a3b3bf",
  }),
  control: (styles: any, state: any) => ({
    ...styles,
    width: state.selectProps.width || 100,
    minHeight: "32px",
    border: state.isFocused
      ? `${theme.colors.secondary} solid 1px`
      : `${theme.colors.inputInactiveBorders} solid 1px`,
    boxShadow: state.isFocused ? 0 : 0,
    "&:hover": {
      border: `${theme.colors.secondary} solid 1px`,
    },
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: "30px",
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    padding: "5px",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    padding: "5px",
  }),
  indicatorSeparator: () => ({}),
  menu: (provided: any) => ({ ...provided, zIndex: 2 }),
  menuPortal: (base: any) => ({ ...base, zIndex: 2 }),
};

export function BaseDropdown(props: DropdownProps) {
  const [showMenu, setShowMenu] = useState(false);
  const layer = React.useContext(LayersContext);
  const { customSelectStyles, input } = props;
  const menuPortalStyle = {
    menuPortal: (styles: any) => ({ ...styles, zIndex: layer.max }),
  };

  const _onChange = (value: any) => {
    input.onChange(value);
    setShowMenu(false);
  };
  const _onFocus = () => {
    setShowMenu(true);
  };
  const _onBlur = () => {
    setShowMenu(false);
  };
  return (
    <Select
      menuPortalTarget={document.body}
      styles={{ ...selectStyles, ...customSelectStyles, ...menuPortalStyle }}
      {...input}
      isDisabled={props.isDisabled}
      isSearchable={props.isSearchable}
      width={props.width}
      {...props}
      onChange={(value) => _onChange(value)}
      onBlur={_onBlur}
      onFocus={_onFocus}
      openMenuOnClick
      closeMenuOnSelect
      blurInputOnSelect
      menuIsOpen={showMenu}
    />
  );
}

function Dropdown(props: DropdownProps) {
  return <BaseDropdown {...props} />;
}

export default Dropdown;
