import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { ScrollView, RichText } from "@tarojs/components";
import { WidgetType } from "constants/WidgetConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { styled } from "linaria/react";

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

  getPageView() {
    const { content } = this.props;
    const unitContent = content
      .replace(/\d+px/g, (size) => `${parseInt(size) * 0.8}px`)
      .replace(/<p>/g, '<p class="rich-p">')
      .replace(/<img /g, '<img class="rich-img" ');
    return (
      <Container scrollY>
        <RichText nodes={unitContent} />
      </Container>
    );
  }

  static getWidgetType(): WidgetType {
    return "TARO_HTML_WIDGET";
  }
}

export interface MHtmlWidgetProps extends WidgetProps {
  content: string;
}

export default MHtmlWidget;
