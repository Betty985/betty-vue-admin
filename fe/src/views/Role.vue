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
        <el-form-item>
          <el-button type="primary" @click="getRoleList" v-has="'role-query'"
            >查询</el-button
          >
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate" v-has="'role.create'"
          >创建</el-button
        >
      </div>
      <!-- 渲染树形菜单需要rolekey -->
      <el-table :data="roleList">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :width="item.width"
        ></el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              @click="handleEdit(scope.row)"
              size="small"
              type="primary"
              v-has="'role-edit'"
              >编辑</el-button
            >
            <el-button
              @click="handlePermission(scope.row)"
              size="small"
              v-has="'role-permission'"
              >设置权限</el-button
            >
            <!-- 当前对象这一行 -->
            <el-button
              type="danger"
              @click="handleDel(scope.row._id)"
              size="small"
              v-has="'role-delete'"
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
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <el-dialog :title="title" v-model="showModel">
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
          <el-button type="primary" @click="handlePermissionSubmit"
            >确定</el-button
          >
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
  pageSize: 5,
});
let roleList = reactive([]);
let menuList = reactive([]);
// 菜单映射表
let actionMap = reactive({});
let action = ref("");
let title = ref("菜单");
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
  },
  {
    label: "备注",
    prop: "remark",
  },
  {
    label: "权限列表",
    prop: "permissList",
    width: 200,
    formatter(row, column, value) {
      let list = value.halfcheckedKeys || [];
      let names = [];
      list.map((key) => {
        let name = actionMap[key];
        // 过滤掉空值
        if (key && name) {
          names.push(name);
        }
      });
      return names.join(",");
    },
  },
  {
    label: "更新时间",
    prop: "updateTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value));
    },
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
    getActionMap(list);
  } catch (e) {
    throw new Error(e);
  }
}
async function getRoleList() {
  try {
    let { page, list } = await proxy.$api.getRoleList({
      ...queryForm,
      ...pager,
    });
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
function handleCreate() {
  title.value = "创建角色";
  action.value = "create";
  showModel.value = true;
}
function handleEdit(row: any) {
  title.value = "编辑角色";
  // 弹出弹窗后执行nextTick
  showModel.value = true;
  // 编辑
  action.value = "edit";
  // nextTick在下次 DOM 更新循环结束之后执行延迟回调。
  // 在修改数据之后立即使用这个方法，获取更新后的 DOM。
  proxy.$nextTick(() => {
    roleForm = { _id: row._id, roleName: row.roleName, remark: row.remark };
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
      let { action, roleForm } = proxy;
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
// 通过句柄ref访问组件，通过组件访问它的方法
function handlePermission(row) {
  showPermission.value = true;
  curRoleId.value = row._id;
  curRoleName.value = row.roleName;
  let { checkedKeys } = row.permissionList;
  // key就是节点ID
  setTimeout(() => {
    // 加入宏任务，防止句柄还没有生成就调用句柄上的方法
    proxy.$refs.permissionTree.setCheckedKeys(checkedKeys);
  });
}

async function handlePermissionSubmit() {
  // 获取选中的节点
  let nodes = proxy.$refs.permissionTree.getCheckedNodes();
  let halfKeys = proxy.$refs.permissionTree.getHalfcheckedKeys();
  let checkedKeys = [];
  let parentKeys = [];
  nodes.map((node) => {
    if (!node.children) {
      checkedKeys.push(node._id);
    } else {
      parentKeys.push(node._id);
    }
  });
  let params = {
    _id: proxy.curRoleId,
    permissionList: {
      checkedKeys,
      halfcheckedKeys: parentKeys.concat(halfKeys),
    },
  };
  await proxy.$api.updatePermission(params);
  showPermission.value = false;
  proxy.$message.success("设置成功");
  proxy.getMenuList();
}
// 递归获取菜单id和名称的映射
function getActionMap(list) {
  let map = {};
  const deep = (arr) => {
    for (let item of arr) {
      //  菜单下面有按钮  有action说明是最后一级
      if (item.children && item.action) {
        actionMap[item._id] = item.menuName;
      }
      // 不是一级菜单，递归子菜单
      if (item.children && !item.action) {
        deep(item.children);
      }
    }
  };
  // 深拷贝：防止数据污染
  deep(JSON.parse(JSON.stringify(list)));
  actionMap = map;
}
// 分页    当前分页页码current
function handleCurrentChange(current) {
  pager.pageNum = current;
  getRoleList();
}
</script>
<style scoped></style>
