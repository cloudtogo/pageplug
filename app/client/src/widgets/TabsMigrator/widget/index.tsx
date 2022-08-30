import BaseWidget, { WidgetState } from "widgets/BaseWidget";
import {
  TabContainerWidgetProps,
  TabsWidgetProps,
} from "widgets/TabsWidget/constants";
import { selectedTabValidation } from "widgets/TabsWidget/widget";
import { WidgetType } from "constants/WidgetConstants";
import { migrateTabsData } from "utils/DSLMigrations";
import { cloneDeep, get } from "lodash";
import { ValidationTypes } from "constants/WidgetValidation";
import { generateReactKey } from "utils/generators";
import { EVAL_VALUE_PATH } from "utils/DynamicBindingUtils";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";

class TabsMigratorWidget extends BaseWidget<
  TabsWidgetProps<TabContainerWidgetProps>,
  WidgetState
> {
  getPageView() {
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
            defaultValue: true,
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
  static getWidgetType(): WidgetType {
    return "TABS_MIGRATOR_WIDGET";
  }
}
export default TabsMigratorWidget;
