import { ValidationTypes } from "constants/WidgetValidation";
import { PropertyPaneConfig } from "constants/PropertyControlConstants";
import {
  CodeScannerWidgetProps,
  ScannerLayout,
} from "widgets/CodeScannerWidget/constants";

export default [
  {
    sectionName: "标签",
    children: [
      {
        propertyName: "scannerLayout",
        label: "Scanner Layout",
        controlType: "ICON_TABS",
        fullWidth: true,
        helpText:
          'Sets how the code scanner will look and behave. If set to "Always on", the scanner will be visible and scanning all the time. If set to "Click to Scan", the scanner will pop up inside a modal and start scanning when the user clicks on the button.',
        options: [
          {
            label: "Always On",
            value: ScannerLayout.ALWAYS_ON,
          },
          {
            label: "Click to Scan",
            value: ScannerLayout.CLICK_TO_SCAN,
          },
        ],
        isJSConvertible: false,
        isBindProperty: false,
        isTriggerProperty: false,
      },
      {
        propertyName: "label",
        label: "文本",
        controlType: "INPUT_TEXT",
        helpText: "扫码按钮文本",
        placeholderText: "扫描二维码/条形码",
        inputType: "TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        hidden: (props: CodeScannerWidgetProps) =>
          props.scannerLayout === ScannerLayout.ALWAYS_ON,
        dependencies: ["scannerLayout"],
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
      {
        propertyName: "isDisabled",
        label: "禁用",
        helpText: "让组件不可交互",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "animateLoading",
        label: "加载时显示动画",
        controlType: "SWITCH",
        helpText: "组件依赖的数据加载时显示加载动画",
        defaultValue: true,
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        helpText: "鼠标悬浮时显示提示信息",
        propertyName: "tooltip",
        label: "提示信息",
        controlType: "INPUT_TEXT",
        placeholderText: "扫一扫",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        hidden: (props: CodeScannerWidgetProps) =>
          props.scannerLayout === ScannerLayout.ALWAYS_ON,
        dependencies: ["scannerLayout"],
      },
    ],
  },
  {
    sectionName: "事件",
    children: [
      {
        helpText: "扫码成功时触发",
        propertyName: "onCodeDetected",
        label: "onCodeDetected",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
    ],
  },
] as PropertyPaneConfig[];
