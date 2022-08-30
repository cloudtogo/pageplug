import React, { lazy, Suspense } from "react";

import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import Skeleton from "components/utils/Skeleton";
import { retryPromise } from "utils/AppsmithUtils";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import {
  dataSetForAfrica,
  dataSetForAsia,
  dataSetForEurope,
  dataSetForNorthAmerica,
  dataSetForOceania,
  dataSetForSouthAmerica,
  dataSetForWorld,
  dataSetForWorldWithAntarctica,
  MapColorObject,
  MapTypes,
} from "../constants";
import { MapType } from "../component";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";

const MapChartComponent = lazy(() =>
  retryPromise(() =>
    import(/* webpackChunkName: "mapCharts" */ "../component"),
  ),
);

const dataSetMapping: Record<MapType, any> = {
  [MapTypes.WORLD]: dataSetForWorld,
  [MapTypes.WORLD_WITH_ANTARCTICA]: dataSetForWorldWithAntarctica,
  [MapTypes.EUROPE]: dataSetForEurope,
  [MapTypes.NORTH_AMERICA]: dataSetForNorthAmerica,
  [MapTypes.SOURTH_AMERICA]: dataSetForSouthAmerica,
  [MapTypes.ASIA]: dataSetForAsia,
  [MapTypes.OCEANIA]: dataSetForOceania,
  [MapTypes.AFRICA]: dataSetForAfrica,
};

// A hook to update the corresponding dataset when map type is changed
const updateDataSet = (
  props: MapChartWidgetProps,
  propertyPath: string,
  propertyValue: MapType,
) => {
  const propertiesToUpdate = [
    { propertyPath, propertyValue },
    {
      propertyPath: "data",
      propertyValue: dataSetMapping[propertyValue],
    },
  ];

  return propertiesToUpdate;
};

class MapChartWidget extends BaseWidget<MapChartWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "设置地图类型",
            propertyName: "mapType",
            label: "地图类型",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "世界地图",
                value: MapTypes.WORLD,
              },
              {
                label: "世界地图（包括南极）",
                value: MapTypes.WORLD_WITH_ANTARCTICA,
              },
              {
                label: "欧洲",
                value: MapTypes.EUROPE,
              },
              {
                label: "北美",
                value: MapTypes.NORTH_AMERICA,
              },
              {
                label: "南美",
                value: MapTypes.SOURTH_AMERICA,
              },
              {
                label: "亚洲",
                value: MapTypes.ASIA,
              },
              {
                label: "大洋洲",
                value: MapTypes.OCEANIA,
              },
              {
                label: "非洲",
                value: MapTypes.AFRICA,
              },
            ],
            isJSconvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            updateHook: updateDataSet,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [
                  MapTypes.WORLD,
                  MapTypes.WORLD_WITH_ANTARCTICA,
                  MapTypes.EUROPE,
                  MapTypes.NORTH_AMERICA,
                  MapTypes.SOURTH_AMERICA,
                  MapTypes.ASIA,
                  MapTypes.OCEANIA,
                  MapTypes.AFRICA,
                ],
              },
            },
          },
          {
            helpText: "地图标题",
            placeholderText: "输入标题",
            propertyName: "mapTitle",
            label: "标题",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
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
        sectionName: "地图图表数据",
        children: [
          {
            helpText: "地图数据",
            propertyName: "data",
            label: "数据",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                unique: true,
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    required: true,
                    allowedKeys: [
                      {
                        name: "id",
                        type: ValidationTypes.TEXT,
                        params: {
                          unique: true,
                          required: true,
                        },
                      },
                      {
                        name: "value",
                        type: ValidationTypes.TEXT,
                        params: {
                          required: true,
                        },
                      },
                    ],
                  },
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            propertyName: "showLabels",
            label: "显示标签",
            helpText: "设置是否显示标签",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            helpText: "设置地图数据项的颜色范围",
            propertyName: "colorRange",
            label: "颜色范围",
            controlType: "INPUT_TEXT",
            placeholderText: "颜色范围对象",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                unique: true,
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    allowedKeys: [
                      {
                        name: "minValue",
                        type: ValidationTypes.NUMBER,
                        params: {
                          required: true,
                        },
                      },
                      {
                        name: "maxValue",
                        type: ValidationTypes.NUMBER,
                        params: {
                          required: true,
                        },
                      },
                      {
                        name: "displayValue",
                        type: ValidationTypes.TEXT,
                      },
                      {
                        name: "code",
                        type: ValidationTypes.TEXT,
                        params: {
                          expected: {
                            type: "Hex color (6-digit)",
                            example: "#FF04D7",
                            autocompleteDataType: AutocompleteDataType.STRING,
                          },
                        },
                      },
                      {
                        name: "alpha",
                        type: ValidationTypes.NUMBER,
                        params: {
                          min: 0,
                          max: 100,
                        },
                      },
                    ],
                  },
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
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
      {
        sectionName: "动作",
        children: [
          {
            helpText: "点击地图图表数据点时触发",
            propertyName: "onDataPointClick",
            label: "onDataPointClick",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "数据",
        children: [
          {
            helpText: "设置地图类型",
            propertyName: "mapType",
            label: "地图类型",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "世界地图",
                value: MapTypes.WORLD,
              },
              {
                label: "世界地图（包括南极）",
                value: MapTypes.WORLD_WITH_ANTARCTICA,
              },
              {
                label: "欧洲",
                value: MapTypes.EUROPE,
              },
              {
                label: "北美",
                value: MapTypes.NORTH_AMERICA,
              },
              {
                label: "南美",
                value: MapTypes.SOURTH_AMERICA,
              },
              {
                label: "亚洲",
                value: MapTypes.ASIA,
              },
              {
                label: "大洋洲",
                value: MapTypes.OCEANIA,
              },
              {
                label: "非洲",
                value: MapTypes.AFRICA,
              },
            ],
            isJSconvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            updateHook: updateDataSet,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [
                  MapTypes.WORLD,
                  MapTypes.WORLD_WITH_ANTARCTICA,
                  MapTypes.EUROPE,
                  MapTypes.NORTH_AMERICA,
                  MapTypes.SOURTH_AMERICA,
                  MapTypes.ASIA,
                  MapTypes.OCEANIA,
                  MapTypes.AFRICA,
                ],
              },
            },
          },
          {
            helpText: "地图数据",
            propertyName: "data",
            label: "Chart Data",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                unique: true,
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    required: true,
                    allowedKeys: [
                      {
                        name: "id",
                        type: ValidationTypes.TEXT,
                        params: {
                          unique: true,
                          required: true,
                        },
                      },
                      {
                        name: "value",
                        type: ValidationTypes.TEXT,
                        params: {
                          required: true,
                        },
                      },
                    ],
                  },
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            helpText: "地图标题",
            placeholderText: "输入标题",
            propertyName: "mapTitle",
            label: "标题",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
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
          {
            propertyName: "showLabels",
            label: "显示标签",
            helpText: "设置是否显示标签",
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
            helpText: "点击地图图表数据点时触发",
            propertyName: "onDataPointClick",
            label: "onDataPointClick",
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
        sectionName: "属性",
        children: [
          {
            helpText: "设置地图数据项的颜色范围",
            propertyName: "colorRange",
            label: "颜色范围",
            controlType: "INPUT_TEXT",
            placeholderText: "颜色范围对象",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                unique: true,
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    allowedKeys: [
                      {
                        name: "minValue",
                        type: ValidationTypes.NUMBER,
                        params: {
                          required: true,
                        },
                      },
                      {
                        name: "maxValue",
                        type: ValidationTypes.NUMBER,
                        params: {
                          required: true,
                        },
                      },
                      {
                        name: "displayValue",
                        type: ValidationTypes.TEXT,
                      },
                      {
                        name: "code",
                        type: ValidationTypes.TEXT,
                        params: {
                          expected: {
                            type: "Hex color (6-digit)",
                            example: "#FF04D7",
                            autocompleteDataType: AutocompleteDataType.STRING,
                          },
                        },
                      },
                      {
                        name: "alpha",
                        type: ValidationTypes.NUMBER,
                        params: {
                          min: 0,
                          max: 100,
                        },
                      },
                    ],
                  },
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
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

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      selectedDataPoint: undefined,
    };
  }

  static getWidgetType(): WidgetType {
    return "MAP_CHART_WIDGET";
  }

  handleDataPointClick = (evt: any) => {
    const { onDataPointClick } = this.props;

    this.props.updateWidgetMetaProperty("selectedDataPoint", evt.data, {
      triggerPropertyName: "onDataPointClick",
      dynamicString: onDataPointClick,
      event: {
        type: EventType.ON_DATA_POINT_CLICK,
      },
    });
  };

  getPageView() {
    const {
      colorRange,
      data,
      isVisible,
      mapTitle,
      mapType,
      showLabels,
    } = this.props;

    return (
      <Suspense fallback={<Skeleton />}>
        <MapChartComponent
          borderRadius={this.props.borderRadius}
          boxShadow={this.props.boxShadow}
          caption={mapTitle}
          colorRange={colorRange}
          data={data}
          isVisible={isVisible}
          onDataPointClick={this.handleDataPointClick}
          showLabels={showLabels}
          type={mapType}
        />
      </Suspense>
    );
  }
}

export interface MapChartWidgetProps extends WidgetProps {
  mapTitle?: string;
  mapType: MapType;
  onDataPointClick?: string;
  showLabels: boolean;
  colorRange: MapColorObject[];
  borderRadius?: string;
  boxShadow?: string;
}

export default MapChartWidget;
