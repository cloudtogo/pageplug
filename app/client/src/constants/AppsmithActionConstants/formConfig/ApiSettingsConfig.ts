export default [
  {
    sectionName: "",
    id: 1,
    children: [
      {
        label: "页面加载完成后立即运行 API",
        configProperty: "executeOnLoad",
        controlType: "SWITCH",
        subtitle: "页面加载后刷新数据",
      },
      {
        label: "运行API前请求用户确认",
        configProperty: "confirmBeforeExecute",
        controlType: "SWITCH",
        subtitle: "每次刷新数据前询问用户是否确认操作",
      },
      {
        label: "编码查询参数",
        configProperty: "actionConfiguration.encodeParamsToggle",
        controlType: "SWITCH",
        subtitle:
          "编码所有的 API 查询参数。当 Content-Type 请求头设置为 x-www-form-encoded 时，系统也会编码表单体。",
      },
      {
        label: "智能 JSON 修正",
        configProperty: "actionConfiguration.pluginSpecifiedTemplates[0].value",
        controlType: "SWITCH",
        subtitle: "修正 API 请求体 JSON 中的引号",
        initialValue: true,
      },
      {
        label: "API 超时时间 (毫秒)",
        subtitle: "容忍 API 多长时间不返回",
        controlType: "INPUT_TEXT",
        configProperty: "actionConfiguration.timeoutInMillisecond",
        dataType: "NUMBER",
      },
    ],
  },
];
