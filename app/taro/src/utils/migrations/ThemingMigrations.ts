import { ButtonBorderRadiusTypes } from "components/constants";
import { BoxShadowTypes } from "components/designSystems/appsmith/WidgetStyleContainer";
import {
  DEFAULT_BOXSHADOW,
  THEMEING_TEXT_SIZES,
  THEMING_BORDER_RADIUS,
} from "constants/ThemeConstants";
import { TextSizes } from "constants/WidgetConstants";
import { WidgetProps } from "widgets/BaseWidget";
import { ContainerWidgetProps } from "widgets/ContainerWidget/widget";

export const migrateStylingPropertiesForTheming = (
  currentDSL: ContainerWidgetProps<WidgetProps>,
) => {
  const widgetsWithPrimaryColorProp = [
    "DATE_PICKER_WIDGET2",
    "INPUT_WIDGET",
    "INPUT_WIDGET_V2",
    "LIST_WIDGET",
  ];

  currentDSL.children = currentDSL.children?.map((child) => {
    switch (child.borderRadius) {
      case ButtonBorderRadiusTypes.SHARP:
        child.borderRadius = THEMING_BORDER_RADIUS.none;
        break;
      case ButtonBorderRadiusTypes.ROUNDED:
        child.borderRadius = THEMING_BORDER_RADIUS.rounded;
        break;
      case ButtonBorderRadiusTypes.CIRCLE:
        child.borderRadius = THEMING_BORDER_RADIUS.circle;
        addPropertyToDynamicPropertyPathList("borderRadius", child);
        break;
      default:
        if (
          (child.type === "CONTAINER_WIDGET" ||
            child.type === "FORM_WIDGET" ||
            child.type === "JSON_FORM_WIDGET") &&
          child.borderRadius
        ) {
          child.borderRadius = `${child.borderRadius}px`;
          addPropertyToDynamicPropertyPathList("borderRadius", child);
        } else {
          child.borderRadius = THEMING_BORDER_RADIUS.none;
        }
    }

    switch (child.boxShadow) {
      case BoxShadowTypes.VARIANT1:
        child.boxShadow = `0px 0px 4px 3px ${child.boxShadowColor ||
          "rgba(0, 0, 0, 0.25)"}`;
        addPropertyToDynamicPropertyPathList("boxShadow", child);
        break;
      case BoxShadowTypes.VARIANT2:
        child.boxShadow = `3px 3px 4px ${child.boxShadowColor ||
          "rgba(0, 0, 0, 0.25)"}`;
        addPropertyToDynamicPropertyPathList("boxShadow", child);
        break;
      case BoxShadowTypes.VARIANT3:
        child.boxShadow = `0px 1px 3px ${child.boxShadowColor ||
          "rgba(0, 0, 0, 0.25)"}`;
        addPropertyToDynamicPropertyPathList("boxShadow", child);
        break;
      case BoxShadowTypes.VARIANT4:
        child.boxShadow = `2px 2px 0px ${child.boxShadowColor ||
          "rgba(0, 0, 0, 0.25)"}`;
        addPropertyToDynamicPropertyPathList("boxShadow", child);
        break;
      case BoxShadowTypes.VARIANT5:
        child.boxShadow = `-2px -2px 0px ${child.boxShadowColor ||
          "rgba(0, 0, 0, 0.25)"}`;
        addPropertyToDynamicPropertyPathList("boxShadow", child);
        break;
      default:
        child.boxShadow = DEFAULT_BOXSHADOW;
    }

    switch (child.fontSize) {
      case TextSizes.PARAGRAPH2:
        child.fontSize = THEMEING_TEXT_SIZES.xs;
        addPropertyToDynamicPropertyPathList("fontSize", child);
        break;
      case TextSizes.PARAGRAPH:
        child.fontSize = THEMEING_TEXT_SIZES.sm;
        break;
      case TextSizes.HEADING3:
        child.fontSize = THEMEING_TEXT_SIZES.base;
        break;
      case TextSizes.HEADING2:
        child.fontSize = THEMEING_TEXT_SIZES.md;
        addPropertyToDynamicPropertyPathList("fontSize", child);
        break;
      case TextSizes.HEADING1:
        child.fontSize = THEMEING_TEXT_SIZES.lg;
        addPropertyToDynamicPropertyPathList("fontSize", child);
        break;
    }

    switch (child.labelTextSize) {
      case TextSizes.PARAGRAPH2:
        child.labelTextSize = THEMEING_TEXT_SIZES.xs;
        addPropertyToDynamicPropertyPathList("labelTextSize", child);
        break;
      case TextSizes.PARAGRAPH:
        child.labelTextSize = THEMEING_TEXT_SIZES.sm;
        break;
      case TextSizes.HEADING3:
        child.labelTextSize = THEMEING_TEXT_SIZES.base;
        break;
      case TextSizes.HEADING2:
        child.labelTextSize = THEMEING_TEXT_SIZES.md;
        addPropertyToDynamicPropertyPathList("labelTextSize", child);
        break;
      case TextSizes.HEADING1:
        child.labelTextSize = THEMEING_TEXT_SIZES.lg;
        addPropertyToDynamicPropertyPathList("labelTextSize", child);
        break;
      default:
        child.labelTextSize = THEMEING_TEXT_SIZES.sm;
    }

    /**
     * Add primaryColor color to missing widgets
     */
    if (widgetsWithPrimaryColorProp.includes(child.type)) {
      child.accentColor = "{{appsmith.theme.colors.primaryColor}}";

      child.dynamicBindingPathList = [
        ...(child.dynamicBindingPathList || []),
        {
          key: "accentColor",
        },
      ];
    }

    if (child.children && child.children.length > 0) {
      child = migrateStylingPropertiesForTheming(child);
    }
    return child;
  });

  return currentDSL;
};

/**
 * This function will add the given propertyName into the dynamicPropertyPathList.
 * @param propertyName
 * @param child
 */
export const addPropertyToDynamicPropertyPathList = (
  propertyName: string,
  child: WidgetProps,
) => {
  const isPropertyPathPresent = (child.dynamicPropertyPathList || []).find(
    (property) => property.key === propertyName,
  );
  if (!isPropertyPathPresent) {
    child.dynamicPropertyPathList = [
      ...(child.dynamicPropertyPathList || []),
      { key: propertyName },
    ];
  }
};
