<script setup lang="ts">
import card from "./component/index.vue";
import { getCharts, $ } from "@/utils/getCharts";
import { onMounted } from "@vue/runtime-core";
const title = "GitHub饼图信息";
const echarts = getCharts();
let options = {
  // tooltip: {
  //   trigger: "item",
  // },
  grid: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: "80%",
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};

onMounted(() => {
  let dom = $(".echarts");
  // let chart = echarts.init(dom, "", { renderer: "canvas" });
  // chart.setOption(options);
});
</script>

<template>
  <div>
    <card :title="title">
      <div class="echarts"></div>
    </card>
  </div>
</template>

<style scoped>
.echarts {
  height: 50px;
}
</style>
