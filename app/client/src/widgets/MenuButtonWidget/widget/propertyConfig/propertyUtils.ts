import { MenuButtonWidgetProps, MenuItemsSource } from "../../constants";

export const updateMenuItemsSource = (
  props: MenuButtonWidgetProps,
  propertyPath: string,
  propertyValue: unknown,
): Array<{ propertyPath: string; propertyValue: unknown }> | undefined => {
  const propertiesToUpdate: Array<{
    propertyPath: string;
    propertyValue: unknown;
  }> = [];
  const isMenuItemsSourceChangedFromStaticToDynamic =
    props.menuItemsSource === MenuItemsSource.STATIC &&
    propertyValue === MenuItemsSource.DYNAMIC;

  if (isMenuItemsSourceChangedFromStaticToDynamic) {
    if (!props.sourceData) {
      propertiesToUpdate.push({
        propertyPath: "sourceData",
        propertyValue: [],
      });
      propertiesToUpdate.push({
        propertyPath: "sourceDataKeys",
        propertyValue: [],
      });
    }

    if (!props.configureMenuItems) {
      propertiesToUpdate.push({
        propertyPath: "configureMenuItems",
        propertyValue: {
          label: "配置菜单项",
          id: "config",
          config: {
            id: "config",
            label: "菜单项",
            isVisible: true,
            isDisabled: false,
          },
        },
      });
    }
  }

  return propertiesToUpdate?.length ? propertiesToUpdate : undefined;
};
