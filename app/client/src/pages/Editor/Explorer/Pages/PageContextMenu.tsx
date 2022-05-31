import React, { ReactNode, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers";
import TreeDropdown, {
  TreeDropdownOption,
} from "pages/Editor/Explorer/TreeDropdown";
import { noop } from "lodash";
import ContextMenuTrigger from "../ContextMenuTrigger";
import { ReduxActionTypes } from "constants/ReduxActionConstants";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { ContextMenuPopoverModifiers } from "../helpers";
import { initExplorerEntityNameEdit } from "actions/explorerActions";
import { clonePageInit, updatePage } from "actions/pageActions";
import styled from "styled-components";
import { Icon } from "@blueprintjs/core";

const CustomLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export function PageContextMenu(props: {
  pageId: string;
  name: string;
  applicationId: string;
  className?: string;
  isDefaultPage: boolean;
  isHidden: boolean;
}) {
  const dispatch = useDispatch();

  const deletePage = useCallback(
    (pageId: string, pageName: string): void => {
      dispatch({
        type: ReduxActionTypes.DELETE_PAGE_INIT,
        payload: {
          id: pageId,
        },
      });
      AnalyticsUtil.logEvent("DELETE_PAGE", {
        pageName,
      });
    },
    [dispatch],
  );

  const setPageAsDefault = useCallback(
    (pageId: string, applicationId?: string): void => {
      dispatch({
        type: ReduxActionTypes.SET_DEFAULT_APPLICATION_PAGE_INIT,
        payload: {
          id: pageId,
          applicationId,
        },
      });
    },
    [dispatch],
  );

  const editPageName = useCallback(
    () => dispatch(initExplorerEntityNameEdit(props.pageId)),
    [dispatch, props.pageId],
  );

  const clonePage = useCallback(() => dispatch(clonePageInit(props.pageId)), [
    dispatch,
    props.pageId,
  ]);

  const setHiddenField = useCallback(
    () => dispatch(updatePage(props.pageId, props.name, !props.isHidden)),
    [dispatch, props.pageId, props.name, props.isHidden],
  );

  const optionTree: TreeDropdownOption[] = [
    {
      value: "rename",
      onSelect: editPageName,
      label: "修改名称",
    },
    {
      value: "clone",
      onSelect: clonePage,
      label: "复制",
    },
    // {
    //   value: "visibility",
    //   onSelect: setHiddenField,
    //   // Possibly support ReactNode in TreeOption
    //   label: ((
    //     <CustomLabel>
    //       {props.isHidden ? "显示" : "隐藏"}
    //       <Icon icon={props.isHidden ? "eye-open" : "eye-off"} iconSize={14} />
    //     </CustomLabel>
    //   ) as ReactNode) as string,
    // },
  ];
  if (!props.isDefaultPage) {
    optionTree.push({
      value: "setdefault",
      onSelect: () => setPageAsDefault(props.pageId, props.applicationId),
      label: "设置为主页",
    });
  }

  if (!props.isDefaultPage) {
    optionTree.push({
      value: "delete",
      onSelect: () => deletePage(props.pageId, props.name),
      label: "删除",
      intent: "danger",
    });
  }
  return (
    <TreeDropdown
      className={props.className}
      defaultText=""
      modifiers={ContextMenuPopoverModifiers}
      onSelect={noop}
      optionTree={optionTree}
      selectedValue=""
      toggle={<ContextMenuTrigger />}
    />
  );
}

export default PageContextMenu;
