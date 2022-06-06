import React, { Context, createContext } from "react";
import { WidgetOperation } from "widgets/BaseWidget";
import { BatchPropertyUpdatePayload } from "actions/controlActions";
import { ExecuteActionPayload } from "constants/AppsmithActionConstants/ActionConstants";
import { OccupiedSpace } from "constants/editorConstants";

export type EditorContextType = {
  executeAction?: (actionPayloads: ExecuteActionPayload) => void;
  updateWidget?: (
    operation: WidgetOperation,
    widgetId: string,
    payload: any
  ) => void;
  updateWidgetProperty?: (
    widgetId: string,
    propertyName: string,
    propertyValue: any
  ) => void;
  updateWidgetMetaProperty?: (
    widgetId: string,
    propertyName: string,
    propertyValue: any
  ) => void;
  resetChildrenMetaProperty?: (widgetId: string) => void;
  disableDrag?: (disable: boolean) => void;
  occupiedSpaces?: { [containerWidgetId: string]: OccupiedSpace[] };
  deleteWidgetProperty?: (widgetId: string, propertyPaths: string[]) => void;
  batchUpdateWidgetProperty?: (
    widgetId: string,
    updates: BatchPropertyUpdatePayload
  ) => void;
};
export const EditorContext: Context<EditorContextType> = createContext({});
