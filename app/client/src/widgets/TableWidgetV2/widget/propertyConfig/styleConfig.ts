import { ValidationTypes } from "constants/WidgetValidation";
import { updateColumnStyles } from "../propertyUtils";

export default [
  {
    sectionName: "属性",
    children: [
      {
        propertyName: "compactMode",
        helpText: "选择行高",
        label: "默认行高",
        controlType: "ICON_TABS",
        fullWidth: true,
        defaultValue: "DEFAULT",
        isBindProperty: true,
        isTriggerProperty: false,
        options: [
          {
            label: "矮",
            value: "SHORT",
          },
          {
            label: "默认",
            value: "DEFAULT",
          },
          {
            label: "高",
            value: "TALL",
          },
        ],
      },
    ],
  },
  {
    sectionName: "文本样式",
    children: [
      {
        propertyName: "textSize",
        label: "字体大小",
        helpText: "Controls the size of text in the column",
        controlType: "DROP_DOWN",
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns"],
        options: [
          {
            label: "S",
            value: "0.875rem",
            subText: "0.875rem",
          },
          {
            label: "M",
            value: "1rem",
            subText: "1rem",
          },
          {
            label: "L",
            value: "1.25rem",
            subText: "1.25rem",
          },
          {
            label: "XL",
            value: "1.875rem",
            subText: "1.875rem",
          },
        ],
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "fontStyle",
        label: "强调",
        helpText: "Controls the style of the text in the column",
        controlType: "BUTTON_TABS",
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns"],
        options: [
          {
            icon: "BOLD_FONT",
            value: "BOLD",
          },
          {
            icon: "ITALICS_FONT",
            value: "ITALIC",
          },
        ],
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "horizontalAlignment",
        label: "文本对齐方式",
        helpText: "Sets the horizontal alignment of the content in the column",
        controlType: "ICON_TABS",
        fullWidth: true,
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns"],
        options: [
          {
            icon: "LEFT_ALIGN",
            value: "LEFT",
          },
          {
            icon: "CENTER_ALIGN",
            value: "CENTER",
          },
          {
            icon: "RIGHT_ALIGN",
            value: "RIGHT",
          },
        ],
        defaultValue: "LEFT",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: ["LEFT", "CENTER", "RIGHT"],
          },
        },
      },
      {
        propertyName: "verticalAlignment",
        label: "垂直对齐",
        helpText: "Sets the vertical alignment of the content in the column",
        controlType: "ICON_TABS",
        fullWidth: true,
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns"],
        options: [
          {
            icon: "VERTICAL_TOP",
            value: "TOP",
          },
          {
            icon: "VERTICAL_CENTER",
            value: "CENTER",
          },
          {
            icon: "VERTICAL_BOTTOM",
            value: "BOTTOM",
          },
        ],
        defaultValue: "CENTER",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: ["TOP", "CENTER", "BOTTOM"],
          },
        },
      },
    ],
  },
  {
    sectionName: "颜色配置",
    children: [
      {
        propertyName: "cellBackground",
        label: "单元格背景颜色",
        helpText: "Changes the background color of the cell",
        controlType: "COLOR_PICKER",
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns"],
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "accentColor",
        label: "强调色",
        controlType: "COLOR_PICKER",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        invisible: true,
      },
      {
        propertyName: "textColor",
        label: "文本颜色",
        helpText: "Controls the color of text in the column",
        controlType: "COLOR_PICKER",
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns"],
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
        propertyName: "variant",
        helpText: "选择单元格边框样式",
        label: "单元格边框",
        controlType: "DROP_DOWN",
        defaultValue: "DEFAULT",
        isBindProperty: true,
        isTriggerProperty: false,
        options: [
          {
            label: "默认",
            value: "DEFAULT",
          },
          {
            label: "无边框",
            value: "VARIANT2",
          },
          {
            label: "水平边框",
            value: "VARIANT3",
          },
        ],
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
      {
        helpText: "请输入边框宽度",
        propertyName: "borderWidth",
        label: "边框宽度",
        placeholderText: "以 px 为单位",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.NUMBER },
      },
    ],
  },
];
