import {
  ReduxActionTypes,
  ReduxActionErrorTypes,
  ReduxActionWithPromise,
} from "@appsmith/constants/ReduxActionConstants";
import { takeLatest, all, call, put } from "redux-saga/effects";
import { reset } from "redux-form";
import UserApi, { UserType } from "@appsmith/api/UserApi";
import RoleApi, {
  RoleData,
  UpdateRoleConfigRequest,
  AssociateRolesRequest,
  UpdateRoleRequest,
} from "@appsmith/api/RoleApi";
import GroupApi, {
  GroupData,
  GroupDetailData,
  UpdateGroupRequest,
  UpdateGroupUsersRequest,
  UpdateUserGroupsRequest,
} from "@appsmith/api/UserGroupApi";
import { ApiResponse } from "api/ApiResponses";
import { validateResponse, getResponseErrorMessage } from "sagas/ErrorSagas";
import { message } from "antd";
import history from "utils/history";

export function* fetchUsersSaga() {
  try {
    const response: ApiResponse<UserType[]> = yield call(UserApi.fetchUsers);
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      yield put({
        type: ReduxActionTypes.FETCH_USERS_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_USERS_ERROR,
      payload: error,
    });
  }
}

export function* fetchUserDetailSaga(
  action: ReduxActionWithPromise<{ id: string }>,
) {
  try {
    const { id } = action.payload;
    const response: ApiResponse<UserType> = yield call(
      UserApi.fetchUserDetail,
      id,
    );
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      yield put({
        type: ReduxActionTypes.FETCH_USER_DETAIL_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_USER_DETAIL_ERROR,
      payload: error,
    });
  }
}

export function* deleteUserSaga(
  action: ReduxActionWithPromise<{ id: string; from: string }>,
) {
  const { id, from, reject, resolve } = action.payload;
  try {
    const response: ApiResponse<boolean> = yield call(UserApi.deleteUser, id);
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      message.success("用户删除成功");
      yield put({
        type: ReduxActionTypes.DELETE_USER_SUCCESS,
      });
      yield call(resolve);
      if (from === "detail") {
        history.push(`/settings/users`);
      } else {
        yield call(fetchUsersSaga);
      }
    }
  } catch (error) {
    message.error("用户删除失败");
    yield call(reject, { _error: (error as Error).message });
    yield put({
      type: ReduxActionErrorTypes.DELETE_USER_ERROR,
      payload: error,
    });
  }
}

export function* fetchRolesForAssignSaga() {
  try {
    const response: ApiResponse<RoleData[]> = yield call(
      RoleApi.fetchRolesForAssign,
    );
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      yield put({
        type: ReduxActionTypes.FETCH_ROLES_FOR_USER_ASSIGN_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_ROLES_FOR_USER_ASSIGN_ERROR,
      payload: error,
    });
  }
}

export function* fetchRolesSaga() {
  try {
    const response: ApiResponse<RoleData[]> = yield call(RoleApi.fetchAllRoles);
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      yield put({
        type: ReduxActionTypes.FETCH_ROLES_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_ROLES_ERROR,
      payload: error,
    });
  }
}

export function* fetchRoleDetailSaga(
  action: ReduxActionWithPromise<{ id: string }>,
) {
  try {
    const { id } = action.payload;
    const response: ApiResponse<RoleData> = yield call(RoleApi.fetchRole, id);
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      yield put({
        type: ReduxActionTypes.FETCH_ROLE_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_ROLE_ERROR,
      payload: error,
    });
  }
}

export function* createRoleSaga(
  action: ReduxActionWithPromise<{ name: string }>,
) {
  try {
    const response: ApiResponse<RoleData> = yield call(
      RoleApi.createRole,
      action.payload,
    );
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      const { id } = response.data;
      message.success("角色创建成功");
      yield put({
        type: ReduxActionTypes.CREATE_ROLE_SUCCESS,
      });
      history.push(`/settings/roles/${id}`);
    }
  } catch (error) {
    message.error("角色创建失败");
    yield put({
      type: ReduxActionErrorTypes.CREATE_ROLE_ERROR,
      payload: error,
    });
  }
}

export function* deleteRoleSaga(
  action: ReduxActionWithPromise<{ id: string }>,
) {
  const { id, reject, resolve } = action.payload;
  try {
    const response: ApiResponse<boolean> = yield call(RoleApi.deleteRole, id);
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      message.success("角色删除成功");
      if (resolve) {
        yield call(resolve);
      }
      yield put({
        type: ReduxActionTypes.DELETE_ROLE_SUCCESS,
      });
      history.push(`/settings/roles`);
    } else {
      if (reject) {
        yield call(reject, { _error: getResponseErrorMessage(response) });
      }
    }
  } catch (error) {
    if (reject) {
      yield call(reject, { _error: (error as Error).message });
    }
    message.error("角色删除失败");
    yield put({
      type: ReduxActionErrorTypes.DELETE_ROLE_ERROR,
      payload: error,
    });
  }
}

export function* updateRoleSaga(
  action: ReduxActionWithPromise<{ id: string; request: UpdateRoleRequest }>,
) {
  try {
    const { id, request } = action.payload;
    const response: ApiResponse<RoleData> = yield call(
      RoleApi.updateRole,
      id,
      request,
    );
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      message.success("修改成功");
      yield put({
        type: ReduxActionTypes.UPDATE_ROLE_SUCCESS,
        payload: {
          name: response.data.name,
          description: response.data.description,
        },
      });
    }
  } catch (error) {
    message.error("修改失败");
    yield put({
      type: ReduxActionErrorTypes.UPDATE_ROLE_ERROR,
      payload: error,
    });
  }
}

export function* fetchRoleConfigSaga(
  action: ReduxActionWithPromise<{ id: string }>,
) {
  try {
    const { id } = action.payload;
    const response: ApiResponse = yield call(RoleApi.fetchRoleConfig, id);
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      yield put({
        type: ReduxActionTypes.FETCH_ROLE_CONFIG_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_ROLE_CONFIG_ERROR,
      payload: error,
    });
  }
}

export function* updateRoleConfigSaga(
  action: ReduxActionWithPromise<{
    id: string;
    request: UpdateRoleConfigRequest;
  }>,
) {
  const { id, request, reject, resolve } = action.payload;
  try {
    const response: ApiResponse = yield call(
      RoleApi.updateRoleConfig,
      id,
      request,
    );
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      message.success("权限修改成功");
      yield put({
        type: ReduxActionTypes.UPDATE_ROLE_CONFIG_SUCCESS,
        payload: response.data,
      });
      if (resolve) {
        yield call(resolve);
      }
    }
  } catch (error) {
    if (reject) {
      yield call(reject, { _error: (error as Error).message });
    }
    message.error("权限修改失败");
    yield put({
      type: ReduxActionErrorTypes.UPDATE_ROLE_CONFIG_ERROR,
      payload: error,
    });
  }
}

export function* fetchGroupsSaga() {
  try {
    const response: ApiResponse<GroupData[]> = yield call(
      GroupApi.fetchAllUserGroups,
    );
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      yield put({
        type: ReduxActionTypes.FETCH_USER_GROUPS_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_USER_GROUPS_ERROR,
      payload: error,
    });
  }
}

export function* fetchGroupDetailSaga(
  action: ReduxActionWithPromise<{ id: string }>,
) {
  try {
    const { id } = action.payload;
    const response: ApiResponse<GroupDetailData> = yield call(
      GroupApi.fetchUserGroupDetail,
      id,
    );
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      yield put({
        type: ReduxActionTypes.FETCH_USER_GROUP_DETAIL_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.FETCH_USER_GROUP_DETAIL_ERROR,
      payload: error,
    });
  }
}

export function* createUserGroupSaga(
  action: ReduxActionWithPromise<{ name: string }>,
) {
  try {
    const response: ApiResponse<GroupData> = yield call(
      GroupApi.createUserGroup,
      action.payload,
    );
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      const { id } = response.data;
      message.success("团队创建成功");
      yield put({
        type: ReduxActionTypes.CREATE_USER_GROUP_SUCCESS,
      });
      history.push(`/settings/groups/${id}`);
    }
  } catch (error) {
    message.error("团队创建失败");
    yield put({
      type: ReduxActionErrorTypes.CREATE_USER_GROUP_ERROR,
      payload: error,
    });
  }
}

export function* deleteUserGroupSaga(
  action: ReduxActionWithPromise<{ id: string; from: string }>,
) {
  const { id, from } = action.payload;
  try {
    const response: ApiResponse<boolean> = yield call(
      GroupApi.deleteUserGroup,
      id,
    );
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      message.success("团队删除成功");
      yield put({
        type: ReduxActionTypes.DELETE_USER_GROUP_SUCCESS,
      });
      if (from === "detail") {
        history.push(`/settings/groups`);
      } else {
        yield call(fetchGroupsSaga);
      }
    }
  } catch (error) {
    message.error("团队删除失败");
    yield put({
      type: ReduxActionErrorTypes.DELETE_USER_GROUP_ERROR,
      payload: error,
    });
  }
}

export function* updateUserGroupSaga(
  action: ReduxActionWithPromise<{ id: string; request: UpdateGroupRequest }>,
) {
  try {
    const { id, request } = action.payload;
    const response: ApiResponse<GroupData> = yield call(
      GroupApi.updateUserGroup,
      id,
      request,
    );
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      message.success("修改成功");
      yield put({
        type: ReduxActionTypes.UPDATE_USER_GROUP_SUCCESS,
        payload: {
          name: response.data.name,
          description: response.data.description,
        },
      });
    }
  } catch (error) {
    message.error("修改失败");
    yield put({
      type: ReduxActionErrorTypes.UPDATE_USER_GROUP_ERROR,
      payload: error,
    });
  }
}

export function* groupInviteUserSaga(
  action: ReduxActionWithPromise<{
    data: UpdateGroupUsersRequest;
    formName: string;
  }>,
) {
  const { data, formName, reject, resolve } = action.payload;
  try {
    const response: ApiResponse = yield call(GroupApi.inviteGroupUsers, data);
    const isValidResponse: boolean = yield validateResponse(response);
    if (!isValidResponse) {
      let errorMessage = `${data.usernames}:  `;
      errorMessage += getResponseErrorMessage(response);
      yield call(reject, { _error: errorMessage });
    }
    yield put({
      type: ReduxActionTypes.USER_GROUP_INVITE_USER_SUCCESS,
      payload: response.data,
    });
    yield call(resolve);
    yield put(reset(formName));
  } catch (error) {
    yield call(reject, { _error: (error as Error).message });
    yield put({
      type: ReduxActionErrorTypes.USER_GROUP_INVITE_USER_ERROR,
      payload: {
        error,
      },
    });
  }
}

export function* groupRemoveUserSaga(
  action: ReduxActionWithPromise<{
    data: UpdateGroupUsersRequest;
  }>,
) {
  const { data, reject, resolve } = action.payload;
  try {
    const response: ApiResponse = yield call(GroupApi.removeGroupUsers, data);
    const isValidResponse: boolean = yield validateResponse(response);
    if (!isValidResponse) {
      let errorMessage = `${data.usernames}:  `;
      errorMessage += getResponseErrorMessage(response);
      yield call(reject, { _error: errorMessage });
    }
    yield put({
      type: ReduxActionTypes.USER_GROUP_REMOVE_USER_SUCCESS,
      payload: response.data,
    });
    yield call(resolve);
  } catch (error) {
    yield call(reject, { _error: (error as Error).message });
    yield put({
      type: ReduxActionErrorTypes.USER_GROUP_REMOVE_USER_ERROR,
      payload: {
        error,
      },
    });
  }
}

export function* userUpdateUserGroupsSaga(
  action: ReduxActionWithPromise<{ request: UpdateUserGroupsRequest }>,
) {
  try {
    const { request } = action.payload;
    const response: ApiResponse<boolean> = yield call(
      GroupApi.updateUserGroups,
      request,
    );
    const isValidResponse: boolean = yield validateResponse(response);
    if (isValidResponse) {
      message.success("团队修改成功");
      yield put({
        type: ReduxActionTypes.USER_UPDATE_GROUPS_SUCCESS,
      });
    }
  } catch (error) {
    message.error("团队修改成功");
    yield put({
      type: ReduxActionErrorTypes.USER_UPDATE_GROUPS_ERROR,
      payload: error,
    });
  }
}

export function* rolesAssociateSaga(
  action: ReduxActionWithPromise<{
    data: AssociateRolesRequest;
    formName: string;
  }>,
) {
  const { data, formName, reject, resolve } = action.payload;
  try {
    const response: ApiResponse = yield call(RoleApi.associateRoles, data);
    const isValidResponse: boolean = yield validateResponse(response);
    if (!isValidResponse && reject) {
      yield call(reject, { _error: getResponseErrorMessage(response) });
    }
    yield put({
      type: ReduxActionTypes.ROLES_ASSOCIATE_SUCCESS,
    });
    if (resolve) {
      yield call(resolve);
    }
    if (formName) {
      yield put(reset(formName));
      message.success("用户添加成功");
    } else {
      message.success("角色修改成功");
    }
  } catch (error) {
    if (reject) {
      yield call(reject, { _error: (error as Error).message });
    }
    yield put({
      type: ReduxActionErrorTypes.ROLES_ASSOCIATE_ERROR,
      payload: {
        error,
      },
    });
    if (formName) {
      message.error("用户添加失败");
    } else {
      message.error("角色修改失败");
    }
  }
}

export default function* settingSagas() {
  yield all([
    takeLatest(ReduxActionTypes.FETCH_USERS_INIT, fetchUsersSaga),
    takeLatest(ReduxActionTypes.FETCH_USER_DETAIL_INIT, fetchUserDetailSaga),
    takeLatest(ReduxActionTypes.DELETE_USER, deleteUserSaga),
    takeLatest(
      ReduxActionTypes.FETCH_ROLES_FOR_USER_ASSIGN_INIT,
      fetchRolesForAssignSaga,
    ),
    takeLatest(ReduxActionTypes.FETCH_ROLES_INIT, fetchRolesSaga),
    takeLatest(ReduxActionTypes.FETCH_ROLE_INIT, fetchRoleDetailSaga),
    takeLatest(ReduxActionTypes.CREATE_ROLE_INIT, createRoleSaga),
    takeLatest(ReduxActionTypes.DELETE_ROLE_INIT, deleteRoleSaga),
    takeLatest(ReduxActionTypes.UPDATE_ROLE_INIT, updateRoleSaga),
    takeLatest(ReduxActionTypes.FETCH_ROLE_CONFIG_INIT, fetchRoleConfigSaga),
    takeLatest(ReduxActionTypes.UPDATE_ROLE_CONFIG_INIT, updateRoleConfigSaga),
    takeLatest(ReduxActionTypes.FETCH_USER_GROUPS_INIT, fetchGroupsSaga),
    takeLatest(
      ReduxActionTypes.FETCH_USER_GROUPS_FOR_INVITE_INIT,
      fetchGroupsSaga,
    ),
    takeLatest(
      ReduxActionTypes.FETCH_USER_GROUP_DETAIL_INIT,
      fetchGroupDetailSaga,
    ),
    takeLatest(ReduxActionTypes.CREATE_USER_GROUP, createUserGroupSaga),
    takeLatest(ReduxActionTypes.DELETE_USER_GROUP, deleteUserGroupSaga),
    takeLatest(ReduxActionTypes.UPDATE_USER_GROUP, updateUserGroupSaga),
    takeLatest(ReduxActionTypes.USER_GROUP_INVITE_USER, groupInviteUserSaga),
    takeLatest(ReduxActionTypes.USER_GROUP_REMOVE_USER, groupRemoveUserSaga),
    takeLatest(ReduxActionTypes.USER_UPDATE_GROUPS, userUpdateUserGroupsSaga),
    takeLatest(ReduxActionTypes.ROLES_ASSOCIATE, rolesAssociateSaga),
  ]);
}
