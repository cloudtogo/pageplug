import { ValidationTypes } from "constants/WidgetValidation";
import type { TableWidgetProps } from "widgets/TableWidgetV2/constants";
import { ColumnTypes, ICON_NAMES } from "widgets/TableWidgetV2/constants";
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
        type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
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
      defaultValue: "left",
      fullWidth: false,
      options: [
        {
          startIcon: "skip-left-line",
          value: "left",
        },
        {
          startIcon: "skip-right-line",
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
