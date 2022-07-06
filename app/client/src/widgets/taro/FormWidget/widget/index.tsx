import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import FormComponent, { FormComponentProps } from "../component";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { get, isArray } from "lodash";

const noMeSubField = (
  props: MFormWidgetProps,
  propertyPath: string,
  field: string,
  current: string | string[],
) => {
  const baseProperty = propertyPath.replace(/\.\w+$/g, "");
  const target = get(props, `${baseProperty}.${field}`, "");
  if (isArray(current)) {
    return !current.includes(target);
  }
  return target !== current;
};

class MFormWidget extends BaseWidget<MFormWidgetProps, WidgetState> {
  state = {
    isLoading: false,
  };

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "内容",
        children: [
          {
            propertyName: "fieldsObj",
            label: "表单字段",
            controlType: "FIELDS_INPUT",
            isJSConvertible: false,
            isBindProperty: false,
            isTriggerProperty: false,
            panelConfig: {
              editableTitle: true,
              titlePropertyName: "label",
              panelIdPropertyName: "id",
              updateHook: (
                props: any,
                propertyPath: string,
                propertyValue: string,
              ) => {
                return [
                  {
                    propertyPath,
                    propertyValue,
                  },
                ];
              },
              children: [
                {
                  sectionName: "字段配置",
                  children: [
                    {
                      propertyName: "name",
                      label: "字段名称",
                      controlType: "INPUT_TEXT",
                      placeholderText: "输入字段名称",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: {
                        type: ValidationTypes.TEXT,
                        params: { required: true },
                      },
                    },
                    {
                      propertyName: "required",
                      label: "必填",
                      controlType: "SWITCH",
                      isBindProperty: false,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.BOOLEAN },
                    },
                    {
                      propertyName: "fieldType",
                      label: "字段控件",
                      controlType: "DROP_DOWN",
                      options: [
                        {
                          label: "输入框",
                          value: "input",
                        },
                        {
                          label: "开关",
                          value: "switch",
                        },
                        {
                          label: "单选框",
                          value: "radio",
                        },
                        {
                          label: "复选框",
                          value: "checkbox",
                        },
                        {
                          label: "选择框",
                          value: "picker",
                        },
                        {
                          label: "省市区选择",
                          value: "address",
                        },
                        {
                          label: "数字输入框",
                          value: "stepper",
                        },
                        {
                          label: "评分",
                          value: "rate",
                        },
                        {
                          label: "文件上传",
                          value: "uploader",
                        },
                      ],
                      isBindProperty: false,
                      isTriggerProperty: false,
                    },
                    {
                      propertyName: "inputType",
                      label: "输入类型",
                      controlType: "RADIO",
                      options: [
                        {
                          label: "文本",
                          value: "text",
                        },
                        {
                          label: "数字",
                          value: "digit",
                        },
                        {
                          label: "整数",
                          value: "number",
                        },
                        {
                          label: "身份证号",
                          value: "idcard",
                        },
                        {
                          label: "密码",
                          value: "password",
                        },
                      ],
                      columns: 3,
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                      dependencies: ["fieldsObj"],
                      hidden: (props: MFormWidgetProps, propertyPath: string) =>
                        noMeSubField(props, propertyPath, "fieldType", "input"),
                    },
                    // {
                    //   propertyName: "rateCount",
                    //   label: "总分",
                    //   controlType: "INPUT_TEXT",
                    //   isBindProperty: true,
                    //   isTriggerProperty: false,
                    //   validation: {
                    //     type: ValidationTypes.NUMBER,
                    //     params: { natural: true },
                    //   },
                    //   dependencies: ["fieldsObj"],
                    //   hidden: (props: MFormWidgetProps, propertyPath: string) =>
                    //     noMeSubField(props, propertyPath, "fieldType", "rate"),
                    // },
                    {
                      propertyName: "options",
                      label: "可选项",
                      controlType: "INPUT_TEXT",
                      placeholderText: '[{"label": "", "value": ""}]',
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: {
                        type: ValidationTypes.ARRAY,
                        params: {
                          unique: ["value"],
                          default: [],
                          children: {
                            type: ValidationTypes.OBJECT,
                            params: {
                              allowedKeys: [
                                {
                                  name: "label",
                                  type: ValidationTypes.TEXT,
                                  params: {
                                    default: "",
                                    required: true,
                                  },
                                },
                                {
                                  name: "value",
                                  type: ValidationTypes.TEXT,
                                  params: {
                                    default: "",
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
                      dependencies: ["fieldsObj"],
                      hidden: (props: MFormWidgetProps, propertyPath: string) =>
                        noMeSubField(props, propertyPath, "fieldType", [
                          "radio",
                          "checkbox",
                          "picker",
                        ]),
                    },
                    {
                      propertyName: "placeholder",
                      label: "缺省提示",
                      controlType: "INPUT_TEXT",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.TEXT },
                      dependencies: ["fieldsObj"],
                      hidden: (props: MFormWidgetProps, propertyPath: string) =>
                        noMeSubField(props, propertyPath, "fieldType", [
                          "input",
                          "picker",
                          "address",
                        ]),
                    },
                    {
                      propertyName: "uploadMax",
                      label: "上传文件数量限制",
                      controlType: "INPUT_TEXT",
                      placeholderText: "1",
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: {
                        type: ValidationTypes.NUMBER,
                        params: { natural: true, default: 1 },
                      },
                      dependencies: ["fieldsObj"],
                      hidden: (props: MFormWidgetProps, propertyPath: string) =>
                        noMeSubField(
                          props,
                          propertyPath,
                          "fieldType",
                          "uploader",
                        ),
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "defaultValues",
            label: "表单默认值",
            controlType: "INPUT_TEXT",
            placeholderText: "{{ { name: '张三' } }}",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.OBJECT,
            },
          },
          {
            propertyName: "buttonText",
            label: "提交按钮文本",
            controlType: "INPUT_TEXT",
            placeholderText: "提交",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
            },
          },
          {
            propertyName: "inset",
            label: "圆角卡片风格",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "themeColor",
            label: "主题颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            propertyName: "onSubmit",
            label: "onSubmit",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      formData: undefined,
    };
  }

  onFormSubmit = (data: any) => {
    if (this.props.onSubmit) {
      this.setState({
        isLoading: true,
      });
      this.props.updateWidgetMetaProperty("formData", data, {
        triggerPropertyName: "onSubmit",
        dynamicString: this.props.onSubmit,
        event: {
          type: EventType.ON_SUBMIT,
          callback: this.handleActionComplete,
        },
      });
    }
  };

  handleActionComplete = () => {
    this.setState({
      isLoading: false,
    });
  };

  getFields = () => {
    const fields: any[] = Object.values(this.props.fieldsObj || {});
    if (fields.length) {
      return fields.sort((field1, field2) => field1.index - field2.index);
    }
    return [];
  };

  getPageView() {
    return (
      <FormComponent
        {...this.props}
        fields={this.getFields()}
        onFormSubmit={this.onFormSubmit}
        isLoading={this.state.isLoading}
      />
    );
  }

  static getWidgetType(): WidgetType {
    return "TARO_FORM_WIDGET";
  }
}

export interface MFormWidgetProps extends WidgetProps, FormComponentProps {}

export default MFormWidget;
