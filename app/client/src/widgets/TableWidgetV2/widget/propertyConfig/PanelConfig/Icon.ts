import { ValidationTypes } from "constants/WidgetValidation";
import {
  ColumnTypes,
  ICON_NAMES,
  TableWidgetProps,
} from "widgets/TableWidgetV2/constants";
import { hideByColumnType, updateIconAlignment } from "../../propertyUtils";

export default {
  sectionName: "图标",
  children: [
    {
      propertyName: "menuButtoniconName",
      label: "菜单按钮图标",
      helpText: "设置菜单按钮图标",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [ColumnTypes.MENU_BUTTON]);
      },
      updateHook: updateIconAlignment,
      dependencies: ["primaryColumns", "columnOrder"],
      controlType: "ICON_SELECT",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.TABLE_PROPERTY,
        params: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: ICON_NAMES,
          },
        },
      },
    },
    {
      propertyName: "iconAlign",
      label: "图标位置",
      helpText: "设置按钮图标位置",
      controlType: "ICON_TABS",
      fullWidth: true,
      options: [
        {
          icon: "VERTICAL_LEFT",
          value: "left",
        },
        {
          icon: "VERTICAL_RIGHT",
          value: "right",
        },
      ],
      isBindProperty: false,
      isTriggerProperty: false,
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [ColumnTypes.MENU_BUTTON]);
      },
      dependencies: ["primaryColumns", "columnOrder"],
      validation: {
        type: ValidationTypes.TEXT,
        params: {
          allowedValues: ["left", "right"],
        },
      },
    },
  ],
};
