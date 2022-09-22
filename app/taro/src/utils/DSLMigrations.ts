import { WidgetProps } from "widgets/BaseWidget";
import { ContainerWidgetProps } from "widgets/ContainerWidget/widget";
import { generateReactKey } from "./generators";
import {
  GridDefaults,
  LATEST_PAGE_VERSION,
  MAIN_CONTAINER_WIDGET_ID,
} from "constants/WidgetConstants";
import { FlattenedWidgetProps } from "reducers/entityReducers/canvasWidgetsReducer";
import { nextAvailableRowInContainer } from "entities/Widget/utils";
import { omit } from "lodash";
import { CANVAS_DEFAULT_HEIGHT_PX } from "constants/AppConstants";
import { migrateIncorrectDynamicBindingPathLists } from "./migrations/IncorrectDynamicBindingPathLists";

import { theme } from "constants/DefaultTheme";
import { getCanvasSnapRows } from "./WidgetPropsUtils";
import CanvasWidgetsNormalizer from "normalizers/CanvasWidgetsNormalizer";
import { FetchPageResponse } from "api/PageApi";
import { GRID_DENSITY_MIGRATION_V1 } from "widgets/constants";
import { migrateStylingPropertiesForTheming } from "./migrations/ThemingMigrations";

const updateContainers = (dsl: ContainerWidgetProps<WidgetProps>) => {
  if (dsl.type === "CONTAINER_WIDGET" || dsl.type === "FORM_WIDGET") {
    if (
      !(
        dsl.children &&
        dsl.children.length > 0 &&
        (dsl.children[0].type === "CANVAS_WIDGET" ||
          dsl.children[0].type === "FORM_WIDGET")
      )
    ) {
      const canvas = {
        ...dsl,
        backgroundColor: "transparent",
        type: "CANVAS_WIDGET",
        detachFromLayout: true,
        topRow: 0,
        leftColumn: 0,
        rightColumn: dsl.parentColumnSpace * (dsl.rightColumn - dsl.leftColumn),
        bottomRow: dsl.parentRowSpace * (dsl.bottomRow - dsl.topRow),
        widgetName: generateReactKey(),
        widgetId: generateReactKey(),
        parentRowSpace: 1,
        parentColumnSpace: 1,
        containerStyle: "none",
        canExtend: false,
        isVisible: true,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete canvas.dynamicBindings;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete canvas.dynamicProperties;
      if (canvas.children && canvas.children.length > 0)
        canvas.children = canvas.children.map(updateContainers);
      dsl.children = [{ ...canvas }];
    }
  }
  return dsl;
};

const dynamicPathListMigration = (
  currentDSL: ContainerWidgetProps<WidgetProps>,
) => {
  if (currentDSL.children && currentDSL.children.length) {
    currentDSL.children = currentDSL.children.map(dynamicPathListMigration);
  }
  if (currentDSL.dynamicBindings) {
    currentDSL.dynamicBindingPathList = Object.keys(
      currentDSL.dynamicBindings,
    ).map((path) => ({ key: path }));
    delete currentDSL.dynamicBindings;
  }
  if (currentDSL.dynamicTriggers) {
    currentDSL.dynamicTriggerPathList = Object.keys(
      currentDSL.dynamicTriggers,
    ).map((path) => ({ key: path }));
    delete currentDSL.dynamicTriggers;
  }
  if (currentDSL.dynamicProperties) {
    currentDSL.dynamicPropertyPathList = Object.keys(
      currentDSL.dynamicProperties,
    ).map((path) => ({ key: path }));
    delete currentDSL.dynamicProperties;
  }
  return currentDSL;
};

const addVersionNumberMigration = (
  currentDSL: ContainerWidgetProps<WidgetProps>,
) => {
  if (currentDSL.children && currentDSL.children.length) {
    currentDSL.children = currentDSL.children.map(addVersionNumberMigration);
  }
  if (currentDSL.version === undefined) {
    currentDSL.version = 1;
  }
  return currentDSL;
};

const canvasNameConflictMigration = (
  currentDSL: ContainerWidgetProps<WidgetProps>,
  props = { counter: 1 },
): ContainerWidgetProps<WidgetProps> => {
  if (
    currentDSL.type === "CANVAS_WIDGET" &&
    currentDSL.widgetName.startsWith("Canvas")
  ) {
    currentDSL.widgetName = `Canvas${props.counter}`;
    // Canvases inside tabs have `name` property as well
    if (currentDSL.name) {
      currentDSL.name = currentDSL.widgetName;
    }
    props.counter++;
  }
  currentDSL.children?.forEach((c) => canvasNameConflictMigration(c, props));

  return currentDSL;
};

const renamedCanvasNameConflictMigration = (
  currentDSL: ContainerWidgetProps<WidgetProps>,
  props = { counter: 1 },
): ContainerWidgetProps<WidgetProps> => {
  // Rename all canvas widgets except for MainContainer
  if (
    currentDSL.type === "CANVAS_WIDGET" &&
    currentDSL.widgetName !== "MainContainer"
  ) {
    currentDSL.widgetName = `Canvas${props.counter}`;
    // Canvases inside tabs have `name` property as well
    if (currentDSL.name) {
      currentDSL.name = currentDSL.widgetName;
    }
    props.counter++;
  }
  currentDSL.children?.forEach((c) => canvasNameConflictMigration(c, props));

  return currentDSL;
};

const pixelToNumber = (pixel: string) => {
  if (pixel.includes("px")) {
    return parseInt(pixel.split("px").join(""));
  }
  return 0;
};

export const calculateDynamicHeight = (
  canvasWidgets: {
    [widgetId: string]: FlattenedWidgetProps;
  } = {},
  presentMinimumHeight = CANVAS_DEFAULT_HEIGHT_PX,
) => {
  let minimumHeight = presentMinimumHeight;
  const nextAvailableRow = nextAvailableRowInContainer(
    MAIN_CONTAINER_WIDGET_ID,
    canvasWidgets,
  );
  const screenHeight = window.innerHeight;
  const gridRowHeight = GridDefaults.DEFAULT_GRID_ROW_HEIGHT;
  const calculatedCanvasHeight = nextAvailableRow * gridRowHeight;
  // DGRH - DEFAULT_GRID_ROW_HEIGHT
  // View Mode: Header height + Page Selection Tab = 8 * DGRH (approx)
  // Edit Mode: Header height + Canvas control = 8 * DGRH (approx)
  // buffer: ~8 grid row height
  const buffer = gridRowHeight + 2 * pixelToNumber(theme.smallHeaderHeight);
  const calculatedMinHeight =
    Math.floor((screenHeight - buffer) / gridRowHeight) * gridRowHeight;
  if (
    calculatedCanvasHeight < screenHeight &&
    calculatedMinHeight !== presentMinimumHeight
  ) {
    minimumHeight = calculatedMinHeight;
  }
  return minimumHeight;
};

// A rudimentary transform function which updates the DSL based on its version.
// A more modular approach needs to be designed.
export const transformDSL = (
  currentDSL: ContainerWidgetProps<WidgetProps>,
  newPage = false,
) => {
  if (currentDSL.version === undefined) {
    // Since this top level widget is a CANVAS_WIDGET,
    // DropTargetComponent needs to know the minimum height the canvas can take
    // See DropTargetUtils.ts
    currentDSL.minHeight = calculateDynamicHeight();
    currentDSL.bottomRow =
      currentDSL.minHeight - GridDefaults.DEFAULT_GRID_ROW_HEIGHT;
    // For the first time the DSL is created, remove one row from the total possible rows
    // to adjust for padding and margins.
    currentDSL.snapRows =
      Math.floor(currentDSL.bottomRow / GridDefaults.DEFAULT_GRID_ROW_HEIGHT) -
      1;

    // Force the width of the canvas to 1224 px
    currentDSL.rightColumn = 1224;
    // The canvas is a CANVAS_WIDGET which doesn't have a background or borders by default
    currentDSL.backgroundColor = "none";
    currentDSL.containerStyle = "none";
    currentDSL.type = "CANVAS_WIDGET";
    currentDSL.detachFromLayout = true;
    currentDSL.canExtend = true;

    // Update version to make sure this doesn't run every time.
    currentDSL.version = 1;
  }

  if (currentDSL.version === 1) {
    if (currentDSL.children && currentDSL.children.length > 0)
      currentDSL.children = currentDSL.children.map(updateContainers);
    currentDSL.version = 2;
  }
  if (currentDSL.version === 2) {
    currentDSL.version = 3;
  }
  if (currentDSL.version === 3) {
    currentDSL.version = 4;
  }
  if (currentDSL.version === 4) {
    currentDSL.version = 5;
  }
  if (currentDSL.version === 5) {
    currentDSL.version = 6;
  }
  if (currentDSL.version === 6) {
    currentDSL = dynamicPathListMigration(currentDSL);
    currentDSL.version = 7;
  }

  if (currentDSL.version === 7) {
    currentDSL = canvasNameConflictMigration(currentDSL);
    currentDSL.version = 8;
  }

  if (currentDSL.version === 8) {
    currentDSL = renamedCanvasNameConflictMigration(currentDSL);
    currentDSL.version = 9;
  }

  if (currentDSL.version === 9) {
    currentDSL.version = 10;
  }

  if (currentDSL.version === 10) {
    currentDSL = addVersionNumberMigration(currentDSL);
    currentDSL.version = 11;
  }

  if (currentDSL.version === 11) {
    currentDSL.version = 12;
  }

  if (currentDSL.version === 12) {
    currentDSL = migrateIncorrectDynamicBindingPathLists(currentDSL);
    currentDSL.version = 13;
  }

  if (currentDSL.version === 13) {
    currentDSL.version = 14;
  }

  if (currentDSL.version === 14) {
    currentDSL.version = 15;
  }

  if (currentDSL.version === 15) {
    currentDSL.version = 16;
  }

  if (currentDSL.version === 16) {
    currentDSL.version = 17;
  }

  if (currentDSL.version === 17) {
    currentDSL.version = 18;
  }

  if (currentDSL.version === 18) {
    currentDSL.version = 19;
  }

  if (currentDSL.version === 19) {
    currentDSL.snapColumns = GridDefaults.DEFAULT_GRID_COLUMNS;
    currentDSL.snapRows = getCanvasSnapRows(
      currentDSL.bottomRow,
      currentDSL.detachFromLayout || false,
    );
    if (!newPage) {
      currentDSL = migrateToNewLayout(currentDSL);
    }
    currentDSL.version = 20;
  }

  if (currentDSL.version === 20) {
    currentDSL.version = 21;
  }

  if (currentDSL.version === 21) {
    const {
      entities: { canvasWidgets },
    } = CanvasWidgetsNormalizer.normalize(currentDSL);
    currentDSL = migrateWidgetsWithoutLeftRightColumns(
      currentDSL,
      canvasWidgets,
    );
    currentDSL.version = 22;
  }

  if (currentDSL.version === 22) {
    currentDSL.version = 23;
  }

  if (currentDSL.version === 23) {
    currentDSL.version = 24;
  }

  if (currentDSL.version === 24) {
    currentDSL.version = 25;
  }

  if (currentDSL.version === 25) {
    currentDSL.version = 26;
  }

  if (currentDSL.version === 26) {
    currentDSL.version = 27;
  }
  if (currentDSL.version === 27) {
    currentDSL.version = 28;
  }

  if (currentDSL.version === 28) {
    currentDSL.version = 29;
  }

  if (currentDSL.version === 29) {
    currentDSL.version = 30;
  }
  if (currentDSL.version === 30) {
    currentDSL.version = 31;
  }

  if (currentDSL.version === 31) {
    currentDSL.version = 32;
  }

  if (currentDSL.version === 32) {
    currentDSL.version = 33;
  }

  if (currentDSL.version === 33) {
    currentDSL.version = 34;
  }

  if (currentDSL.version === 34) {
    currentDSL.version = 35;
  }

  if (currentDSL.version === 35) {
    currentDSL.version = 36;
  }

  if (currentDSL.version === 36) {
    currentDSL.version = 37;
  }

  if (currentDSL.version === 37) {
    currentDSL.version = 38;
  }

  if (currentDSL.version === 38) {
    currentDSL.version = 39;
  }

  if (currentDSL.version === 39) {
    currentDSL.version = 40;
  }

  if (currentDSL.version === 40) {
    currentDSL.version = 41;
  }

  if (currentDSL.version === 41) {
    currentDSL.version = 42;
  }

  if (currentDSL.version === 42) {
    currentDSL.version = 43;
  }

  if (currentDSL.version === 43) {
    currentDSL.version = 44;
  }
  if (currentDSL.version === 44) {
    currentDSL.version = 45;
  }

  if (currentDSL.version === 45) {
    currentDSL.version = 46;
  }

  if (currentDSL.version === 46) {
    currentDSL.version = 47;
  }

  if (currentDSL.version === 47) {
    // We're skipping this to fix a bad table migration.
    // skipped migration is added as version 51
    currentDSL.version = 48;
  }

  if (currentDSL.version === 48) {
    currentDSL.version = 49;
  }

  if (currentDSL.version === 49) {
    currentDSL.version = 50;
  }

  if (currentDSL.version === 50) {
    /*
     * We're skipping this to fix a bad table migration - migrateTableWidgetNumericColumnName
     * it overwrites the computedValue of the table columns
     */

    currentDSL.version = 51;
  }

  if (currentDSL.version === 51) {
    currentDSL.version = 52;
  }

  if (currentDSL.version === 52) {
    currentDSL.version = 53;
  }

  if (currentDSL.version === 53) {
    currentDSL.version = 54;
  }

  if (currentDSL.version === 54) {
    currentDSL.version = 55;
  }

  if (currentDSL.version === 55) {
    currentDSL.version = 56;
  }

  if (currentDSL.version === 56) {
    currentDSL.version = 57;
  }

  if (currentDSL.version === 57) {
    currentDSL = migrateStylingPropertiesForTheming(currentDSL);
    currentDSL.version = 58;
  }

  if (currentDSL.version === 58) {
    currentDSL.version = LATEST_PAGE_VERSION;
  }

  return currentDSL;
};

const migrateWidgetsWithoutLeftRightColumns = (
  currentDSL: ContainerWidgetProps<WidgetProps>,
  canvasWidgets: any,
) => {
  if (
    currentDSL.widgetId !== MAIN_CONTAINER_WIDGET_ID &&
    !(
      currentDSL.hasOwnProperty("leftColumn") &&
      currentDSL.hasOwnProperty("rightColumn")
    )
  ) {
    try {
      const nextRow = nextAvailableRowInContainer(
        currentDSL.parentId || MAIN_CONTAINER_WIDGET_ID,
        omit(canvasWidgets, [currentDSL.widgetId]),
      );
      canvasWidgets[currentDSL.widgetId].repositioned = true;
      const leftColumn = 0;
      // TODO(abhinav): Figure out a way to get the correct values from the widgets
      const rightColumn = 4;
      const bottomRow = nextRow + (currentDSL.bottomRow - currentDSL.topRow);
      const topRow = nextRow;
      currentDSL = {
        ...currentDSL,
        topRow,
        bottomRow,
        rightColumn,
        leftColumn,
      };
    } catch (error) {
      console.log("Migrating position of widget on data loss failed", currentDSL)
    }
  }
  if (currentDSL.children && currentDSL.children.length) {
    currentDSL.children = currentDSL.children.map((dsl) =>
      migrateWidgetsWithoutLeftRightColumns(dsl, canvasWidgets),
    );
  }
  return currentDSL;
};

export const migrateToNewLayout = (dsl: ContainerWidgetProps<WidgetProps>) => {
  const scaleWidget = (widgetProps: WidgetProps) => {
    widgetProps.bottomRow *= GRID_DENSITY_MIGRATION_V1;
    widgetProps.topRow *= GRID_DENSITY_MIGRATION_V1;
    widgetProps.leftColumn *= GRID_DENSITY_MIGRATION_V1;
    widgetProps.rightColumn *= GRID_DENSITY_MIGRATION_V1;
    if (widgetProps.children && widgetProps.children.length) {
      widgetProps.children.forEach((eachWidgetProp: WidgetProps) => {
        scaleWidget(eachWidgetProp);
      });
    }
  };
  scaleWidget(dsl);
  return dsl;
};

export const checkIfMigrationIsNeeded = (
  fetchPageResponse?: FetchPageResponse,
) => {
  const currentDSL = fetchPageResponse?.data.layouts[0].dsl;
  if (!currentDSL) return false;
  return currentDSL.version !== LATEST_PAGE_VERSION;
};
