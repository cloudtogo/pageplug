import React from "react";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import { ScrollView, RichText } from "@tarojs/components";
import { ValidationTypes } from "constants/WidgetValidation";
import styled from "styled-components";
import IconSVG from "../icon.svg";

const Container = styled(ScrollView)`
  width: 100%;
  height: 100%;
  & img {
    width: 100%;
  }
  & p {
    margin: 0;
  }
`;

class MHtmlWidget extends BaseWidget<MHtmlWidgetProps, WidgetState> {
  static type = "TARO_HTML_WIDGET";

  static getConfig() {
    return {
      name: "HTML",
      searchTags: ["html"],
      iconSVG: IconSVG,
      needsMeta: false,
      isCanvas: false,
      isMobile: true,
    };
  }

  static getDefaults() {
    return {
      widgetName: "html",
      rows: 24,
      columns: 56,
      content:
        "<p style='font-size: 36px; font-weight: bold; font-family: fangsong; background:red; color:black; text-align: center;'>恭喜发财 大吉大利</p>",
      version: 1,
    };
  }

  static getAutoLayoutConfig() {
    return {
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: () => {
            return {
              minWidth: "280px",
              minHeight: "70px",
            };
          },
        },
      ],
      disableResizeHandles: {
        vertical: true,
      },
    };
  }

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "content",
            label: "HTML内容",
            controlType: "INPUT_TEXT",
            placeholderText: "输入HTML格式内容",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  getWidgetView() {
    const { content } = this.props;
    return (
      <Container scrollY>
        <RichText nodes={content} />
      </Container>
    );
  }
}

export interface MHtmlWidgetProps extends WidgetProps {
  content: string;
}

export default MHtmlWidget;
