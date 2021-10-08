import {
  copyActionRequest,
  deleteAction,
  moveActionRequest,
} from "actions/actionActions";
import { initExplorerEntityNameEdit } from "actions/explorerActions";
import { BUILDER_PAGE_URL } from "constants/routes";
import { noop } from "lodash";
import TreeDropdown from "pages/Editor/Explorer/TreeDropdown";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getPageListAsOptions } from "selectors/entitiesSelector";
import history from "utils/history";
import ContextMenuTrigger from "../ContextMenuTrigger";
import { ContextMenuPopoverModifiers, ExplorerURLParams } from "../helpers";
import { useNewActionName } from "./helpers";

type EntityContextMenuProps = {
  id: string;
  name: string;
  className?: string;
  pageId: string;
};
export function ActionEntityContextMenu(props: EntityContextMenuProps) {
  const nextEntityName = useNewActionName();
  const params = useParams<ExplorerURLParams>();
  const dispatch = useDispatch();
  const copyActionToPage = useCallback(
    (actionId: string, actionName: string, pageId: string) =>
      dispatch(
        copyActionRequest({
          id: actionId,
          destinationPageId: pageId,
          name: nextEntityName(actionName, pageId, true),
        }),
      ),
    [dispatch, nextEntityName],
  );
  const moveActionToPage = useCallback(
    (actionId: string, actionName: string, destinationPageId: string) =>
      dispatch(
        moveActionRequest({
          id: actionId,
          destinationPageId,
          originalPageId: props.pageId,
          name: nextEntityName(actionName, destinationPageId),
        }),
      ),
    [dispatch, nextEntityName, props.pageId],
  );
  const deleteActionFromPage = useCallback(
    (actionId: string, actionName: string, onSuccess?: () => void) =>
      dispatch(deleteAction({ id: actionId, name: actionName, onSuccess })),
    [dispatch],
  );

  const menuPages = useSelector(getPageListAsOptions);

  const editActionName = useCallback(
    () => dispatch(initExplorerEntityNameEdit(props.id)),
    [dispatch, props.id],
  );

  return (
    <TreeDropdown
      className={props.className}
      defaultText=""
      modifiers={ContextMenuPopoverModifiers}
      onSelect={noop}
      optionTree={[
        {
          value: "rename",
          onSelect: editActionName,
          label: "编辑名称",
        },
        {
          value: "copy",
          onSelect: noop,
          label: "复制到页面",
          children: menuPages.map((page) => {
            return {
              ...page,
              onSelect: () => copyActionToPage(props.id, props.name, page.id),
            };
          }),
        },
        {
          value: "move",
          onSelect: noop,
          label: "移动到页面",
          children:
            menuPages.length > 1
              ? menuPages
                  .filter((page) => page.id !== props.pageId) // Remove current page from the list
                  .map((page) => {
                    return {
                      ...page,
                      onSelect: () =>
                        moveActionToPage(props.id, props.name, page.id),
                    };
                  })
              : [{ value: "No Pages", onSelect: noop, label: "暂无页面" }],
        },
        {
          value: "delete",
          label: "删除",
          intent: "danger",
          onSelect: () =>
            deleteActionFromPage(props.id, props.name, () => {
              history.push(
                BUILDER_PAGE_URL(params.applicationId, params.pageId),
              );
            }),
        },
      ]}
      selectedValue=""
      toggle={<ContextMenuTrigger />}
    />
  );
}

export default ActionEntityContextMenu;
