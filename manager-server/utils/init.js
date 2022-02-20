module.exports = function (Schema, data) {
  Schema.remove(function (err) {
    console.log("初始化完成");
    Schema.create(data);
  });
};
