<template>
  <el-form-item>
    <el-input v-if="item.type == 'input'"></el-input>
    <el-input v-else-if="item.type == 'select'">
      <el-option
        v-for="option in item.options"
        :key="option.value"
        :value="option.value"
        :label="option.label"
      ></el-option>
    </el-input>
  </el-form-item>
</template>
<script>
export default {
  props: ["item"],
};
</script>
