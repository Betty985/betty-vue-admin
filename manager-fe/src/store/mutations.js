/**
 * mutations业务层数据提交
 */
import storage from "@u/storage.js";
export default {
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo;
    storage.setItem("userInfo", userInfo);
  },
};
