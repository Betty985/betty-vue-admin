<template>
  <div class="base-table">
    <slot name="action"></slot>
    <el-table v-bind="$attrs">
      <el-table-column type="selection" width="55" v-if="selection" />
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        v-bind="item"
      ></el-table-column>
      {{ action }}
      <template v-if="action == 'action'">
        <el-table-column
          v-for="(btn, index) in operation"
          :key="index"
          v-bind="operation"
        >
          <el-button>{{ btn.text }}</el-button>
        </el-table-column>
      </template>

      <!-- 
          <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button
            @click="handleEdit(scope.row)"
            size="small"
            v-has="'user-eidt'"
            >编辑</el-button
          >
         当前对象这一行
          <el-button
            type="danger"
            @click="handleDel(scope.row)"
            size="small"
            v-has="'user-delete'"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
    <!-- <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="1000"
      :pageSize="pager.pageSize"
      @current-change="handleCurrentChange"
    /> -->
  </div>
</template>
<script>
export default {
  name: "BaseTable",
  props: ["columns", "selection", "action", "operation"],
  setup() {},
};
</script>
