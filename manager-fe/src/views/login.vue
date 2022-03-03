<script setup lang="ts">
import { useRouter } from "vue-router";
import testLink from "@c/link/index.vue";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import myIcon from "@c/myIcon.vue";
import { reactive, ref } from "vue";
import { log } from "console";
// import { Search } from "@element-plus/icons-vue";
let router = useRouter();
// 解构
let { proxy } = getCurrentInstance();
// proxy
//   .$request({
//     method: "get",
//     url: "/login",
//     data: {
//       name: "10001",
//     },
//   })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch(() => {
//     console.log("出错了~~~");
//   });
// 不变成响应式数据会出bug，比如输入有问题和失焦后报错
let user = reactive({});
let rules = reactive({
  userName: [
    {
      required: true,
      message: "请输入用户名",
      trriger: blur,
    },
  ],
  userPwd: [
    {
      required: true,
      message: "请输入密码",
      trriger: blur,
    },
  ],
});
function login() {
  proxy.$refs.userForm.validate((valid) => {
    if (valid) {
      proxy.$api.login(user).then((res) => {
        proxy.$store.commit("saveUserInfo", res);
        router.push("/welcome");
      });
    } else {
      return false;
    }
  });
}
</script>

<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <div class="title">雪球</div>
        <!-- 没有prop不会校验 -->
        <el-form-item prop="userName">
          <el-input
            type="text"
            prefix-icon="Avatar"
            v-model="user.userName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input
            type="password"
            prefix-icon="View"
            v-model="user.userPwd"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" radius class="btn-login" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 31.25rem;
    padding: 3.125rem;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0rem 0rem 0.625rem 0.1875rem #c7c9cb4d;
    .title {
      font-size: 50px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 1.875rem;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
