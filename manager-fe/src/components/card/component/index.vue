<script setup lang="ts">
const props = defineProps({
  title: String,
});
</script>

<template>
  <div>
    <div>{{ props.title }}</div>
    <el-divider></el-divider>
    <slot></slot>
    <!-- <slot name="flooter"></slot> -->
  </div>
</template>

<style scoped></style>
