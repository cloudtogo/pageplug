import React, { useContext } from "react";
import { styled } from "linaria/react";
import { RenderModes } from "constants/WidgetConstants";
import WidgetFactory from "utils/WidgetFactory";
import { DSLWidget } from "widgets/constants";
import { useDynamicAppLayout } from "utils/hooks/useDynamicAppLayout";
import ReduxContext from "./ReduxContext";

const PageView = styled.div<{ width: number }>`
  height: 100%;
  position: relative;
  width: ${(props) => props.width}px;
  margin: 0 auto;
`;

type AppPageProps = {
  dsl: DSLWidget;
  pageName?: string;
  appName?: string;
};

export function AppPage(props: AppPageProps) {
  const { useDispatch, useSelector, context } = useContext(ReduxContext);
  const dispatch = useDispatch();
  useDynamicAppLayout(dispatch, useSelector);
  return (
    <PageView width={props.dsl.rightColumn}>
      {props.dsl.widgetId &&
        WidgetFactory.createWidget({ ...props.dsl, context }, RenderModes.PAGE)}
    </PageView>
  );
}

export default AppPage;
