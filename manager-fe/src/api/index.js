/**
 * api管理
 */
import request from "./../utils/request";
export default {
  login(params) {
    return request({
      url: "/users/login",
      method: "post",
      data: params,
    });
  },
  noticeCount(params) {
    return request({
      url: "/leave/count",
      method: "get",
      data: {},
      mock: true,
    });
  },
  getMenuList(params) {
    return request({
      url: "/menu/list",
      method: "get",
      data: params,
    });
  },
  getUserList(params) {
    return request({
      url: "/users/list",
      method: "get",
      data: params,
    });
  },
  getUserAllList() {
    return request({
      url: "/users/all/list",
      method: "get",
      data: {},
    });
  },
  userDel(params) {
    return request({
      url: "/users/delete",
      method: "post",
      data: params,
    });
  },
  getRoleAllList() {
    return request({
      url: "/roles/allList",
      method: "get",
      data: {},
    });
  },
  getRoleList(params) {
    return request({
      url: "/roles/list",
      method: "get",
      data: params,
    });
  },
  getDeptList() {
    return request({
      url: "/dept/list",
      method: "get",
      data: {},
      mock: true,
    });
  },
  deptOperate(params) {
    return request({
      url: "/dept/operate",
      method: "post",
      data: params,
      mock: true,
    });
  },
  userSubmit(params) {
    return request({
      url: "/users/operate",
      method: "post",
      data: params,
    });
  },
  menuSubmit(params) {
    return request({
      url: "/menu/operate",
      method: "post",
      data: params,
    });
  },
  roleOperate(params) {
    return request({
      url: "/roles/operate",
      method: "post",
      data: params,
    });
  },
  updatePermission(params) {
    return request({
      url: "/roles/ update/permission",
      method: "post",
      data: params,
    });
  },
  getPermissionList() {
    return request({
      url: "/users/getPermissionList",
      method: "post",
      data: {},
    });
  },
};
