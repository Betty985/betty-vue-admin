import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import ElementPlus from "element-plus";
import axios from "axios";
import "element-plus/dist/index.css";
import storage from "@u/storage.js";
import request from "@u/request";
import api from "@/api";
import config from "./config";
import store from "./store";
import * as Icons from "@element-plus/icons-vue";
let app = createApp(App);
// 注册Icons 全局组件
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key]);
});
app.use(ElementPlus);
app.config.globalProperties.$api = api;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$request = request;
app.use(router);
// use会把它挂载到globalProperties上面去
app.use(store);
app.mount("#app");
