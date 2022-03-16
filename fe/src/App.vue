<template>
  <div>
    <!-- <router-view v-slot="{ Component }">
      <keep-alive v-if="route.meta.zyh">
        <component :is="Component" />
      </keep-alive>
      <component v-else :is="Component" />
    </router-view> -->
    <v-input
      v-model="name"
      v-model:title="title"
      @handleSubmit="handleSubmit"
    ></v-input>
  </div>
</template>
<style lang="scss">
@import "@a/style/reset.css";
@import "@a/style/index.scss";
</style>
<script setup lang="ts">
// import { getCurrentInstance, onMounted } from "vue";
import { useRoute } from "vue-router";
import VInput from "@c/vinput.vue";
import { ref } from "vue";
let name = ref("betty");
let title = ref("vue3");
const handleSubmit = (val: any) => {
  console.log(val);
};
const route = useRoute();
// import useCurrentInstance from "@u/useCurrentInstance.js";
// const { proxy } = useCurrentInstance();
// const { proxy } = getCurrentInstance();
// onMounted(() => {
//   proxy.$storage.setItem("name", "hello");
// });
</script>
