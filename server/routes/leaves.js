const router = require("koa-router")();
const Leave = require("./../modules/leaveSchema");
const Dept = require("./../modules/deptSchema");
const utils = require("./../utils/util");
router.prefix("/leave");
router.get("/list", async (ctx) => {
  const { applyState, type } = ctx.request.query;
  const { page, skipIndex } = utils.paper(ctx.request.query);
  let authorization = ctx.request.headers.authorization;
  let { data } = utils.decoded(authorization);
  try {
    let params = {};
    if (type == "approve") {
      if (applyState == 1 || applyState == 2) {
        params.curAuditUserName = data.userName;
        params.$or = [{ applyState: 1 }, { applyState: 2 }];
      } else if (applyState > 2) {
        params = { "auditFlows.userId": data.userId, applyState };
      } else {
        params = { "auditFlows.userId": data.userId };
      }
    } else {
      params = {
        "applyUser.userId": data.userId,
      };
      if (applyState) params.applyState = applyState;
    }
    const query = Leave.find(params);
    const list = await query.skip(skipIndex).limit(page.pageSize);
    const total = await Leave.countDocuments(params);
    ctx.body = utils.success({
      page: {
        ...page,
        total,
      },
      list,
    });
  } catch (error) {
    ctx.body = utils.fail(`查询失败:${error.stack}`);
  }
});

router.get("/count", async (ctx) => {
  let authorization = ctx.request.headers.authorization;
  let { data } = utils.decoded(authorization);
  try {
    let params = {};
    params.curAuditUserName = data.userName;
    params.$or = [{ applyState: 1 }, { applyState: 2 }];
    const total = await Leave.countDocuments(params);
    ctx.body = utils.success(total);
  } catch (error) {
    ctx.body = utils.fail(`查询异常：${error.message}`);
  }
});

router.post("/operate", async (ctx) => {
  const { _id, action, ...params } = ctx.request.body;
  let authorization = ctx.request.headers.authorization;
  let { data } = utils.decoded(authorization);

  if (action == "create") {
    // 生成申请单号
    let orderNo = "XJ";
    orderNo += utils.formateDate(new Date(), "yyyyMMdd");
    const total = await Leave.countDocuments();
    params.orderNo = orderNo + total;

    // 获取用户当前部门ID
    let id = data.deptId.pop();
    // 查找负责人信息
    let dept = await Dept.findById(id);
    // 获取人事部门和财务部门负责人信息
    let userList = await Dept.find({
      deptName: { $in: ["人事部门", "财务部门"] },
    });

    let auditUsers = dept.userName;
    let auditFlows = [
      {
        userId: dept.userId,
        userName: dept.userName,
        userEmail: dept.userEmail,
      },
    ];
    userList.map((item) => {
      auditFlows.push({
        userId: item.userId,
        userName: item.userName,
        userEmail: item.userEmail,
      });
      auditUsers += "," + item.userName;
    });

    params.auditUsers = auditUsers;
    params.curAuditUserName = dept.userName;
    params.auditFlows = auditFlows;
    params.auditLogs = [];
    params.applyUser = {
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
    };

    let res = await Leave.create(params);
    ctx.body = utils.success("", "创建成功");
  } else {
    let res = await Leave.findByIdAndUpdate(_id, { applyState: 5 });
    ctx.body = utils.success("", "操作成功");
  }
});

router.post("/approve", async (ctx) => {
  const { action, remark, _id } = ctx.request.body;
  let authorization = ctx.request.headers.authorization;
  let { data } = utils.decoded(authorization);
  let params = {};
  try {
    // 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
    let doc = await Leave.findById(_id);
    let auditLogs = doc.auditLogs || [];
    if (action == "refuse") {
      params.applyState = 3;
    } else {
      // 审核通过
      if (doc.auditFlows.length == doc.auditLogs.length) {
        ctx.body = utils.success("当前申请单已处理，请勿重复提交");
        return;
      } else if (doc.auditFlows.length == doc.auditLogs.length + 1) {
        params.applyState = 4;
      } else if (doc.auditFlows.length > doc.auditLogs.length) {
        params.applyState = 2;
        params.curAuditUserName =
          doc.auditFlows[doc.auditLogs.length + 1].userName;
      }
    }
    auditLogs.push({
      userId: data.userId,
      userName: data.userName,
      createTime: new Date(),
      remark,
      action: action == "refuse" ? "审核拒绝" : "审核通过",
    });
    params.auditLogs = auditLogs;
    let res = await Leave.findByIdAndUpdate(_id, params);
    ctx.body = utils.success("", "处理成功");
  } catch (error) {
    ctx.body = utils.fail(`查询异常：${error.message}`);
  }
});

module.exports = router;
