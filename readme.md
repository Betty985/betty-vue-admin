# 第一章 项目规划

- 菜单按钮权限？

- jwt 认证？cookie 不安全

- 审批流（工作流的一种）？

- 常规 CRUD

- 模块化/组件化

- 架构设计

## 技术栈

vue3 全家桶【vue3+router+vuecli+vuex】+node/koa2+mongodb+axios+log4gs+vite2+elementplus

vite 与 webpack 的区别？

注意：jwt、权限、mock、接口联调【前后端联调、动态菜单渲染、RBAC 权限

## 项目开发流程

**nginx 部署服务器**

接口评审后数据 mock

冒烟测试要通过（主流程）

CR(**Code Review，代码复查**)

跨域 重定向

## 通用后台

- rn?

- flutter

### ui 框架

- element
- AntD
- Mint
- Vant
- WeUI

### 框架

- Vue

- React

- Angular

- Jquery

### 插件

- cookie

- swiper 轮播插件

- lodash 工具函数库

- Underscore

### 项目级别

- antd-Pro

- yue-admin

- fag

## vue3

设计目标：更小，更快，加强 API 设计一致性，加强 TS 支持，提高自身可维护性。

### 更小

全局 Api 和内置组件/功能支持 tree-shaking；核心代码尺寸控制在 10kb gzipped 上下

### 更快

- **基于 Proxy 的变动侦测**（proxy 检测对象，而 Object.defineProperty()需要递归），性能整体优于 getter/setter；
- **Virtual DOM 重构**
  - 传统 VDOM Diff 算法对比的颗粒度是组件，单个组件内，需要遍历整个 DOM 树。V3 进行了 VDOM 优化，增加静态标记。
  - TypeScipt。3.0 本身用 TypeScipt 重写，内置 typeing 优化（增加静态标记），TSX 支持。
  - composition API (vue2 是 Options api ) Function-based API
    - 定义响应式：ref/reactive
    - 入口函数：setup
    - 钩子函数：computed/onMounted
    - 上下文：genCurrentInstance/globalProperties

### 维护性更高

代码采用 monorepo 结构，内部分层更清晰

### Vite

vite,一个基于浏览器原生 ES imports 的开发服务器。利用浏览器去解析 imports，在服务器端按需编译返回，完全跳过了打包，服务器随起随用。有 vue 文件支持和热更新。生产环境可以把同一份代码用 rollup 打包。Vite 核心：vue 文件编译为 render 函数.

# 前端架构设计

## 项目初始化

- Node 环境安装
- 全局安装 vue 脚手架 @vue/cli (cnpm 是淘宝代理的镜像)
- 通过 vite 创建项目
  在 script 标签里加` type="module"`才能让 HTML 识别 es6 语法
  `-D`是安装到开发环境

插件：ESlint vetur prettier

跨组件共享：vuex

## 路由封装

### push

```js
import { useRouter } from "vue-router";
import testLink from "@c/link/index.vue";
let router = useRouter();
function goHome() {
  router.push("/welcome");
}
```

### 钩子函数

![image-20220213165225311](C:\Users\123\AppData\Roaming\Typora\typora-user-images\image-20220213165225311.png)

### router-link

原理

```html
<a :href="'#' + props.to"><slot></slot></a>
```

路由懒加载缩短首屏渲染的时间。

写 web 爬虫 ChunkName 的块注释可以在浏览器显示文件名.

router-view 放在 keep-alive 标签可以缓存。

```html
<!-- <el-button @click="goHome">test</el-button> -->
<!-- <router-link to="/welcome">hhhhhhh</router-link> -->
<!-- <a href="/#/welcome">hhhhhhh</a> -->
<!-- <testLink to="/welcome">love hui</testLink> -->
```

## axios 二次封装

request

## storage 二次封装

storage+js 持久保存

storage 存储的数据量大

localstorage 防止覆盖：命名空间

json 格式的 key 必须是双引号

# koa 架构设计

全局下载 koa

启动 mongo `mongod --config "E:\mongodb\bin\mongod.cfg"`

注册 mongo 服务 `mongod --config "E:\mongodb\bin\mongod.cfg" --serviceName "MongoDB" --install` 管理员身份运行 cmd

### 基础

| SQL  | Mongo                             |
| ---- | --------------------------------- |
| 表   | 集合                              |
| 行   | 文档                              |
| 列   | 字段                              |
| 主键 | 对象 ID（不能自动增长，可以生成） |

### 操作

| 创建数据库 |     use demo      |
| :--------: | :---------------: |
| 查看数据库 |     show des      |
| 删除数据库 | db.dropDatabase() |

[mongodb](https://www.runoob.com/mongodb)

# jwt

jwt 是一种跨域认证方案。

## 解决问题

- 数据传输简单、高效

- jwt 会生成签名，保证传输安全 (jwt.sign(数据，私钥或公钥，配置选项) 、解密 jwt.verify(token,私钥或公钥))

- jwt 具有时效性

- jwt 更高效利用集群做好单点登录

## 原理

- 服务器认证后，生成一个 JSON 对象，后续通过 json 进行通信
  - 数据结构：Header(头部)、Payload(负载)、Signature(签名)，通过"."连接

## 使用方式

- /api?token=xxx
- cookie 写入 token
- storage 写入 token，请求头添加：Authorization:Bearer<token>

## jwt 拦截

中间件 koa-jwt

```js
app.use(
  koajwt({
    secret: "miyao",
  })
);
```

验证的时候应该过滤掉一些接口，如登录注册。

```js
app.use(
  koajwt({
    secret: "miyao",
  })
);
```

# git

强制推送到远程仓库 git push -f origin master
变基 git rebase

# 错误

- `JSON.parse(window.localStorage.getItem(config.namespace) || "{}")`

需要清空原来的值

- ```js
  const { proxy } = getCurrentInstance();
  ```

  在 ts 中使用会报错：报错：...类型“ComponentInternalInstance | null”

  直接封装一下

  创建 useCurrentInstance.ts 文件：
  https://www.jianshu.com/p/5558cadd10b9

  ```js
  import { ComponentInternalInstance, getCurrentInstance } from 'vue'
  export default function useCurrentInstance() {
      const { appContext } = getCurrentInstance() as ComponentInternalInstance
      const proxy = appContext.config.globalProperties
      return {
          proxy
      }
  }
  ```

  组件内使用：

  ```html
  <script lang="ts">
    import { defineComponent } from "vue";
    import useCurrentInstance from "@/utils/useCurrentInstance";
    export default defineComponent({
      setup() {
        const { proxy } = useCurrentInstance();
        console.log(proxy);
      },
    });
  </script>
  ```

​ 不过不重要，proxy 是全局属性，不是函数。

# 注意

- vite 创建的项目导入组件时需要扩展名
- git commit 功能开发用 feat:
- eslint 可以进行代码格式化

# 遗留的问题

- ~~mockApi 和 axios 没有测试~~

- 日志无法写入文件

- ~~从 3-5 开始跳过第三章~~

- ~~输入框图标~~
- 菜单样式及数据无法渲染
- 页面无法显示内容（element 组件问题？

  ```js
  //全局注册组件
  ```

- login 的 request 报错，axios 封装问题

- menumock 没有实现

# 补充

- this.$routes 的 vue3 写法

  ```js
  import { useRouter } from "vue-router";
  const router = useRouter();
  console.log(router.currentRoute.value);
  ```

-
