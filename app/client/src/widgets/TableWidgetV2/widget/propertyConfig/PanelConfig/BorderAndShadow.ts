import { ValidationTypes } from "constants/WidgetValidation";
import { ColumnTypes, TableWidgetProps } from "widgets/TableWidgetV2/constants";
import {
  hideByColumnType,
  removeBoxShadowColorProp,
} from "../../propertyUtils";

export default {
  sectionName: "轮廓样式",
  children: [
    {
      propertyName: "borderRadius",
      label: "边框圆角",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      helpText: "设置边框圆角半径",
      controlType: "BORDER_RADIUS_OPTIONS",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [
          ColumnTypes.ICON_BUTTON,
          ColumnTypes.MENU_BUTTON,
          ColumnTypes.BUTTON,
        ]);
      },
      dependencies: ["primaryColumns", "columnOrder"],
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.TABLE_PROPERTY,
        params: {
          type: ValidationTypes.TEXT,
        },
      },
    },
    {
      propertyName: "boxShadow",
      label: "阴影",
      helpText: "设置组件外框阴影",
      controlType: "BOX_SHADOW_OPTIONS",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      updateHook: removeBoxShadowColorProp,
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [
          ColumnTypes.ICON_BUTTON,
          ColumnTypes.MENU_BUTTON,
          ColumnTypes.BUTTON,
        ]);
      },
      dependencies: ["primaryColumns", "columnOrder"],
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.TABLE_PROPERTY,
        params: {
          type: ValidationTypes.TEXT,
        },
      },
    },
  ],
};
