<template>
  <el-form-item>
    <el-input v-if="item.type == 'input'" v-bind="item"></el-input>
    <el-select v-else-if="item.type == 'select'" v-bind="item">
      <el-option
        v-for="option in item.options"
        :key="option.value"
        v-bind="option"
      ></el-option>
    </el-select>
  </el-form-item>
</template>
<script setup>
// option的控件要和element ui 对上
let props = defineProps(["item"]);
console.log(props);
</script>
