<template>
  <router-view v-slot="{ Component }">
    <keep-alive v-if="route.meta.zyh">
      <component :is="Component" />
    </keep-alive>
    <component v-else :is="Component" />
  </router-view>
</template>
<style lang="scss">
@import "@a/style/reset.css";
@import "@a/style/index.scss";
</style>
<script setup lang="ts">
import { getCurrentInstance, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
// import useCurrentInstance from "@u/useCurrentInstance.js";
// const { proxy } = useCurrentInstance();
// const { proxy } = getCurrentInstance();
// onMounted(() => {
//   proxy.$storage.setItem("name", "hello");
// });
</script>
