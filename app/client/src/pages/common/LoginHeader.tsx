import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCurrentUser } from "selectors/usersSelectors";
import styled from "styled-components";
import StyledHeader from "components/designSystems/appsmith/StyledHeader";
import { AppState } from "reducers";
import { BASE_URL } from "constants/routes";
import { Colors } from "constants/Colors";
import LogoImage from "assets/images/pageplug_logo_black.svg";

const StyledPageHeader = styled(StyledHeader)`
  width: 100%;
  height: 48px;
  background: ${Colors.MINT_GREEN};
  display: flex;
  justify-content: center;
  box-shadow: ${(props) => props.theme.colors.header.boxShadow};
  padding: 0px ${(props) => props.theme.spaces[12]}px;
`;

const LogoContainer = styled.div`
  .logoimg {
    height: 32px;
  }
`;

export function LoginHeader() {
  return (
    <StyledPageHeader data-testid="t--appsmith-login-header">
      <LogoContainer>
        <Link to={BASE_URL}>
          <img
            alt="PagePlug Logo"
            className="logoimg t--Appsmith-logo-image"
            src={LogoImage}
          />
        </Link>
      </LogoContainer>
    </StyledPageHeader>
  );
}

const mapStateToProps = (state: AppState) => ({
  user: getCurrentUser(state),
});

export default connect(mapStateToProps)(LoginHeader);
