import React, { useCallback, useEffect, useState, lazy, Suspense, useMemo } from "react";
import styled, { ThemeProvider } from "styled-components";
import classNames from "classnames";
import type { ApplicationPayload } from "@appsmith/constants/ReduxActionConstants";
import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import { APPLICATIONS_URL } from "constants/routes";
import AppInviteUsersForm from "pages/workspace/AppInviteUsersForm";
import AnalyticsUtil from "utils/AnalyticsUtil";
import PagePlugLogo from "assets/images/pageplug_icon_mint.svg";
import { Link } from "react-router-dom";
import type { AppState } from "@appsmith/reducers";
import {
  getCurrentApplicationId,
  getCurrentPageId,
  getIsPublishingApplication,
  previewModeSelector,
} from "selectors/editorSelectors";
import {
  getAllUsers,
  getCurrentWorkspaceId,
} from "@appsmith/selectors/workspaceSelectors";
import { useDispatch, useSelector } from "react-redux";
import DeployLinkButtonDialog from "components/designSystems/appsmith/header/DeployLinkButton";
import {
  publishApplication,
  updateApplication,
} from "@appsmith/actions/applicationActions";
import {
  getApplicationList,
  getIsSavingAppName,
  getIsErroredSavingAppName,
  getCurrentApplication,
} from "@appsmith/selectors/applicationSelectors";
import EditorAppName from "./EditorAppName";
import { getCurrentUser } from "selectors/usersSelectors";
import {
  EditInteractionKind,
  SavingState,
  getTypographyByKey,
} from "design-system-old";
import {
  Button,
  Icon,
  Tooltip,
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  Tabs,
  TabsList,
  Tab,
  TabPanel,
} from "design-system";
import { Profile } from "pages/common/ProfileImage";
import HelpBar from "components/editorComponents/GlobalSearch/HelpBar";
import { getTheme, ThemeMode } from "selectors/themeSelectors";
import ToggleModeButton from "pages/Editor/ToggleModeButton";
import { snipingModeSelector } from "selectors/editorSelectors";
import { showConnectGitModal } from "actions/gitSyncActions";
import RealtimeAppEditors from "./RealtimeAppEditors";
import { EditorSaveIndicator } from "./EditorSaveIndicator";
import { datasourceEnvEnabled } from "@appsmith/selectors/featureFlagsSelectors";
import { retryPromise } from "utils/AppsmithUtils";
import { fetchUsersForWorkspace } from "@appsmith/actions/workspaceActions";

import { getIsGitConnected } from "selectors/gitSyncSelectors";
import { IconWrapper } from "design-system-old";
import {
  CLOSE_ENTITY_EXPLORER_MESSAGE,
  createMessage,
  DEPLOY_BUTTON_TOOLTIP,
  DEPLOY_MENU_OPTION,
  EDITOR_HEADER,
  INVITE_TAB,
  INVITE_USERS_PLACEHOLDER,
  IN_APP_EMBED_SETTING,
  LOCK_ENTITY_EXPLORER_MESSAGE,
  LOGO_TOOLTIP,
  RENAME_APPLICATION_TOOLTIP,
  SHARE_BUTTON_TOOLTIP,
  SHARE_BUTTON_TOOLTIP_WITH_USER,
  EDITOR_HEADER_SAVE_INDICATOR,
} from "@appsmith/constants/messages";
import { getExplorerPinned } from "selectors/explorerSelector";
import {
  setExplorerActiveAction,
  setExplorerPinnedAction,
} from "actions/explorerActions";
import { modText } from "utils/helpers";
import Boxed from "./GuidedTour/Boxed";
import EndTour from "./GuidedTour/EndTour";
import { GUIDED_TOUR_STEPS } from "./GuidedTour/constants";
import { viewerURL } from "RouteBuilder";
import { useHref } from "./utils";
import EmbedSnippetForm from "@appsmith/pages/Applications/EmbedSnippetTab";
import { getAppsmithConfigs } from "@appsmith/configs";
import moment from "moment/moment";
import { getIsAppSettingsPaneWithNavigationTabOpen } from "selectors/appSettingsPaneSelectors";
import type { NavigationSetting } from "constants/AppConstants";
import { getUserPreferenceFromStorage } from "@appsmith/utils/Environments";
import { showEnvironmentDeployInfoModal } from "@appsmith/actions/environmentAction";
import { getIsFirstTimeUserOnboardingEnabled } from "selectors/onboardingSelectors";

const { cloudHosting } = getAppsmithConfigs();

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: var(--ads-v2-color-bg);
  flex-direction: row;
  box-shadow: none;
  border-bottom: 1px solid var(--ads-v2-color-border);
  height: ${(props) => props.theme.smallHeaderHeight};
  & .editable-application-name {
    ${getTypographyByKey("h4")}
    color: ${(props) => props.theme.colors.header.appName};
  }

  & .header__application-share-btn {
    background-color: ${(props) => props.theme.colors.header.background};
    border-color: ${(props) => props.theme.colors.header.background};
    color: ${(props) => props.theme.colors.header.shareBtn};
    ${IconWrapper} path {
      fill: ${(props) => props.theme.colors.header.shareBtn};
    }
  }

  & .header__application-share-btn:hover {
    color: ${(props) => props.theme.colors.header.shareBtnHighlight};
    ${IconWrapper} path {
      fill: ${(props) => props.theme.colors.header.shareBtnHighlight};
    }
  }

  & ${Profile} {
    width: 24px;
    height: 24px;
  }

  & .t--save-status-container .header-status-icon {
    vertical-align: -6px;
  }

  @media only screen and (max-width: 900px) {
    & .help-bar {
      display: none;
    }
  }

  @media only screen and (max-width: 700px) {
    & .app-realtime-editors {
      display: none;
    }
  }
`;

const HeaderSection = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  overflow: visible;
  align-items: center;
  :nth-child(1) {
    justify-content: flex-start;
    max-width: 30%;
  }
  :nth-child(2) {
    justify-content: center;
  }
  :nth-child(3) {
    justify-content: flex-end;
  }
`;

const PagePlugLogoImg = styled.img`
  margin-right: ${(props) => props.theme.spaces[6]}px;
  height: 28px;
`;

const AppsmithLink = styled((props) => {
  // we are removing non input related props before passing them in the components
  // eslint-disable @typescript-eslint/no-unused-vars
  return <Link {...props} />;
})`
  height: 24px;
  min-width: 24px;
  width: 24px;
  display: inline-block;
  img {
    min-width: 24px;
    width: 24px;
    height: 24px;
  }
`;

const BindingBanner = styled.div`
  position: fixed;
  width: 199px;
  height: 36px;
  left: 50%;
  top: ${(props) => props.theme.smallHeaderHeight};
  transform: translate(-50%, 0);
  text-align: center;
  background: var(--ads-v2-color-fg-information);
  color: var(--ads-v2-color-white);
  border-radius: var(--ads-v2-border-radius);
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  /* Depth: 01 */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--ads-v2-shadow-popovers);
  z-index: 9999;
`;

const SidebarNavButton = styled(Button)`
  .ads-v2-button__content {
    padding: 0;
  }
  .group {
    height: 36px;
    width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const GlobalSearch = lazy(() => {
  return retryPromise(
    () =>
      import(
        /* webpackChunkName: "global-search" */ "components/editorComponents/GlobalSearch"
      ),
  );
});

const theme = getTheme(ThemeMode.LIGHT);

export function EditorHeader() {
  const [activeTab, setActiveTab] = useState("invite");
  const dispatch = useDispatch();
  const isSnipingMode = useSelector(snipingModeSelector);
  const isSavingName = useSelector(getIsSavingAppName);
  const pinned = useSelector(getExplorerPinned);
  const isGitConnected = useSelector(getIsGitConnected);
  const isErroredSavingName = useSelector(getIsErroredSavingAppName);
  const applicationList = useSelector(getApplicationList);
  const isPreviewMode = useSelector(previewModeSelector);
  const signpostingEnabled = useSelector(getIsFirstTimeUserOnboardingEnabled);
  const workspaceId = useSelector(getCurrentWorkspaceId);
  const applicationId = useSelector(getCurrentApplicationId);
  const currentApplication = useSelector(getCurrentApplication);
  const isPublishing = useSelector(getIsPublishingApplication);
  const pageId = useSelector(getCurrentPageId) as string;
  const sharedUserList = useSelector(getAllUsers);
  const currentUser = useSelector(getCurrentUser);

  const deployLink = useHref(viewerURL, { pageId });

  const lastUpdatedTime = useSelector(
    (state: AppState) => state.ui.editor.lastUpdatedTime,
  );
  const isAppSettingsPaneWithNavigationTabOpen = useSelector(
    getIsAppSettingsPaneWithNavigationTabOpen,
  );
  const isPreviewingApp =
    isPreviewMode || isAppSettingsPaneWithNavigationTabOpen;

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const dsEnvEnabled = useSelector(datasourceEnvEnabled);

  const handlePublish = () => {
    if (applicationId) {
      dispatch(publishApplication(applicationId));

      const appName = currentApplication ? currentApplication.name : "";
      const pageCount = currentApplication?.pages?.length;
      const navigationSettingsWithPrefix: Record<
        string,
        NavigationSetting[keyof NavigationSetting]
      > = {};

      if (currentApplication?.applicationDetail?.navigationSetting) {
        const settingKeys = Object.keys(
          currentApplication.applicationDetail.navigationSetting,
        ) as Array<keyof NavigationSetting>;

        settingKeys.map((key: keyof NavigationSetting) => {
          if (currentApplication?.applicationDetail?.navigationSetting?.[key]) {
            const value: NavigationSetting[keyof NavigationSetting] =
              currentApplication.applicationDetail.navigationSetting[key];

            navigationSettingsWithPrefix[`navigationSetting_${key}`] = value;
          }
        });
      }

      AnalyticsUtil.logEvent("PUBLISH_APP", {
        appId: applicationId,
        appName,
        pageCount,
        ...navigationSettingsWithPrefix,
        isPublic: !!currentApplication?.isPublic,
      });
    }
  };

  const updateApplicationDispatch = (
    id: string,
    data: { name: string; currentApp: boolean },
  ) => {
    dispatch(updateApplication(id, data));
  };

  const handleClickDeploy = useCallback(
    (fromDeploy?: boolean) => {
      if (isGitConnected) {
        dispatch(showConnectGitModal());
        AnalyticsUtil.logEvent("GS_DEPLOY_GIT_CLICK", {
          source: fromDeploy
            ? "Deploy button"
            : "Application name menu (top left)",
        });
      } else {
        if (!dsEnvEnabled || getUserPreferenceFromStorage() === "true") {
          handlePublish();
        } else {
          dispatch(showEnvironmentDeployInfoModal());
        }
      }
    },
    [dispatch, handlePublish],
  );

  /**
   * on hovering the menu, make the explorer active
   */
  const onMenuHover = useCallback(() => {
    dispatch(setExplorerActiveAction(true));
  }, [setExplorerActiveAction]);

  /**
   * toggles the pinned state of sidebar
   */
  const onPin = useCallback(() => {
    dispatch(setExplorerPinnedAction(!pinned));
  }, [pinned, dispatch, setExplorerPinnedAction]);

  //Fetch all users for the application to show the share button tooltip
  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchUsersForWorkspace(workspaceId));
    }
  }, [workspaceId]);
  const filteredSharedUserList = sharedUserList.filter(
    (user) => user.username !== currentUser?.username,
  );

  // const tabs = useMemo(() => {
  //   return [
  //     {
  //       key: "INVITE",
  //       title: createMessage(INVITE_TAB),
  //       component: AppInviteUsersForm,
  //     },
  //     {
  //       key: "EMBED",
  //       title: createMessage(IN_APP_EMBED_SETTING.embed),
  //       component: EmbedSnippetForm,
  //       customProps: {
  //         changeTabIndex: 0,
  //       },
  //     },
  //   ];
  // }, []);

  // if (inCloudOS) {
  //   const savedMessage = createMessage(EDITOR_HEADER_SAVE_INDICATOR);
  //   const savedTime = lastUpdatedTime
  //     ? `${savedMessage} ${moment(lastUpdatedTime * 1000).fromNow()}`
  //     : savedMessage;
  //   return (
  //     <ThemeProvider theme={theme}>
  //       <HeaderWrapper className="pr-3">
  //         <HeaderSection className="space-x-3">
  //           <HamburgerContainer
  //             className={classNames({
  //               "relative flex items-center justify-center p-0 text-gray-800 transition-all transform duration-400":
  //                 true,
  //               "-translate-x-full opacity-0": isPreviewMode,
  //               "translate-x-0 opacity-100": !isPreviewMode,
  //             })}
  //           >
  //             <TooltipComponent
  //               content={
  //                 <div className="flex items-center justify-between">
  //                   <span>
  //                     {!pinned
  //                       ? createMessage(LOCK_ENTITY_EXPLORER_MESSAGE)
  //                       : createMessage(CLOSE_ENTITY_EXPLORER_MESSAGE)}
  //                   </span>
  //                   <span className="ml-4 text-xs text-gray-300">
  //                     {modText()} /
  //                   </span>
  //                 </div>
  //               }
  //               position="bottom-left"
  //             >
  //               <div
  //                 className="relative w-4 h-4 text-trueGray-600 group t--pin-entity-explorer"
  //                 onMouseEnter={onMenuHover}
  //               >
  //                 <MenuIcon className="absolute w-4 h-4 transition-opacity cursor-pointer fill-current group-hover:opacity-0" />
  //                 {!pinned && (
  //                   <UnpinIcon
  //                     className="absolute w-4 h-4 transition-opacity opacity-0 cursor-pointer fill-current group-hover:opacity-100"
  //                     onClick={onPin}
  //                   />
  //                 )}
  //                 {pinned && (
  //                   <PinIcon
  //                     className="absolute w-4 h-4 transition-opacity opacity-0 cursor-pointer fill-current group-hover:opacity-100"
  //                     onClick={onPin}
  //                   />
  //                 )}
  //               </div>
  //             </TooltipComponent>
  //           </HamburgerContainer>
  //           <ToggleModeButton showSelectedMode={!isPopoverOpen} />
  //         </HeaderSection>
  //         <HeaderSection
  //           className={classNames({
  //             "-translate-y-full opacity-0": isPreviewMode,
  //             "translate-y-0 opacity-100": !isPreviewMode,
  //             "transition-all transform duration-400": true,
  //           })}
  //         />
  //         <HeaderSection className="space-x-3">
  //           <EditorSaveIndicator />
  //           <span style={{ color: "#8a8a8a" }}>{savedTime}</span>
  //           {/* <StyledDeployButton
  //             className="t--application-publish-btn"
  //             isLoading={isPublishing}
  //             onClick={handlePublish}
  //             size={Size.small}
  //             text={"提交"}
  //             style={{ padding: "6px 20px" }}
  //           /> */}
  //         </HeaderSection>
  //       </HeaderWrapper>
  //     </ThemeProvider>
  //   );
  // }

  return (
    <ThemeProvider theme={theme}>
      <HeaderWrapper
        className="pl-1 pr-1 overflow-hidden"
        data-testid="t--appsmith-editor-header"
      >
        {/* 左侧 */}
        <HeaderSection className="space-x-2">
          {!signpostingEnabled && (
            <Tooltip
              content={
                <div className="flex items-center justify-between">
                  <span>
                    {!pinned
                      ? createMessage(LOCK_ENTITY_EXPLORER_MESSAGE)
                      : createMessage(CLOSE_ENTITY_EXPLORER_MESSAGE)}
                  </span>
                  <span className="ml-4">{modText()} /</span>
                </div>
              }
              placement="bottomLeft"
            >
              <SidebarNavButton
                className={classNames({
                  "transition-all transform duration-400": true,
                  "-translate-x-full opacity-0": isPreviewingApp,
                  "translate-x-0 opacity-100": !isPreviewingApp,
                })}
                data-testid="sidebar-nav-button"
                kind="tertiary"
                onClick={onPin}
                size="md"
              >
                <div
                  className="t--pin-entity-explorer group relative"
                  onMouseEnter={onMenuHover}
                >
                  <Icon
                    className="absolute transition-opacity group-hover:opacity-0"
                    name="hamburger"
                    size="md"
                  />
                  {pinned && (
                    <Icon
                      className="absolute transition-opacity opacity-0 group-hover:opacity-100"
                      name="menu-fold"
                      onClick={onPin}
                      size="md"
                    />
                  )}
                  {!pinned && (
                    <Icon
                      className="absolute transition-opacity opacity-0 group-hover:opacity-100"
                      name="menu-unfold"
                      onClick={onPin}
                      size="md"
                    />
                  )}
                </div>
              </SidebarNavButton>
            </Tooltip>
          )}

          <Tooltip content={createMessage(LOGO_TOOLTIP)} placement="bottomLeft">
            <AppsmithLink to={APPLICATIONS_URL}>
              <PagePlugLogoImg
                alt="PagePlug logo"
                className="t--appsmith-logo"
                src={PagePlugLogo}
              />
            </AppsmithLink>
          </Tooltip>

          <Tooltip
            content={createMessage(RENAME_APPLICATION_TOOLTIP)}
            isDisabled={isPopoverOpen}
            placement="bottom"
          >
            <div>
              <EditorAppName
                applicationId={applicationId}
                className="t--application-name editable-application-name max-w-48"
                defaultSavingState={
                  isSavingName ? SavingState.STARTED : SavingState.NOT_STARTED
                }
                defaultValue={currentApplication?.name || ""}
                editInteractionKind={EditInteractionKind.SINGLE}
                fill
                isError={isErroredSavingName}
                isNewApp={
                  applicationList.filter((el) => el.id === applicationId)
                    .length > 0
                }
                isPopoverOpen={isPopoverOpen}
                onBlur={(value: string) =>
                  updateApplicationDispatch(applicationId || "", {
                    name: value,
                    currentApp: true,
                  })
                }
                setIsPopoverOpen={setIsPopoverOpen}
              />
            </div>
          </Tooltip>
          <EditorSaveIndicator />
        </HeaderSection>
        {/* 中间-全局搜索*/}
        <HeaderSection
          className={classNames({
            "-translate-y-full opacity-0": isPreviewMode,
            "translate-y-0 opacity-100": !isPreviewMode,
            "transition-all transform duration-400": true,
            "help-bar": "true",
          })}
        >
          <HelpBar />
        </HeaderSection>
        {/* 右侧 */}
        <HeaderSection className="gap-x-1">
          <Boxed
            alternative={<EndTour />}
            step={GUIDED_TOUR_STEPS.BUTTON_ONSUCCESS_BINDING}
          >
            <RealtimeAppEditors applicationId={applicationId} />
            <ToggleModeButton />
            {applicationId && (
              <Tooltip
                content={
                  filteredSharedUserList.length
                    ? createMessage(
                        SHARE_BUTTON_TOOLTIP_WITH_USER(
                          filteredSharedUserList.length,
                        ),
                      )
                    : createMessage(SHARE_BUTTON_TOOLTIP)
                }
                placement="bottom"
              >
                <Button
                  className="t--application-share-btn"
                  kind="tertiary"
                  onClick={() => setShowModal(true)}
                  size="md"
                  startIcon="share-line"
                >
                  {createMessage(EDITOR_HEADER.share)}
                </Button>
              </Tooltip>
            )}
            <Modal
              onOpenChange={(isOpen) => setShowModal(isOpen)}
              open={showModal}
            >
              <ModalContent style={{ width: "640px" }}>
                <ModalHeader>应用分享</ModalHeader>
                <ModalBody>
                  <Tabs
                    onValueChange={(value) => setActiveTab(value)}
                    value={activeTab}
                  >
                    <TabsList>
                      <Tab data-testid="t--tab-INVITE" value="invite">
                        {createMessage(INVITE_TAB)}
                      </Tab>
                      <Tab data-tesid="t--tab-EMBED" value="embed">
                        {createMessage(IN_APP_EMBED_SETTING.embed)}
                      </Tab>
                    </TabsList>
                    <TabPanel value="invite">
                      <AppInviteUsersForm
                        applicationId={applicationId}
                        placeholder={createMessage(
                          INVITE_USERS_PLACEHOLDER,
                          cloudHosting,
                        )}
                        workspaceId={workspaceId}
                      />
                    </TabPanel>
                    <TabPanel value="embed">
                      <EmbedSnippetForm
                        changeTab={() => setActiveTab("invite")}
                      />
                    </TabPanel>
                  </Tabs>
                </ModalBody>
              </ModalContent>
            </Modal>
            <div className="flex items-center">
              <Tooltip
                content={createMessage(DEPLOY_BUTTON_TOOLTIP)}
                placement="bottomRight"
              >
                <Button
                  className="t--application-publish-btn"
                  data-guided-tour-iid="deploy"
                  isLoading={isPublishing}
                  kind="tertiary"
                  onClick={() => handleClickDeploy(true)}
                  size="md"
                  startIcon={"rocket"}
                >
                  {DEPLOY_MENU_OPTION()}
                </Button>
              </Tooltip>

              <DeployLinkButtonDialog link={deployLink} trigger="" />
            </div>
          </Boxed>
        </HeaderSection>
        <Suspense fallback={<span />}>
          <GlobalSearch />
        </Suspense>
        {isSnipingMode && (
          <BindingBanner className="t--sniping-mode-banner">
            选择一个组件绑定
          </BindingBanner>
        )}
      </HeaderWrapper>
    </ThemeProvider>
  );
}

export default EditorHeader;
