<template>
  <div>
    <el-input
      :modelValue="modelValue"
      :title="title"
      @update:modelValue="handleInput"
    ></el-input>
    <el-button @click="handelSubmit">提交测试</el-button>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
//  :modelValue="value" 默认是modelValue可以绑定其他值
let props = defineProps({
  modelValue: String,
  title: String,
});
let name = ref(props.modelValue);
let emit = defineEmits(["update:modelValue", "handleSubmit"]);
const handleInput = (val: string) => {
  name.value = val;
  emit("update:modelValue", val);
};
const handelSubmit = () => {
  emit("handleSubmit", name.value);
};
</script>
