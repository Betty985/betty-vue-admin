/**
 *维护用户Id自增长表
 */
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  _id: String,
  sequence_value: Number,
});
module.exports = mongoose.model("couters", userSchema, "couters");
