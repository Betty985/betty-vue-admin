<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
      <router-link to="/welcome" v-if="index == 0">{{
        item.meta.title
      }}</router-link>
      <span v-else>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";
let { proxy } = getCurrentInstance();
const router = useRouter();
let breadList = router.currentRoute.value.matched;
onMounted(() => {
  // console.log(router.currentRoute.value);
});
</script>
