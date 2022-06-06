import BaseControl, {
  ControlProps,
} from "components/propertyControls/BaseControl";

export const PropertyControls = {
};

export type PropertyControlPropsType =
  | ControlProps;

export const getPropertyControlTypes = (): { [key: string]: string } => {
  const _types: { [key: string]: string } = {};
  Object.values(PropertyControls).forEach(
    (Control: typeof BaseControl & { getControlType: () => string }) => {
      const controlType = Control.getControlType();
      _types[controlType] = controlType;
    },
  );
  return _types;
};
