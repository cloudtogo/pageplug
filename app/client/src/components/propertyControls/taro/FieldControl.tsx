import React, { useCallback } from "react";
import BaseControl, { ControlProps } from "../BaseControl";
import {
  StyledInputGroup,
  StyledPropertyPaneButton,
  StyledDragIcon,
  StyledDeleteIcon,
  StyledEditIcon,
} from "../StyledControls";
import styled from "constants/DefaultTheme";
import { generateReactKey } from "utils/generators";
import { DroppableComponent } from "components/ads/DraggableListComponent";
import { getNextEntityName } from "utils/AppsmithUtils";
import _, { debounce } from "lodash";
import { Category, Size } from "components/ads/Button";

const StyledPropertyPaneButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 10px;
`;

const ItemWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const TabsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledOptionControlInputGroup = styled(StyledInputGroup)`
  margin-right: 2px;
  margin-bottom: 2px;
  width: 100%;
  padding-left: 30px;
  padding-right: 60px;
  &&& {
    input {
      border: none;
      color: ${(props) => props.theme.colors.propertyPane.radioGroupText};
      background: ${(props) => props.theme.colors.propertyPane.radioGroupBg};
      &:focus {
        border: none;
        color: ${(props) => props.theme.colors.textOnDarkBG};
        background: ${(props) => props.theme.colors.paneInputBG};
      }
    }
  }
`;

type RenderComponentProps = {
  index: number;
  item: {
    label: string;
    isVisible?: boolean;
  };
  deleteOption: (index: number) => void;
  updateOption: (index: number, value: string) => void;
  toggleVisibility?: (index: number) => void;
  onEdit?: (props: any) => void;
};

function FieldControlComponent(props: RenderComponentProps) {
  const { deleteOption, index, item, updateOption } = props;
  const debouncedUpdate = debounce(updateOption, 1000);
  const handleChange = useCallback(() => props.onEdit && props.onEdit(index), [
    index,
  ]);
  return (
    <ItemWrapper>
      <StyledDragIcon height={20} width={20} />
      <StyledOptionControlInputGroup
        dataType="text"
        defaultValue={item.label}
        onChange={(value: string) => {
          debouncedUpdate(index, value);
        }}
        placeholder="标题"
      />
      <StyledDeleteIcon
        className="t--delete-tab-btn"
        height={20}
        marginRight={12}
        onClick={() => {
          deleteOption(index);
        }}
        width={20}
      />
      <StyledEditIcon
        className="t--edit-column-btn"
        height={20}
        onClick={handleChange}
        width={20}
      />
    </ItemWrapper>
  );
}

class FieldControl extends BaseControl<ControlProps> {
  updateItems = (items: Array<Record<string, any>>) => {
    const fieldsObj = items.reduce((obj: any, each: any, index: number) => {
      obj[each.id] = {
        ...each,
        index,
      };
      return obj;
    }, {});
    this.updateProperty(this.props.propertyName, fieldsObj);
  };

  onEdit = (index: number) => {
    const fields: Array<{
      id: string;
      label: string;
    }> = Object.values(this.props.propertyValue);
    const cellToChange = fields[index];
    this.props.openNextPanel({
      index,
      ...cellToChange,
      propPaneId: this.props.widgetProperties.widgetId,
    });
  };

  render() {
    const fields: Array<{
      id: string;
      label: string;
    }> = _.isString(this.props.propertyValue)
      ? []
      : Object.values(this.props.propertyValue);
    return (
      <TabsWrapper>
        <DroppableComponent
          deleteOption={this.deleteOption}
          itemHeight={45}
          items={fields}
          onEdit={this.onEdit}
          renderComponent={FieldControlComponent}
          toggleVisibility={this.toggleVisibility}
          updateItems={this.updateItems}
          updateOption={this.updateOption}
        />
        <StyledPropertyPaneButtonWrapper>
          <StyledPropertyPaneButton
            category={Category.tertiary}
            icon="plus"
            onClick={this.addOption}
            size={Size.medium}
            tag="button"
            text="添加字段"
            type="button"
          />
        </StyledPropertyPaneButtonWrapper>
      </TabsWrapper>
    );
  }

  toggleVisibility = (index: number) => {
    const fields: Array<{
      id: string;
      label: string;
      isVisible: boolean;
      widgetId: string;
    }> = this.props.propertyValue.slice();
    const isVisible = fields[index].isVisible === true ? false : true;
    const updatedCells = fields.map((cell, cellIndex) => {
      if (index === cellIndex) {
        return {
          ...cell,
          isVisible: isVisible,
        };
      }
      return cell;
    });
    this.updateProperty(this.props.propertyName, updatedCells);
  };

  deleteOption = (index: number) => {
    const fieldsArray: any = Object.values(this.props.propertyValue);
    const itemId = fieldsArray[index].id;
    if (fieldsArray && fieldsArray.length === 1) return;
    const updatedArray = fieldsArray.filter((eachItem: any, i: number) => {
      return i !== index;
    });
    const updatedObj = updatedArray.reduce(
      (obj: any, each: any, index: number) => {
        obj[each.id] = {
          ...each,
          index,
        };
        return obj;
      },
      {},
    );
    this.deleteProperties([`${this.props.propertyName}.${itemId}.isVisible`]);
    this.updateProperty(this.props.propertyName, updatedObj);
  };

  updateOption = (index: number, updatedLabel: string) => {
    const fieldsArray: any = Object.values(this.props.propertyValue);
    const itemId = fieldsArray[index].id;
    this.updateProperty(
      `${this.props.propertyName}.${itemId}.label`,
      updatedLabel,
    );
  };

  addOption = () => {
    let fields = this.props.propertyValue;
    const fieldsArray = Object.values(fields);
    const newTabId = generateReactKey({ prefix: "field" });
    const newTabLabel = getNextEntityName(
      "字段",
      fieldsArray.map((tab: any) => tab.label),
    );
    fields = {
      ...fields,
      [newTabId]: {
        id: newTabId,
        label: newTabLabel,
        widgetId: generateReactKey(),
        fieldType: "input",
        name: newTabId,
        inputType: "text",
        required: true,
      },
    };

    this.updateProperty(this.props.propertyName, fields);
  };

  static getControlType() {
    return "FIELDS_INPUT";
  }
}

export default FieldControl;
