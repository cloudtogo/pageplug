import { createSelector } from "reselect";
import { AppState } from "reducers";
import {
  ApplicationsReduxState,
  creatingApplicationMap,
} from "reducers/uiReducers/applicationsReducer";
import { ApplicationPayload } from "@appsmith/constants/ReduxActionConstants";
import { GitApplicationMetadata } from "api/ApplicationApi";

const getApplicationsState = (state: AppState) => state.ui.applications;
export const getCurrentApplication = (
  state: AppState
): ApplicationPayload | undefined => {
  return state.ui.applications.currentApplication;
};
export const getApplicationSearchKeyword = (state: AppState) =>
  state.ui.applications.searchKeyword;
export const getAppMode = (state: AppState) => state.entities.app.mode;
export const getIsDeletingApplication = (state: AppState) =>
  state.ui.applications.deletingApplication;
export const getIsDuplicatingApplication = (state: AppState) =>
  state.ui.applications.duplicatingApplication;
export const getIsSavingAppName = (state: AppState) =>
  state.ui.applications.isSavingAppName;
export const getIsErroredSavingAppName = (state: AppState) =>
  state.ui.applications.isErrorSavingAppName;
export const getUserApplicationsOrgs = (state: AppState) => {
  return state.ui.applications.userOrgs;
};

export const getImportedCollections = (state: AppState) =>
  state.ui.importedCollections.importedCollections;

export const getProviders = (state: AppState) => state.ui.providers.providers;
export const getProvidersLoadingState = (state: AppState) =>
  state.ui.providers.isFetchingProviders;
export const getProviderTemplates = (state: AppState) =>
  state.ui.providers.providerTemplates;
export const getProvidersTemplatesLoadingState = (state: AppState) =>
  state.ui.providers.isFetchingProviderTemplates;

export const getIsFetchingApplications = createSelector(
  getApplicationsState,
  (applications: ApplicationsReduxState): boolean =>
    applications.isFetchingApplications
);

export const getIsCreatingApplication = createSelector(
  getApplicationsState,
  (applications: ApplicationsReduxState): creatingApplicationMap =>
    applications.creatingApplication
);

export const getCreateApplicationError = createSelector(
  getApplicationsState,
  (applications: ApplicationsReduxState): string | undefined =>
    applications.createApplicationError
);

export const getIsDeletingApplications = createSelector(
  getApplicationsState,
  (applications: ApplicationsReduxState): boolean =>
    applications.deletingApplication
);

export const getCurrentAppGitMetaData = createSelector(
  getCurrentApplication,
  (currentApplication): GitApplicationMetadata | undefined =>
    currentApplication?.gitApplicationMetadata
);

export const getIsSavingOrgInfo = (state: AppState) =>
  state.ui.applications.isSavingOrgInfo;

export const showAppInviteUsersDialogSelector = (state: AppState) =>
  state.ui.applications.showAppInviteUsersDialog;

export const getIsDatasourceConfigForImportFetched = (state: AppState) =>
  state.ui.applications.isDatasourceConfigForImportFetched;

export const getIsImportingApplication = (state: AppState) =>
  state.ui.applications.importingApplication;

export const getOrganizationIdForImport = (state: AppState) =>
  state.ui.applications.organizationIdForImport;

export const getImportedApplication = (state: AppState) =>
  state.ui.applications.importedApplication;
