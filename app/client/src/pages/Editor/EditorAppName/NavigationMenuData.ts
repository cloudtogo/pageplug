import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import type { noop } from "lodash";

import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import { APPLICATIONS_URL } from "constants/routes";

import type { MenuItemData } from "./NavigationMenuItem";
import { MenuTypes } from "./NavigationMenuItem";
import { useCallback } from "react";
import { getExportAppAPIRoute } from "@appsmith/constants/ApiConstants";

import {
  hasDeleteApplicationPermission,
  isPermitted,
  PERMISSION_TYPE,
} from "@appsmith/utils/permissionHelpers";
import { getCurrentApplication } from "@appsmith/selectors/applicationSelectors";
import { Colors } from "constants/Colors";
import { getCurrentApplicationId } from "selectors/editorSelectors";
import { redoAction, undoAction } from "actions/pageActions";
import { redoShortCut, undoShortCut } from "utils/helpers";
import { openAppSettingsPaneAction } from "actions/appSettingsPaneActions";
import { toast } from "design-system";
import type { ThemeProp } from "widgets/constants";

type NavigationMenuDataProps = ThemeProp & {
  editMode: typeof noop;
  setForkApplicationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GetNavigationMenuData = ({
  editMode,
  setForkApplicationModalOpen,
}: NavigationMenuDataProps): MenuItemData[] => {
  const dispatch = useDispatch();
  const history = useHistory();

  const applicationId = useSelector(getCurrentApplicationId);

  const isApplicationIdPresent = !!(applicationId && applicationId.length > 0);

  const currentApplication = useSelector(getCurrentApplication);
  const hasExportPermission = isPermitted(
    currentApplication?.userPermissions ?? [],
    PERMISSION_TYPE.EXPORT_APPLICATION,
  );
  const hasEditPermission = isPermitted(
    currentApplication?.userPermissions ?? [],
    PERMISSION_TYPE.MANAGE_APPLICATION,
  );
  const openExternalLink = useCallback((link: string) => {
    if (link) {
      window.open(link, "_blank");
    }
  }, []);

  const exportAppAsJSON = () => {
    const id = `t--export-app-link`;
    const existingLink = document.getElementById(id);
    existingLink && existingLink.remove();
    const link = document.createElement("a");

    const branchName = currentApplication?.gitApplicationMetadata?.branchName;
    link.href = getExportAppAPIRoute(applicationId, branchName);
    link.id = id;
    document.body.appendChild(link);
    // @ts-expect-error: Types are not available
    if (!window.Cypress) {
      link.click();
    }
    toast.show(`Successfully exported ${currentApplication?.name}`, {
      kind: "success",
    });
  };

  const openAppSettingsPane = () => dispatch(openAppSettingsPaneAction());

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
      toast.show("删除应用时发生了错误", {
        kind: "error",
      });
    }
  };

  return [
    {
      text: "首页",
      onClick: () => history.replace(APPLICATIONS_URL),
      type: MenuTypes.MENU,
      isVisible: true,
    },
    {
      text: "divider_1",
      type: MenuTypes.MENU_DIVIDER,
      isVisible: true,
    },
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
      onClick: openAppSettingsPane,
      type: MenuTypes.MENU,
      isVisible: true,
    },
    {
      text: "帮助",
      type: MenuTypes.PARENT,
      isVisible: true,
      children: [
        {
          text: "文档",
          onClick: () => openExternalLink("https://docs.pageplug.cn"),
          type: MenuTypes.MENU,
          isVisible: true,
          isOpensNewWindow: true,
        },
        {
          text: "Github",
          onClick: () =>
            openExternalLink("https://github.com/cloudtogo/pageplug"),
          type: MenuTypes.MENU,
          isVisible: true,
          isOpensNewWindow: true,
        },
        {
          text: "Gitee",
          onClick: () =>
            openExternalLink("https://gitee.com/cloudtogo/pageplug"),
          type: MenuTypes.MENU,
          isVisible: true,
          isOpensNewWindow: true,
        },
      ],
    },
    {
      text: "复制应用",
      onClick: () => setForkApplicationModalOpen(true),
      type: MenuTypes.MENU,
      isVisible: isApplicationIdPresent && hasEditPermission,
    },
    {
      text: "导出应用",
      onClick: exportAppAsJSON,
      type: MenuTypes.MENU,
      isVisible: isApplicationIdPresent && hasExportPermission,
    },
    hasDeleteApplicationPermission(currentApplication?.userPermissions) && {
      text: "删除应用",
      confirmText: "确认删除吗？",
      onClick: deleteApplication,
      type: MenuTypes.RECONFIRM,
      isVisible: isApplicationIdPresent,
      style: { color: Colors.ERROR_RED },
    },
  ].filter(Boolean) as MenuItemData[];
};
