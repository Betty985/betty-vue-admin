<script setup lang="ts">
import { onActivated, onMounted, reactive } from "vue";
let props = defineProps({
  msg: String,
});
// onActivated(() => {
//   console.log(1);
// });
</script>

<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎使用</div>
      <div class="title">通用后台管理系统</div>
      <div class="desc">-Vue3.0+element-plus+node+mondo打造的系统</div>
    </div>
    <div class="img"></div>
    <!-- <router-link to="/login">去登录</router-link> -->
  </div>
</template>

<style lang="scss">
.welcome {
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .content {
    position: relative;
    bottom: 2.5rem;
    .sub-title {
      font-size: 30px;
      line-height: 2.625rem;
      color: #333;
    }
    .title {
      font-size: 40px;
      line-height: 3.875rem;
      color: #409e;
    }
    .desc {
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }
  .img {
    margin-left: 6.5625rem;
    width: 23.1875rem;
    height: 27.375rem;
    background-image: url("@/assets/images/welcome.png");
  }
}
</style>
