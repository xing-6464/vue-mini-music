import { type App } from '@/app'
import { definePage, ref } from '@vue-mini/core'

definePage(() => {
  const defaultAvatarUrl =
    'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

  const avatarUrl = ref(defaultAvatarUrl)
  const avatarFileId = ref('')
  const app = getApp<App>()

  function onChooseAvatar(e: { detail: { avatarUrl: string } }) {
    const { avatarUrl: a } = e.detail
    avatarUrl.value = a
    uploadFile()
  }

  function uploadFile() {
    const suffix = /\.\w+$/.exec(avatarUrl.value)?.[0]
    wx.cloud.uploadFile({
      cloudPath: `avatar/${Date.now()}-${Math.random() * 1000000}${suffix}`,
      filePath: avatarUrl.value,
      success: (res) => {
        avatarFileId.value = res.fileID
      },
      fail: (err) => console.error(err),
    })
  }

  function formSubmit(e: { detail: { value: { nickname: string } } }) {
    const { nickname } = e.detail.value

    // 保存头像和昵称
    // 可以保存在云数据库中或者本地存储，这里以本地存储为例
    const openid = app.getOpenid()

    if (nickname.trim() === '' || avatarFileId.value === '') {
      void wx.showToast({
        icon: 'error',
        title: '昵称或头像不能为空',
      })
    }

    wx.setStorage({
      key: `${openid}-userinfo`,
      data: {
        nickname,
        avatarFileId: avatarFileId.value,
      },
      success: async () => {
        await wx
          .showToast({
            icon: 'success',
            title: '保存成功',
          })
          .then(() => {
            setTimeout(() => {
              void wx.navigateBack()
            }, 1500)
          })
      },
      fail: async () => {
        await wx.showToast({
          icon: 'error',
          title: '保存失败',
        })
      },
    })
  }

  return {
    avatarUrl,
    avatarFileId,
    onChooseAvatar,
    formSubmit,
  }
})
