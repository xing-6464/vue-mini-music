// 云函数入口文件
const cloud = require("wx-server-sdk");

const TcbRouter = require("tcb-router");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });

  app.router("playlist", async (ctx, next) => {
    // 获取数据库中的歌单列表,根据添加时间排序
    ctx.body = await cloud
      .database()
      .collection("playlist")
      .skip(event.start)
      .limit(event.count)
      .orderBy("createTime", "desc")
      .get();
  });

  app.router("playlist_length", async (ctx, next) => {
    // 获取数据库中的歌单数量
    const res = await cloud.database().collection("playlist").count();
    ctx.body = res.total;
  });

  return app.serve();
};
