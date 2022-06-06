import { Component } from "react";
import { ControlType } from "constants/PropertyControlConstants";

export const InputTypes = {
  TEXT: "TEXT",
  NUMBER: "NUMBER",
  INTEGER: "INTEGER",
  PHONE_NUMBER: "PHONE_NUMBER",
  EMAIL: "EMAIL",
  PASSWORD: "PASSWORD",
  CURRENCY: "CURRENCY",
  SEARCH: "SEARCH",
};
export type InputType = typeof InputTypes[keyof typeof InputTypes];

// eslint-disable-next-line @typescript-eslint/ban-types
abstract class BaseControl<P extends ControlProps, S = {}> extends Component<
  P,
  S
> {
  abstract getControlType(): ControlType;
}

export type ComparisonOperations =
  | "EQUALS"
  | "NOT_EQUALS"
  | "LESSER"
  | "GREATER"
  | "IN"
  | "NOT_IN";

export type HiddenType = boolean | Condition | ConditionObject;

export type ConditionObject = { conditionType: string; conditions: Conditions };

export type Condition = {
  path: string;
  comparison: ComparisonOperations;
  value: any;
};

export type Conditions = Array<Condition> | ConditionObject;
export interface ControlBuilder<T extends ControlProps> {
  buildPropertyControl(controlProps: T): JSX.Element;
}

export interface ControlProps extends ControlData, ControlFunctions {
  key?: string;
  extraData?: ControlData[];
  formName: string;
}

export interface ControlData {
  id: string;
  label: string;
  configProperty: string;
  controlType: ControlType;
  propertyValue?: any;
  isValid: boolean;
  validationMessage?: string;
  validationRegex?: string;
  dataType?: InputType;
  isRequired?: boolean;
  hidden?: HiddenType;
  placeholderText?: string;
  schema?: any;
}

export interface ControlFunctions {
  onPropertyChange?: (propertyName: string, propertyValue: string) => void;
}

export default BaseControl;
