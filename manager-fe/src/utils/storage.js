/*
 * storage二次封装
 * 重点：命名空间和json格式化
 */
import config from "./../config";
export default {
  setItem(key, val) {
    let storage = this.getStorage();
    // key是一个变量，需要用中括号获取值
    storage[key] = val;
    window.localStorage.setItem(config.namespace, JSON.stringify(storage));
  },
  getItem(key) {
    return this.getStorage()[key] || {};
  },
  clearItem(key) {
    let storage = this.getStorage();
    delete storage[key];
    // 重新写入
    window.localStorage.setItem(config.namespace, JSON.stringify(storage));
  },
  clearAll() {
    window.localStorage.clear();
  },
  getStorage() {
    return JSON.parse(window.localStorage.getItem(config.namespace) || "{}");
  },
};
