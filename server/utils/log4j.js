/**
 * 日志存储
 */
var log4js = require("log4js");
const level = {
  trace: log4js.levels.TRACE,
  debug: log4js.levels.DEBUG,
  info: log4js.levels.INFO,
  warn: log4js.levels.WARN,
  error: log4js.levels.ERROR,
  fatal: log4js.levels.FATAL,
};
log4js.configure({
  appenders: {
    // 名字可以随便起      stdout输出到控制台
    console: { type: "console" },
    info: { type: "file", filename: "logs/all-my-logs.log" },
    error: {
      type: "dateFile",
      filename: "logs/error",
      pattern: "yyyy-MM-dd.log",
      //   错误日志文件名是filename和pattern的组合体
      alwaysIncludePattern: true,
    },
  },
  categories: {
    default: { appenders: ["info"], level: "debug" },
    error: { appenders: ["error"], level: "error" },
    info: { appenders: ["info"], level: "info" },
  },
});
/**
 * 日志输出，level为debug
 * @param {string} content
 */
exports.debug = (content) => {
  let logger = log4js.getLogger();
  logger.level = level.debug;
  logger.debug(content);
};
/**
 * 日志输出，level为error
 * @param {string} content
 */
exports.error = (content) => {
  // 参数是 categories 的键名（可以自定义），不写参数就不会写入log文件
  let logger = log4js.getLogger("error");
  logger.level = level.error;
  logger.error(content);
};
/**
 * 日志输出，level为info
 * @param {string} content
 */
exports.info = (content) => {
  let logger = log4js.getLogger("info");
  logger.level = level.info;
  logger.info(content);
};
