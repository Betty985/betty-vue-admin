<template>
  <div class="hi">
    <el-form ref="queryForm" :inline="true" :model="queryModel">
      <template v-for="(item, index) in form" :key="index">
        <FormItem
          :item="item"
          v-bind="item"
          v-model="queryModel[item.model]"
        ></FormItem>
      </template>
      <el-form-item>
        <el-button @click="handleQuery">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// form = [
//   {
//     type: "input",
//     model: "userId",
//     label: "用户ID",
//     placeholder: "请输入用户ID",
//   },
// ];
import FormItem from "./FormItem.vue";
import { getCurrentInstance } from "vue";
import { reactive } from "vue";
export default {
  name: "QueryForm",
  props: ["modelValue", "form"],
  // 注册组件
  components: { FormItem },
  emits: ["update:modelValue"],
  setup(props, context) {
    const ctx = getCurrentInstance();
    const form = props.form;
    const queryModel = reactive({
      ...props.modelValue,
    });
    const handleReset = () => {
      ctx.refs.queryForm.resetFields();
    };
    const handleQuery = () => {
      // 优先触发语法糖，再触发自定义事件
      // context.emit("update:modelValue", {'hi':'vue'});
      context.emit("handleQuery", { ...queryModel });
    };
    return {
      queryModel,
      handleReset,
      handleQuery,
    };
  },
};
</script>

<style scoped></style>
