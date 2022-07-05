import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { ScrollView, RichText } from "@tarojs/components";
import { WidgetType } from "constants/WidgetConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import styled from "styled-components";

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
    return (
      <Container scrollY>
        <RichText nodes={content} />
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
