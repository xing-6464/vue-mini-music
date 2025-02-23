import { App } from '@/app'
import { definePage } from '@vue-mini/core'

definePage(() => {
  const app = getApp<App>()
  // const modalShow = ref(false)
  function onPublish() {
    // modalShow.value = true

    const openid = app.getOpenid()
    wx.getStorage({
      key: `${openid}-userinfo`,
      success: async (res: {
        data: { nickname: string; avatarFileId: string }
      }) => {
        const { nickname, avatarFileId } = res.data

        // 如果用户信息存在，那么就跳转到发博客页面
        await wx.navigateTo({
          url: `../blogEdit/index?nickName=${nickname}&avatarUrl=${avatarFileId}`,
        })
      },
      fail: () => {
        // 如果用户信息不存在，那么就跳转到用户配置页面
        void wx
          .showToast({
            icon: 'loading',
            title: '请用户配置信息',
          })
          .then(() => {
            setTimeout(() => {
              void wx.navigateTo({
                url: '../userinfo/index',
              })
            }, 1200)
          })
      },
    })
  }

  return {
    // modalShow,
    onPublish,
  }
})
