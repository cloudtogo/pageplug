import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import NavTabComponent from "../component";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import {
  ValidationResponse,
  ValidationTypes,
} from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";
import _ from "lodash";
import { View } from "@tarojs/components";
import { Skeleton } from "@taroify/core";
import styled from "styled-components";

const LoadingContainer = styled(View)<{
  direction: string;
}>`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: ${(props) => (props.direction === "h" ? "row" : "column")};
  align-items: center;
  overflow: hidden;

  & .taroify-skeleton {
    width: ${(props) => (props.direction === "h" ? "80px" : "80%")};
    height: ${(props) => (props.direction === "h" ? "80%" : "40px")};
    border-radius: 4px;
    flex-shrink: 0;
    margin: 10px;
  }
`;

export function selectedTabValidation(
  value: unknown,
  props: MTabsWidgetProps,
  _: any,
): ValidationResponse {
  try {
    let parsed = value;
    let isValid = false;

    if (_.isString(value as string)) {
      if (/^\d+$/.test(value as string)) {
        parsed = Number(value);
        isValid = true;
      } else {
        return {
          isValid: false,
          parsed: 0,
          messages: [`索引值必须是非负整数`],
        };
      }
    }

    if (_.isNumber(value)) {
      isValid = true;
    }

    if (_.isArray(props.list) && Number(parsed) >= props.list.length) {
      return {
        isValid: false,
        parsed,
        messages: [`索引值超出数组范围`],
      };
    }

    return { isValid, parsed };
  } catch (e) {
    return {
      isValid: false,
      parsed: value,
      messages: [`校验失败`],
    };
  }
}

class MTabsWidget extends BaseWidget<MTabsWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "数组，通过 {{}} 进行数据绑定",
            propertyName: "list",
            label: "数据",
            controlType: "INPUT_TEXT",
            placeholderText: '[{ name: "标签" }]',
            inputType: "ARRAY",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.OBJECT_ARRAY,
              params: {
                default: [],
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            propertyName: "nameKey",
            label: "标题字段",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "defaultNum",
            label: "默认选中索引（从 0 开始）",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: selectedTabValidation,
                expected: {
                  type: "数组索引（自然数）",
                  example: 0,
                  autocompleteDataType: AutocompleteDataType.NUMBER,
                },
              },
            },
            dependencies: ["list"],
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "showLoading",
            label: "数据加载时显示加载动画",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            helpText: "选中标签页时触发",
            propertyName: "onTabSelected",
            label: "onTabSelected",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  onTabChange = (tabIndex: number) => {
    this.props.updateWidgetMetaProperty("selectedTabIndex", tabIndex, {
      triggerPropertyName: "onTabSelected",
      dynamicString: this.props.onTabSelected,
      event: {
        type: EventType.ON_TAB_CHANGE,
      },
    });
  };

  static getDerivedPropertiesMap() {
    return {
      selectedTab: `{{_.get(this.list, this.selectedTabIndex)}}`,
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      selectedTabIndex: undefined,
    };
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }

  componentDidUpdate(prevProps: MTabsWidgetProps) {
    const props = this.cleanProps();
    const pre = this.cleanProps(prevProps);
    if (
      props.list.length !== pre.list.length ||
      props.defaultNum !== pre.defaultNum
    ) {
      this.syncMetaProperty(props);
    }
  }

  componentDidMount() {
    this.syncMetaProperty(this.cleanProps());
  }

  syncMetaProperty = (props: any) => {
    const { list, defaultNum, safeDefault } = props;
    let defaultIndex = defaultNum;
    if (!safeDefault) {
      defaultIndex = list.length ? 0 : undefined;
    }
    this.props.updateWidgetMetaProperty("selectedTabIndex", defaultIndex);
  };

  cleanProps = (props?: MTabsWidgetProps) => {
    const { list, defaultNum, ...others } = props || this.props;
    const tabItems = _.isArray(list) ? list : [];
    const safeDefault =
      _.isNumber(defaultNum) &&
      tabItems.length &&
      defaultNum > 0 &&
      defaultNum < tabItems.length;
    return {
      ...others,
      defaultNum,
      list: tabItems,
      safeDefault,
    };
  };

  getPageView() {
    const {
      topRow,
      bottomRow,
      leftColumn,
      rightColumn,
      list,
      nameKey,
      selectedTabIndex,
      isLoading,
      showLoading,
    } = this.cleanProps();
    const layout = bottomRow - topRow > rightColumn - leftColumn ? "v" : "h";
    if (isLoading && showLoading) {
      return (
        <LoadingContainer direction={layout}>
          {Array.from(Array(20)).map((a, i) => (
            <Skeleton animation="pulse" key={i} />
          ))}
        </LoadingContainer>
      );
    }
    return (
      <NavTabComponent
        list={list}
        nameKey={nameKey}
        selectedIndex={selectedTabIndex}
        layout={layout}
        onTabSelected={this.onTabChange}
      />
    );
  }

  static getWidgetType(): WidgetType {
    return "TARO_TABS_WIDGET";
  }
}

export interface MTabsWidgetProps extends WidgetProps {
  list: any[];
  nameKey: string;
  defaultNum?: string | number;
  onTabSelected?: string;
  selectedTabIndex: number;
  showLoading?: boolean;
}

export default MTabsWidget;
