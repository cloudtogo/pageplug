import React from "react";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import { View } from "@tarojs/components";
import { Checkbox } from "@taroify/core";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import type { DerivedPropertiesMap } from "WidgetProvider/factory";
import { ValidationTypes } from "constants/WidgetValidation";
import styled from "styled-components";
import LoadingWrapper from "../../LoadingWrapper";
import IconSVG from "../icon.svg";

const Container = styled(View)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

class MCheckboxWidget extends BaseWidget<MCheckboxWidgetProps, WidgetState> {
  static type = "TARO_CHECKBOX_WIDGET";

  static getConfig() {
    return {
      name: "复选框",
      searchTags: ["checkbox"],
      iconSVG: IconSVG,
      needsMeta: true,
      isCanvas: false,
      isMobile: true,
    };
  }

  static getDefaults() {
    return {
      widgetName: "checkbox",
      rows: 4,
      columns: 16,
      version: 1,
      label: "勾选",
      defaultCheckedState: true,
      isDisabled: false,
      showLoading: false,
    };
  }

  static getAutoLayoutConfig() {
    return {
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: () => {
            return {
              minWidth: "280px",
              minHeight: "70px",
            };
          },
        },
      ],
      disableResizeHandles: {
        vertical: true,
      },
    };
  }

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "label",
            label: "文本",
            controlType: "INPUT_TEXT",
            placeholderText: "输入文本内容",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "defaultCheckedState",
            label: "默认选中",
            helpText: "修改它会刷新组件状态",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            helpText: "控制组件是否可见",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            label: "是否禁用",
            controlType: "SWITCH",
            helpText: "是否禁止用户操作",
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
            helpText: "当选中状态变化时触发",
            propertyName: "onCheckChange",
            label: "onCheckChange",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      isChecked: "defaultCheckedState",
    };
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      value: `{{!!this.isChecked}}`,
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      isChecked: undefined,
    };
  }

  onCheckChange = (isChecked: boolean) => {
    this.props.updateWidgetMetaProperty("isChecked", isChecked, {
      triggerPropertyName: "onCheckChange",
      dynamicString: this.props.onCheckChange,
      event: {
        type: EventType.ON_CHECK_CHANGE,
      },
    });
  };

  getWidgetView() {
    const { isChecked, isDisabled, isLoading, label, showLoading } = this.props;
    return (
      <LoadingWrapper isLoading={isLoading && showLoading}>
        <Container>
          <Checkbox
            checked={!!isChecked}
            disabled={!!isDisabled}
            onChange={this.onCheckChange}
          >
            {label}
          </Checkbox>
        </Container>
      </LoadingWrapper>
    );
  }
}

export interface MCheckboxWidgetProps extends WidgetProps {
  label: string;
  defaultCheckedState: boolean;
  isChecked?: boolean;
  isDisabled?: boolean;
  onCheckChange?: string;
}

export default MCheckboxWidget;
