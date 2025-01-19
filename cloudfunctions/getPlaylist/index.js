// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database() // 初始化数据库
const axios = require('axios')
const ICODE = '7CF78BFBFA13F9F7'
const URL = `https://apis.imooc.com/personalized?icode=${ICODE}`
const playlistCollection = db.collection('playlist')

const MAX_LIMIT = 100 // 最大限制

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取歌单
  // const list = await playlistCollection.get(); // 突破100条限制
  const count = await playlistCollection.count()
  const total = count.total
  const batchTimes = Math.ceil(total / MAX_LIMIT) // 计算分批次数
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = await playlistCollection
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get()
    tasks.push(promise)
  }
  let list = {
    data: [],
  }
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: [...acc.data, ...cur.data],
      }
    })
  }

  // 获取最新歌单
  const { data } = await axios.get(URL)
  if (data.code >= 1000) {
    console.log('获取歌单失败', data.msg)
    return 0
  }
  const playlist = data.result

  // 去重
  const newData = []
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true // 判断是否存在相同歌单
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      // 判断是否存在相同歌单
      if (playlist[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(playlist[i])
    }
  }

  // 保存歌单到数据库
  if (newData.length > 0) {
    try {
      await db
        .collection('playlist')
        .add({
          data: [...newData],
        })
        .then((res) => {
          console.log('添加歌单成功')
          return res
        })
    } catch (err) {
      console.error('添加歌单失败', err)
    }
  }

  return newData.length
}
