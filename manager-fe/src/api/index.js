/**
 * Api 管理
 */
import request from "@u/request.js";
export default {
  login(params) {
    return request({
      url: "/api/users/login",
      method: "post",
      data: params,
    });
  },
  noticeCount(params) {
    return request({
      url: "/api/leave/count",
      method: "get",
      data: {},
    });
  },
  getMenuList() {
    return request({
      url: "/api/menu/list",
      method: "get",
      data: {},
    });
  },
};
