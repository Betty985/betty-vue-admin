import { Router, createRouter, createWebHashHistory } from "vue-router";
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
      zyh: false,
    },
    component: () => import("@/views/home.vue"),
    children: [
      {
        name: "welcome",
        path: "/welcome",
        component: () => import("@v/Welcome.vue"),
        meta: {
          title: "欢迎页",
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
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login.vue"),
    meta: {
      title: "登录页",
    },
  },

  {
    path: "/test",
    name: "test",
    component: () => import("@/views/test/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/views/404/index.vue"),
  },
] as any;

export const router: Router = createRouter({
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
