<template>
  <div class="approve-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getApplyList" type="primary">查询</el-button>
          <el-button @click="handleReset(form)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <el-table :data="applyList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-buton
              @click="handelDetail(scope.row)"
              v-if="
                scope.row.curAuditUserName === userInfo.userName &&
                [1, 2].includes(scope.row.applyState)
              "
              size="mini"
              >审核</el-buton
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="pagination"
      background
      layout="prev,pager,next"
      :total="pager.total"
      :page-size="pager.pageSize"
      :current-change="handleCurrentChange"
    ></el-pagination>
    <el-dialog
      title="审核"
      width="50%"
      v-model="showDetailModel"
      destroy-on-close
    >
      <el-form
        :ref="leaveForm"
        :model="auditForm"
        label-width="120px"
        label-suffix=":"
        :rules="rules"
      >
        <el-form-item label="申请人">
          {{ detail.applyUser.userName }}
        </el-form-item>
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
        <el-form-item label="审批人"
          >{{ detail.curAuditUserName }}
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :row="3"
            placeholder="请输入审核备注"
            v-model="auditForm.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleApprove('pass')"> 审核通过 </el-button>
          <el-button @click="handleApprove('refuse')" type="danger">
            驳回
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import utils from "@u/utils";
import { getCurrentInstance, onMounted, reactive } from "@vue/runtime-core";
import { ref } from "vue";
let { proxy } = getCurrentInstance();
let queryForm = reactive({
  applyState: 1,
});
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
let columns = reactive([
  {
    label: "单号",
    prop: "orderNo",
  },
  {
    label: "申请人",
    prop: "",
    formatter: (row) => {
      return row.applyUser.userName;
    },
  },
  {
    label: "休假时间",
    prop: "",
    formatter: (row) => {
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
    formatter: (row, column, value) => {
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
// 申请列表
let applyList = ref([]);
// 创建休假弹框表单
let leaveForm = reactive({
  applyType: 1,
  startTime: "",
  endTime: "",
  leaveTime: "0天",
  reasons: "",
});
let showDetailModel = ref(false);
let detail = reactive({});
let userInfo = proxy.$store.state.userInfo;
let rules = {
  remark: [
    {
      require: true,
      message: "请输入审核备注",
      trigger: "change",
    },
  ],
};
let auditForm = reactive({
  remark: "",
});
onMounted(() => {
  getApplyList();
});
async function getApplyList() {
  let params = { ...queryForm, ...pager, type: "approve" };
  let { list, page } = await proxy.$api.getApplyList(params);
  applyList.value = list;
  pager.total = page.total;
}
function handleReset(form) {
  proxy.$refs[form].resetFields();
}
function handleCurrentChange(cur) {
  pager.pageNum = cur;
  getApplyList();
}
function handelClose() {
  showDetailModel.value = false;
  handleReset("dialogForm");
}
function handelDetail(row) {
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
  data.applyStateName = {
    1: "待审批",
    2: "审批中",
    3: "审批拒绝",
    4: "审批通过",
    5: "作废",
  }[data.applyState];
  detail = data;
  showDetailModel.value = true;
}
function handleApprove(action) {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = {
        action,
        remark: auditForm.remark,
        _id: detail._id,
      };
      try {
        await proxy.$api.leaveApprove(params);
        handelClose();
        proxy.$message.success("处理成功");
        getApplyList();
        proxy.$store.commit(
          "saveNoticeCount",
          proxy.$store.state.noticeCount - 1
        );
      } catch (error) {}
    }
  });
}
</script>
