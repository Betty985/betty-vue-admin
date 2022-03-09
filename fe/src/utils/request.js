/**
 * axios二次封装 //get、post、put、delete、request、response、cancel、抛出异常
  axios 对于web promise的ajax 【提供了一些方法】
  对于服务器 node的http模块
*/
import axios from "axios";
import config from "./../config";
import { ElMessage } from "element-plus";
// 从router文件里导入
import { router } from "./../router";
import storage from "./storage";
const TOKEN_INVALED = "token 认证失败,请重新登录";
const NETWORK_ERROR = "网络请求异常,请稍后重试";
// 创建axios实例对象，添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000,
});
// 请求拦截
//  token 认证
// jwt json web token
//登录流程
// 前端输入完账号密码-》后端账号密码【】-》后端return token
// 前端存储token [localStroage.get('token')]
service.interceptors.request.use((req) => {
  const headers = req.headers;
  const { token } = storage.getItem("userInfo");
  if (!headers.Authorization) headers.Authorization = "snow " + token;
  return req;
});
// 响应拦截
service.interceptors.response.use((res) => {
  //  res返回的状态码是http状态码，res.data返回的状态码是api的状态码
  const { code, data, msg } = res.data;
  if (code === 200) {
    return data;
  } else if (code === 50001) {
    ElMessage.error(TOKEN_INVALED);
    setTimeout(() => {
      router.push("/login");
    }, 50000);
    return Promise.reject(TOKEN_INVALED);
  } else {
    ElMessage.error(msg || NETWORK_ERROR);
    return Promise.reject(msg || NETWORK_ERROR);
  }
});
/**
 *请求核心函数
 * @param {*} options  请求配置
 * @returns
 */
function request(options) {
  options.method = options.method || "get";
  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }
  // 通过isMock这一中间量确保config.mock不被污染
  let isMock = config.mock;
  if (typeof options.mock !== "undefined") {
    isMock = options.mock;
  }
  if (config.env === "prod") {
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
  }
  return service(options);
}
["get", "post", "put", "delete", "pathch"].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({ url, data, method: item, ...options });
  };
});
export default request;
