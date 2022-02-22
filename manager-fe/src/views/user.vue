<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
// 获取上下文对象
const { ctx } = getCurrentInstance();
// reactive一般创建引用类型，ref一般创建基本类型
const user = reactive({
  userId: 101,
  userName: "wes",
  state: 0,
});
const userList = reactive({});
const getUserList = () => {};
const columns = reactive([
  {
    label: "用户ID",
    prop: "userId",
  },
  {
    label: "用户名称",
    prop: "userName",
  },
  {
    label: "用户邮箱",
    prop: "userEmail",
  },
  {
    label: "用户角色",
    prop: "role",
  },
  {
    label: "用户状态",
    prop: "state",
  },
  {
    label: "注册时间",
    prop: "createTime",
  },
  {
    label: "最后登录时间",
    prop: "lastLoginTime",
  },
]);
onMounted(() => {
  getUserList();
});
</script>

<template>
  <div class="user-manage">
    <div class="query-form" :model="user">
      <!-- 行内表单 -->
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="user.userName"
            placeholder="请输入用户名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选择用户状态" v-model="user.state">
            <!-- 该处动态绑定是数值类型，直接写是字符串类型 -->
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">新增</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
      <el-table :data="userList">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :lable="item.label"
        ></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped></style>
