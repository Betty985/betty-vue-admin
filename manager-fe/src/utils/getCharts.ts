import * as echarts from "echarts";
export const getCharts = function () {
  return echarts;
};

export const $ = function (el) {
  return document.querySelector(el);
};
