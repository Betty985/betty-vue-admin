import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import storage from "@u/storage.js";
import request from "@u/request";
import api from "@/api";
import store from "./store";
import QueryForm from "./../packages/QueryForm/index.js";
import * as Icons from "@element-plus/icons-vue";
let app = createApp(App);
// 注册Icons 全局组件
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key]);
});
// 全局指令    指令名称  obj
app.directive("has", {
  // el:是自定义指令应用的元素  binding:是vue提供的
  beforeMount: (el, binding) => {
    // 获取按钮权限
    let userAction = storage.getItem("actionList");

    // 权限标识
    let value = binding.value;
    // 判断列表中是否有对应的按钮权限标识
    let hasPermission = userAction.includes(value);
    // 没有标识
    if (!hasPermission) {
      // 隐藏
      el.style.display = "none";
      // 移除元素，但此时还是vnode，所以外面嵌套定时器，加入任务队列
      setTimeout(() => {
        el.parentNode.removeChild(el);
      }, 0);
    }
  },
});
app.use(ElementPlus, { size: "small" });
app.config.globalProperties.$api = api;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$request = request;
app.use(router);
// use会把它挂载到globalProperties上面去
// use方法会执行index.js 全局注册组件
app.use(store).use(QueryForm);
app.mount("#app");
