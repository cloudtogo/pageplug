import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { getCurrentUser, selectFeatureFlags } from "selectors/usersSelectors";
import styled from "styled-components";
import StyledHeader from "components/designSystems/appsmith/StyledHeader";
import LogoImage from "assets/images/pageplug_logo_black.svg";
import { AppState } from "reducers";
import { User, ANONYMOUS_USERNAME } from "constants/userConstants";
import {
  AUTH_LOGIN_URL,
  APPLICATIONS_URL,
  matchApplicationPath,
  matchTemplatesPath,
  TEMPLATES_PATH,
  TEMPLATES_ID_PATH,
  matchTemplatesIdPath,
} from "constants/routes";
import history from "utils/history";
import Button from "components/editorComponents/Button";
import ProfileDropdown from "./ProfileDropdown";
import { Colors } from "constants/Colors";
import { useIsMobileDevice } from "utils/hooks/useDeviceDetect";
import { ReactComponent as TwoLineHamburger } from "assets/icons/ads/two-line-hamburger.svg";
import MobileSideBar from "./MobileSidebar";
import { Indices } from "constants/Layers";
import Icon, { IconSize } from "components/ads/Icon";
import { TemplatesTabItem } from "pages/Templates/TemplatesTabItem";
import { getTemplateNotificationSeenAction } from "actions/templateActions";

const StyledPageHeader = styled(StyledHeader)`
  justify-content: normal;
  background: white;
  height: 48px;
  color: white;
  position: fixed;
  top: 0;
  z-index: 9;
  box-shadow: ${(props) => props.theme.colors.header.boxShadow};
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;

  .t--appsmith-logo {
    svg {
      max-width: 110px;
      width: 110px;
    }
  }
`;

const StyledDropDownContainer = styled.div``;

const PagePlugLogoImg = styled.img`
  height: 32px;
`;

const StyledTwoLineHamburger = styled(TwoLineHamburger)`
  fill: ${Colors.BLACK};
  width: 22px;
  height: 22px;
  cursor: pointer;
`;

const Tabs = styled.div`
  display: flex;
  font-size: 16px;
  line-height: 24px;
  box-sizing: border-box;
  margin-left: ${(props) => props.theme.spaces[16]}px;
  height: 100%;
  gap: ${(props) => `${props.theme.spaces[0]}px ${props.theme.spaces[12]}px`};
  flex: 1;
  padding-top: ${(props) => props.theme.spaces[1]}px;
`;
const TabName = styled.div<{ isSelected: boolean }>`
  color: ${Colors.GRAY};
  border-bottom: 2px solid transparent;
  text-align: center;
  display: flex;
  align-items: center;
  ${(props) =>
    props.isSelected &&
    `border-bottom: 2px solid ${Colors.MINT_GREEN};
  color: ${Colors.COD_GRAY};`}
  cursor: pointer;
`;

type PageHeaderProps = {
  user?: User;
  hideShadow?: boolean;
  showSeparator?: boolean;
};

export function PageHeader(props: PageHeaderProps) {
  const { user } = props;
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const isMobile = useIsMobileDevice();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  let loginUrl = AUTH_LOGIN_URL;
  if (queryParams.has("redirectUrl")) {
    loginUrl += `?redirectUrl
    =${queryParams.get("redirectUrl")}`;
  }

  const featureFlags = useSelector(selectFeatureFlags);

  useEffect(() => {
    dispatch(getTemplateNotificationSeenAction());
  }, []);

  const tabs = [
    {
      title: "应用",
      path: APPLICATIONS_URL,
      matcher: matchApplicationPath,
    },
    {
      title: "模板",
      path: TEMPLATES_PATH,
      matcher: matchTemplatesPath,
    },
    {
      title: "模板 id",
      path: TEMPLATES_ID_PATH,
      matcher: matchTemplatesIdPath,
    },
  ];

  const showTabs = useMemo(() => {
    return tabs.some((tab) => tab.matcher(location.pathname));
  }, [featureFlags, location.pathname]);

  return (
    <StyledPageHeader
      data-testid="t--appsmith-page-header"
      hideShadow={props.hideShadow || false}
      isMobile={isMobile}
      showSeparator={props.showSeparator || false}
      showingTabs={showTabs}
    >
      <HeaderSection>
        <Link className="t--appsmith-logo" to={APPLICATIONS_URL}>
          <PagePlugLogoImg alt="Appsmith logo" src={LogoImage} />
        </Link>
      </HeaderSection>

      <Tabs>
        {showTabs && !isMobile && (
          <>
            <TabName
              isSelected={matchApplicationPath(location.pathname)}
              onClick={() => history.push(APPLICATIONS_URL)}
            >
              <div>应用</div>
            </TabName>
            <TemplatesTabItem>
              <TabName
                className="t--templates-tab"
                isSelected={
                  matchTemplatesPath(location.pathname) ||
                  matchTemplatesIdPath(location.pathname)
                }
                onClick={() => history.push(TEMPLATES_PATH)}
              >
                <div>模板</div>
              </TabName>
            </TemplatesTabItem>
          </>
        )}
      </Tabs>

      {user && !isMobile && (
        <StyledDropDownContainer>
          {user.username === ANONYMOUS_USERNAME ? (
            <Button
              filled
              intent={"primary"}
              onClick={() => history.push(loginUrl)}
              size="small"
              text="登录"
            />
          ) : (
            <ProfileDropdown
              name={user.name}
              photoId={user?.photoId}
              userName={user.username}
            />
          )}
        </StyledDropDownContainer>
      )}
      {isMobile && !isMobileSidebarOpen && (
        <StyledTwoLineHamburger onClick={() => setIsMobileSidebarOpen(true)} />
      )}
      {isMobile && isMobileSidebarOpen && (
        <Icon
          fillColor={Colors.CRUSTA}
          name="close-x"
          onClick={() => setIsMobileSidebarOpen(false)}
          size={IconSize.XXXXL}
        />
      )}
      {isMobile && user && (
        <MobileSideBar
          isOpen={isMobileSidebarOpen}
          name={user.name}
          userName={user.username}
        />
      )}
    </StyledPageHeader>
  );
}

const mapStateToProps = (state: AppState) => ({
  user: getCurrentUser(state),
  hideShadow: state.ui.theme.hideHeaderShadow,
  showSeparator: state.ui.theme.showHeaderSeparator,
});

export default connect(mapStateToProps)(PageHeader);
