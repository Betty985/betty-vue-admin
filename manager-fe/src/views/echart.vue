<script setup lang="ts">
import { getCharts, $ } from "@u/getCharts";
import { onMounted } from "@vue/runtime-core";
var myChart = getCharts();

var res = {
  success: true,
  errMsg: "ok",
  data: [
    {
      name: "深圳市",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "广州市",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "珠海市",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "汕头市",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "佛山市",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "深圳市2",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "广州市2",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "珠海2市",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "汕头市2",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "佛山市2",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "深圳市3",
      plts: [
        { name: "PM25", rate: 95 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "广州市3",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "珠海3市",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "汕头市3",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "佛山市3",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "深圳市4",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "广州市4",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "珠海市4",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "汕头市4",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "佛山市4",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "深圳市5",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 35 },
      ],
    },
    {
      name: "广州市5",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 35 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "珠海市5",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "汕头市5",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 45 },
        { name: "O3", rate: 15 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
    {
      name: "佛山市5",
      plts: [
        { name: "PM25", rate: 25 },
        { name: "PM10", rate: 15 },
        { name: "O3", rate: 35 },
        { name: "CO", rate: 15 },
        { name: "NO2", rate: 15 },
        { name: "SO2", rate: 15 },
      ],
    },
  ],
};
var color = [
  "#78b4ff",
  "#f66bc7",
  "#2bcba7",
  "#ff8896",
  "#79c628",
  "#6c93ee",
  "#a9abff",
  "#f7a23f",
  "#27bae7",
  "#ff6d9d",
  "#cb79ff",
  "#f95b5a",
  "#ccaf27",
  "#38b99c",
  "#93d0ff",
  "#bd74e0",
  "#fd77da",
  "#dea700",
];

var citylist = [];
var data = [];
res.data.forEach((v, i) => {
  citylist.push({
    name: v.name,
    itemStyle: {
      color: "#78b4ff",
    },
  });
  v.plts.forEach((val, j) => {
    if (i === 0) {
      citylist.push({
        name: val.name,
        itemStyle: {
          color: color[j],
        },
      });
    }
    data.push({
      target: v.name,
      source: val.name,
      value: val.rate,
      lineStyle: {
        color: color[j],
      },
    });
  });
});

var option = {
  backgroundColor: "#000",
  tooltip: {
    trigger: "item",
    triggerOn: "mousemove",
    formatter: function (o) {
      if (o.dataType !== "edge") {
        return "";
      }
      return o.data.source + " - " + o.data.target + "：" + o.data.value + "%";
    },
  },
  series: [
    {
      type: "sankey",
      data: citylist,
      links: data,
      top: "10%",
      right: "10%",
      bottom: "5%",
      nodeWidth: 80,
      nodeGap: 0,
      focusNodeAdjacency: "allEdges",
      itemStyle: {
        normal: {
          borderWidth: 0,
          borderColor: "#fff",
          opacity: 1,
        },
      },
      label: {
        normal: {
          align: "center",
          padding: [0, 0, 0, -90],
          fontSize: "14",
          color: "#fff",
        },
      },
      lineStyle: {
        normal: {
          curveness: 0.5,
          opacity: 0.5,
        },
      },
    },
  ],
};

onMounted(() => {
  let dom = document.querySelector(".main");
  console.log(dom);
  let chart = myChart.init(dom);
  chart.setOption(option);
  // 使用刚指定的配置项和数据显示图表。
});
</script>

<template>
  <div>
    <div class="main"></div>
  </div>
</template>

<style scoped>
.main {
  width: 600px;
  height: 600px;
}
</style>
