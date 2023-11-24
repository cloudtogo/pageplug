import type { ApplicationPayload } from "@appsmith/constants/ReduxActionConstants";
import {
  CHANGES_SINCE_LAST_DEPLOYMENT,
  createMessage,
} from "@appsmith/constants/messages";

export const getIsStartingWithRemoteBranches = (
  local: string,
  remote: string,
) => {
  const remotePrefix = "origin/";

  return (
    local &&
    !local.startsWith(remotePrefix) &&
    remote &&
    remote.startsWith(remotePrefix)
  );
};

const GIT_REMOTE_URL_PATTERN =
  /^((git|ssh)|(git@[\w\-\.]+))(:(\/\/)?)([\w\.@\:\/\-~\(\)]+)[^\/]$/im;

const gitRemoteUrlRegExp = new RegExp(GIT_REMOTE_URL_PATTERN);

/**
 * isValidGitRemoteUrl: returns true if a url follows valid SSH/git url scheme, see GIT_REMOTE_URL_PATTERN
 * @param url {string} remote url input
 * @returns {boolean} true if valid remote url, false otherwise
 */
export const isValidGitRemoteUrl = (url: string) =>
  gitRemoteUrlRegExp.test(url);

/**
 * isRemoteBranch: returns true if a branch name starts with origin/
 * @param name {string} branch name
 * @returns {boolean}
 */
export const isRemoteBranch = (name: string): boolean =>
  name.startsWith("origin/");

/**
 * isLocalBranch: returns true if a branch name doesn't start with origin/
 * @param name {string} branch name
 * @returns {boolean}
 */
export const isLocalBranch = (name: string): boolean => !isRemoteBranch(name);

export const getIsActiveItem = (
  isCreateNewBranchInputValid: boolean,
  activeHoverIndex: number,
  index: number,
) =>
  (isCreateNewBranchInputValid ? activeHoverIndex - 1 : activeHoverIndex) ===
  index;

/**
 * removeSpecialChars: removes non-word ([^A-Za-z0-9_]) characters except / and - from input string
 * @param input {string} string containing non-word characters e.g. name of the branch
 * @returns {string}
 */
export const removeSpecialChars = (input: string): string => {
  const separatorRegex = /(?![/-])\W+/;
  return input.split(separatorRegex).join("_");
};

/**
 * changeInfoSinceLastCommit: Returns reason for change string, and whether the changes are from migration or user or both.
 * @param currentApplication {ApplicationPayload | undefined}
 * @returns {{changeReasonText: string, isAutoUpdate:boolean, isManualUpdate: boolean}}
 */
export function changeInfoSinceLastCommit(
  currentApplication: ApplicationPayload | undefined,
) {
  const isAutoUpdate = !!currentApplication?.isAutoUpdate;
  const isManualUpdate = !!currentApplication?.isManualUpdate;
  const changeReasonText = createMessage(CHANGES_SINCE_LAST_DEPLOYMENT);
  return { isAutoUpdate, isManualUpdate, changeReasonText };
}

export const GIT_DOC_URLs = {
  base: "https://docs.pageplug.cn/%E5%AD%A6%E4%B9%A0%E6%96%87%E6%A1%A3/%E5%85%B6%E4%BB%96%E8%B5%84%E6%BA%90/%E4%BD%BF%E7%94%A8Git%E8%BF%9B%E8%A1%8C%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6/%E4%BD%BF%E7%94%A8Git%E8%BF%9B%E8%A1%8C%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6",
  import:
    "https://docs.pageplug.cn/%E5%AD%A6%E4%B9%A0%E6%96%87%E6%A1%A3/%E5%85%B6%E4%BB%96%E8%B5%84%E6%BA%90/%E4%BD%BF%E7%94%A8Git%E8%BF%9B%E8%A1%8C%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6/%E4%BD%BF%E7%94%A8Git%E8%BF%9B%E8%A1%8C%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6",
  connect:
    "https://docs.pageplug.cn/%E5%AD%A6%E4%B9%A0%E6%96%87%E6%A1%A3/%E5%85%B6%E4%BB%96%E8%B5%84%E6%BA%90/%E4%BD%BF%E7%94%A8Git%E8%BF%9B%E8%A1%8C%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6/%E8%BF%9E%E6%8E%A5%E5%88%B0Git%E5%AD%98%E5%82%A8%E5%BA%93",
};
