const mongoose = require("mongoose");
let deptShcema = mongoose.Schema({
  deptName: String,
  userId: String,
  userName: String,
  userEmail: String,
  parentId: [mongoose.Types.ObjectId],
  updateTime: {
    type: Date,
    default: Date.now(),
  },
  createTime: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("dept", deptShcema, "depts");
