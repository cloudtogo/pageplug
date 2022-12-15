import { ValidationTypes } from "constants/WidgetValidation";
import { ButtonPlacementTypes, ButtonVariantTypes } from "components/constants";
import { Alignment } from "@blueprintjs/core";
import { MenuButtonWidgetProps } from "../../constants";

export default [
  {
    sectionName: "属性",
    children: [
      {
        propertyName: "menuVariant",
        label: "按钮类型",
        controlType: "DROP_DOWN",
        helpText: "设置菜单按钮的风格类型",
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
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: [
              ButtonVariantTypes.PRIMARY,
              ButtonVariantTypes.SECONDARY,
              ButtonVariantTypes.TERTIARY,
            ],
            default: ButtonVariantTypes.PRIMARY,
          },
        },
      },
    ],
  },
  {
    sectionName: "图标配置",
    children: [
      {
        propertyName: "iconName",
        label: "图标",
        helpText: "设置菜单按钮图标",
        controlType: "ICON_SELECT",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        updateHook: (
          props: MenuButtonWidgetProps,
          propertyPath: string,
          propertyValue: string,
        ) => {
          const propertiesToUpdate = [{ propertyPath, propertyValue }];
          if (!props.iconAlign) {
            propertiesToUpdate.push({
              propertyPath: "iconAlign",
              propertyValue: Alignment.LEFT,
            });
          }
          return propertiesToUpdate;
        },
        dependencies: ["iconAlign"],
        validation: {
          type: ValidationTypes.TEXT,
        },
      },
      {
        propertyName: "iconAlign",
        label: "位置",
        helpText: "设置菜单按钮图标对齐方式",
        controlType: "ICON_TABS",
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
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: ["center", "left", "right"],
          },
        },
      },
      {
        propertyName: "placement",
        label: "排列方式",
        controlType: "DROP_DOWN",
        helpText: "设置图标与标签的排列方式",
        options: [
          {
            label: "向前对齐",
            value: ButtonPlacementTypes.START,
          },
          {
            label: "两边对齐",
            value: ButtonPlacementTypes.BETWEEN,
          },
          {
            label: "居中对齐",
            value: ButtonPlacementTypes.CENTER,
          },
        ],
        defaultValue: ButtonPlacementTypes.CENTER,
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: [
              ButtonPlacementTypes.START,
              ButtonPlacementTypes.BETWEEN,
              ButtonPlacementTypes.CENTER,
            ],
            default: ButtonPlacementTypes.CENTER,
          },
        },
      },
    ],
  },
  {
    sectionName: "颜色配置",
    children: [
      {
        propertyName: "menuColor",
        helpText: "设置菜单按钮颜色",
        label: "按钮颜色",
        controlType: "COLOR_PICKER",
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
