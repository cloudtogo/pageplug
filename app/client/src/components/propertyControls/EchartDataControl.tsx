import React from "react";
import { get, isString } from "lodash";
import BaseControl, { ControlProps } from "./BaseControl";
import { ControlWrapper, StyledPropertyPaneButton } from "./StyledControls";
import styled from "constants/DefaultTheme";
import { FormIcons } from "icons/FormIcons";
import { AnyStyledComponent } from "styled-components";
import { CodeEditorExpected } from "components/editorComponents/CodeEditor";
import { InputText } from "components/propertyControls/InputTextControl";
import {
  EditorModes,
  EditorSize,
  EditorTheme,
  TabBehaviour,
} from "components/editorComponents/CodeEditor/EditorConfig";
import { Size, Category } from "design-system";
import { AllChartData, ChartData } from "widgets/ChartWidget/constants";
import { generateReactKey } from "utils/generators";
import { AutocompleteDataType } from "utils/autocomplete/CodemirrorTernService";
import CodeEditor from "components/editorComponents/LazyCodeEditorWrapper";

const Wrapper = styled.div`
  background-color: ${(props) =>
    props.theme.colors.propertyPane.dropdownSelectBg};
  padding: 0 8px;
`;

const StyledOptionControlWrapper = styled(ControlWrapper)`
  display: flex;
  justify-content: flex-start;
  padding: 0;
  width: 100%;
`;

const StyledDynamicInput = styled.div`
  width: 100%;
  &&& {
    input {
      border: none;
      color: ${(props) => props.theme.colors.textOnDarkBG};
      background: ${(props) => props.theme.colors.paneInputBG};
      &:focus {
        border: none;
        color: ${(props) => props.theme.colors.textOnDarkBG};
        background: ${(props) => props.theme.colors.paneInputBG};
      }
    }
  }
`;

const StyledDeleteIcon = styled(FormIcons.DELETE_ICON as AnyStyledComponent)`
  padding: 0;
  position: relative;
  margin-left: 15px;
  cursor: pointer;

  &&& svg {
    path {
      fill: ${(props) => props.theme.colors.propertyPane.jsIconBg};
    }
  }
`;

const ActionHolder = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StyledLabel = styled.label`
  margin: 8px auto 8px 0;

  && {
    color: ${(props) => props.theme.colors.propertyPane.label};
  }
`;

const Box = styled.div`
  height: 16px;
`;

type labelType = {
  titleLabel: string;
  areaLabel: string;
  btnLabel: string;
};

type RenderComponentProps = {
  index: string;
  item: ChartData;
  length: number;
  dataTreePath: string;
  deleteOption: (index: string) => void;
  updateOption: (index: string, key: string, value: string) => void;
  evaluated: {
    seriesName: string;
    data: Array<{ name: string; value: string }> | any;
  };
  theme: EditorTheme;
  noTitle?: boolean;
  label?: labelType;
};

type RenderChildrenComponentProps = {
  index: string;
  item: ChartData;
  length: number;
  dataTreePath: string;
  deleteOption: (index: string) => void;
  updateOption: (index: string, key: string, value: string) => void;
  evaluated: {
    seriesName: string;
    data: Array<{ name: string; value: string }> | any;
  };
  theme: EditorTheme;
  noTitle?: boolean;
  label?: labelType;
  children?: any[];
  panel?: any;
};

const expectedSeriesName: CodeEditorExpected = {
  type: "string",
  example: "series1",
  autocompleteDataType: AutocompleteDataType.STRING,
};
const expectedSeriesData: CodeEditorExpected = {
  type: "Array<{ name: string, value: number Required }>",
  example: [
    {
      name: "Mon",
      value: 10000,
    },
  ],
  autocompleteDataType: AutocompleteDataType.ARRAY,
};

const expectedListenerName: CodeEditorExpected = {
  type: "string",
  example:
    "click | dblclick | mousedown | mouseup | contextmenu | highlight | downplay | selectchanged | datazoom | rendered | fininshed | geoselect | updateAxisPointer",
  autocompleteDataType: AutocompleteDataType.STRING,
};
const expectedListenerSeriesData: CodeEditorExpected = {
  type: "Function",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  example: `{{(params) => { 
    // add code here 
   }}}`,
  autocompleteDataType: AutocompleteDataType.FUNCTION,
};

function EventControlComponent(props: RenderChildrenComponentProps) {
  const {
    dataTreePath,
    deleteOption,
    // evaluated,
    index,
    item,
    length,
    updateOption,
  } = props;
  // console.log(item, dataTreePath, props);
  return (
    <StyledOptionControlWrapper orientation={"VERTICAL"}>
      <ActionHolder>
        <StyledLabel>名称</StyledLabel>
        {length > 0 && (
          <StyledDeleteIcon
            height={20}
            onClick={() => {
              deleteOption(index);
            }}
            width={20}
          />
        )}
      </ActionHolder>
      <StyledOptionControlWrapper orientation={"HORIZONTAL"}>
        <InputText
          dataTreePath={`${dataTreePath}.seriesName`}
          expected={expectedListenerName}
          label={"eventName"}
          onChange={(
            event: React.ChangeEvent<HTMLTextAreaElement> | string,
          ) => {
            let value: string = event as string;
            if (typeof event !== "string") {
              value = event.target.value;
            }
            updateOption(index, "seriesName", value);
          }}
          placeholder="event name"
          theme={props.theme}
          value={item.seriesName || ""}
        />
      </StyledOptionControlWrapper>

      <StyledLabel>函数</StyledLabel>
      <StyledDynamicInput
        className={"t--property-control-chart-series-data-control"}
      >
        <CodeEditor
          dataTreePath={`${dataTreePath}.handler`}
          expected={expectedListenerSeriesData}
          input={{
            value: item.handler,
            onChange: (
              event: React.ChangeEvent<HTMLTextAreaElement> | string,
            ) => {
              let value: string = event as string;
              if (typeof event !== "string") {
                value = event.target.value;
              }
              updateOption(index, "handler", value);
            },
          }}
          mode={EditorModes.JSON_WITH_BINDING}
          placeholder={"event handler"}
          size={EditorSize.EXTENDED}
          tabBehaviour={TabBehaviour.INPUT}
          theme={props.theme}
        />
      </StyledDynamicInput>
      <Box />
    </StyledOptionControlWrapper>
  );
}

function DataControlComponent(props: RenderComponentProps) {
  const {
    dataTreePath,
    deleteOption,
    evaluated,
    index,
    item,
    length,
    updateOption,
    noTitle,
    label,
  } = props;
  return (
    <StyledOptionControlWrapper orientation={"VERTICAL"}>
      {!noTitle ? (
        <>
          <ActionHolder>
            <StyledLabel>{label?.titleLabel}</StyledLabel>
            {length > 1 && (
              <StyledDeleteIcon
                height={20}
                onClick={() => {
                  deleteOption(index);
                }}
                width={20}
              />
            )}
          </ActionHolder>
          <StyledOptionControlWrapper orientation={"HORIZONTAL"}>
            <CodeEditor
              dataTreePath={`${dataTreePath}.seriesName`}
              evaluatedValue={evaluated?.seriesName}
              expected={expectedSeriesName}
              input={{
                value: item.seriesName,
                onChange: (
                  event: React.ChangeEvent<HTMLTextAreaElement> | string,
                ) => {
                  let value: string = event as string;
                  if (typeof event !== "string") {
                    value = event.target.value;
                  }
                  updateOption(index, "seriesName", value);
                },
              }}
              mode={EditorModes.JAVASCRIPT}
              placeholder={label?.titleLabel}
              size={EditorSize.EXTENDED}
              tabBehaviour={TabBehaviour.INPUT}
              theme={props.theme}
            />
          </StyledOptionControlWrapper>
        </>
      ) : null}
      <StyledLabel>{label?.areaLabel}</StyledLabel>
      <StyledDynamicInput
        className={"t--property-control-chart-series-data-control"}
      >
        <CodeEditor
          dataTreePath={`${dataTreePath}.data`}
          evaluatedValue={evaluated?.data}
          expected={expectedSeriesData}
          input={{
            value: item.data,
            onChange: (
              event: React.ChangeEvent<HTMLTextAreaElement> | string,
            ) => {
              let value: string = event as string;
              if (typeof event !== "string") {
                value = event.target.value;
              }
              updateOption(index, "data", value);
            },
          }}
          mode={EditorModes.JSON_WITH_BINDING}
          placeholder={label?.areaLabel}
          size={EditorSize.EXTENDED}
          tabBehaviour={TabBehaviour.INPUT}
          theme={props.theme}
        />
      </StyledDynamicInput>
      <Box />
    </StyledOptionControlWrapper>
  );
}

const Name_Data_Array = ["xAxis", "yAxis"];

const ControlLabel = (propertyName: string) => {
  if (propertyName === "listener") {
    return {
      titleLabel: "名称",
      areaLabel: "函数",
      hasAddBtn: true,
      btnLabel: "ADD LISTENER",
    };
  }
  if (Name_Data_Array.includes(propertyName)) {
    return {
      titleLabel: "标签",
      areaLabel: "数据",
      hasAddBtn: false,
      btnLabel: "ADD AXIS",
    };
  }
  return {
    titleLabel: "Series Title",
    areaLabel: "Series Data",
    hasAddBtn: true,
    btnLabel: "ADD SERIES",
  };
};

class EchartDataControl extends BaseControl<ControlProps> {
  render() {
    const chartData: AllChartData =
      isString(this.props.propertyValue) || !this.props.propertyValue
        ? {}
        : this.props.propertyValue;
    const dataLength = Object.keys(chartData).length;
    const isDataSet = this.props.propertyName === "dataSet";
    const evaluatedValue = this.props.evaluatedValue;
    const firstKey = Object.keys(chartData)[0] as string;
    if (this.props.propertyName === "listener") {
      return (
        <>
          <Wrapper>
            {Object.keys(chartData).map((key: string) => {
              const data = get(chartData, `${key}`);
              return (
                <EventControlComponent
                  dataTreePath={`${this.props.dataTreePath}.${key}`}
                  deleteOption={this.deleteOption}
                  evaluated={get(evaluatedValue, `${key}`)}
                  index={key}
                  item={data}
                  key={key}
                  length={dataLength}
                  theme={this.props.theme}
                  updateOption={this.updateOption}
                  label={ControlLabel(this.props.propertyName)}
                  panel={this.props.panel}
                />
              );
            })}
          </Wrapper>
          {/* 新增按钮 */}
          {ControlLabel(this.props.propertyName).hasAddBtn ? (
            <StyledPropertyPaneButton
              category={Category.tertiary}
              icon="plus"
              onClick={this.addOption}
              size={Size.medium}
              tag="button"
              text={ControlLabel(this.props.propertyName).btnLabel}
              type="button"
            />
          ) : null}
        </>
      );
    }

    if (this.props.widgetProperties.chartType === "PIE_CHART") {
      const data = dataLength
        ? get(chartData, `${firstKey}`)
        : {
            seriesName: "",
            data: [],
          };
      return (
        <DataControlComponent
          noTitle={isDataSet}
          dataTreePath={`${this.props.dataTreePath}.${firstKey}`}
          deleteOption={this.deleteOption}
          evaluated={get(evaluatedValue, `${firstKey}`)}
          index={firstKey}
          item={data}
          length={1}
          theme={this.props.theme}
          updateOption={this.updateOption}
          label={ControlLabel(this.props.propertyName)}
        />
      );
    }

    return (
      <>
        <Wrapper>
          {Object.keys(chartData).map((key: string) => {
            const data = get(chartData, `${key}`);
            return (
              <DataControlComponent
                noTitle={isDataSet}
                dataTreePath={`${this.props.dataTreePath}.${key}`}
                deleteOption={this.deleteOption}
                evaluated={get(evaluatedValue, `${key}`)}
                index={key}
                item={data}
                key={key}
                length={dataLength}
                theme={this.props.theme}
                updateOption={this.updateOption}
                label={ControlLabel(this.props.propertyName)}
              />
            );
          })}
        </Wrapper>

        {/* 新增按钮 */}
        {ControlLabel(this.props.propertyName).hasAddBtn ? (
          <StyledPropertyPaneButton
            category={Category.tertiary}
            icon="plus"
            onClick={this.addOption}
            size={Size.medium}
            tag="button"
            text={ControlLabel(this.props.propertyName).btnLabel}
            type="button"
          />
        ) : null}
      </>
    );
  }

  deleteOption = (index: string) => {
    this.deleteProperties([`${this.props.propertyName}.${index}`]);
  };

  updateOption = (
    index: string,
    propertyName: string,
    updatedValue: string,
  ) => {
    this.updateProperty(
      `${this.props.propertyName}.${index}.${propertyName}`,
      updatedValue,
    );
  };

  /**
   * it adds new series data object in the chartData
   */
  addOption = () => {
    const randomString = generateReactKey();
    if (this.props.propertyName === "listener") {
      this.updateProperty(`${this.props.propertyName}.${randomString}`, {
        seriesName: "",
        handler: "",
      });
    } else {
      this.updateProperty(`${this.props.propertyName}.${randomString}`, {
        seriesName: "",
        data: JSON.stringify([{ name: "label", value: 100 }]),
        handler: "",
      });
    }
  };

  static getControlType() {
    return "ECHART_DATA";
  }
}

export default EchartDataControl;
