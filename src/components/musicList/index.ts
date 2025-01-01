import { type App } from '@/app'
import { defineComponent, onShow, ref } from '@vue-mini/core'

defineComponent({
  properties: {
    musicList: {
      type: Array,
    },
  },
  setup() {
    const playingId = ref(-1)
    const app = getApp<App>()

    onShow(() => {
      // 同步修改当前播放音乐
      playingId.value = app.getPlayingMusicId()
    })

    async function onSelect(e: TouchEvent) {
      const { musicid, index } = (
        e.currentTarget! as unknown as {
          dataset: { musicid: number; index: number }
        }
      ).dataset
      playingId.value = musicid

      await wx.navigateTo({
        url: `../../pages/player/index?musicId=${musicid}&index=${index}`,
      })
    }

    return {
      //data
      playingId,
      // functions
      onSelect,
    }
  },
})
