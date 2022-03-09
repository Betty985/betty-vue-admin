<template>
  <div class="Leave-manage">
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
            <el-option value="" label="全部"></el-option>
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
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table :data="applyList">
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
            <el-button @click="handleDetail(scope.row)" size="small"
              >查看</el-button
            >
            <!-- 当前对象这一行 -->
            <el-button
              @click="handleDelete(scope.row._id)"
              v-if="[1, 2].includes(scope.row.applyState)"
              type="danger"
              size="small"
              >作废</el-button
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
    <el-dialog title="申请休假" v-model="showModel" width="70%">
      <!-- ref和model的值一样会导致表单无法输入 -->
      <el-form
        ref="dialogForm"
        :model="leaveForm"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType">
            <el-option :value="1" label="事假"></el-option>
            <el-option :value="2" label="调休"></el-option>
            <el-option :value="3" label="年假"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间" required>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime" required>
                <el-date-picker
                  v-model="leaveForm.startTime"
                  type="date"
                  placeholder="选择开始日期"
                  @change="(val) => handleDateChange('startTime', val)"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="8">
              <el-form-item prop="endTime" required>
                <el-date-picker
                  v-model="leaveForm.endTime"
                  type="date"
                  placeholder="选择结束日期"
                  @change="(val) => handleDateChange('endTime', val)"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长" required>
          {{ leaveForm.leaveTime }}
        </el-form-item>
        <el-form-item label="休假原因" required>
          <el-input
            type="textarea"
            :row="3"
            placeholder="请输入休假原因"
            v-model="leaveForm.reasons"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="申请休假详情"
      width="50%"
      v-model="showDetailModel"
      destroy-on-close
    >
      <el-steps
        :active="detail.applyState > 2 ? 3 : detail.applyState"
        align-center
      >
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step title="审批通过/审批拒绝"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
        <el-form-item label="休假类型">
          {{ detail.applyTypeName }}
        </el-form-item>
        <el-form-item label="休假时间">
          {{ detail.time }}
        </el-form-item>
        <el-form-item label="休假时长">
          {{ detail.leaveTime }}
        </el-form-item>
        <el-form-item label="休假原因">
          {{ detail.reasons }}
        </el-form-item>
        <el-form-item label="审批状态">
          {{ detail.applyStateName }}
        </el-form-item>
        <el-form-item label="审批人">
          {{ detail.curAuditUserName }}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import utils from "@u/utils";
import { ref } from "vue";

// 获取Composition API的上下文对象
const { proxy } = getCurrentInstance();
// reactive一般创建引用类型，ref一般创建基本类型
const queryForm = reactive({
  applyState: "0",
});
let applyList = ref([]);
const action = ref("create");
const showModel = ref(false);
const showDetailModel = ref(false);
let detail = reactive({});
const leaveForm = reactive({
  applyType: 1,
  startTime: "",
  endTime: "",
  leaveTime: "0天",
  reasons: "",
});
// 定义表单校验规则
const rules = reactive({
  startTime: [
    {
      type: "date",
      required: true,
      message: "请输入开始日期",
      trigger: "change",
    },
  ],
  endTime: [
    {
      type: "date",
      required: true,
      message: "请输入结束日期",
      trigger: "change",
    },
  ],
  reasons: [
    {
      required: true,
      message: "请输入休假原因",
      trigger: ["change", "blur"],
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
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
// 初始化接口调用
onMounted(() => {
  getApplyList();
});
// 分页事件处理
let handleCurrentChange = (current) => {
  pager.pageNum = current;
  getApplyList();
};
// 重置查询表单
const handleReset = (form) => {
  // 传参是为了动态重置，关闭弹窗的时候也可以重置
  proxy.$refs[form].resetFields();
};
async function getApplyList() {
  let params = { ...queryForm, ...pager };
  let { list, page } = await proxy.$api.getApplyList(params);
  applyList.value = list;
  pager.total = page.total;
}
const handleApply = () => {
  showModel.value = true;
  action.value = "create";
};
// 弹框关闭
const handleClose = () => {
  showModal.value = false;
  handleReset("dialogForm");
};
// 获取休假时长
const handleDateChange = (key, val) => {
  let { startTime, endTime } = leaveForm;
  if (!startTime || !endTime) return;
  if (startTime > endTime) {
    proxy.$message.error("开始日期不能晚于结束日期");
    leaveForm.leaveTime = "0天";
    setTimeout(() => {
      leaveForm[key] = "";
    }, 0);
  } else {
    leaveForm.leaveTime =
      (endTime - startTime) / (24 * 60 * 60 * 1000) + 1 + "天";
  }
};
// 申请提交
const handleSubmit = () => {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      try {
        let params = { ...leaveForm, action: action.value };
        let res = await proxy.$api.leaveOperate(params);
        proxy.$message.success("创建成功");
        handleClose();
        getApplyList();
      } catch (error) {}
    }
  });
};

const handleDetail = (row) => {
  let data = { ...row };
  data.applyTypeName = {
    1: "事假",
    2: "调休",
    3: "年假",
  }[data.applyType];
  data.time =
    utils.formateDate(new Date(data.startTime), "yyyy-MM-dd") +
    "到" +
    utils.formateDate(new Date(data.endTime), "yyyy-MM-dd");
  // 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
  data.applyStateName = {
    1: "待审批",
    2: "审批中",
    3: "审批拒绝",
    4: "审批通过",
    5: "作废",
  }[data.applyState];
  detail = data;
  showDetailModel.value = true;
};

const handleDelete = async (_id) => {
  try {
    let params = { _id, action: "delete" };
    await proxy.$api.leaveOperate(params);
    proxy.$message.success("删除成功");
    getApplyList();
  } catch (error) {}
};
</script>
<style scoped></style>
