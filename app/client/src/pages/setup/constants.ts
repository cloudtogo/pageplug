export interface OptionType {
  label?: string;
  value?: string;
}

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
    label: "企业分析师",
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

type OptionTypeWithSubtext = OptionType & {
  subtext?: string;
};

export const proficiencyOptions: OptionTypeWithSubtext[] = [
  {
    label: "Brand New",
    subtext: "I've never written code before.",
    value: "Brand New",
  },
  {
    label: "Novice",
    subtext: "Learning the ropes. Basic understanding of coding concepts.",
    value: "Novice",
  },
  {
    label: "Intermediate",
    subtext: "Can tackle moderately complex projects.",
    value: "Intermediate",
  },
  {
    label: "Advanced",
    subtext: "Mastery in development. Experienced with complex coding tasks.",
    value: "Advanced",
  },
];

export const useCaseOptionsForNonSuperUser: OptionTypeWithSubtext[] = [
  {
    label: "Work Project",
    value: "work project",
  },
  {
    label: "Personal Project",
    value: "personal project",
  },
];
