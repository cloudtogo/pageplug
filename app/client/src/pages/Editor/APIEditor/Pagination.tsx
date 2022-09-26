import React from "react";
import DynamicTextField from "components/editorComponents/form/fields/DynamicTextField";

import styled from "constants/DefaultTheme";
import FormRow from "components/editorComponents/FormRow";
import { PaginationType } from "entities/Action";
import RadioFieldGroup from "components/editorComponents/form/fields/RadioGroupField";
import { Button, Category, Size, Text, TextType } from "design-system";
import {
  CodeEditorBorder,
  EditorTheme,
} from "components/editorComponents/CodeEditor/EditorConfig";
import { GifPlayer } from "design-system";
import { Classes } from "components/ads/common";
import lightmodeGif from "assets/icons/gifs/config_pagination_lightmode.gif";
import darkmodeGif from "assets/icons/gifs/config_pagination_darkmode.gif";
import lightmodeThumbnail from "assets/icons/gifs/lightmode_thumbnail.png";
import darkmodeThumbnail from "assets/icons/gifs/darkmode_thumbnail.png";

interface PaginationProps {
  onTestClick: (test?: "PREV" | "NEXT") => void;
  paginationType: PaginationType;
  theme?: EditorTheme;
}
const PaginationFieldWrapper = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spaces[5]}px;
  margin-left: ${(props) => props.theme.spaces[11] + 2}px;
  width: 420px;
  button {
    margin-left: ${(props) => props.theme.spaces[5]}px;
  }
`;

const Step = styled(Text)`
  display: block;
  margin-bottom: ${(props) => props.theme.spaces[5]}px;
  color: ${(props) => props.theme.colors.apiPane.pagination.label};
  margin-left: ${(props) => props.theme.spaces[11] + 2}px;
`;

const StepTitle = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spaces[4]}px;
  span {
    color: ${(props) => props.theme.colors.apiPane.pagination.stepTitle};
  }
`;

const PaginationTypeView = styled.div`
  margin-left: 28px;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spaces[11]}px;
`;

const PaginationSection = styled.div`
  display: flex;
  padding: ${(props) => props.theme.spaces[8]}px
    ${(props) => props.theme.spaces[12]}px;
`;

const Example = styled(Text)`
  display: block;
  margin-left: ${(props) => props.theme.spaces[11] + 2}px;
  margin-bottom: ${(props) => props.theme.spaces[3]}px;
  color: ${(props) => props.theme.colors.apiPane.pagination.label};
`;

const BindingKey = styled.div`
  padding: ${(props) => props.theme.spaces[1] - 2}px
    ${(props) => props.theme.spaces[1]}px;
  margin-left: ${(props) => props.theme.spaces[11] + 2}px;
  width: fit-content;
  span {
    color: ${(props) => props.theme.colors.apiPane.pagination.label};
  }
  background: ${(props) => props.theme.colors.apiPane.pagination.bindingBg};
`;

const GifContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 320px;
    height: 161px;
  }

  .${Classes.TEXT} {
    margin-top: 12px;
  }
`;

export default function Pagination(props: PaginationProps) {
  return (
    <PaginationSection>
      <FormRow>
        <RadioFieldGroup
          className="t--apiFormPaginationType"
          name="actionConfiguration.paginationType"
          options={[
            {
              label: "不分页",
              value: PaginationType.NONE,
            },
            {
              label: "使用表格页号分页",
              value: PaginationType.PAGE_NO,
            },
            {
              label: "上一页下一页",
              value: PaginationType.URL,
            },
          ]}
          placeholder="Method"
          rows={3}
          selectedOptionElements={[
            null,
            <PaginationTypeView key={PaginationType.PAGE_NO}>
              <div>
                <StepTitle>
                  <Text type={TextType.P1}>
                    1. 配置表格分页
                  </Text>
                </StepTitle>
                <Step type={TextType.P1}>1. 打开服务端分页</Step>
                <Step type={TextType.P1}>2. 配置 OnPageChange 动作</Step>
                <StepTitle>
                  <Text type={TextType.P1}>
                    2. 配置请求参数
                  </Text>
                </StepTitle>
                <Step style={{ width: "336px" }} type={TextType.P1}>
                  1. 在你的请求头或者请求参数中配置 UsersTable 的页号
                </Step>
                <Example type={TextType.P2}>
                  例如：<i>pageNo</i> 或者其他类似值
                </Example>
                <BindingKey>
                  <Text type={TextType.P2}>{"{{UsersTable.pageNo}}"}</Text>
                </BindingKey>
              </div>
              <GifContainer>
                <GifPlayer
                  gif={
                    props.theme === EditorTheme.LIGHT
                      ? lightmodeGif
                      : darkmodeGif
                  }
                  thumbnail={
                    props.theme === EditorTheme.LIGHT
                      ? lightmodeThumbnail
                      : darkmodeThumbnail
                  }
                />
                <Text type={TextType.P3}>
                  1. 如何配置表格分页
                </Text>
              </GifContainer>
            </PaginationTypeView>,
            <PaginationTypeView key={PaginationType.URL}>
              <div>
                <StepTitle>
                  <Text type={TextType.P1}>
                    1. 配置表格分页
                  </Text>
                </StepTitle>
                <Step type={TextType.P1}>1. 打开服务端分页</Step>
                <Step type={TextType.P1}>2. 配置 OnPageChange 动作</Step>
                <StepTitle>
                  <Text type={TextType.P1}>
                    2. 配置请求参数
                  </Text>
                </StepTitle>
                <Step type={TextType.P1}>配置上一页、下一页 url </Step>
                <Step type={TextType.P1}>上一页 url</Step>
                <PaginationFieldWrapper
                  data-replay-id={btoa("actionConfiguration.prev")}
                >
                  <DynamicTextField
                    border={CodeEditorBorder.ALL_SIDE}
                    className="t--apiFormPaginationPrev"
                    fill={!!true}
                    height="100%"
                    name="actionConfiguration.prev"
                    theme={props.theme}
                  />
                  <Button
                    category={Category.tertiary}
                    className="t--apiFormPaginationPrevTest"
                    height="auto"
                    onClick={() => {
                      props.onTestClick("PREV");
                    }}
                    size={Size.medium}
                    tag="button"
                    text={"Test"}
                    type="button"
                  />
                </PaginationFieldWrapper>
                <Step type={TextType.P1}>下一页 url</Step>
                <PaginationFieldWrapper
                  data-replay-id={btoa("actionConfiguration.next")}
                >
                  <DynamicTextField
                    border={CodeEditorBorder.ALL_SIDE}
                    className="t--apiFormPaginationNext"
                    fill={!!true}
                    height="100%"
                    name="actionConfiguration.next"
                    theme={props.theme}
                  />
                  <Button
                    category={Category.tertiary}
                    className="t--apiFormPaginationNextTest"
                    height="auto"
                    onClick={() => {
                      props.onTestClick("NEXT");
                    }}
                    size={Size.medium}
                    tag="button"
                    text={"Test"}
                    type="button"
                  />
                </PaginationFieldWrapper>
              </div>
              <GifContainer>
                <GifPlayer
                  gif={
                    props.theme === EditorTheme.LIGHT
                      ? lightmodeGif
                      : darkmodeGif
                  }
                  thumbnail={
                    props.theme === EditorTheme.LIGHT
                      ? lightmodeThumbnail
                      : darkmodeThumbnail
                  }
                />
                <Text type={TextType.P3}>
                  1. 如何配置表格分页
                </Text>
              </GifContainer>
            </PaginationTypeView>,
          ]}
        />
      </FormRow>
    </PaginationSection>
  );
}
