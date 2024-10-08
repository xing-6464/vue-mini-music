// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取数据库中的歌单列表,根据添加时间排序
  return await cloud
    .database()
    .collection("playlist")
    .skip(event.start)
    .limit(event.count)
    .orderBy("createTime", "desc")
    .get();
};
