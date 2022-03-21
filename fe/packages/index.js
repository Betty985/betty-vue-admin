import QueryForm from "./QueryForm";
// 实际执行的index.js文件
import BaseTable from "./BaseTable";
export default {
  install(app) {
    app.use(QueryForm);
    app.use(BaseTable);
  },
};
