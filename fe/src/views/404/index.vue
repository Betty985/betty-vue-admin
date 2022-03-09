<template>
  <div class="exception">
    <img
      src="https://error404.fun/img/illustrations/03@2x.png"
      alt="404"
      @click="goHome"
      title="点击回首页"
    />
  </div>
</template>

<script setup lang="ts">
import { router } from "@r/index.ts";
function goHome() {
  router.push("/");
}
</script>

<style lang="scss">
.exception {
  position: relative;
  img {
    width: 100%;
    height: 100vh;
  }
}
</style>
