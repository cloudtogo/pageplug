import { AxiosPromise } from "axios";
import Api from "api/Api";
import { ApiResponse } from "api/ApiResponses";

export interface UpdateRoleConfigRequest {
  tabName: string;
  entitiesChanged: {
    id: string;
    permissions: number[];
    type: string;
    name: string;
  }[];
}

interface RoleItem {
  id: string;
  name: string;
}

export interface AssociateRolesRequest {
  users?: {
    id?: string;
    username: string;
  }[];
  groups?: RoleItem[];
  rolesAdded?: RoleItem[];
  rolesRemoved?: RoleItem[];
}

export interface RoleData {
  name: string;
  id: string;
  description?: string;
  autoCreated: boolean;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
}

class RoleApi extends Api {
  static baseURL = "v1/roles";

  static fetchRolesForAssign(): AxiosPromise<ApiResponse> {
    return Api.get(`${RoleApi.baseURL}/assign`);
  }

  static fetchAllRoles(): AxiosPromise<ApiResponse> {
    return Api.get(`${RoleApi.baseURL}`);
  }

  static fetchRole(id: string): AxiosPromise<ApiResponse> {
    return Api.get(`${RoleApi.baseURL}/${id}`);
  }

  static createRole(request: UpdateRoleRequest): AxiosPromise<ApiResponse> {
    return Api.post(`${RoleApi.baseURL}`, request);
  }

  static updateRole(
    id: string,
    request: UpdateRoleRequest,
  ): AxiosPromise<ApiResponse> {
    return Api.put(`${RoleApi.baseURL}/${id}`, request);
  }

  static deleteRole(id: string): AxiosPromise<ApiResponse> {
    return Api.delete(`${RoleApi.baseURL}/${id}`);
  }

  static fetchRoleConfig(id: string): AxiosPromise<ApiResponse> {
    return Api.get(`${RoleApi.baseURL}/configure/${id}`);
  }

  static updateRoleConfig(
    id: string,
    request: UpdateRoleConfigRequest,
  ): AxiosPromise<ApiResponse> {
    return Api.put(`${RoleApi.baseURL}/configure/${id}`, request);
  }

  static associateRoles(
    request: AssociateRolesRequest,
  ): AxiosPromise<ApiResponse> {
    return Api.put(`${RoleApi.baseURL}/associate`, request);
  }
}

export default RoleApi;
