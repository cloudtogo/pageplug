import { get } from "lodash";
import { ValidationTypes } from "constants/WidgetValidation";
import { ColumnTypes, TableWidgetProps } from "widgets/TableWidgetV2/constants";
import { hideByColumnType, getBasePropertyPath } from "../../propertyUtils";
import { ButtonVariantTypes } from "components/constants";
import { ICON_NAMES } from "widgets/constants";

export default {
  sectionName: "保存按钮",
  hidden: (props: TableWidgetProps, propertyPath: string) => {
    return hideByColumnType(
      props,
      propertyPath,
      [ColumnTypes.EDIT_ACTIONS],
      true,
    );
  },
  children: [
    {
      sectionName: "标签",
      collapsible: false,
      children: [
        {
          propertyName: "saveActionLabel",
          label: "文本",
          helpText: "Sets the label text of the button",
          controlType: "TABLE_COMPUTE_VALUE",
          dependencies: ["primaryColumns"],
          isBindProperty: true,
          isTriggerProperty: false,
        },
      ],
    },
    {
      sectionName: "配置",
      collapsible: false,
      children: [
        {
          propertyName: "onSave",
          label: "onSave",
          helpText: "Triggers an action when the save button is clicked",
          controlType: "ACTION_SELECTOR",
          hidden: (props: TableWidgetProps, propertyPath: string) => {
            const baseProperty = getBasePropertyPath(propertyPath);
            const columnType = get(props, `${baseProperty}.columnType`, "");
            return columnType !== ColumnTypes.EDIT_ACTIONS;
          },
          dependencies: ["primaryColumns"],
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: true,
        },
        {
          propertyName: "isSaveVisible",
          dependencies: ["primaryColumns"],
          label: "是否显示",
          helpText: "是否显示按钮",
          defaultValue: true,
          controlType: "SWITCH",
          customJSControl: "TABLE_COMPUTE_VALUE",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: false,
          validation: {
            type: ValidationTypes.TABLE_PROPERTY,
            params: {
              type: ValidationTypes.BOOLEAN,
            },
          },
        },
        {
          propertyName: "isSaveDisabled",
          label: "禁用",
          helpText: "Disables clicks to the save button",
          defaultValue: false,
          controlType: "SWITCH",
          customJSControl: "TABLE_COMPUTE_VALUE",
          isJSConvertible: true,
          isBindProperty: true,
          isTriggerProperty: false,
          validation: {
            type: ValidationTypes.TABLE_PROPERTY,
            params: {
              type: ValidationTypes.BOOLEAN,
            },
          },
          dependencies: ["primaryColumns"],
        },
      ],
    },
  ],
};

export const saveButtonStyleConfig = {
  sectionName: "保存按钮",
  hidden: (props: TableWidgetProps, propertyPath: string) => {
    return hideByColumnType(
      props,
      propertyPath,
      [ColumnTypes.EDIT_ACTIONS],
      true,
    );
  },
  children: [
    {
      sectionName: "配置",
      collapsible: false,
      children: [
        {
          propertyName: "saveButtonColor",
          label: "按钮颜色",
          controlType: "PRIMARY_COLUMNS_COLOR_PICKER_V2",
          helpText: "修改按钮颜色",
          isJSConvertible: true,
          customJSControl: "TABLE_COMPUTE_VALUE",
          dependencies: ["primaryColumns"],
          isBindProperty: true,
          validation: {
            type: ValidationTypes.TABLE_PROPERTY,
            params: {
              type: ValidationTypes.TEXT,
              params: {
                regex: /^(?![<|{{]).+/,
              },
            },
          },
          isTriggerProperty: false,
        },
        {
          propertyName: "saveButtonVariant",
          label: "按钮类型",
          controlType: "ICON_TABS",
          fullWidth: true,
          customJSControl: "TABLE_COMPUTE_VALUE",
          isJSConvertible: true,
          helpText: "设置按钮类型",
          dependencies: ["primaryColumns"],
          options: [
            {
              label: "主按钮",
              value: ButtonVariantTypes.PRIMARY,
            },
            {
              label: "次级按钮",
              value: ButtonVariantTypes.SECONDARY,
            },
            {
              label: "文本按钮",
              value: ButtonVariantTypes.TERTIARY,
            },
          ],
          defaultValue: ButtonVariantTypes.PRIMARY,
          isBindProperty: true,
          isTriggerProperty: false,
          validation: {
            type: ValidationTypes.TABLE_PROPERTY,
            params: {
              type: ValidationTypes.TEXT,
              params: {
                default: ButtonVariantTypes.PRIMARY,
                allowedValues: [
                  ButtonVariantTypes.PRIMARY,
                  ButtonVariantTypes.SECONDARY,
                  ButtonVariantTypes.TERTIARY,
                ],
              },
            },
          },
        },
        {
          propertyName: "saveBorderRadius",
          label: "边框圆角",
          customJSControl: "TABLE_COMPUTE_VALUE",
          isJSConvertible: true,
          helpText: "按钮边框圆角半径",
          controlType: "BORDER_RADIUS_OPTIONS",
          dependencies: ["primaryColumns"],
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
    },
    {
      sectionName: "图标配置",
      collapsible: false,
      children: [
        {
          propertyName: "saveActionIconName",
          label: "图标",
          helpText: "设置按钮图标",
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
          propertyName: "saveIconAlign",
          label: "图标位置",
          helpText: "设置按钮图标位置",
          controlType: "ICON_TABS",
          fullWidth: true,
          defaultValue: "left",
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
          dependencies: ["primaryColumns"],
          validation: {
            type: ValidationTypes.TEXT,
            params: {
              allowedValues: ["left", "right"],
            },
          },
        },
      ],
    },
  ],
};
