import WidgetBuilderRegistry from "./WidgetRegistry";

export const editorInitializer = async () => {
  WidgetBuilderRegistry.registerWidgetBuilders();
};
