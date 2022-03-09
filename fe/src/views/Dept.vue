<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form ref="queryForm" :model="queryForm" :inline="true">
        <el-form-item label="部门名称" prop="deptName">
          <el-input placeholder="请输入部门名称" v-model="queryForm.deptName">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDeptList" type="primary" v-has="'dept-query'"
            >查询</el-button
          >
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen" v-has="'dept-create'"
          >创建</el-button
        >
      </div>
      <!-- tree-props可以指定自定义children属性 -->
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        stripe
      >
        <el-table-column v-for="item in columns" :key="item.prop" v-bind="item">
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              v-has="'dept-edit'"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDel(scope.row._id)"
              v-has="'dept-delete'"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="action === 'create' ? '创建部门' : '编辑部门'"
      v-model="showModel"
    >
      <el-form
        ref="dialogForm"
        :model="deptForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item lable="上级部门" prop="parentId">
          <!-- 通过 props.checkStrictly = true 来设置父子节点取消选中关联，从而达到选择任意一级选项的目的。 -->
          <el-cascader
            placeholder="请选择上级部门"
            v-model="deptForm.parentId"
            :props="{ checkSrictly: true, value: '_id', label: 'deptName' }"
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
        <el-form-item label="负责人">
          <el-select
            placeholder="请选择负责人"
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
        <el-form-item label="负责人邮箱" prop="userEmail"
          ><el-input v-model="deptForm.userEmail" disabled></el-input
        ></el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handelClose">取消</el-button>
          <el-button @click="handelSubmit" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { getCurrentInstance, onMounted, ref } from "vue";

let queryForm = reactive({
  deptName: "",
});
let columns = ref([
  {
    label: "部门名称",
    prop: "deptName",
  },
  {
    label: "负责人",
    prop: "userName",
  },
  {
    label: "更新时间",
    prop: "updateTime",
  },
  {
    label: "创建时间",
    prop: "createTime",
  },
]);
let deptList = ref([]);
// 分页插件
let pager = reactive({
  pageNum: 1,
  pageSize: 10,
});
let action = ref("create");
let showModel = ref(false);
let deptForm = reactive({
  parentId: [null],
});
let userList = ref([]);
let rules = reactive({
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
});
let { proxy } = getCurrentInstance();
onMounted(() => {
  getDeptList();
  getAllUserList();
});
async function getDeptList() {
  let list = await proxy.$api.getDeptList(queryForm);
  deptList.value = list;
}
async function getAllUserList() {
  userList.value = await proxy.$api.getAllUserList();
}
function handleUser(val) {
  const [userId, userName, userEmail] = val.split("/");
  Object.assign(deptForm, { userId, userName, userEmail });
}
function handleReset(form) {
  proxy.$refs[form].resetFields();
}
function handleOpen() {
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
  await proxy.$api.operateDept({
    _id,
    action,
  });
}
function handelClose() {
  showModel.value = false;
  handleReset("dialogForm");
}
function handelSubmit() {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = { ...deptForm, action };
      delete params.user;
      await proxy.$api.operateDept(params);
      proxy.$message.success("操作成功");
      handelClose();
      getDeptList();
    }
  });
}
</script>
<style scoped></style>
