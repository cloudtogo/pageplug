import { registerWidgets } from "./WidgetRegistry";

export const editorInitializer = async () => {
  registerWidgets();
};
