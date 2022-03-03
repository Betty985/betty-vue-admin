<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import { ref } from "vue";
let { proxy } = getCurrentInstance();
let queryForm = reactive({ deptName: "" });
let deptList = reactive([]);
let userList = reactive([]);
let deptForm = reactive({ parentId: null });
let action = ref("");
let showModel = ref(false);
let pager = reactive({
  pageNum: 1,
  pageSize: 10,
});
let columns = reactive([
  {
    label: "部门名称",
    prop: "deptName",
  },
  {
    label: "负责人",
    prop: "userName",
  },
  {
    label: "创建时间",
    prop: "createTime",
  },
  {
    label: "更新时间",
    prop: "updateTime",
  },
]);
let rules = reactive([
  {
    parentId: [
      {
        required: true,
        message: "请选择上级部门",
        trigger: blur,
      },
    ],
    deptName: [
      {
        required: true,
        message: "请输入部门名称",
        trigger: blur,
      },
    ],
    user: [
      {
        required: true,
        message: "请选择负责人",
        trigger: blur,
      },
    ],
  },
]);
onMounted(() => {
  getDeptList();
  getUserAllList();
});
async function getDeptList() {
  let list = await proxy.$api.getDeptList();
  deptList = list;
}
async function getUserAllList() {
  let list = await proxy.$api.getUserAllList({ ...queryForm, ...pager });
  userList = list;
}
function handleReset(form: string | number) {
  proxy.$refs[form].resetFields();
}
function handleOpen(row) {
  action.value = "create";
  showModel.value = true;
}
function handleEdit(row) {
  action.value = "edit";
  showModel.value = true;
  proxy.$nextTick(() => {
    Object.assign(deptForm, row, {
      user: `${row.userId}/${row.userName}/${row.userEmail}`,
    });
  });
}
async function handleDel(_id) {
  action.value = "delete";
  await proxy.$api.deptOperate({ _id, action });
  proxy.$message.success("删除成功");
  getDeptList();
}
function handleClose() {
  showModel.value = false;
  handleReset("dialogForm");
}
function handleSubmit() {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = { ...deptForm, action };
      delete params.user;
      await proxy.$api.deptOperate(params);
      showModel.value = false;
      proxy.$message.success("操作成功");
      handleClose();
      getDeptList();
    }
  });
}
function handleUser(val) {
  let [userId, userName, userEmail] = val.split("/");
  Object.assign(deptForm, { userId, userName, userEmail });
}
</script>

<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :inline="true" ref="queryForm" :model="queryForm">
        <el-form-item
          placeholder="请输入部门名称"
          v-model="queryForm.deptName"
        ></el-form-item>
        <el-form-item>
          <el-button @click="getDeptList">查询</el-button>
          <el-button @click="handleReset(queryForm)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen">创建</el-button>
      </div>
      <!-- 树形结构需要 row-key -->
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column v-for="item in columns" :key="item.prop" v-bind="item">
        </el-table-column>
        <el-table-colum label="操作">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDel(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-colum>
      </el-table>
    </div>
    <el-dialog
      :title="action == 'create' ? '创建部门' : '编辑部门'"
      v-model="showModel"
    >
      <el-form
        ref="dialogForm"
        :model="deptForm"
        :rules="rules"
        lable-width="120px"
      >
        <!-- 加prop校验才会生效 -->
        <el-form-item prop="parentId">
          <el-cascader
            placeholder="请选择上级部门"
            v-model="deptForm.parentId"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            :options="deptList"
            :show-all-levels="true"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            placeholder="请输入部门名称"
            v-model="deptForm.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select
            placeholder="请选择部门负责人"
            v-model="deptForm.user"
            @change="handleUser"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="deptForm.userEmail" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleSubmit" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
