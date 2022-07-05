export const textSizeOptions = [
  {
    label: "一级标题",
    value: "HEADING1",
    subText: "24px",
    icon: "HEADING_ONE",
  },
  {
    label: "二级标题",
    value: "HEADING2",
    subText: "18px",
    icon: "HEADING_TWO",
  },
  {
    label: "三级标题",
    value: "HEADING3",
    subText: "16px",
    icon: "HEADING_THREE",
  },
  {
    label: "一级段落",
    value: "PARAGRAPH",
    subText: "14px",
    icon: "PARAGRAPH",
  },
  {
    label: "二级段落",
    value: "PARAGRAPH2",
    subText: "12px",
    icon: "PARAGRAPH_TWO",
  },
];

export const textAlignOptions = [
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
];

export const demoLayoutProps: any = {
  list: [
    {
      key: "晚来天欲雪",
      value: "能饮一杯无",
    },
  ],
  kKey: "key",
  vKey: "value",
  layout: "v",
  inset: false,
  kColor: "#999",
  kSize: "PARAGRAPH",
  kBold: false,
  kAlign: "LEFT",
  vColor: "#000",
  vSize: "PARAGRAPH",
  vBold: false,
  vAlign: "LEFT",
  style: {
    borderRadius: "4px",
    padding: "1px 12px",
    marginBottom: "8px",
    background: "#f7f8f9",
    border: "2px solid #ccc",
  },
};
