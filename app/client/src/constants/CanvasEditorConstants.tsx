export type OccupiedSpace = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  id: string;
  type?: string;
  parentId?: string;
  floatLayout?: boolean;
};

export type WidgetSpace = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  id: string;
  type: string;
  parentId?: string;
  isDropTarget?: boolean;
  fixedHeight?: number;
  floatLayout?: boolean;
};

export const zIndexLayers = {
  PROPERTY_PANE: "z-[3]",
  ENTITY_EXPLORER: "z-[3]",
  RESIZER: "z-[4]",
  PEEK_OVERLAY: "z-[10]", // to hover over the header
};
