import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { noop } from "lodash";

import { Variant } from "components/ads/common";
import { Toaster } from "components/ads/Toast";
import { ThemeProp } from "components/ads/common";
import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import { APPLICATIONS_URL } from "constants/routes";

import { MenuItemData, MenuTypes } from "./NavigationMenuItem";
import { useCallback } from "react";
import { ExplorerURLParams } from "../Explorer/helpers";
import { getExportAppAPIRoute } from "@appsmith/constants/ApiConstants";

import {
  isPermitted,
  PERMISSION_TYPE,
} from "../../Applications/permissionHelpers";
import { getCurrentApplication } from "selectors/applicationSelectors";
import { Colors } from "constants/Colors";
import { setIsGitSyncModalOpen } from "actions/gitSyncActions";
import { GitSyncModalTab } from "entities/GitSync";
import { getIsGitConnected } from "selectors/gitSyncSelectors";
import {
  createMessage,
  DEPLOY_MENU_OPTION,
  CONNECT_TO_GIT_OPTION,
  CURRENT_DEPLOY_PREVIEW_OPTION,
} from "@appsmith/constants/messages";
import { getCurrentApplicationId } from "selectors/editorSelectors";
import { redoAction, undoAction } from "actions/pageActions";
import { redoShortCut, undoShortCut } from "utils/helpers";
import { pageListEditorURL } from "RouteBuilder";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { selectFeatureFlags } from "selectors/usersSelectors";

type NavigationMenuDataProps = ThemeProp & {
  editMode: typeof noop;
  deploy: typeof noop;
  currentDeployLink: string;
};

export const GetNavigationMenuData = ({
  currentDeployLink,
  deploy,
  editMode,
}: NavigationMenuDataProps): MenuItemData[] => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams<ExplorerURLParams>();

  const isGitConnected = useSelector(getIsGitConnected);

  const openGitConnectionPopup = () => {
    AnalyticsUtil.logEvent("GS_CONNECT_GIT_CLICK", {
      source: "Application name menu (top left)",
    });

    dispatch(
      setIsGitSyncModalOpen({
        isOpen: true,
        tab: GitSyncModalTab.GIT_CONNECTION,
      }),
    );
  };

  const applicationId = useSelector(getCurrentApplicationId);

  const isApplicationIdPresent = !!(applicationId && applicationId.length > 0);

  const currentApplication = useSelector(getCurrentApplication);
  const hasExportPermission = isPermitted(
    currentApplication?.userPermissions ?? [],
    PERMISSION_TYPE.EXPORT_APPLICATION,
  );
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
          applicationId: applicationId,
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

  const deployOptions = [
    {
      text: createMessage(DEPLOY_MENU_OPTION),
      onClick: deploy,
      type: MenuTypes.MENU,
      isVisible: true,
      isOpensNewWindow: true,
      className: "t--app-name-menu-deploy",
    },
    {
      text: createMessage(CURRENT_DEPLOY_PREVIEW_OPTION),
      onClick: () => openExternalLink(currentDeployLink),
      type: MenuTypes.MENU,
      isVisible: true,
      isOpensNewWindow: true,
      className: "t--app-name-menu-deploy-current-version",
    },
  ];

  const featureFlags = useSelector(selectFeatureFlags);

  if (featureFlags.GIT && !isGitConnected) {
    deployOptions.push({
      text: createMessage(CONNECT_TO_GIT_OPTION),
      onClick: () => openGitConnectionPopup(),
      type: MenuTypes.MENU,
      isVisible: true,
      isOpensNewWindow: false,
      className: "t--app-name-menu-deploy-connect-to-git",
    });
  }

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
      isVisible: true,
      children: [
        {
          text: "撤回",
          labelElement: undoShortCut(),
          onClick: () => dispatch(undoAction()),
          type: MenuTypes.MENU,
          isVisible: true,
        },
        {
          text: "重做",
          labelElement: redoShortCut(),
          onClick: () => dispatch(redoAction()),
          type: MenuTypes.MENU,
          isVisible: true,
        },
      ],
    },
    {
      text: "页面配置",
      onClick: () => {
        history.push(pageListEditorURL({ pageId: params.pageId }));
      },
      type: MenuTypes.MENU,
      isVisible: true,
    },
    {
      text: "发布",
      type: MenuTypes.PARENT,
      isVisible: true,
      children: deployOptions,
      className: "t--app-name-menu-deploy-parent",
    },
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
    //       onClick: () => openExternalLink("https://discord.gg/rBTTVJp"),
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
      text: "导出应用",
      onClick: () =>
        applicationId && openExternalLink(getExportAppAPIRoute(applicationId)),
      type: MenuTypes.MENU,
      isVisible: isApplicationIdPresent && hasExportPermission,
    },
    {
      text: "删除应用",
      confirmText: "确认删除吗？",
      onClick: deleteApplication,
      type: MenuTypes.RECONFIRM,
      isVisible: isApplicationIdPresent,
      style: { color: Colors.ERROR_RED },
    },
  ];
};
