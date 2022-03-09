<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { $, getCharts } from "@/utils/getCharts";
let props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
    default: {},
  },
  theme: {
    default: "",
  },
  type: {
    default: {
      renderer: "canvas",
    },
  },
});
let echarts = getCharts();
let charts;

onMounted(() => {
  let dom = $("#echarts");
  dom.innerHTML = "";
  dom.removeAttribute("_echarts_instance_");
  if (props.open) {
    dom.style.height = "100%";
    dom.style.width = "100%";
  }
  charts = echarts.init(dom, props.theme, props.type);
  charts.setOption(props.options);
});
</script>

<template>
  <div id="echarts"></div>
</template>

<style scoped>
#echarts {
  width: 300px;
  height: 150px;
}
</style>
