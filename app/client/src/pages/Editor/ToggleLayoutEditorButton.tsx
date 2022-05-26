import React, { useCallback } from "react";
import { ControlIcons } from "icons/ControlIcons";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import {
  getCurrentApplicationId,
  getCurrentPageId,
} from "selectors/editorSelectors";
import { getViewerLayoutEditorURL } from "constants/routes";
import styled from "styled-components";

const LayoutConfig = styled.div`
  position: absolute;
  left: 12px;
  top: 14px;
  cursor: pointer;
`;
const SettingIcon = ControlIcons.SETTINGS_CONTROL;

const ToggleLayoutEditorButton = () => {
  const history = useHistory();
  const applicationId = useSelector(getCurrentApplicationId);
  const pageId = useSelector(getCurrentPageId);

  const navToLayoutEditor = useCallback(() => {
    history.push(getViewerLayoutEditorURL(applicationId, pageId));
  }, []);

  return (
    <LayoutConfig title="设计项目菜单">
      <SettingIcon
        color="#888"
        width={16}
        height={16}
        onClick={navToLayoutEditor}
      />
    </LayoutConfig>
  );
};

export default ToggleLayoutEditorButton;
