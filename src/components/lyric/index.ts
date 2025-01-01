import { defineComponent, onReady, ref, watchEffect } from '@vue-mini/core'

defineComponent({
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false,
    },
    lyric: String,
  },
  setup(props) {
    let lyricHight = 0 // 歌词高度

    const lrcList = ref<{ lrc: string; time: number }[]>([])
    const nowLyricIndex = ref(0) // 当前歌词索引
    const scrollTop = ref(0) // 滚动条位置

    onReady(() => {
      const windowInfo = wx.getWindowInfo()
      // 1rpx = 屏幕高度 / 750 * 64
      lyricHight = (windowInfo.screenWidth / 750) * 64
    })

    watchEffect(() => {
      const lyric = props.lyric
      if (lyric == '暂无歌词') {
        lrcList.value = [
          {
            lrc: lyric,
            time: 0,
          },
        ]
        nowLyricIndex.value = -1
      } else {
        parseLyric(lyric)
      }
    })

    function parseLyric(sLyric: string) {
      const lyricArr = sLyric.split('\n')
      const _lyricList: { lrc: string; time: number }[] = []
      lyricArr.forEach((item) => {
        const time = item.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          const lrc = item.split(time[0])[1]
          const timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          if (timeReg == null) return
          // 把时间转化为秒数
          const time2Seconds =
            parseInt(timeReg[1]) * 60 +
            parseInt(timeReg[2]) +
            parseInt(timeReg[3]) / 1000
          _lyricList.push({
            lrc,
            time: time2Seconds,
          })
        }
      })
      lrcList.value = _lyricList
    }

    function update(currentTime: number) {
      const lrcListValue = lrcList.value
      if (lrcListValue.length === 0) return

      if (currentTime > lrcListValue[lrcListValue.length - 1].time) {
        if (nowLyricIndex.value != -1) {
          nowLyricIndex.value = -1
          scrollTop.value = lrcListValue.length * lyricHight
        }
      }
      for (let i = 0, len = lrcListValue.length; i < len; i++) {
        if (currentTime <= lrcListValue[i].time) {
          nowLyricIndex.value = i - 1
          scrollTop.value = (i - 1) * lyricHight
          break
        }
      }
    }

    return {
      nowLyricIndex,
      lrcList,
      scrollTop,
      update,
    }
  },
})
