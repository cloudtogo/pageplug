import React, { useContext } from "react";
import type { ControlProps } from "./BaseControl";
import BaseControl from "./BaseControl";
import { StyledDynamicInput } from "./StyledControls";
import type { InputType } from "components/constants";
import type { CodeEditorExpected } from "components/editorComponents/CodeEditor";
import {
  CodeEditorBorder,
  EditorModes,
  EditorSize,
  EditorTheme,
  TabBehaviour,
} from "components/editorComponents/CodeEditor/EditorConfig";
import { CollapseContext } from "pages/Editor/PropertyPane/PropertySection";
import LazyCodeEditor from "../editorComponents/LazyCodeEditor";
import type { AdditionalDynamicDataTree } from "utils/autocomplete/customTreeTypeDefCreator";

export function JsData(props: {
  label: string;
  value: string;
  onBlur?: () => void;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement> | string) => void;
  onFocus?: () => void;
  evaluatedValue?: any;
  expected?: CodeEditorExpected;
  placeholder?: string;
  dataTreePath?: string;
  additionalAutocomplete?: AdditionalDynamicDataTree;
  theme?: EditorTheme;
  hideEvaluatedValue?: boolean;
}) {
  const {
    dataTreePath,
    evaluatedValue,
    expected,
    hideEvaluatedValue,
    label,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    value,
  } = props;

  //subscribing to context to help re-render component on Property section open or close
  const isOpen = useContext(CollapseContext);

  return (
    <StyledDynamicInput>
      <LazyCodeEditor
        AIAssisted
        additionalDynamicData={props.additionalAutocomplete}
        border={CodeEditorBorder.ALL_SIDE}
        dataTreePath={dataTreePath}
        evaluatedPopUpLabel={label}
        evaluatedValue={evaluatedValue}
        expected={expected}
        hideEvaluatedValue={hideEvaluatedValue}
        hoverInteraction
        input={{
          value: value,
          onChange: onChange,
        }}
        isEditorHidden={!isOpen}
        mode={EditorModes.JAVASCRIPT}
        onEditorBlur={onBlur}
        onEditorFocus={onFocus}
        placeholder={placeholder}
        size={EditorSize.EXTENDED}
        tabBehaviour={TabBehaviour.INDENT}
        theme={props.theme || EditorTheme.LIGHT}
      />
    </StyledDynamicInput>
  );
}

class JsDataControl extends BaseControl<JsDataControllProps> {
  render() {
    const {
      additionalAutoComplete,
      dataTreePath,
      defaultValue,
      expected,
      hideEvaluatedValue,
      label,
      onBlur,
      onFocus,
      placeholderText,
      propertyValue,
    } = this.props;

    return (
      <JsData
        additionalAutocomplete={additionalAutoComplete}
        dataTreePath={dataTreePath}
        expected={expected}
        hideEvaluatedValue={hideEvaluatedValue}
        label={label}
        onBlur={onBlur}
        onChange={this.onTextChange}
        onFocus={onFocus}
        placeholder={placeholderText}
        theme={this.props.theme}
        value={propertyValue !== undefined ? propertyValue : defaultValue}
      />
    );
  }

  onTextChange = (event: React.ChangeEvent<HTMLTextAreaElement> | string) => {
    const value = event;
    // if (typeof event !== "string") {
    //   value = event.target.value;
    // }
    this.updateProperty(this.props.propertyName, value, true);
  };

  static getControlType() {
    return "JS_DATA";
  }
}

export interface JsDataControllProps extends ControlProps {
  placeholderText: string;
  inputType: InputType;
  validationMessage?: string;
  isDisabled?: boolean;
  defaultValue?: any;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default JsDataControl;
