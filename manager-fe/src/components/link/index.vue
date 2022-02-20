<script setup lang="ts">
const props = defineProps({
  to: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <a :href="'#' + props.to"><slot></slot></a>
</template>

<style scoped></style>
