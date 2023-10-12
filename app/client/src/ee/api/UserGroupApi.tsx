import { AxiosPromise } from "axios";
import Api from "api/Api";
import { ApiResponse } from "api/ApiResponses";

export interface UpdateGroupUsersRequest {
  usernames: string[];
  groupIds: string[];
}

export interface UpdateUserGroupsRequest {
  usernames: string[];
  groupsAdded: string[];
  groupsRemoved: string[];
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
}

export interface GroupData {
  id: string;
  name: string;
  description: string;
  users: string[];
}

export interface GroupDetailData {
  id: string;
  name: string;
  description: string;
  roles: {
    name: string;
    id: string;
  }[];
  users: {
    name: string;
    id: string;
  }[];
}

class UserGroupApi extends Api {
  static baseURL = "v1/user-groups";

  static fetchUserGroupsForInvite(): AxiosPromise<ApiResponse> {
    return Api.get(`${UserGroupApi.baseURL}/for-invite`);
  }

  static fetchAllUserGroups(): AxiosPromise<ApiResponse> {
    return Api.get(`${UserGroupApi.baseURL}`);
  }

  static fetchUserGroupDetail(id: string): AxiosPromise<ApiResponse> {
    return Api.get(`${UserGroupApi.baseURL}/${id}`);
  }

  static deleteUserGroup(id: string): AxiosPromise<ApiResponse> {
    return Api.delete(`${UserGroupApi.baseURL}/${id}`);
  }

  static createUserGroup(
    request: UpdateGroupRequest,
  ): AxiosPromise<ApiResponse> {
    return Api.post(`${UserGroupApi.baseURL}`, request);
  }

  static updateUserGroup(
    id: string,
    request: UpdateGroupRequest,
  ): AxiosPromise<ApiResponse> {
    return Api.put(`${UserGroupApi.baseURL}/${id}`, request);
  }

  static removeGroupUsers(
    request: UpdateGroupUsersRequest,
  ): AxiosPromise<ApiResponse> {
    return Api.post(`${UserGroupApi.baseURL}/removeUsers`, request);
  }

  static inviteGroupUsers(
    request: UpdateGroupUsersRequest,
  ): AxiosPromise<ApiResponse> {
    return Api.post(`${UserGroupApi.baseURL}/invite`, request);
  }

  static updateUserGroups(
    request: UpdateUserGroupsRequest,
  ): AxiosPromise<ApiResponse> {
    return Api.put(`${UserGroupApi.baseURL}/users`, request);
  }
}

export default UserGroupApi;
