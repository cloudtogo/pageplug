import type { WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import type {
  TabContainerWidgetProps,
  TabsWidgetProps,
} from "widgets/TabsWidget/constants";
import { selectedTabValidation } from "widgets/TabsWidget/widget";
import { cloneDeep, get, isString } from "lodash";
import { ValidationTypes } from "constants/WidgetValidation";
import { generateReactKey } from "utils/generators";
import { EVAL_VALUE_PATH } from "utils/DynamicBindingUtils";
import { AutocompleteDataType } from "utils/autocomplete/AutocompleteDataType";
import * as Sentry from "@sentry/react";
import type { DSLWidget } from "WidgetProvider/constants";
import { DATA_BIND_REGEX_GLOBAL } from "constants/BindingsConstants";

function migrateTabsDataUsingMigrator(currentDSL: DSLWidget) {
  if (currentDSL.type === "TABS_WIDGET" && currentDSL.version === 1) {
    try {
      currentDSL.type = "TABS_MIGRATOR_WIDGET";
      currentDSL.version = 1;
    } catch (error) {
      Sentry.captureException({
        message: "Tabs Migration Failed",
        oldData: currentDSL.tabs,
      });
      currentDSL.tabsObj = {};
      delete currentDSL.tabs;
    }
  }
  if (currentDSL.children && currentDSL.children.length) {
    currentDSL.children = currentDSL.children.map(migrateTabsDataUsingMigrator);
  }
  return currentDSL;
}

const migrateTabsData = (currentDSL: DSLWidget) => {
  if (
    // TODO: Fix this the next time the file is edited
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ["TABS_WIDGET", "TABS_MIGRATOR_WIDGET"].includes(currentDSL.type as any) &&
    currentDSL.version === 1
  ) {
    try {
      currentDSL.type = "TABS_WIDGET";
      const isTabsDataBinded = isString(currentDSL.tabs);
      currentDSL.dynamicPropertyPathList =
        currentDSL.dynamicPropertyPathList || [];
      currentDSL.dynamicBindingPathList =
        currentDSL.dynamicBindingPathList || [];

      if (isTabsDataBinded) {
        const tabsString = currentDSL.tabs.replace(
          DATA_BIND_REGEX_GLOBAL,
          // TODO: Fix this the next time the file is edited
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (word: any) => `"${word}"`,
        );
        try {
          currentDSL.tabs = JSON.parse(tabsString);
        } catch (error) {
          return migrateTabsDataUsingMigrator(currentDSL);
        }
        const dynamicPropsList = currentDSL.tabs // TODO: Fix this the next time the file is edited
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((each: any) => DATA_BIND_REGEX_GLOBAL.test(each.isVisible)) // TODO: Fix this the next time the file is edited
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((each: any) => {
            return { key: `tabsObj.${each.id}.isVisible` };
          });
        // TODO: Fix this the next time the file is edited
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dynamicBindablePropsList = currentDSL.tabs.map((each: any) => {
          return { key: `tabsObj.${each.id}.isVisible` };
        });
        currentDSL.dynamicPropertyPathList = [
          ...currentDSL.dynamicPropertyPathList,
          ...dynamicPropsList,
        ];
        currentDSL.dynamicBindingPathList = [
          ...currentDSL.dynamicBindingPathList,
          ...dynamicBindablePropsList,
        ];
      }
      currentDSL.dynamicPropertyPathList =
        currentDSL.dynamicPropertyPathList.filter((each) => {
          return each.key !== "tabs";
        });
      currentDSL.dynamicBindingPathList =
        currentDSL.dynamicBindingPathList.filter((each) => {
          return each.key !== "tabs";
        });
      currentDSL.tabsObj = currentDSL.tabs.reduce(
        // TODO: Fix this the next time the file is edited
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obj: any, tab: any, index: number) => {
          obj = {
            ...obj,
            [tab.id]: {
              ...tab,
              isVisible: tab.isVisible === undefined ? true : tab.isVisible,
              index,
            },
          };
          return obj;
        },
        {},
      );
      currentDSL.version = 2;
      delete currentDSL.tabs;
    } catch (error) {
      Sentry.captureException({
        message: "Tabs Migration Failed",
        oldData: currentDSL.tabs,
      });
      currentDSL.tabsObj = {};
      delete currentDSL.tabs;
    }
  }
  if (currentDSL.children && currentDSL.children.length) {
    currentDSL.children = currentDSL.children.map(migrateTabsData);
  }
  return currentDSL;
};

class TabsMigratorWidget extends BaseWidget<
  TabsWidgetProps<TabContainerWidgetProps>,
  WidgetState
> {
  static type = "TABS_MIGRATOR_WIDGET";

  static getConfig() {
    return {
      name: "旧版标签页",
      needsMeta: true,
    };
  }

  static getDefaults() {
    return {
      isLoading: true,
      rows: 1,
      columns: 1,
      widgetName: "Skeleton",
      version: 1,
      animateLoading: false,
    };
  }

  getWidgetView() {
    return null;
  }
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "标签页名称数组",
            propertyName: "tabs",
            isJSConvertible: true,
            label: "标签页列表",
            controlType: "TABS_INPUT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    allowedKeys: [
                      {
                        name: "label",
                        type: ValidationTypes.TEXT,
                      },
                      {
                        name: "id",
                        type: ValidationTypes.TEXT,
                        default: generateReactKey(),
                      },
                      {
                        name: "widgetId",
                        type: ValidationTypes.TEXT,
                        default: generateReactKey(),
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            propertyName: "shouldShowTabs",
            helpText: "隐藏标签头后，标签页不可切换，只展示默认标签页",
            label: "显示标签头",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "defaultTab",
            placeholderText: "输入标签页名称",
            label: "默认标签页",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: selectedTabValidation,
                expected: {
                  type: "标签页名称 (string)",
                  example: "Tab 1",
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
            dependencies: ["tabsObj", "tabs"],
          },
          {
            helpText: "允许组件内部内容滚动",
            propertyName: "shouldScrollContents",
            label: "滚动内容",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "animateLoading",
            label: "加载时显示动画",
            controlType: "SWITCH",
            helpText: "组件依赖的数据加载时显示加载动画",
            defaultValue: false,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            helpText: "选中标签页时触发",
            propertyName: "onTabSelected",
            label: "onTabSelected",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  componentDidMount() {
    if (get(this.props, EVAL_VALUE_PATH, false)) {
      const tabsDsl = cloneDeep(this.props);
      const migratedTabsDsl = migrateTabsData(tabsDsl);
      super.batchUpdateWidgetProperty({
        modify: {
          tabsObj: migratedTabsDsl.tabsObj,
          type: "TABS_WIDGET",
          version: 2,
          dynamicPropertyPathList: migratedTabsDsl.dynamicPropertyPathList,
          dynamicBindingPathList: migratedTabsDsl.dynamicBindingPathList,
        },
        remove: ["tabs"],
      });
    }
  }
}
export default TabsMigratorWidget;
