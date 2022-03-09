<script setup lang="ts">
import BreadCrumb from "@c/BreadCroumb.vue";
import { onMounted, reactive, ref } from "vue";
import { getCurrentInstance } from "vue";
import { router } from "../router";
import treeMenu from "@c/TreeMenu.vue";
let { proxy } = getCurrentInstance();
let isCollapse = ref(false);
let noticeCount = ref(3);
let userMenu = ref([]);
let activeMenu = ref(location.hash.slice(1));
let userInfo = reactive(proxy.$store.state.userInfo);
function toggle() {
  isCollapse.value = !isCollapse;
}

function handleLogout(key: string) {
  if (key !== "logout") return;
  proxy.$store.commit("saveUserInfo", "");
  userInfo = {};
  router.push("/login");
}
async function getNocticeCount() {
  try {
    const count = await proxy.$api.noticeCount();
    noticeCount.value = count;
  } catch (err) {
    console.error(err);
  }
}
async function getMenuList() {
  try {
    const { menuList, actionList } = await proxy.$api.getPermissionList();
    userMenu = menuList;
    proxy.$store.commit("saveUserMenu", menuList);
    proxy.$store.commit("saveUserAction", actionList);
  } catch (err) {
    console.error(err);
  }
}
onMounted(() => {
  getNocticeCount();
  getMenuList();
});
</script>

<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统LOGO -->
      <div class="logo">
        <img src="@/assets/logo.png" style="width: 10px" />
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        background-color="#001529"
        text-color="#fff"
        router
        :collapse="isCollapse"
        class="nav-menu"
      >
        <tree-menu :userMenu="userMenu"></tree-menu>
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon><fold /></el-icon>
          </div>
          <div class="bread">
            <BreadCrumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge
            :is-dot="noticeCount > 0 ? true : false"
            class="notice"
            type="danger"
          >
            <el-icon><bell /></el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout" class="user-drop">
            <span class="user-link">
              {{ userInfo.userName }}
              <el-icon><right /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱：{{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    transition: width 0.5s;
    z-index: 9;
    .logo {
      height: 50px;
      display: flex;
      align-items: center;
      text-align: center;
      font-size: 18px;
      img {
        margin: 0 16px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    &.fold {
      width: 64px;
    }
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 16px;
          font-size: 18px;
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 16px;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
        .user-drop {
          line-height: 3rem;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
    }
    &.fold {
      margin-left: 64px;
    }
    &.unfold {
      margin-left: 200px;
    }
  }
}
</style>
