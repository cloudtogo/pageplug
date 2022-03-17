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

function ActionControlComponent(props: RenderComponentProps) {
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

class ActionControl extends BaseControl<ControlProps> {
  updateItems = (items: Array<Record<string, any>>) => {
    const listObj = items.reduce((obj: any, each: any, index: number) => {
      obj[each.id] = {
        ...each,
        index,
      };
      return obj;
    }, {});
    this.updateProperty(this.props.propertyName, listObj);
  };

  onEdit = (index: number) => {
    const list: Array<{
      id: string;
      label: string;
    }> = Object.values(this.props.propertyValue);
    const targetToChange = list[index];
    this.props.openNextPanel({
      index,
      ...targetToChange,
      propPaneId: this.props.widgetProperties.widgetId,
    });
  };

  render() {
    const actions: Array<{
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
          items={actions}
          onEdit={this.onEdit}
          renderComponent={ActionControlComponent}
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
            text="添加动作单元"
            type="button"
          />
        </StyledPropertyPaneButtonWrapper>
      </TabsWrapper>
    );
  }

  toggleVisibility = (index: number) => {
    const actions: Array<{
      id: string;
      label: string;
      isVisible: boolean;
      widgetId: string;
    }> = this.props.propertyValue.slice();
    const isVisible = actions[index].isVisible === true ? false : true;
    const updatedCells = actions.map((cell, cellIndex) => {
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
    const actionsArray: any = Object.values(this.props.propertyValue);
    const itemId = actionsArray[index].id;
    if (actionsArray && actionsArray.length === 1) return;
    const updatedArray = actionsArray.filter((eachItem: any, i: number) => {
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
    const actionsArray: any = Object.values(this.props.propertyValue);
    const itemId = actionsArray[index].id;
    this.updateProperty(
      `${this.props.propertyName}.${itemId}.label`,
      updatedLabel,
    );
  };

  addOption = () => {
    let actions = this.props.propertyValue;
    const actionsArray = Object.values(actions);
    const newTabId = generateReactKey({ prefix: "action" });
    const newTabLabel = getNextEntityName(
      "动作",
      actionsArray.map((tab: any) => tab.label),
    );
    actions = {
      ...actions,
      [newTabId]: {
        id: newTabId,
        label: newTabLabel,
        widgetId: generateReactKey(),
        type: "icon",
        icon: "like-o",
        buttonType: "warning",
      },
    };

    this.updateProperty(this.props.propertyName, actions);
  };

  static getControlType() {
    return "ACTIONS_INPUT";
  }
}

export default ActionControl;
