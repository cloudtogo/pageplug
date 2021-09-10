import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { noop } from "lodash";

import { Variant } from "components/ads/common";
import { Toaster } from "components/ads/Toast";
import { ThemeProp } from "components/ads/common";
import { setCommentModeInUrl } from "pages/Editor/ToggleModeButton";
import { toggleShowGlobalSearchModal } from "actions/globalSearchActions";
import { areCommentsEnabledForUserAndApp } from "selectors/commentsSelectors";
import { ReduxActionTypes } from "constants/ReduxActionConstants";
import { APPLICATIONS_URL } from "constants/routes";

import { MenuItemData, MenuTypes } from "./NavigationMenuItem";
import { useCallback } from "react";

type NavigationMenuDataProps = ThemeProp & {
  applicationId: string | undefined;
  editMode: typeof noop;
  deploy: typeof noop;
  currentDeployLink: string;
};

export const GetNavigationMenuData = ({
  applicationId,
  currentDeployLink,
  deploy,
  editMode,
  theme,
}: NavigationMenuDataProps): MenuItemData[] => {
  const dispatch = useDispatch();
  const commentsEnabled = useSelector(areCommentsEnabledForUserAndApp);
  const history = useHistory();

  const isApplicationIdPresent = !!(applicationId && applicationId.length > 0);

  const openExternalLink = useCallback((link: string) => {
    if (link) {
      window.open(link, "_blank");
    }
  }, []);

  const deleteApplication = () => {
    if (applicationId && applicationId.length > 0) {
      dispatch({
        type: ReduxActionTypes.DELETE_APPLICATION_INIT,
        payload: {
          applicationId,
        },
      });
      history.push(APPLICATIONS_URL);
    } else {
      Toaster.show({
        text: "删除应用时发生了错误",
        variant: Variant.danger,
      });
    }
  };

  return [
    {
      text: "重命名",
      onClick: editMode,
      type: MenuTypes.MENU,
      isVisible: true,
    },
    {
      text: "视图模式",
      type: MenuTypes.PARENT,
      isVisible: !!commentsEnabled,
      children: [
        {
          text: "编辑模式",
          label: "E",
          onClick: () => setCommentModeInUrl(false),
          type: MenuTypes.MENU,
          isVisible: true,
        },
        {
          text: "注释模式",
          label: "C",
          onClick: () => setCommentModeInUrl(true),
          type: MenuTypes.MENU,
          isVisible: true,
        },
      ],
    },
    {
      text: "发布",
      type: MenuTypes.PARENT,
      isVisible: true,
      children: [
        {
          text: "发布",
          onClick: deploy,
          type: MenuTypes.MENU,
          isVisible: true,
          isOpensNewWindow: true,
        },
        {
          text: "最新发布版本",
          onClick: () => openExternalLink(currentDeployLink),
          type: MenuTypes.MENU,
          isVisible: true,
          isOpensNewWindow: true,
        },
      ],
    },
    // {
    //   text: "快速查找",
    //   onClick: () => dispatch(toggleShowGlobalSearchModal()),
    //   type: MenuTypes.MENU,
    //   isVisible: true,
    // },
    // {
    //   text: "帮助",
    //   type: MenuTypes.PARENT,
    //   isVisible: true,
    //   children: [
    //     {
    //       text: "Community Forum",
    //       onClick: () => openExternalLink("https://community.appsmith.com/"),
    //       type: MenuTypes.MENU,
    //       isVisible: true,
    //       isOpensNewWindow: true,
    //     },
    //     {
    //       text: "Discord Channel",
    //       onClick: () => openExternalLink("https://discord.gg/9deFW7q4kB"),
    //       type: MenuTypes.MENU,
    //       isVisible: true,
    //       isOpensNewWindow: true,
    //     },
    //     {
    //       text: "Github",
    //       onClick: () =>
    //         openExternalLink("https://github.com/appsmithorg/appsmith/"),
    //       type: MenuTypes.MENU,
    //       isVisible: true,
    //       isOpensNewWindow: true,
    //     },
    //     {
    //       text: "Documentation",
    //       onClick: () => openExternalLink("https://docs.appsmith.com/"),
    //       type: MenuTypes.MENU,
    //       isVisible: true,
    //       isOpensNewWindow: true,
    //     },
    //   ],
    // },
    {
      text: "删除应用",
      confirmText: "确定删除吗？",
      onClick: deleteApplication,
      type: MenuTypes.RECONFIRM,
      isVisible: isApplicationIdPresent,
      style: { color: theme.colors.navigationMenu.warning },
    },
  ];
};
