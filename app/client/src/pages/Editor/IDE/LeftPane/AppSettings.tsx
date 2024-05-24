import React from "react";
import AppSettingsPane from "../../AppSettingsPane/AppSettings";
import EditorSettingsPaneContainer from "pages/Editor/commons/EditorSettingsPaneContainer";
const SettingsPane = () => {
  return (
    <EditorSettingsPaneContainer title="应用设置">
      <AppSettingsPane />
    </EditorSettingsPaneContainer>
  );
};

export default SettingsPane;
