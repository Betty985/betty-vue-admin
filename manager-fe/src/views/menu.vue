<template>
  <div class="user-manage">
    <div class="query-form">
      <!-- 行内表单 -->
      <el-form :inline="true" ref="form" :model="queryForm">
        <!-- 不设置prop会导致无法重置，通过prop添加底层是可以获取到的 -->
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="queryForm.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menustate">
          <el-select placeholder="请选择菜单状态" v-model="queryForm.menustate">
            <!-- 该处动态绑定是数值类型，直接写是字符串类型 -->
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
      </div>
      <el-table :data="menuList">
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
          <template #default="scope">
            <el-button @click="handleAdd(scope.row)" size="mini"
              >新增</el-button
            >
            <el-button @click="handleEdit(scope.row)" size="mini"
              >编辑</el-button
            >
            <!-- 当前对象这一行 -->
            <el-button type="danger" @click="handleDel(scope.row)" size="mini"
              >删除</el-button
            >
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
    <!-- 
    <el-dialog title="用户新增" v-model="showModel">
      ref和model的值一样会导致表单无法输入
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
          checkStrictly指定单选，value指定用哪些字段
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
    </el-dialog> -->
  </div>
</template>
<script setup lang="ts">
import { reactive } from "@vue/reactivity";
// 菜单列表
const menuList = reactive([]);
//
const columns = reactive([
  {
    label: "菜单名称",
    prop: "menuName",
    width: 180,
  },
  {
    label: "图标",
    prop: "icon",
  },
  {
    //   标识菜单是路由还是按钮
    label: "菜单类型",
    prop: "menuType",
  },
  {
    label: "权限标识",
    prop: "menuCode",
  },
  {
    label: "路由地址",
    prop: "path",
  },
  {
    label: "组件路径",
    prop: "component",
  },
  {
    label: "菜单状态",
    prop: "menuState",
  },
  {
    label: "创建时间",
    prop: "createTime",
  },
]);
// 查询表单 状态默认是正常的
const queryForm = reactive({ menuState: 1 });
function handleQuery() {}
function handleReset() {}
function handleAdd() {}
function handleEdit() {}
function handleDel() {}
</script>
<style scoped></style>
