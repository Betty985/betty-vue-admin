<script setup lang="ts">
import BreadCrumb from "@c/BreadCroumb.vue";
import { onMounted, reactive } from "vue";
import { getCurrentInstance } from "vue";
import { router } from "../router";
import treeMenu from "@c/TreeMenu.vue";
let { proxy } = getCurrentInstance();

let data = reactive({
  isCollapse: false,
  userInfo: proxy.$store.state.userInfo,
  noticeCount: 3,
  userMenu: [],
  activeMenu: location.hash.slice(1),
});
function toggle() {
  data.isCollapse = !data.isCollapse;
}

function handleLogout(key: string) {
  if (key === "email") return;
  proxy.$store.commit("saveUserInfo", "");
  data.userInfo = null;
  router.push("/login");
}
async function getNocticeCount() {
  try {
    const count = await proxy.$api.noticeCount();
    data.noticeCount = count;
  } catch (err) {
    console.error(err);
  }
}
onMounted(() => {
  getNocticeCount();
});
</script>

<template>
  <div class="basic-layout">
    <div :class="['nav-side', data.isCollapse ? 'fold' : 'unfold']">
      <!-- 系统LOGO -->
      <div class="logo">
        <img
          src="https://img1.baidu.com/it/u=1132789667,1628966653&fm=253&fmt=auto&app=138&f=JPEG?w=225&h=170"
          style="width: 10px"
        />
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="data.activeMenu"
        background-color="#001529"
        text-color="#fff"
        router
        :collapse="data.isCollapse"
        class="nav-menu"
      >
        <tree-menu :userMenu="data.userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', data.isCollapse ? 'fold' : 'unfold']">
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
            :is-dot="data.noticeCount > 0 ? true : false"
            class="notice"
            type="danger"
          >
            <el-icon><bell /></el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ data.userInfo.userName }}
              <el-icon><right /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱：{{ data.userInfo.userEmail }}</el-dropdown-item
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
    overflow-y: auto;
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    // 合并
    &.fold {
      width: 64px;
    }
    // 展开
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    // 合并
    &.fold {
      margin-left: 64px;
    }
    // 展开
    &.unfold {
      margin-left: 200px;
    }
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
          margin-right: 15px;
          font-size: 18px;
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
        }
        .user-link {
          line-height: 45px;
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        background: #fff;
        height: 100%;
      }
    }
  }
}
</style>
