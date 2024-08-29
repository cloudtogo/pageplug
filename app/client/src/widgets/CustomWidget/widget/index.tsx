import React from "react";

import type { DerivedPropertiesMap } from "WidgetProvider/factory";

import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";

import CustomComponent from "../component";

import IconSVG from "../icon.svg";
import ThumbnailSVG from "../thumbnail.svg";
import { WIDGET_PADDING, WIDGET_TAGS } from "constants/WidgetConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import type {
  AppThemeProperties,
  SetterConfig,
  Stylesheet,
} from "entities/AppTheming";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import type { AutocompletionDefinitions } from "WidgetProvider/constants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { DEFAULT_MODEL } from "../constants";
import defaultApp from "./defaultApp";
import type { ExtraDef } from "utils/autocomplete/defCreatorUtils";
import { generateTypeDef } from "utils/autocomplete/defCreatorUtils";
import {
  CUSTOM_WIDGET_DEFAULT_MODEL_DOC_URL,
  CUSTOM_WIDGET_DOC_URL,
  CUSTOM_WIDGET_HEIGHT_DOC_URL,
} from "pages/Editor/CustomWidgetBuilder/constants";
import { Link } from "@appsmith/ads";
import styled from "styled-components";
import { ReduxActionTypes } from "ee/constants/ReduxActionConstants";
import { Colors } from "constants/Colors";
import AnalyticsUtil from "ee/utils/AnalyticsUtil";
import { DynamicHeight, type WidgetFeatures } from "utils/WidgetFeatures";
import { isAirgapped } from "ee/utils/airgapHelpers";

const StyledLink = styled(Link)`
  display: inline-block;
  span {
    font-size: 12px;
  }
`;

class CustomWidget extends BaseWidget<CustomWidgetProps, WidgetState> {
  static type = "CUSTOM_WIDGET";

  static getConfig() {
    return {
      name: "自定义组件(New)",
      iconSVG: IconSVG,
      thumbnailSVG: ThumbnailSVG,
      needsMeta: true,
      isCanvas: false,
      tags: [WIDGET_TAGS.DISPLAY],
      searchTags: ["external", "custom","自定义"],
      isSearchWildcard: true,
      hideCard: isAirgapped(),
    };
  }

  static getDefaults() {
    return {
      widgetName: "Custom",
      rows: 30,
      columns: 23,
      version: 1,
      onResetClick: "{{showAlert('Successfully reset!!', '');}}",
      events: ["onResetClick"],
      isVisible: true,
      defaultModel: DEFAULT_MODEL,
      srcDoc: defaultApp.srcDoc,
      uncompiledSrcDoc: defaultApp.uncompiledSrcDoc,
      theme: "{{appsmith.theme}}",
      dynamicBindingPathList: [{ key: "theme" }],
      dynamicTriggerPathList: [{ key: "onResetClick" }],
      borderColor: Colors.GREY_5,
      borderWidth: "1",
      backgroundColor: "#FFFFFF",
    };
  }

  static getFeatures(): WidgetFeatures {
    return {
      dynamicHeight: {
        sectionIndex: 2,
        active: true,
        defaultValue: DynamicHeight.FIXED,
        helperText: (props) => {
          if (props?.dynamicHeight !== DynamicHeight.FIXED) {
            return (
              <div className="leading-5 mt-[10px]">
                For the auto-height feature to function correctly, the custom
                widget&apos;s container should not have a fixed height set.{" "}
                <StyledLink
                  kind="secondary"
                  rel="noopener noreferrer"
                  target="_blank"
                  to={CUSTOM_WIDGET_HEIGHT_DOC_URL}
                >
                  Read more
                </StyledLink>
              </div>
            );
          } else {
            return null;
          }
        },
      },
    };
  }

  static getAutoLayoutConfig() {
    return {
      autoDimension: {
        height: true,
      },
      disabledPropsDefaults: {
        dynamicHeight: DynamicHeight.AUTO_HEIGHT,
      },
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: () => {
            return {
              minWidth: "120px",
              minHeight: "40px",
            };
          },
        },
      ],
      disableResizeHandles: {
        vertical: true,
      },
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return (widget: CustomWidgetProps, extraDefsToDefine?: ExtraDef) => ({
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      model: generateTypeDef(widget.model, extraDefsToDefine),
    });
  }

  static getSetterConfig(): SetterConfig {
    return {
      __setters: {
        setVisibility: {
          path: "isVisible",
          type: "boolean",
        },
      },
    };
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "{{appsmith.theme.boxShadow.appBoxShadow}}",
    };
  }

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "组件",
        children: [
          {
            propertyName: "editSource",
            label: "",
            controlType: "CUSTOM_WIDGET_EDIT_BUTTON_CONTROL",
            isJSConvertible: false,
            isBindProperty: false,
            isTriggerProperty: false,
            dependencies: ["srcDoc", "events", "uncompiledSrcDoc"],
            evaluatedDependencies: ["defaultModel", "theme"],
            dynamicDependencies: (widget: WidgetProps) => widget.events,
            // helperText: (
            //   <div className="leading-5" style={{ marginTop: "10px" }}>
            //     The source editor lets you add your own HTML, CSS and JS.{" "}
            //     <StyledLink
            //       kind="secondary"
            //       rel="noopener noreferrer"
            //       target="_blank"
            //       to={CUSTOM_WIDGET_DOC_URL}
            //     >
            //       Read more
            //     </StyledLink>
            //   </div>
            // ),
          },
        ],
      },
      {
        sectionName: "默认数据",
        children: [
          {
            propertyName: "defaultModel",
            // helperText: (
            //   <div className="leading-5" style={{ marginTop: "10px" }}>
            //     This model exposes Appsmith data to the widget editor.{" "}
            //     <StyledLink
            //       kind="secondary"
            //       rel="noopener noreferrer"
            //       target="_blank"
            //       to={CUSTOM_WIDGET_DEFAULT_MODEL_DOC_URL}
            //     >
            //       Read more
            //     </StyledLink>
            //   </div>
            // ),
            label: "",
            controlType: "INPUT_TEXT",
            defaultValue: "{}",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.OBJECT,
            },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "isVisible",
            label: "是否显示",
            helpText: "控制组件的显示/隐藏",
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
        hasDynamicProperties: true,
        generateDynamicProperties: (widgetProps: WidgetProps) => {
          return widgetProps.events?.map((event: string) => ({
            propertyName: event,
            label: event,
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
            // dynamicTriggerPathList:[{key: "onResetClick"}],
            controlConfig: {
              allowEdit: true,
              onEdit: (widget: CustomWidgetProps, newLabel: string) => {
                const triggerPaths = [];
                const updatedProperties = {
                  events: widget.events.map((e) => {
                    if (e === event) {
                      return newLabel;
                    }

                    return e;
                  }),
                };

                if (
                  widget.dynamicTriggerPathList
                    ?.map((d) => d.key)
                    .includes(event)
                ) {
                  triggerPaths.push(newLabel);
                }

                return {
                  modify: updatedProperties,
                  triggerPaths,
                };
              },
              allowDelete: true,
              onDelete: (widget: CustomWidgetProps) => {
                return {
                  events: widget.events.filter((e) => e !== event),
                };
              },
            },
            dependencies: ["events", "dynamicTriggerPathList"],
            helpText: "在自定义组件内触发",
          }));
        },
        children: [
          {
            propertyName: "generateEvents",
            label: "",
            controlType: "CUSTOM_WIDGET_ADD_EVENT_BUTTON_CONTROL",
            isJSConvertible: false,
            isBindProperty: false,
            buttonLabel: "添加事件",
            onAdd: (widget: CustomWidgetProps, event: string) => {
              const events = widget.events;

              return {
                events: [...events, event],
              };
            },
            isTriggerProperty: false,
            dependencies: ["events"],
            size: "md",
          },
        ],
      },
    ];
  }

  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "颜色配置",
        children: [
          {
            helpText: "使用 html 颜色名称，HEX，RGB 或者 RGBA 值",
            placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
            propertyName: "backgroundColor",
            label: "背景颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "使用 html 颜色名称，HEX，RGB 或者 RGBA 值",
            placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
            propertyName: "borderColor",
            label: "边框颜色",
            controlType: "COLOR_PICKER",
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
            helpText: "输入边框宽度",
            propertyName: "borderWidth",
            label: "边框宽度",
            placeholderText: "以 px 为单位",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.NUMBER },
            postUpdateAction: ReduxActionTypes.CHECK_CONTAINERS_FOR_AUTO_HEIGHT,
          },
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText: "边框圆角样式",
            controlType: "BORDER_RADIUS_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
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
        ],
      },
    ];
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      model: "defaultModel",
    };
  }

  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getMetaPropertiesMap(): Record<string, any> {
    return {
      model: undefined,
    };
  }

  execute = (eventName: string, contextObj: Record<string, unknown>) => {
    if (this.props.hasOwnProperty(eventName)) {
      const eventString = this.props[eventName];

      super.executeAction({
        triggerPropertyName: eventName,
        dynamicString: eventString,
        event: {
          type: EventType.CUSTOM_WIDGET_EVENT,
        },
        globalContext: contextObj,
      });

      AnalyticsUtil.logEvent("CUSTOM_WIDGET_API_TRIGGER_EVENT", {
        widgetId: this.props.widgetId,
        eventName,
      });
    }
  };

  update = (data: Record<string, unknown>) => {
    this.props.updateWidgetMetaProperty("model", {
      ...this.props.model,
      ...data,
    });

    AnalyticsUtil.logEvent("CUSTOM_WIDGET_API_UPDATE_MODEL", {
      widgetId: this.props.widgetId,
    });
  };

  getRenderMode = () => {
    switch (this.props.renderMode) {
      case "CANVAS":
        return "EDITOR";
      default:
        return "DEPLOYED";
    }
  };

  getWidgetView() {
    return (
      <CustomComponent
        backgroundColor={this.props.backgroundColor}
        borderColor={this.props.borderColor}
        borderRadius={this.props.borderRadius}
        borderWidth={this.props.borderWidth}
        boxShadow={this.props.boxShadow}
        dynamicHeight={this.props.dynamicHeight}
        execute={this.execute}
        height={this.props.componentHeight - WIDGET_PADDING * 2}
        layoutSystemType={this.props.layoutSystemType}
        minDynamicHeight={this.props.minDynamicHeight}
        model={this.props.model || {}}
        renderMode={this.getRenderMode()}
        srcDoc={this.props.srcDoc}
        theme={this.props.theme}
        update={this.update}
        widgetId={this.props.widgetId}
        width={this.props.componentWidth - WIDGET_PADDING * 2}
      />
    );
  }
}

export interface CustomWidgetProps extends WidgetProps {
  events: string[];
  theme: AppThemeProperties;
}

export default CustomWidget;
