<script setup lang="ts">
import { reactive, ref } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import utils from "@u/utils";
import { toRaw } from "vue";

// 获取Composition API的上下文对象
const { proxy } = getCurrentInstance();
// reactive一般创建引用类型，ref一般创建基本类型
const queryForm = reactive({
  applyState: "0",
});
// 定义表单校验规则
const rules = reactive({
  userName: [
    {
      require: true,
      message: "请输入用户名称",
      trigger: "blur",
    },
  ],
  email: [
    {
      require: true,
      message: "请输入用户邮箱",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /1[3-9]\d{9}/,
      message: "请输入正确的手机号格式",
      trigger: "blur",
    },
  ],
  deptId: [
    {
      require: true,
      message: "请选择用户部门",
      trigger: "blur",
    },
  ],
});
// 定义动态表格的格式
const columns = reactive([
  {
    label: "单号",
    prop: "orderNo",
  },
  {
    label: "申请人",
    prop: "",
    formatter(row) {
      return row.applyUser.userName;
    },
  },
  {
    label: "休假时间",
    prop: "",
    formatter(row) {
      return (
        utils.formateDate(new Date(row.startTime), "yyyy-MM-dd") +
        "到" +
        utils.formateDate(new Date(row.endTime), "yyyy-MM-dd")
      );
    },
  },
  {
    label: "休假时长",
    prop: "leaveTime",
  },
  {
    label: "休假类型",
    prop: "applyType",
    formatter(row, column, value) {
      return {
        1: "事假",
        2: "调休",
        3: "年假",
      }[value];
    },
  },
  {
    label: "休假原因",
    prop: "reasons",
  },
  {
    label: "申请时间",
    prop: "createTime",
    width: 180,
    formatter: (row, column, value) => {
      return utils.formateDate(new Date(value));
    },
  },
  {
    label: "审批人",
    prop: "auditUsers",
  },
  {
    label: "当前审批人",
    prop: "curAuditUserName",
  },
  {
    label: "审批状态",
    prop: "applyState",
    formatter: (row, column, value) => {
      // 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
      return {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      }[value];
    },
  },
]);
const getApplyList = () => {};
// 初始化接口调用
onMounted(() => {
  getApplyList();
});
// 分页事件处理
let handleCurrentChange = (current) => {
  pager.pageNum = current;
  getUserList();
};
// 重置查询表单
const handleReset = (form) => {
  // 传参是为了动态重置，关闭弹窗的时候也可以重置
  proxy.$refs[form].resetFields();
};
</script>

<template>
  <div class="user-manage">
    <div class="query-form">
      <!-- 行内表单 -->
      <el-form :inline="true" ref="form" :model="queryForm">
        <!-- 不设置prop会导致无法重置，通过prop添加底层是可以获取到的 -->
        <el-form-item label="审批状态" prop="applyState">
          <el-select
            placeholder="请选择用户状态"
            v-model="queryForm.applyState"
          >
            <!-- 该处动态绑定是数值类型，直接写是字符串类型 -->
            <el-option :value="0" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <el-table :data="applyList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :lable="item.label"
          :formatter="item.formatter"
          :width="item.width"
        ></el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <el-button size="mini">查看</el-button>
            <!-- 当前对象这一行 -->
            <el-button type="danger" size="mini">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="1000"
        :pageSize="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="用户新增" v-model="showModel">
      <!-- ref和model的值一样会导致表单无法输入 -->
      <el-form
        ref="dialogForm"
        :model="userForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            :disabled="action === 'edit'"
            v-model="userForm.userName"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="mobile">
          <el-input
            :disabled="action === 'edit'"
            v-model="userForm.userEmail"
            placeholder="请输入用户邮箱"
          >
            <template #append> @qq.com </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择对应用户系统角色"
            mutiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <!-- checkStrictly指定单选，value指定用哪些字段 -->
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择对应部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
