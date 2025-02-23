import { createApp } from '@vue-mini/core'

export type App = {
  setPlayingMusicId: (musicId: number) => void
  getPlayingMusicId: () => number
  setOpenid: (openid: string) => void
  getOpenid: () => string
}

createApp(() => {
  if (!wx.cloud) {
    console.error('请使用 2.2.3 或以上的基础库以使用云能力')
  } else {
    wx.cloud.init({
      env: 'cloud1-5g5oe2k1d4d8d78e',
      traceUser: true,
    })
  }

  const globalData = {
    playingMusicId: -1,
    openid: '',
  }

  void _getOpenid()

  function _setOpenid(openid: string) {
    globalData.openid = openid
  }

  async function _getOpenid() {
    const res = await wx.cloud.callFunction({
      name: 'login',
    })
    const openid = (res.result as AnyObject).openid as string
    _setOpenid(openid)
    if (wx.getStorageSync(openid) === '') {
      wx.setStorageSync('openid', [])
    }
  }

  function getOpenid() {
    return globalData.openid
  }

  function setPlayingMusicId(musicId: number) {
    globalData.playingMusicId = musicId
  }

  function getPlayingMusicId() {
    return globalData.playingMusicId
  }

  return {
    setPlayingMusicId,
    getPlayingMusicId,
    getOpenid,
  }
})
