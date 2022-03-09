/**
 * 通用工具函数
 */
let jwt = require("jsonwebtoken");
const log4js = require("./log4j");
const CODE = {
  SUCCESS: 200,
  PRAMA_ERROR: 10001, //参数错误
  USER_ACCOUNT_ERROR: 20001, //账户或密码错误
  USER_LOGIN_ERROR: 30001, // 用户未登录
  BUSSINESS_ERROR: 40001, // 业务请求失败
  AUTH_ERROR: 50001, // 认证失败或token过期
};
module.exports = {
  /**
   *分页封装
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns
   */
  paper(pageNum = 1, pageSize = 10) {
    //   为了转成数字
    pageNum *= 1;
    pageSize *= 1;
    // 索引
    let skipIndex = (pageNum - 1) * pageSize;
    return {
      page: { pageNum, pageSize },
      skipIndex,
    };
  },
  success(data = "", msg = "", code = CODE.SUCCESS) {
    log4js.debug(data);
    return { code, data, msg };
  },
  fail(msg = "", code = CODE.BUSSINESS_ERROR, data = "") {
    log4js.debug(msg);
    return { code, data, msg };
  },
  CODE,
  // 解密token
  decoded(authorization) {
    if (authorization) {
      let token = authorization.split(" ")[1];
      // 验证 解密
      return jwt.verify(token, "miyao");
    }
    return "";
  },
  // 递归拼接树形列表
  getTreeMenu(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
      let item = rootList[i];
      // 判断是不是一级菜单   pop会改变数组
      // id是buffer类型，需要都转成字符串
      if (String(item.parentId.slice().pop()) == String(id)) {
        // 把一级菜单push进数组
        list.push(item._doc); //item是mongoose的对象，提供了get方法可以取每个字段。需要通过_doc取每个子文档
      }
    }
    list.map((item) => {
      //   二级菜单
      item.children = [];
      // getTreeMenu不是全局函数，在module.export里面获取不到自己
      // 需要用this获取当前上下文，来调用getTreeMenu
      this.getTreeMenu(rootList, item._id, item.children);
      // 如果没有child就不需要child属性
      if (item.children.length == 0) {
        delete item.children;
      } else if (item.children.length > 0 && item.children[0].menuType == 2) {
        // 快速区分按钮和菜单，用于后期菜单按钮权限控制
        item.action = item.children;
      }
    });
    return list;
  },
};
