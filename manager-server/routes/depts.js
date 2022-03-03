const router = require("koa-router")();
const util = require("./../utils/util.js");
const Dept = require("./../modules/deptSchema");
// 二级路由前缀
router.prefix("/dept");
// 部门树形列表
router.get("/list", async (ctx) => {
  let { deptName } = ctx.request.query;
  let params = {};
  if (deptName) params.deptName = deptName;
  let rootList = await Dept.find(params);
  if (deptName) {
    ctx.body = util.success(rootList);
  } else {
    //   没有查询条件，全部显示
    // id为空，先查一级菜单
    let treeList = getTreeDept(rootList, null, []);
    ctx.body = util.success(treeList);
  }
});
// 递归拼接树形列表
function getTreeDept(rootList, id, list) {
  for (i < 0; i < rootList.length; i++) {
    let item = rootList[i];
    // 判断是不是一级菜单   pop会改变数组
    // id是buffer类型，需要都转成字符串
    if (String(item.parentId.slice().pop()) == String(id)) {
      // 把一级菜单push进数组
      list.push(item._doc); //item是mongoose的对象，提供了get方法可以取每个字段。需要通过_doc取每个子文档
    }
  }
  list.map((item) => {
    //   二级菜单
    item.children = [];
    getTreeDept(rootList, item._id, item.children);
    // 如果没有child就不需要child属性
    if (item.children.length == 0) {
      delete item.children;
    }
    // dept不需要判断是不是按钮
  });
}
// 部门的操作：创建，编辑，删除
router.post("/operate", async (ctx) => {
  const { _id, action, ...params } = ctx.request.body;
  let res, info;
  try {
    if (action == "create") {
      res = await Dept.create(params);
      info = "创建成功";
    } else if (action == "edit") {
      params.updateTime = new Date();
      res = await Dept.findByIdAndUpdate(_id, params);
      info = "编辑成功";
    } else if ((action = "delete")) {
      res = await Dept.findByIdAndRemove(_id);
      Dept.deleteMany({ parentId: { $all: [_id] } });
    }
    ctx.body = util.success("", info);
  } catch (error) {}
});
module.exports = router;
