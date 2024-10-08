// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database(); // 初始化数据库
const axios = require("axios");
const ICODE = "9C7A1756CCCEBE22";
const URL = `https://apis.imooc.com/personalized?icode=${ICODE}`;

// 云函数入口函数
exports.main = async (event, context) => {
  const { data } = await axios.get(URL);
  if (data.code >= 1000) {
    console.log("获取歌单失败", data.msg);
    return 0;
  }
  const playlist = data.result;
  console.log(playlist);

  // 保存歌单到数据库
  if (playlist.length > 0) {
    try {
      await db
        .collection("playlist")
        .add({
          data: [...playlist],
        })
        .then((res) => {
          console.log("添加歌单成功");
          return res;
        });
    } catch (err) {
      console.error("添加歌单失败", err);
    }
  }
};
