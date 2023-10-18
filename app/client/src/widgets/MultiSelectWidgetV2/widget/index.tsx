import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { Layers } from "constants/Layers";
import type { WidgetType } from "constants/WidgetConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import type { SetterConfig, Stylesheet } from "entities/AppTheming";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import equal from "fast-deep-equal/es6";
import { isArray, isFinite, isString, xorWith } from "lodash";
import type { DraftValueType, LabelInValueType } from "rc-select/lib/Select";
import React from "react";
import { AutocompleteDataType } from "utils/autocomplete/AutocompleteDataType";
import { isAutoLayout } from "utils/autoLayout/flexWidgetUtils";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import { GRID_DENSITY_MIGRATION_V1, MinimumPopupRows } from "widgets/constants";
import {
  isAutoHeightEnabledForWidget,
  DefaultAutocompleteDefinitions,
} from "widgets/WidgetUtils";
import MultiSelectComponent from "../component";
import derivedProperties from "./parseDerivedProperties";
import type { AutocompletionDefinitions } from "widgets/constants";
import {
  defaultValueExpressionPrefix,
  getDefaultValueExpressionSuffix,
  getOptionLabelValueExpressionPrefix,
  optionLabelValueExpressionSuffix,
} from "../constants";
import {
  defaultOptionValueValidation,
  labelKeyValidation,
  getLabelValueAdditionalAutocompleteData,
  getLabelValueKeyOptions,
  valueKeyValidation,
} from "./propertyUtils";
import type {
  WidgetQueryConfig,
  WidgetQueryGenerationFormConfig,
} from "WidgetQueryGenerators/types";

class MultiSelectWidget extends BaseWidget<
  MultiSelectWidgetProps,
  WidgetState
> {
  static getQueryGenerationConfig(widget: WidgetProps) {
    return {
      select: {
        where: `${widget.widgetName}.filterText`,
      },
    };
  }

  static getPropertyUpdatesForQueryBinding(
    queryConfig: WidgetQueryConfig,
    widget: WidgetProps,
    formConfig: WidgetQueryGenerationFormConfig,
  ) {
    let modify;

    if (queryConfig.select) {
      modify = {
        sourceData: queryConfig.select.data,
        optionLabel: formConfig.aliases.find((d) => d.name === "label")?.alias,
        optionValue: formConfig.aliases.find((d) => d.name === "value")?.alias,
        defaultOptionValue: "",
        serverSideFiltering: true,
        onFilterUpdate: queryConfig.select.run,
      };
    }

    return {
      modify,
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "MultiSelect is used to capture user input/s from a specified list of permitted inputs. A MultiSelect captures multiple choices from a list of options",
      "!url": "https://docs.appsmith.com/widget-reference/dropdown",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      filterText: {
        "!type": "string",
        "!doc": "The filter text for Server side filtering",
      },
      selectedOptionValues: {
        "!type": "[string]",
        "!doc": "The array of values selected in a multi select dropdown",
        "!url": "https://docs.appsmith.com/widget-reference/dropdown",
      },
      selectedOptionLabels: {
        "!type": "[string]",
        "!doc":
          "The array of selected option labels in a multi select dropdown",
        "!url": "https://docs.appsmith.com/widget-reference/dropdown",
      },
      isDisabled: "bool",
      isValid: "bool",
      isDirty: "bool",
      options: "[$__dropdownOption__$]",
    };
  }

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "数据",
        children: [
          {
            helpText: "接受一个对象数组以显示选项。使用 {{}} 绑定来自 API 的数据。",
            propertyName: "sourceData",
            label: "源数据",
            controlType: "ONE_CLICK_BINDING_CONTROL",
            controlConfig: {
              aliases: [
                {
                  name: "label",
                  isSearcheable: true,
                  isRequired: true,
                },
                {
                  name: "value",
                  isRequired: true,
                },
              ],
              sampleData: JSON.stringify(
                [
                  { name: "Blue", code: "BLUE" },
                  { name: "Green", code: "GREEN" },
                  { name: "Red", code: "RED" },
                ],
                null,
                2,
              ),
            },
            isJSConvertible: true,
            placeholderText: '[{ "label": "Option1", "value": "Option2" }]',
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    required: true,
                  },
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            helpText:
              "选择或设置源数据中的字段作为显示标签",
            propertyName: "optionLabel",
            label: "Label key",
            controlType: "DROP_DOWN",
            customJSControl: "WRAPPED_CODE_EDITOR",
            controlConfig: {
              wrapperCode: {
                prefix: getOptionLabelValueExpressionPrefix,
                suffix: optionLabelValueExpressionSuffix,
              },
            },
            placeholderText: "",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            evaluatedDependencies: ["sourceData"],
            options: getLabelValueKeyOptions,
            alwaysShowSelected: true,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: labelKeyValidation,
                expected: {
                  type: "String or Array<string>",
                  example: `color | ["blue", "green"]`,
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
            additionalAutoComplete: getLabelValueAdditionalAutocompleteData,
          },
          {
            helpText: "选择或设置源数据中的字段作为数值",
            propertyName: "optionValue",
            label: "Value key",
            controlType: "DROP_DOWN",
            customJSControl: "WRAPPED_CODE_EDITOR",
            controlConfig: {
              wrapperCode: {
                prefix: getOptionLabelValueExpressionPrefix,
                suffix: optionLabelValueExpressionSuffix,
              },
            },
            placeholderText: "",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            evaluatedDependencies: ["sourceData"],
            options: getLabelValueKeyOptions,
            alwaysShowSelected: true,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: valueKeyValidation,
                expected: {
                  type: "String or Array<string | number | boolean>",
                  example: `color | [1, "orange"]`,
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
              dependentPaths: ["sourceData"],
            },
            additionalAutoComplete: getLabelValueAdditionalAutocompleteData,
          },
          {
            helpText: "默认选中值",
            propertyName: "defaultOptionValue",
            label: "默认选中值",
            controlType: "WRAPPED_CODE_EDITOR",
            controlConfig: {
              wrapperCode: {
                prefix: defaultValueExpressionPrefix,
                suffix: getDefaultValueExpressionSuffix,
              },
            },
            placeholderText: "[GREEN]",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: defaultOptionValueValidation,
                expected: {
                  type: "Array of values",
                  example: ` "option1, option2" | ['option1', 'option2'] | [{ "label": "label1", "value": "value1" }]`,
                  autocompleteDataType: AutocompleteDataType.ARRAY,
                },
              },
              dependentPaths: ["serverSideFiltering", "options"],
            },
            dependencies: ["serverSideFiltering", "options"],
          },
        ],
      },
      {
        sectionName: "标签",
        children: [
          {
            helpText: "设置组件标签文本",
            propertyName: "labelText",
            label: "文本",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入文本内容",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "设置组件标签位置",
            propertyName: "labelPosition",
            label: "位置",
            controlType: "ICON_TABS",
            fullWidth: true,
            hidden: isAutoLayout,
            options: [
              { label: "自动", value: LabelPosition.Auto },
              { label: "左", value: LabelPosition.Left },
              { label: "上", value: LabelPosition.Top },
            ],
            defaultValue: LabelPosition.Top,
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "设置组件标签的对齐方式",
            propertyName: "labelAlignment",
            label: "对齐",
            controlType: "LABEL_ALIGNMENT_OPTIONS",
            fullWidth: false,
            options: [
              {
                startIcon: "align-left",
                value: Alignment.LEFT,
              },
              {
                startIcon: "align-right",
                value: Alignment.RIGHT,
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            hidden: (props: MultiSelectWidgetProps) =>
              props.labelPosition !== LabelPosition.Left,
            dependencies: ["labelPosition"],
          },
          {
            helpText: "设置组件标签占用的列数",
            propertyName: "labelWidth",
            label: "宽度（所占列数）",
            controlType: "NUMERIC_INPUT",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            min: 0,
            validation: {
              type: ValidationTypes.NUMBER,
              params: {
                natural: true,
              },
            },
            hidden: (props: MultiSelectWidgetProps) =>
              props.labelPosition !== LabelPosition.Left,
            dependencies: ["labelPosition"],
          },
        ],
      },
      {
        sectionName: "搜索过滤",
        children: [
          {
            propertyName: "isFilterable",
            label: "允许搜索",
            helpText: "让下拉列表支持数据过滤",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "开启服务端数据过滤",
            propertyName: "serverSideFiltering",
            label: "服务端过滤",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "过滤关键字更改时触发",
            hidden: (props: MultiSelectWidgetProps) =>
              !props.serverSideFiltering,
            dependencies: ["serverSideFiltering"],
            propertyName: "onFilterUpdate",
            label: "onFilterUpdate",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
      {
        sectionName: "校验",
        children: [
          {
            propertyName: "isRequired",
            label: "必填",
            helpText: "强制用户填写",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            helpText: "提示信息",
            propertyName: "labelTooltip",
            label: "提示",
            controlType: "INPUT_TEXT",
            placeholderText: "添加提示信息",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "设置占位文本",
            propertyName: "placeholderText",
            label: "占位符",
            controlType: "INPUT_TEXT",
            placeholderText: "Search",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "控制组件的显示/隐藏",
            propertyName: "isVisible",
            label: "是否显示",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            label: "禁用",
            helpText: "让组件不可交互",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "animateLoading",
            label: "加载时显示动画",
            controlType: "SWITCH",
            helpText: "组件依赖的数据加载时显示加载动画",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "是否下拉列表中展示全选选项",
            propertyName: "allowSelectAll",
            label: "允许全选",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "事件",
        children: [
          {
            helpText: "用户选中一个选项时触发",
            propertyName: "onOptionChange",
            label: "onOptionChange",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "when the dropdown opens",
            propertyName: "onDropdownOpen",
            label: "onDropdownOpen",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "when the dropdown closes",
            propertyName: "onDropdownClose",
            label: "onDropdownClose",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "标签样式",
        children: [
          {
            propertyName: "labelTextColor",
            label: "字体颜色",
            helpText: "设置标签字体颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "labelTextSize",
            label: "字体大小",
            helpText: "设置标签字体大小",
            controlType: "DROP_DOWN",
            defaultValue: "0.875rem",
            hidden: isAutoLayout,
            options: [
              {
                label: "S",
                value: "0.875rem",
                subText: "0.875rem",
              },
              {
                label: "M",
                value: "1rem",
                subText: "1rem",
              },
              {
                label: "L",
                value: "1.25rem",
                subText: "1.25rem",
              },
              {
                label: "XL",
                value: "1.875rem",
                subText: "1.875rem",
              },
              {
                label: "2xl",
                value: "3rem",
                subText: "3rem",
              },
              {
                label: "3xl",
                value: "3.75rem",
                subText: "3.75rem",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "labelStyle",
            label: "强调",
            helpText: "设置标签字体是否加粗或斜体",
            controlType: "BUTTON_GROUP",
            options: [
              {
                icon: "text-bold",
                value: "BOLD",
              },
              {
                icon: "text-italic",
                value: "ITALIC",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "轮廓样式",
        children: [
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText: "边框圆角样式",
            controlType: "BORDER_RADIUS_OPTIONS",
            isBindProperty: true,
            isJSConvertible: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
            },
          },
          {
            propertyName: "boxShadow",
            label: "阴影",
            helpText: "组件轮廓投影",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "accentColor",
            label: "强调色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            invisible: true,
          },
        ],
      },
    ];
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      accentColor: "{{appsmith.theme.colors.primaryColor}}",
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "none",
    };
  }

  static getDerivedPropertiesMap() {
    return {
      options: `{{(()=>{${derivedProperties.getOptions}})()}}`,
      value: `{{this.selectedOptionValues}}`,
      isValid: `{{(()=>{${derivedProperties.getIsValid}})()}}`,
      selectedOptionValues: `{{(()=>{${derivedProperties.getSelectedOptionValues}})()}}`,
      selectedOptionLabels: `{{(()=>{${derivedProperties.getSelectedOptionLabels}})()}}`,
    };
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      selectedOptions: "defaultOptionValue",
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      selectedOptions: undefined,
      filterText: "",
      isDirty: false,
    };
  }

  componentDidUpdate(prevProps: MultiSelectWidgetProps): void {
    // Check if defaultOptionValue is string
    let isStringArray = false;
    if (
      this.props.defaultOptionValue &&
      this.props.defaultOptionValue.some(
        (value: any) => isString(value) || isFinite(value),
      )
    ) {
      isStringArray = true;
    }

    const hasChanges = isStringArray
      ? xorWith(
          this.props.defaultOptionValue as string[],
          prevProps.defaultOptionValue as string[],
          equal,
        ).length > 0
      : xorWith(
          this.props.defaultOptionValue as OptionValue[],
          prevProps.defaultOptionValue as OptionValue[],
          equal,
        ).length > 0;

    if (hasChanges && this.props.isDirty) {
      this.props.updateWidgetMetaProperty("isDirty", false);
    }
  }

  static getSetterConfig(): SetterConfig {
    return {
      __setters: {
        setVisibility: {
          path: "isVisible",
          type: "boolean",
        },
        setDisabled: {
          path: "isDisabled",
          type: "boolean",
        },
        setRequired: {
          path: "isRequired",
          type: "boolean",
        },
        setSelectedOptions: {
          path: "defaultOptionValue",
          type: "array",
          accessor: "selectedOptionValues",
        },
      },
    };
  }

  getPageView() {
    const options = isArray(this.props.options) ? this.props.options : [];
    const minDropDownWidth = MinimumPopupRows * this.props.parentColumnSpace;
    const { componentWidth } = this.getComponentDimensions();
    const values = this.mergeLabelAndValue();
    const isInvalid =
      "isValid" in this.props && !this.props.isValid && !!this.props.isDirty;
    return (
      <MultiSelectComponent
        accentColor={this.props.accentColor}
        allowSelectAll={this.props.allowSelectAll}
        borderRadius={this.props.borderRadius}
        boxShadow={this.props.boxShadow}
        compactMode={
          !(
            (this.props.bottomRow - this.props.topRow) /
              GRID_DENSITY_MIGRATION_V1 >
            1
          )
        }
        disabled={this.props.isDisabled ?? false}
        dropDownWidth={minDropDownWidth}
        dropdownStyle={{
          zIndex: Layers.dropdownModalWidget,
        }}
        filterText={this.props.filterText}
        isDynamicHeightEnabled={isAutoHeightEnabledForWidget(this.props)}
        isFilterable={this.props.isFilterable}
        isValid={!isInvalid}
        labelAlignment={this.props.labelAlignment}
        labelPosition={this.props.labelPosition}
        labelStyle={this.props.labelStyle}
        labelText={this.props.labelText}
        labelTextColor={this.props.labelTextColor}
        labelTextSize={this.props.labelTextSize}
        labelTooltip={this.props.labelTooltip}
        labelWidth={this.getLabelWidth()}
        loading={this.props.isLoading}
        onChange={this.onOptionChange}
        onDropdownClose={this.onDropdownClose}
        onDropdownOpen={this.onDropdownOpen}
        onFilterChange={this.onFilterChange}
        options={options}
        placeholder={this.props.placeholderText as string}
        renderMode={this.props.renderMode}
        serverSideFiltering={this.props.serverSideFiltering}
        value={values}
        widgetId={this.props.widgetId}
        width={componentWidth}
      />
    );
  }

  onOptionChange = (value: DraftValueType) => {
    this.props.updateWidgetMetaProperty("selectedOptions", value, {
      triggerPropertyName: "onOptionChange",
      dynamicString: this.props.onOptionChange,
      event: {
        type: EventType.ON_OPTION_CHANGE,
      },
    });
    if (!this.props.isDirty) {
      this.props.updateWidgetMetaProperty("isDirty", true);
    }
  };

  // { label , value } is needed in the widget
  mergeLabelAndValue = (): LabelInValueType[] => {
    if (!this.props.selectedOptionLabels || !this.props.selectedOptionValues) {
      return [];
    }
    const labels = [...this.props.selectedOptionLabels];
    const values = [...this.props.selectedOptionValues];
    return values.map((value, index) => ({
      value,
      label: labels[index],
    }));
  };

  onFilterChange = (value: string) => {
    this.props.updateWidgetMetaProperty("filterText", value);

    if (this.props.onFilterUpdate && this.props.serverSideFiltering) {
      super.executeAction({
        triggerPropertyName: "onFilterUpdate",
        dynamicString: this.props.onFilterUpdate,
        event: {
          type: EventType.ON_FILTER_UPDATE,
        },
      });
    }
  };

  onDropdownOpen = () => {
    if (this.props.onDropdownOpen) {
      super.executeAction({
        triggerPropertyName: "onDropdownOpen",
        dynamicString: this.props.onDropdownOpen,
        event: {
          type: EventType.ON_DROPDOWN_OPEN,
        },
      });
    }
  };

  onDropdownClose = () => {
    if (this.props.onDropdownClose) {
      super.executeAction({
        triggerPropertyName: "onDropdownClose",
        dynamicString: this.props.onDropdownClose,
        event: {
          type: EventType.ON_DROPDOWN_CLOSE,
        },
      });
    }
  };

  static getWidgetType(): WidgetType {
    return "MULTI_SELECT_WIDGET_V2";
  }
}
export interface OptionValue {
  label: string;
  value: string;
}
export interface DropdownOption extends OptionValue {
  disabled?: boolean;
}

export interface MultiSelectWidgetProps extends WidgetProps {
  placeholderText?: string;
  selectedIndex?: number;
  selectedIndexArr?: number[];
  selectedOption: DropdownOption;
  options?: DropdownOption[];
  onOptionChange: string;
  onFilterChange: string;
  onDropdownOpen?: string;
  onDropdownClose?: string;
  defaultOptionValue: string[] | OptionValue[];
  isRequired: boolean;
  isLoading: boolean;
  selectedOptions: LabelInValueType[];
  filterText: string;
  selectedOptionValues?: string[];
  selectedOptionLabels?: string[];
  serverSideFiltering: boolean;
  onFilterUpdate: string;
  allowSelectAll?: boolean;
  isFilterable: boolean;
  labelText: string;
  labelPosition?: LabelPosition;
  labelAlignment?: Alignment;
  labelWidth?: number;
  isDirty?: boolean;
}

export default MultiSelectWidget;
