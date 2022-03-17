import React from "react";
import BaseControl, { ControlProps } from "./BaseControl";
import RadioGroup, { OptionProps } from "components/ads/Radio";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-top: 5px;
`;

class RadioControl extends BaseControl<RadioControlProps> {
  selectOption = (value: string) => {
    const { defaultValue, propertyValue } = this.props;
    if (propertyValue === value) {
      this.updateProperty(this.props.propertyName, defaultValue);
    } else {
      this.updateProperty(this.props.propertyName, value);
    }
  };
  render() {
    const { options, propertyValue, columns, name } = this.props;
    return (
      <Wrapper>
        <RadioGroup
          name={name}
          columns={columns}
          options={options}
          onSelect={this.selectOption}
          defaultValue={propertyValue}
        />
      </Wrapper>
    );
  }

  static getControlType() {
    return "RADIO";
  }
}

export interface RadioControlProps extends ControlProps {
  options: OptionProps[];
  defaultValue: string;
  columns: number;
  name: string;
}

export default RadioControl;
