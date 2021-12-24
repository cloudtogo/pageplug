import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "../BaseWidget";
import { WidgetType, WidgetTypes } from "constants/WidgetConstants";
import PickerComponent from "components/designSystems/taro/PickerComponent";
import { ValidationTypes } from "constants/WidgetValidation";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import * as Sentry from "@sentry/react";
import withMeta, { WithMeta } from "../MetaHOC";

class PickerWidget extends BaseWidget<PickerWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "title",
            label: "这是什么",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            propertyName: "onTap",
            label: "被点击后执行",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  onButtonClick = (e: any) => {
    e.stopPropagation();
    if (this.props.onTap) {
      super.executeAction({
        triggerPropertyName: "onTap",
        dynamicString: this.props.onTap,
        event: {
          type: EventType.ON_CLICK,
        },
      });
    }
  };

  static getMetaPropertiesMap(): Record<string, undefined> {
    return {};
  }

  getPageView() {
    const { title } = this.props;
    return (
      <PickerComponent
        onButtonClick={this.onButtonClick}
        {...{
          title,
        }}
      />
    );
  }

  getWidgetType(): WidgetType {
    return WidgetTypes.TARO_PICKER_WIDGET;
  }
}

export interface PickerWidgetProps extends WidgetProps, WithMeta {
  title?: string;
  onTap?: string;
}

export default PickerWidget;
export const ProfiledPickerWidget = Sentry.withProfiler(withMeta(PickerWidget));
