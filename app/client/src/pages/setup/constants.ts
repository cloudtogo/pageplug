export type OptionType = {
  label?: string;
  value?: string;
};

export const roleOptions: OptionType[] = [
  {
    label: "工程师",
    value: "engineer",
  },
  {
    label: "产品经理",
    value: "product manager",
  },
  {
    label: "创始人",
    value: "founder",
  },
  {
    label: "运维人员",
    value: "operations",
  },
  {
    label: "商业分析师",
    value: "business analyst",
  },
  {
    label: "其他",
    value: "other",
  },
];

export const useCaseOptions: OptionType[] = [
  {
    label: "随便看看",
    value: "just exploring",
  },
  {
    label: "个人项目",
    value: "personal project",
  },
  {
    label: "公司项目",
    value: "work project",
  },
  {
    label: "其他",
    value: "other",
  },
];
