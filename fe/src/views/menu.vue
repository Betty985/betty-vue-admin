<template>
  <div class="menu-manage">
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
          <el-button type="primary" @click="getMenuList" v-has="'menu-query'"
            >查询</el-button
          >
          <el-button @click="handleReset(queryForm)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)" v-has="'menu-create'"
          >创建
        </el-button>
      </div>
      <!-- 渲染树形菜单需要rolekey -->
      <el-table
        :data="menuList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
      >
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
              @click="handleAdd(2, scope.row)"
              size="small"
              type="primary"
              v-has="'menu-create'"
              >新增</el-button
            >
            <el-button
              @click="handleEdit(scope.row)"
              size="small"
              v-has="'menu-edit'"
              >编辑</el-button
            >
            <!-- 当前对象这一行 -->
            <el-button
              type="danger"
              @click="handleDel(scope.row._id)"
              size="small"
              v-has="'menu-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="菜单新增" v-model="showModel">
      <!-- ref和model的值一样会导致表单无法输入 -->
      <el-form
        ref="dialogForm"
        :model="menuForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          ></el-cascader>
          <span>默认为一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <!-- 动态绑定变成数字类型 -->
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item
          label="路由地址"
          prop="path"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="menuCode"
          v-show="menuForm.menuType == 2"
        >
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item
          label="组件路径"
          prop="component"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item
          label="菜单状态"
          prop="menuState"
          v-show="menuForm.menuType == 1"
        >
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
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
<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import utils from "@u/utils.js";
import { ref } from "vue";
// 菜单列表
let menuList = ref([]);
// 新增表单字段
let menuForm = reactive({
  parentId: [null],
  menuType: 1,
  menuState: 1,
});
//自定义表格列
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
    formatter(row, column, value) {
      return {
        "1": "菜单",
        "2": "按钮",
      }[value];
    },
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
    formatter(row, column, value) {
      return {
        "1": "正常",
        "2": "停用",
      }[value];
    },
  },
  {
    label: "创建时间",
    prop: "createTime",
    formatter(row, column, value) {
      return utils.formatDate(new Date(value));
    },
  },
]);
// 查询表单 状态默认是正常的
const queryForm = reactive({ menuState: 1 });
// rules
let rules = reactive({
  menuName: [
    {
      required: true,
      message: "请输入菜单名称",
      trigger: ["blur"],
    },
    {
      min: 2,
      max: 10,
      message: "长度在2-8个字符",
      trigger: "blur",
    },
  ],
});
// 是否弹窗
let showModel = ref(false);
// 什么操作
let action = ref("");
const { proxy } = getCurrentInstance();
// 菜单列表初始化
async function getMenuList() {
  try {
    let list = await proxy.$api.getMenuList(queryForm);
    menuList.value = list;
  } catch (e) {
    console.error(e);
  }
}
onMounted(() => {
  getMenuList();
});
// 表单重置
function handleReset(form) {
  proxy.$refs.form.resetFields();
}
// 新增菜单
function handleAdd(type, row) {
  // 两个新增的区别是有没有选中父级菜单
  // 弹出弹窗
  showModel.value = true;
  // 创建
  action.value = "add";
  // 第2个新增
  if (type === 2) {
    // 解构     过滤掉父级菜单为空的数据
    menuForm.parentId = [...row.parentId, row._id].filter((item) => item);
  }
}
function handleEdit(row: any) {
  // 弹出弹窗
  showModel.value = true;
  // 编辑
  action.value = "edit";
  // nextTick在下次 DOM 更新循环结束之后执行延迟回调。
  // 在修改数据之后立即使用这个方法，获取更新后的 DOM。
  proxy.$nextTick(() => {
    menuForm = row;
    // Object.assign(menuForm, row);
  });
}
async function handleDel(id) {
  // 如果失败会被request拦截
  await proxy.$api.menuSubmit({ id, action: "delete" });
  proxy.$message.success("删除成功");
  // 重新拉取菜单列表
  getMenuList();
}
// 菜单操作提交
function handleSubmit() {
  // valid为false说明校验失败
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = { params: menuForm, action: action.value };
      let res = await proxy.$api.menuSubmit(params);
      showModel.value = false;
      proxy.$message.success("操作成功");
      handleReset(proxy.$refs.dialogForm);
      proxy.$api.getMenuList();
    }
  });
}
// 弹窗关闭
function handleClose() {
  showModel.value = false;
  handleReset("dialogForm");
}
</script>
<style scoped></style>
