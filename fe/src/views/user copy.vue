<script setup lang="ts">
import { reactive, ref } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import utils from "@u/utils";
import { toRaw } from "vue";

// 获取Composition API的上下文对象
const { proxy } = getCurrentInstance();
// reactive一般创建引用类型，ref一般创建基本类型
// 初始化用户表单对象
const user = reactive({
  state: 1,
});
// ref定义的对象通过.value进行赋值
// 初始化用户列表
const userList = ref([]);
// 所有角色列表
const roleList = ref([]);
const title = ref("用户新增");
// 所有部门列表
const deptList = ref([]);
// 分页插件
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: undefined,
});
//新增用户Form对象
const userForm = reactive({
  state: 3,
});
// 查询事件，获取用户列表
const handleQuery = function () {
  getUserList();
};
// 重置查询表单
const handleReset = (form) => {
  // 传参是为了动态重置，关闭弹窗的时候也可以重置
  proxy.$refs[form].resetFields();
};
// 获取用户列表
const getUserList = async () => {
  let params = { ...user, ...pager };
  try {
    const { list, page } = await proxy.$api.getUserList(params);
    userList.value = list;
    pager.total = page.total;
  } catch (error) {}
};
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
      required: true,
      message: "请选择部门",
      trigger: "blur",
    },
  ],
});
// 定义动态表格的格式
const columns = reactive([
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
    // formatter 属性用于格式化指定列的值，
    // 接受一个 Function，会传入两个参数：row 和 column
    formatter(row, column, value) {
      return {
        0: "管理员",
        1: "普通用户",
      }[value];
    },
  },
  {
    label: "用户状态",
    prop: "state",
    formatter(row, column, val) {
      return {
        1: "在职",
        2: "离职",
        3: "试用期",
      }[val];
    },
  },
  {
    label: "注册时间",
    prop: "createTime",
    width: 180,
    formatter: (row, column, value) => {
      return utils.formatDate(new Date(value));
    },
  },
  {
    label: "最后登录时间",
    prop: "lastLoginTime",
    width: 180,
    formatter: (row, column, value) => {
      return utils.formatDate(new Date(value));
    },
  },
]);
// 初始化接口调用
onMounted(() => {
  getUserList();
  getDeptList();
  getRoleAllList();
});
// 分页事件处理
let handleCurrentChange = (current) => {
  pager.pageNum = current;
  getUserList();
};
// 用户单个删除
let handleDel = async (row) => {
  await proxy.$api.userDel({
    userIds: [row.userId], //可单个删除，也可批量删除
  });
  proxy.$message.success("删除成功");
  // 刷新接口
  getUserList();
};
// 选中用户列表的对象
const checkedUserIds = ref([]);
// 批量删除
const handlePatchDel = async () => {
  if (checkedUserIds.value.length == 0) {
    proxy.$message.error("请选择要删除的用户");
    return;
  }
  const res = await proxy.$api.userDel({
    userIds: [checkedUserIds.value], //可单个删除，也可批量删除
  });
  if (res.oModified > 0) {
    proxy.$message.success("删除成功");
    // 刷新接口
    getUserList();
  } else {
    proxy.$message.error("删除失败");
  }
};
// 表格多选
const handleSelectionChange = (list) => {
  let arr = [];
  list.map((item) => {
    arr.push(item.userId);
  });
  checkedUserIds.value = arr;
};
// 弹窗显示对象
const showModel = ref(false);
// 用户新增
const handleCreate = () => {
  title.value = "用户新增";
  action.value = "add";
  showModel.value = true;
};
//定义用户操作类型
const action = ref("add");
// 用户编辑
const handleEdit = (row) => {
  action.value = "edit";
  showModel.value = true;
  title.value = "用户编辑";
  // dom渲染完成再执行代码
  proxy.$nextTick(() => {
    // 浅拷贝
    Object.assign(userForm, row);
  });
};
// 获取部门列表
const getDeptList = async () => {
  let list = await proxy.$api.getDeptList();
  deptList.value = list;
};
// 获取角色列表
const getRoleAllList = async () => {
  let list = await proxy.$api.getRoleAllList();
  roleList.value = list;
};
// 用户弹窗关闭
const handleClose = () => {
  showModel.value = false;
  handleReset("dialogForm");
};
// 用户提交
const handleSubmit = () => {
  // 校验
  // 在调用的方法里写async
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      // userForm 是响应式对象
      // toRaw把响应式对象变成普通对象
      let params = toRaw(userForm);
      params.userEmail += "@qq.com";
      console.log(params);
      let res = await proxy.$api.userSubmit(params);
      if (res) {
        showModel.value = false;
        proxy.$message.success("用户创建成功");
        // 重置表单
        handleReset("dialogForm");
        // 刷新表单
        getUserList();
      }
    }
  });
};
</script>

<template>
  <div class="user-manage">
    <div class="query-form">
      行内表单
      <el-form :inline="true" ref="form" :model="user">
        <!-- 不设置prop会导致无法重置，通过prop添加底层是可以获取到的 -->
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input
            v-model="user.userName"
            placeholder="请输入用户名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select placeholder="请选择用户状态" v-model="user.state">
            <!-- 该处动态绑定是数值类型，直接写是字符串类型 -->
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
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
        <el-button type="primary" @click="handleCreate" v-has="'user-create'"
          >新增</el-button
        >
        <el-button
          type="danger"
          @click="handlePatchDel"
          v-has="'user-patch-delete'"
          >批量删除</el-button
        >
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :width="item.width"
        ></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              @click="handleEdit(scope.row)"
              size="small"
              v-has="'user-eidt'"
              >编辑</el-button
            >
            <!-- 当前对象这一行 -->
            <el-button
              type="danger"
              @click="handleDel(scope.row)"
              size="small"
              v-has="'user-delete'"
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
    <el-dialog :title="title" v-model="showModel">
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
