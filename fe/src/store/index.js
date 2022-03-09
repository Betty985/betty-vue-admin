/**
 * vuex状态管理
 */
import { createStore } from "vuex";
import mutations from "./mutations";
import storage from "@u/storage";
const state = {
  userInfo: storage.getItem("userInfo") || {}, //获取用户信息
  // 菜单列表
  menuList: storage.getItem("menuList") || {},
  // 按钮列表
  actionList: storage.getItem("actionList") || {},
};
export default createStore({
  state,
  mutations,
});
