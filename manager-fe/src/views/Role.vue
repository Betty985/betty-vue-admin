<template>
  <div class="role-manage">
    <div class="query-form">
      <!-- 行内表单 -->
      <el-form :inline="true" ref="form" :model="queryForm">
        <!-- 不设置prop会导致无法重置，通过prop添加底层是可以获取到的 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryForm.roleName"
            placeholder="请输入角色名称"
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
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <!-- 渲染树形菜单需要rolekey -->
      <el-table :data="roleList">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :lable="item.label"
          :formatter="item.formatter"
          :width="item.width"
        ></el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" size="mini" type="primary"
              >编辑</el-button
            >
            <el-button @click="handlePermission(scope.row)" size="mini"
              >设置权限</el-button
            >
            <!-- 当前对象这一行 -->
            <el-button
              type="danger"
              @click="handleDel(scope.row._id)"
              size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
      >
      </el-pagination>
    </div>
    <el-dialog title="角色新增" v-model="showModel">
      <!-- ref和model的值一样会导致表单无法输入 -->
      <el-form
        ref="dialogForm"
        :model="roleForm"
        label-width="100px"
        :rules="rules"
      >
        <!-- 正则和校验需要加prop -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            v-model="roleForm.remark"
            placeholder="请输入角色备注"
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
    <!-- 权限弹框 -->
    <el-dialog title="权限设置" v-model="showPermission">
      <!-- ref和model的值一样会导致表单无法输入 -->
      <el-form label-width="100px">
        <!-- 正则和校验需要加prop -->
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="permissionTree"
            :data="menuList"
            show-checkbox
            node-key="_id"
            :props="{ label: 'menuName' }"
            default-expand-all
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import utils from "@u/utils.js";
import { ref } from "vue";
// 分页插件
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: undefined,
});
let roleList = reactive([]);
let menuList = reactive([]);
let action = ref("");
//
let curRoleName = ref("");
// 当前角色id
let curRoleId = ref("");
let showModel = ref(false);
// 权限展示
let showPermission = ref(false);
let roleForm = reactive({});
//自定义表格列
let columns = reactive([
  {
    label: "角色名称",
    prop: "roleName",
    width: 150,
  },
  {
    label: "备注",
    prop: "remark",
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
    width: 90,
  },
  {
    label: "创建时间",
    prop: "createTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value));
    },
  },
]);
// 查询表单 状态默认是正常的
let queryForm = reactive({ roleName: 1 });
const { proxy } = getCurrentInstance();
const rules = reactive({
  roleName: [
    {
      required: true,
      message: "请输入角色名称",
    },
  ],
});
// 菜单列表初始化
async function getMenuList() {
  try {
    let list = await proxy.$api.getMenuList();
    menuList = list;
  } catch (e) {
    throw new Error(e);
  }
}
async function getRoleList() {
  try {
    let { list, page } = await proxy.$api.getRoleList(queryForm);
    roleList = list;
    pager.total = page.total;
  } catch (e) {
    throw new Error(e);
  }
}
onMounted(() => {
  getRoleList();
  getMenuList();
});
// 表单重置
function handleReset(form) {
  proxy.$refs[form].resetFields();
}
// 新增菜单
function handleAdd(row) {
  // 弹出弹窗
  showModel.value = true;
  // 创建
  action.value = "create";
  await proxy.$api.roleOperate({ row, action });
  proxy.$message.success("删除成功");
  getRoleList();
}
function handleEdit(row: any) {
  // 弹出弹窗后执行nextTick
  showModel.value = true;
  // 编辑
  action.value = "edit";
  // nextTick在下次 DOM 更新循环结束之后执行延迟回调。
  // 在修改数据之后立即使用这个方法，获取更新后的 DOM。
  proxy.$nextTick(() => {
    roleForm = row;
    // Object.assign(roleForm, row);
  });
}
async function handleDel(id) {
  // 如果失败会被request拦截
  await proxy.$api.roleOperate({ id, action: "delete" });
  proxy.$message.success("删除成功");
  getRoleList();
}
// 操作提交
function handleSubmit() {
  // valid为false说明校验失败
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let { action, roleForm } = proxy.$refs;
      let params = { ...roleForm, action };
      let res = await proxy.$api.roleOperate(params);
      if (res) {
        showModel.value = false;
        proxy.$message.success("操作成功");
        handleReset(proxy.$refs.dialogForm);
        proxy.$api.getRoleList();
      }
    }
  });
}
// 弹窗关闭
function handleClose() {
  showModel.value = false;
  handleReset("dialogForm");
}
// 权限弹窗
function handlePermission(row) {
  showPermission.value = true;
  curRoleId.value = row._id;
  curRoleName.value = row.roleName;
  let { checkedKeys } = row.permissionList;
}
// 通过句柄ref访问组件，通过组件访问它的方法
</script>
<style scoped></style>
