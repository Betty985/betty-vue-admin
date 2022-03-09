import { createRouter, createWebHashHistory } from "vue-router";
import storage from "@u/storage.js";
import API from "@/api";
import util from "@u/utils.js";
import { ElMessage } from "element-plus";
const routerArr = [
  {
    path: "/",
    redirect: "/welcome",
  },
  {
    name: "home",
    path: "/home",
    // meta可以加权限
    meta: {
      title: "首页",
    },
    component: () => import("@/views/Home.vue"),
    children: [
      {
        name: "welcome",
        path: "/welcome",
        component: () => import("@v/Welcome.vue"),
        meta: {
          title: "欢迎使用",
          zyh: true,
        },
      },
      {
        name: "user",
        // 如果要复用上一级的路径不要加"/"，不然会变成绝对路径
        path: "/system/user",
        component: () => import("@v/user.vue"),
        meta: {
          title: "用户管理",
        },
      },
      {
        name: "menu",
        path: "/system/menu",
        component: () => import("@v/menu.vue"),
        meta: {
          title: "菜单管理",
        },
      },
      {
        name: "role",
        path: "/system/role",
        component: () => import("@v/Role.vue"),
        meta: {
          title: "角色管理",
        },
      },
      {
        name: "dept",
        path: "/system/dept",
        component: () => import("@v/Dept.vue"),
        meta: {
          title: "部门管理",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login.vue"),
    meta: {
      public: true,
      title: "登录页",
    },
  },

  {
    path: "/test",
    name: "test",
    component: () => import("@/views/test/index.vue"),
  },
  {
    path: "/404",
    name: "404",
    meta: { title: "页面不存在" },
    component: () => import("@/views/404/index.vue"),
  },
] as any;
// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes: routerArr,
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  },
});

// 判断空对象
function isEmptyObject(obj) {
  return Object.keys(obj).length <= 0;
}

// 声明"全局导航守卫"
// 参数为守卫方法，访问路由规则就会触发守卫方法
router.beforeEach((to, from, next) => {
  // to 目标路由对象
  // from 当前导航正要离开的路由对象
  // next 一个函数，表示放行。不声明next形参，默认允许用户访问每一个路由。
  // 声明形参，但是不调用next函数，不允许访问任何一个路由
  let data = storage.getItem("userInfo");
  let token = !isEmptyObject(data) ? data.token : "";
  if (!to.meta.public && !token) {
    ElMessage({
      message: "请先登录",
      type: "error",
    });
    return next("/login");
  }
  // 动态路由开始
  loadAsyncRoutes();
  if (router.hasRoute(to.name)) {
    document.title = to.meta.title;
    next();
  } else {
    next("/404");
  }
});

// 动态路由
async function loadAsyncRoutes() {
  let userInfo = storage.getItem("userInfo") || {};
  if (userInfo.token) {
    console.log(1);
    // 请求后端路由接口
    const { menuList } = await API.getPermissionList();
    let routes = util.generateRoute(menuList);
    routes.map((route) => {
      let url = `./../views/${route.component}.vue`;
      route.component = () => import(url);
      router.addRoute("system", route);
    });
  }
}

// 导出路由对象
export { router };
