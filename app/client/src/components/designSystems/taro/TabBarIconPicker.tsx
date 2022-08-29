import React from "react";
import styled from "styled-components";
import { connect, useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers";
import { updatePage } from "actions/pageActions";
import {
  getViewModePageList,
  getCurrentPage,
  isMobileLayout,
} from "selectors/editorSelectors";
import {
  Page,
  ReduxActionTypes,
} from "@appsmith/constants/ReduxActionConstants";
import Switch from "components/ads/Switch";
import EditablePageName from "pages/Editor/Explorer/Entity/Name";
import Loader from "pages/Editor/Explorer/Entity/Loader";
import { resolveAsSpaceChar } from "utils/helpers";
import {
  useEntityUpdateState,
  useEntityEditState,
} from "pages/Editor/Explorer/hooks";
import Icon, { IconSize } from "components/ads/Icon";
import { TooltipComponent } from "design-system";
import { Alignment } from "@blueprintjs/core";
import { Position } from "@blueprintjs/core/lib/esm/common/position";
import IconSelectControl from "components/propertyControls/taro/IconSelectControl";
import { Colors } from "constants/Colors";

const TabBarContainer = styled.div`
  position: fixed;
  bottom: 8px;
  transform: translate(-208px, 0px);
  width: 200px;
  border-radius: 4px;
  background: ${Colors.MINT_GREEN_LIGHT}45;
  border: 2px solid ${Colors.MINT_GREEN};
  padding: 12px;
`;

const PropertyName = styled.div`
  margin-bottom: 2px;
  font-size: 14px;
  font-weight: bold;
`;

const PropertyControl = styled.div`
  margin-bottom: 12px;
`;

const AddSwitch = styled(Switch)`
  margin-bottom: 16px;
  font-size: 14px !important;
  font-weight: bold;
`;

const Warning = styled.div`
  color: ${Colors.MINT_ORANGE};
`;

export type TabbarProps = {
  currentPage?: Page | null;
  isFull: boolean;
};

const CLOSE_TABBAR = "CLOSE_TABBAR";

const TabBar = ({ currentPage, isFull }: TabbarProps) => {
  const dispatch = useDispatch();
  const pageId = currentPage?.pageId || "";
  const entityId = pageId + "_standalone";
  const pageName = currentPage?.pageName || "";
  const pageHidden = !!currentPage?.isHidden;
  const pageIcon: any = currentPage?.icon || "";
  const isUpdating = useEntityUpdateState(entityId);
  const isEditing = useEntityEditState(entityId);
  const switchDisabled = isFull && !pageIcon;
  const isMobile = useSelector(isMobileLayout);

  const onToggle = () => {
    onIconSelected(pageIcon ? CLOSE_TABBAR : "smile-o");
  };

  const startEditingName = () => {
    dispatch({
      type: ReduxActionTypes.INIT_EXPLORER_ENTITY_NAME_EDIT,
      payload: {
        id: entityId,
      },
    });
  };

  const onIconSelected = (icon?: string) => {
    if (icon) {
      dispatch(
        updatePage(
          pageId,
          pageName,
          pageHidden,
          icon === CLOSE_TABBAR ? "" : icon,
        ),
      );
    }
  };

  if (!isMobile) {
    return null;
  }

  return (
    <TabBarContainer>
      <PropertyName>页面名称</PropertyName>
      <PropertyControl style={{ display: "flex" }}>
        <EditablePageName
          entityId={entityId}
          isEditing={isEditing}
          name={pageName}
          nameTransformFn={resolveAsSpaceChar}
          updateEntityName={(name) =>
            updatePage(pageId, name, pageHidden, pageIcon)
          }
        />
        {isEditing ? null : (
          <Icon name="edit" size={IconSize.LARGE} onClick={startEditingName} />
        )}
      </PropertyControl>

      <TooltipComponent
        content="底部导航栏最多放5个导航项"
        position={Position.TOP}
      >
        <AddSwitch
          checked={!!pageIcon}
          large
          onChange={onToggle}
          disabled={switchDisabled}
          alignIndicator={Alignment.RIGHT}
        >
          添加到底部导航栏
        </AddSwitch>
      </TooltipComponent>
      {switchDisabled ? (
        <Warning>
          注意：底部导航栏已经满员，如果需要添加到底部导航栏，请先将不需要的页面移出。
        </Warning>
      ) : null}

      {pageIcon ? (
        <>
          <PropertyName>导航栏图标</PropertyName>
          <PropertyControl>
            <IconSelectControl
              propertyValue={pageIcon}
              onIconSelected={onIconSelected}
            />
          </PropertyControl>
        </>
      ) : null}

      <Loader isVisible={isUpdating} />
    </TabBarContainer>
  );
};

const mapStateToProps = (state: AppState) => {
  const pages = getViewModePageList(state);
  return {
    pages,
    isFull: pages?.filter((p) => !!p.icon)?.length >= 5,
    currentPage: getCurrentPage(state),
  };
};

export default connect(mapStateToProps)(TabBar);
