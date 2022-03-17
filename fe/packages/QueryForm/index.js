import QueryForm from "./QueryForm.vue";
// app是vue对象
// 组件注册
QueryForm.install = (app) => {
  app.component(QueryForm.name, QueryForm);
};
export default QueryForm;
