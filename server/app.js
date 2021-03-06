const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const log4js = require("./utils/log4j");
const index = require("./routes/index");
const jwt = require("jsonwebtoken");
const koajwt = require("koa-jwt");

//表
const users = require("./routes/users");
const menus = require("./routes/menus");
const roles = require("./routes/roles");
const depts = require("./routes/depts");
const leaves = require("./routes/leaves");
const util = require("./utils/util");

// 加载koa-router并调用方法
const router = require("koa-router")();
// error handler
onerror(app);

require("./config/db");
// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);

app.use(json());

// 输出日志
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "ejs",
  })
);
// // 测试log4js用的 错误 ctx
// app.use(async (ctx) => {
//   ctx.body = "error 111s";
// });
// logger

app.use(async (ctx, next) => {
  // 把参数记录到日志里
  log4js.info(`pramas: get ${JSON.stringify(ctx.request.query)}`);
  log4js.info(`pramas: post ${JSON.stringify(ctx.request.body)}`);
  // 没有token会被拦截
  await next().catch((err) => {
    // 401	Unauthorized	请求要求用户的身份认证
    if (err.status == "401") {
      // 可以修改状态码
      ctx.swtatus = 200;
      ctx.body = util.fail("Token认证失败", util.CODE.AUTH_ERROR);
    } else {
      // 如果不是401，抛出别的异常
      throw err;
    }
  });
});

app.use(
  koajwt({
    secret: "miyao",
    getToken: function (ctx, opts) {
      const { authorization } = ctx.header;
      if (authorization && authorization.split(" ")[0] === "snow") {
        return authorization.split(" ")[1];
      }
    },
  }).unless({
    path: [/\/users\/login/],
  })
);
// routes
router.prefix("/api"); //一级路由
router.get("/users/login", (ctx) => {
  const token = ctx.request.header.authorization.split(" ")[1];
  const playload = jwt.verify(token, "miyao");
  ctx.body = playload;
  return 3;
});
router.use(users.routes(), users.allowedMethods()); //2级路由 加载用户模块路由和用户模块的方法
router.use(menus.routes(), menus.allowedMethods());
router.use(roles.routes(), roles.allowedMethods());
router.use(depts.routes(), depts.allowedMethods());
router.use(leaves.routes(), leaves.allowedMethods());

app.use(router.routes(), router.allowedMethods()); //加载全部的路由
// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
  // log4js.error(`栈的信息：${error.stack}`);
});

module.exports = app;
