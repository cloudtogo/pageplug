import React from "react";
import type { ReactNode } from "react";
import type { Dispatch } from "redux";
import TableData from "assets/gifs/table_data.gif";
import DefaultText from "assets/gifs/default_text.gif";
import {
  setCurrentStepInit,
  addOnboardingWidget,
  forceShowContent,
  focusWidget,
} from "actions/onboardingActions";
import type { IconName } from "design-system-old";
import { highlightSection, showIndicator } from "./utils";
import { setExplorerPinnedAction } from "actions/explorerActions";
import { forceOpenWidgetPanel } from "actions/widgetSidebarActions";
import {
  createMessage,
  STEP_EIGHT_SUCCESS_TEXT,
  STEP_EIGHT_TITLE,
  STEP_FIVE_HINT_TEXT,
  STEP_FIVE_SUCCESS_BUTTON_TEXT,
  STEP_FIVE_SUCCESS_TEXT,
  STEP_FIVE_TITLE,
  STEP_FOUR_HINT_BUTTON_TEXT,
  STEP_FOUR_SUCCESS_BUTTON_TEXT,
  STEP_FOUR_SUCCESS_TEXT,
  STEP_FOUR_TITLE,
  STEP_NINE_TITLE,
  STEP_ONE_BUTTON_TEXT,
  STEP_ONE_SUCCESS_TEXT,
  STEP_ONE_TITLE,
  STEP_SEVEN_TITLE,
  STEP_SIX_SUCCESS_BUTTON_TEXT,
  STEP_SIX_SUCCESS_TEXT,
  STEP_SIX_TITLE,
  STEP_THREE_SUCCESS_BUTTON_TEXT,
  STEP_THREE_SUCCESS_TEXT,
  STEP_THREE_TITLE,
  STEP_TWO_TITLE,
} from "@appsmith/constants/messages";
import { ASSETS_CDN_URL } from "constants/ThirdPartyConstants";
import { getAssetUrl } from "@appsmith/utils/airgapHelpers";

export const Classes = {
  GUIDED_TOUR_BORDER: "guided-tour-border",
  GUIDED_TOUR_SHOW_BORDER: "guided-tour-show-border",
  GUIDED_TOUR_INDICATOR: "guided-tour-indicator",
};

export const GuidedTourEntityNames = {
  BUTTON_WIDGET: "UpdateButton",
  NAME_INPUT: "NameInput",
  EMAIL_INPUT: "EmailInput",
  COUNTRY_INPUT: "CountryInput",
  DISPLAY_IMAGE: "DisplayImage",
};

export enum GUIDED_TOUR_STEPS {
  DEFAULT = 0,
  RUN_QUERY = 1,
  SELECT_TABLE_WIDGET = 2,
  TABLE_WIDGET_BINDING = 3,
  NAME_INPUT_BINDING = 4,
  BIND_OTHER_FORM_WIDGETS = 5,
  ADD_BUTTON_WIDGET = 6,
  BUTTON_ONCLICK_BINDING = 7,
  BUTTON_ONSUCCESS_BINDING = 8,
  DEPLOY = 9,
}

// We are using widget blueprints to create the form like container widget
export const onboardingContainerBlueprint = {
  view: [
    {
      type: "CANVAS_WIDGET",
      position: { top: 0, left: 0 },
      props: {
        containerStyle: "none",
        canExtend: false,
        detachFromLayout: true,
        children: [],
        version: 1,
        blueprint: {
          view: [
            {
              type: "TEXT_WIDGET",
              position: {
                left: 1,
                top: 1,
              },
              size: {
                rows: 4,
                cols: 48,
              },
              props: {
                textAlign: "LEFT",
                fontStyle: "BOLD",
                version: 1,
                textColor: "#231F20",
                fontSize: "HEADING2",
                text: "\uD83D\uDC68‍\uD83D\uDCBC Customer Update Form",
              },
            },
            {
              type: "IMAGE_WIDGET",
              position: {
                left: 1,
                top: 6,
              },
              size: {
                rows: 12,
                cols: 16,
              },
              props: {
                imageShape: "RECTANGLE",
                defaultImage: getAssetUrl(
                  `${ASSETS_CDN_URL}/widgets/default.png`,
                ),
                objectFit: "contain",
                image: "{{CustomersTable.selectedRow.image}}",
                dynamicBindingPathList: [{ key: "image" }],
              },
            },
            {
              type: "TEXT_WIDGET",
              position: {
                top: 6,
                left: 19,
              },
              size: {
                rows: 4,
                cols: 8,
              },
              props: {
                text: "Name",
                textAlign: "LEFT",
                fontStyle: "BOLD",
                textColor: "#231F20",
                version: 1,
                fontSize: "PARAGRAPH",
              },
            },
            {
              type: "INPUT_WIDGET_V2",
              position: {
                top: 6,
                left: 30,
              },
              size: {
                rows: 4,
                cols: 32,
              },
              props: {
                inputType: "TEXT",
                label: "",
              },
            },
            {
              type: "TEXT_WIDGET",
              position: {
                top: 10,
                left: 19,
              },
              size: {
                rows: 4,
                cols: 8,
              },
              props: {
                text: "Email",
                textAlign: "LEFT",
                fontStyle: "BOLD",
                textColor: "#231F20",
                version: 1,
                fontSize: "PARAGRAPH",
              },
            },
            {
              type: "INPUT_WIDGET_V2",
              position: {
                top: 10,
                left: 30,
              },
              size: {
                rows: 4,
                cols: 32,
              },
              props: {
                inputType: "TEXT",
                label: "",
              },
            },
            {
              type: "TEXT_WIDGET",
              position: {
                top: 14,
                left: 19,
              },
              size: {
                rows: 4,
                cols: 10,
              },
              props: {
                text: "Country",
                textAlign: "LEFT",
                fontStyle: "BOLD",
                textColor: "#231F20",
                version: 1,
                fontSize: "PARAGRAPH",
              },
            },
            {
              type: "INPUT_WIDGET_V2",
              position: {
                top: 14,
                left: 30,
              },
              size: {
                rows: 4,
                cols: 32,
              },
              props: {
                inputType: "TEXT",
                label: "",
              },
            },
          ],
        },
      },
    },
  ],
};

type Step = {
  title: string;
  description?: string;
  elementSelector?: string;
  hints: {
    text: ReactNode;
    image?: string;
    button?: {
      text: string;
      onClick?: (dispatch: Dispatch<any>) => void;
    };
    steps?: ReactNode[];
  }[];
  success?: {
    text: string;
    onClick?: (dispatch: Dispatch<any>) => void;
    timed?: boolean;
    buttonText?: string;
  };
  info?: {
    icon: IconName;
    text: ReactNode;
    onClick: (dispatch: Dispatch<any>) => void;
    buttonText?: string;
  };
};
type StepsType = Record<number, Step>;

export const Steps: StepsType = {
  [GUIDED_TOUR_STEPS.RUN_QUERY]: {
    title: createMessage(STEP_ONE_TITLE),
    elementSelector: "query-table-response",
    hints: [
      {
        text: (
          <>
            这个命令会拉取 user_data 数据库的前 20 条数据，点击 <b>运行</b>{" "}
            按钮查看响应数据
          </>
        ),
      },
    ],
    success: {
      text: createMessage(STEP_ONE_SUCCESS_TEXT),
      onClick: (dispatch) => {
        dispatch(setExplorerPinnedAction(true));
        dispatch(setCurrentStepInit(GUIDED_TOUR_STEPS.SELECT_TABLE_WIDGET));
        setTimeout(() => {
          showIndicator(`[data-guided-tour-iid='CustomersTable']`, "right", {
            top: 5,
            left: -15,
          });
        }, 1000);
      },
      buttonText: createMessage(STEP_ONE_BUTTON_TEXT),
      timed: true,
    },
  },
  [GUIDED_TOUR_STEPS.SELECT_TABLE_WIDGET]: {
    title: createMessage(STEP_TWO_TITLE),
    hints: [
      {
        text: (
          <>
            在左侧资源管理面板 <b>点击 CustomersTable 组件</b>
          </>
        ),
      },
    ],
  },
  [GUIDED_TOUR_STEPS.TABLE_WIDGET_BINDING]: {
    title: createMessage(STEP_THREE_TITLE),
    hints: [
      {
        text: (
          <>
            在右侧面板 “数据” 配置框中输入{" "}
            <b>
              <code>
                &#123;&#123;
                {"getCustomers.data"}&#125;&#125;
              </code>
            </b>{" "}
            来绑定响应数据
          </>
        ),
        image: TableData,
      },
    ],
    success: {
      text: createMessage(STEP_THREE_SUCCESS_TEXT),
      onClick: (dispatch) => {
        // Stop hiding rest of the properties in the propery pane
        dispatch(forceShowContent(GUIDED_TOUR_STEPS.TABLE_WIDGET_BINDING));
        setTimeout(() => {
          highlightSection("property-pane");
        }, 1000);
      },
      timed: true,
      buttonText: createMessage(STEP_THREE_SUCCESS_BUTTON_TEXT),
    },
    info: {
      icon: "lightbulb-flash-line",
      text: (
        <>
          右侧是 <b>属性配置面板</b>，你可以在那里修改组件的属性、数据和样式
        </>
      ),
      onClick: (dispatch) => {
        dispatch(setCurrentStepInit(GUIDED_TOUR_STEPS.NAME_INPUT_BINDING));
        dispatch(
          addOnboardingWidget({
            type: "CONTAINER_WIDGET",
            widgetName: "CustomersInfo",
            topRow: 7,
            rows: 30,
            columns: 29,
            leftColumn: 35,
            props: {
              blueprint: onboardingContainerBlueprint,
            },
          }),
        );
      },
      buttonText: "好的",
    },
  },
  [GUIDED_TOUR_STEPS.NAME_INPUT_BINDING]: {
    title: createMessage(STEP_FOUR_TITLE),
    hints: [
      {
        text: (
          <>
            接下来，我们会
            <b>把表格的选中行数据展示到一个输入框中</b>
            <br /> 这样可以让我们在更新数据前看到当前值
          </>
        ),
        button: {
          text: createMessage(STEP_FOUR_HINT_BUTTON_TEXT),
          onClick: (dispatch) => {
            // Select the NameInput widget and focus the defaultText input field
            dispatch(focusWidget("NameInput", "defaultText"));
            setTimeout(() => {
              showIndicator(`[data-guided-tour-iid='defaultText']`, "top", {
                top: 20,
                left: 0,
              });
            }, 1000);
          },
        },
      },
      {
        text: (
          <>
            在组件 {GuidedTourEntityNames.NAME_INPUT} 的属性配置面板中，输入{" "}
            <b>
              <code>
                &#123;&#123;CustomersTable.selectedRow.name&#125;&#125;
              </code>
            </b>{" "}
            绑定到 <b>默认值</b> 属性
          </>
        ),
        // Get gif from url
        image: DefaultText,
      },
    ],
    success: {
      text: createMessage(STEP_FOUR_SUCCESS_TEXT),
      timed: true,
      onClick: (dispatch) => {
        dispatch(setCurrentStepInit(GUIDED_TOUR_STEPS.BIND_OTHER_FORM_WIDGETS));
        dispatch(focusWidget("EmailInput", "defaultText"));
        setTimeout(() => {
          showIndicator(`[data-guided-tour-iid='defaultText']`, "top", {
            top: 20,
            left: 0,
          });
        }, 1000);
      },
      buttonText: createMessage(STEP_FOUR_SUCCESS_BUTTON_TEXT),
    },
  },
  [GUIDED_TOUR_STEPS.BIND_OTHER_FORM_WIDGETS]: {
    title: createMessage(STEP_FIVE_TITLE),
    hints: [
      {
        text: <>{createMessage(STEP_FIVE_HINT_TEXT)}</>,
        steps: [
          <>
            绑定 <b>{GuidedTourEntityNames.EMAIL_INPUT}</b>
            的默认值为{" "}
            <code>
              &#123;&#123;CustomersTable.selectedRow.email&#125;&#125;
            </code>
          </>,
          <>
            绑定 <b>{GuidedTourEntityNames.COUNTRY_INPUT}</b>
            的默认值为{" "}
            <code>
              &#123;&#123;CustomersTable.selectedRow.country&#125;&#125;
            </code>
          </>,
        ],
      },
    ],
    success: {
      text: createMessage(STEP_FIVE_SUCCESS_TEXT),
      onClick: (dispatch) => {
        dispatch(setCurrentStepInit(GUIDED_TOUR_STEPS.ADD_BUTTON_WIDGET));
        dispatch(setExplorerPinnedAction(true));
        dispatch(forceOpenWidgetPanel(true));
        setTimeout(() => {
          highlightSection("widget-card-buttonwidget");
        }, 2000);
      },
      timed: true,
      buttonText: createMessage(STEP_FIVE_SUCCESS_BUTTON_TEXT),
    },
  },
  [GUIDED_TOUR_STEPS.ADD_BUTTON_WIDGET]: {
    title: createMessage(STEP_SIX_TITLE),
    hints: [
      {
        text: (
          <>
            切换到添加组件面板 <b>拖拽</b> 一个
            <b>按钮</b> 组件到右边容器中图片组件的下方
          </>
        ),
      },
    ],
    success: {
      text: createMessage(STEP_SIX_SUCCESS_TEXT),
      timed: true,
      onClick: (dispatch) => {
        dispatch(forceOpenWidgetPanel(false));
        setTimeout(() => {
          highlightSection("explorer-entity-updateCustomerInfo");
        }, 1000);
      },
      buttonText: createMessage(STEP_SIX_SUCCESS_BUTTON_TEXT),
    },
    info: {
      icon: "lightbulb-flash-line",
      text: (
        <>
          为了用这个按钮 <b>更新用户数据</b>，我们为你创建了一个名为{" "}
          <b>updateCustomerInfo</b> 的查询供你使用
        </>
      ),
      onClick: (dispatch) => {
        dispatch(focusWidget(GuidedTourEntityNames.BUTTON_WIDGET));
        dispatch(setCurrentStepInit(GUIDED_TOUR_STEPS.BUTTON_ONCLICK_BINDING));
        requestAnimationFrame(() => {
          showIndicator(`[data-guided-tour-iid='onClick']`, "top", {
            top: 25,
            left: 0,
          });
        });
      },
    },
  },
  [GUIDED_TOUR_STEPS.BUTTON_ONCLICK_BINDING]: {
    title: createMessage(STEP_SEVEN_TITLE),
    hints: [
      {
        text: (
          <>
<<<<<<< HEAD
            选中按钮在右侧查看它的属性配置，点击 onClick 的下拉框，选择{" "}
            <b>执行查询</b>，然后选择 <b>updateCustomerInfo</b>
=======
            Select the button widget to see the properties in the property pane.
            Click the <b>+</b> button beside the onClick property to add an
            action, select <b>Execute a query</b> {"&"} then select{" "}
            <b>updateCustomerInfo</b> query
<<<<<<< HEAD
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
=======
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
          </>
        ),
      },
    ],
  },
  [GUIDED_TOUR_STEPS.BUTTON_ONSUCCESS_BINDING]: {
    title: createMessage(STEP_EIGHT_TITLE),
    hints: [
      {
        text: (
          <>
<<<<<<< HEAD
<<<<<<< HEAD
            点击 onSuccess 下拉框，选择 <b>执行查询</b>，然后选择{" "}
            <b>getCustomers</b>
=======
            Click the <b>+</b> button beside On success, select{" "}
            <b>Execute a query</b> {"&"} then choose <b>getCustomers</b> Query
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
=======
            Click the <b>+</b> button beside On success, select{" "}
            <b>Execute a query</b> {"&"} then choose <b>getCustomers</b> Query
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
          </>
        ),
      },
    ],
    success: {
      text: createMessage(STEP_EIGHT_SUCCESS_TEXT),
      onClick: (dispatch) => {
        dispatch(setCurrentStepInit(GUIDED_TOUR_STEPS.DEPLOY));
        setTimeout(() => {
          showIndicator(`[data-guided-tour-iid='deploy']`, "bottom", {
            top: -6,
            left: 0,
          });
        }, 1000);
      },
      timed: true,
    },
  },
  [GUIDED_TOUR_STEPS.DEPLOY]: {
    title: createMessage(STEP_NINE_TITLE),
    hints: [
      {
        text: (
          <>
            测试你的应用，看看有没有错误，一切准备好之后，点击 <b>发布</b>{" "}
            按钮发布你的应用
          </>
        ),
      },
    ],
  },
};
