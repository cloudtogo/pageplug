export * from "ce/api/UserApi";
import { UserApi as CE_UserApi } from "ce/api/UserApi";
import { AxiosPromise } from "axios";
import Api from "api/Api";
import { ApiResponse } from "api/ApiResponses";

export type UserType = {
  id: string;
  name: string;
  username: string;
  roles: any[];
  groups: any[];
};

export type FetchUserResponse = ApiResponse & {
  email: string;
  id: string;
};

class UserApi extends CE_UserApi {
  static userManageURL = `${UserApi.usersURL}/manage`;
  static captchaURL = "v1/captcha";

  static fetchUsers(): AxiosPromise<ApiResponse> {
    return Api.get(`${UserApi.userManageURL}/all`);
  }

  static fetchUserDetail(id: string): AxiosPromise<ApiResponse> {
    return Api.get(`${UserApi.userManageURL}/${id}`);
  }

  static deleteUser(id: string): AxiosPromise<ApiResponse> {
    return Api.delete(`${UserApi.userManageURL}/${id}`);
  }

  static fetchCaptcha(): AxiosPromise<any> {
    return Api.get(UserApi.captchaURL, {}, { responseType: "blob" });
  }
}

export default UserApi;
