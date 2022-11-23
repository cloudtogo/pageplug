import { ValidationTypes } from "constants/WidgetValidation";
import { ButtonPlacementTypes } from "components/constants";
import { updateStyles } from "../propertyUtils";
import {
  CodeScannerWidgetProps,
  ScannerLayout,
} from "widgets/CodeScannerWidget/constants";

export default [
  {
    sectionName: "图标",
    children: [
      {
        propertyName: "iconName",
        label: "选择图标",
        helpText: "选择按钮图标",
        controlType: "ICON_SELECT",
        isBindProperty: false,
        isTriggerProperty: false,
        updateHook: updateStyles,
        dependencies: ["iconAlign", "scannerLayout"],
        validation: {
          type: ValidationTypes.TEXT,
        },
        hidden: (props: CodeScannerWidgetProps) =>
          props.scannerLayout === ScannerLayout.ALWAYS_ON,
      },
      {
        propertyName: "iconAlign",
        label: "位置",
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
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: ["center", "left", "right"],
          },
        },
        hidden: (props: CodeScannerWidgetProps) =>
          props.scannerLayout === ScannerLayout.ALWAYS_ON,
        dependencies: ["scannerLayout"],
      },
      {
        propertyName: "placement",
        label: "对齐",
        controlType: "ICON_TABS",
        fullWidth: true,
        helpText: "设置对齐方式",
        options: [
          {
            label: "左对齐",
            value: ButtonPlacementTypes.START,
          },
          {
            label: "两端对齐",
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
        hidden: (props: CodeScannerWidgetProps) =>
          props.scannerLayout === ScannerLayout.ALWAYS_ON,
        dependencies: ["scannerLayout"],
      },
    ],
  },
  {
    sectionName: "颜色",
    children: [
      {
        propertyName: "buttonColor",
        helpText: "设置按钮背景色",
        label: "按钮颜色",
        controlType: "COLOR_PICKER",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            regex: /^(?![<|{{]).+/,
          },
        },
        hidden: (props: CodeScannerWidgetProps) =>
          props.scannerLayout === ScannerLayout.ALWAYS_ON,
        dependencies: ["scannerLayout"],
      },
    ],
  },
  {
    sectionName: "边框/阴影",
    children: [
      {
        propertyName: "borderRadius",
        label: "圆角",
        helpText: "设置边框圆角半径",
        controlType: "BORDER_RADIUS_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "boxShadow",
        label: "阴影",
        helpText: "设置组件轮廓阴影",
        controlType: "BOX_SHADOW_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
    ],
  },
];
