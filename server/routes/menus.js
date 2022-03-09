const router = require("koa-router")(); //可以直接调用，也可以new
const utils = require("../utils/util");
const Menu = require("../modules/menuSchema");
const util = require("../utils/util");
router.prefix("/menu");
// 菜单列表查询
router.get("/list", async (ctx) => {
  const { menuName, menuState } = ctx.request.query;
  const params = {};
  if (menuName) params.menuName = menuName;
  if (menuState) params.menuState = menuState;
  //所有列表字段  过滤
  let rootList = (await Menu.find(params)) || [];
  let permissionList = util.getTreeMenu(rootList, null, []);
  ctx.body = util.success(permissionList);
});

// 菜单增删改
// ctx：上下文环境
router.post("/operate", async (ctx) => {
  // 去掉id和action的其他参数为params
  const { _id, action, params } = ctx.request.body;
  let res, info;
  try {
    if (action == "add") {
      //   也可以用new Menu({}),然后调用实例的save方法
      res = await Menu.create(params);
      info = "创建成功";
    } else if ((action = "edit")) {
      params.updateTime = new Date();
      res = await Menu.findByIdAndUpdate(_id, params);
      info = "编辑成功";
    } else {
      res = await Menu.findByIdAndRemove(_id);
      //   要把子数据一起删除   query原型上的all方法可以选择查询条件
      res = await Menu.deleteMany({ parentId: { $all: [_id] } });
      info = "删除成功";
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
  ctx.body = util.success("", info);
});
// 需要导出
module.exports = router;
