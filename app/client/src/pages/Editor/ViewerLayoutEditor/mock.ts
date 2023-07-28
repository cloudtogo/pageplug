export const menutree = [
  {
    title: "文件夹9999",
    expanded: true,
    children: [
      {
        title: "文件夹4444",
        expanded: true,
        children: [
          {
            title: "文件夹55555",
          },
        ],
      },
    ],
  },
  {
    title: "文件夹6666",
    expanded: true,
    children: [
      {
        title: "Page1",
        pageId: "64a7bb0a6fbfd93d5cd4a44b",
        isPage: true,
        expanded: true,
        icon: "arrow-left",
      },
      {
        title: "page2",
      },
    ],
  },
];

export const mockpages = [
  {
    pageId: "6478856ade5d5825c7aee5a0",
    pageName: "Page1",
    slug: "page1",
    isDefault: true,
  },
  {
    id: "64c225a16fbfd93d5cd4e7ed",
    name: "hhhhhhhh ",
    slug: "hhhhhhhh",
    isDefault: false,
    isHidden: false,
  },
  {
    id: "64c245136fbfd93d5cd4e8c9",
    name: "页面1",
    slug: "1",
    isDefault: false,
  },
  {
    id: "64c245176fbfd93d5cd4e8cc",
    name: "页面2",
    slug: "2",
    isDefault: false,
  },
];

export const navdata = {
  color: "var(--ads-color-brand)",
  logoUrl: "",
  name: "应用 3",
  treeData: [
    {
      title: "Page1",
      pageId: "6478856ade5d5825c7aee5a0",
      isPage: true,
    },
    {
      title: "一级菜单",
      expanded: true,
      children: [
        {
          title: "页面1",
          pageId: "64c245136fbfd93d5cd4e8c9",
          isPage: true,
        },
      ],
    },
  ],
  outsiderTree: [
    {
      title: "页面2",
      pageId: "64c245176fbfd93d5cd4e8cc",
      isPage: true,
    },
    {
      title: "hhhhhhhh ",
      pageId: "64c225a16fbfd93d5cd4e7ed",
      isPage: true,
    },
  ],
};
