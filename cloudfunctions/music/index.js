// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')
const axios = require('axios')

const ICODE = '7CF78BFBFA13F9F7'
const ICODESTRING = `icode=${ICODE}`
const BASE_URL = 'https://apis.imooc.com'

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })

  app.router('playlist', async (ctx, next) => {
    // 获取数据库中的歌单列表,根据添加时间排序
    ctx.body = await cloud
      .database()
      .collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
  })

  // 获取数据库中的歌单数量
  app.router('playlist_length', async (ctx, next) => {
    const res = await cloud.database().collection('playlist').count()
    ctx.body = res.total
  })

  // 获取歌单列表
  app.router('musicList', async (ctx, next) => {
    const res = await axios.get(
      `${BASE_URL}/playlist/detail?id=${event.playlistId}&${ICODESTRING}`,
    )
    ctx.body = res.data
  })

  // 获取歌曲路由
  app.router('musicUrl', async (ctx, next) => {
    ctx.body = await axios
      .get(BASE_URL + `/song/url?id=${event.musicId}&${ICODESTRING}`)
      .then((res) => res.data)
  })

  // 获取歌词
  app.router('lyric', async (ctx, next) => {
    ctx.body = await axios
      .get(BASE_URL + `/lyric?id=${event.musicId}&${ICODESTRING}`)
      .then((res) => res.data)
  })

  return app.serve()
}
