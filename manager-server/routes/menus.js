const router = require("koa-router")(); //可以直接调用，也可以new
const utils = require("../utils/util");
const Menu = require("../modules/menuSchema");
const util = require("../utils/util");
router.prefix("/menu");
// 菜单列表查询
router.get("/list", async (ctx) => {
  console.log(1);
  const { menuName, menuState } = ctx.request.query;
  const params = {};
  if (menuName) params.menuName = menuName;
  if (menuState) params.menuState = menuState;
  //所有列表字段  过滤
  let rootList = (await Menu.find(params)) || [];
  //   rootList是所有列表字段， 第二个参数是菜单的parentid，第三个参数是叶子节点的数组？
  let permissionList = getTreeMenu(rootList, null, []);
  ctx.body = util.success(permissionList);
});
// 递归拼接树形列表
function getTreeMenu(rootList, id, list) {
  for (let i = 0; i < rootList.length; i++) {
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
    getTreeMenu(rootList, item._id, item.children);
    // 如果没有child就不需要child属性
    if (item.children.length == 0) {
      delete item.children;
    } else if (item.children[0].menuType == 2) {
      // 快速区分按钮和菜单，用于后期菜单按钮权限控制
      item.action = item.children;
    }
  });
}
// 菜单增删改
// ctx：上下文环境
router.post("/operate", async (ctx) => {
  // 去掉id和action的其他参数为params
  const { _id, action, ...params } = ctx.request.body;
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
