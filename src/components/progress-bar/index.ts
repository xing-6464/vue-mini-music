import { defineComponent, onReady, reactive, ref } from '@vue-mini/core'

defineComponent({
  setup(props, ctx) {
    let progressValue = 0
    let movableDisValue = 0
    let movableAreaWidth = 0
    let movableViewWidth = 0
    let currentSec = '0' // 当前秒数
    let duration = 0 // 总时长
    let isMoving = false // 是否正在拖动 解决：当前进度条推动时候和updatetime事件冲突的问题
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    // 音乐播放时间
    const showTime = reactive({
      currentTime: '00:00',
      totalTime: '00:00',
    })
    // 进度条可移动距离
    const movableDis = ref(0)
    // 进度条移动距离
    const progress = ref(0)

    onReady(() => {
      getMovableDis()
      bindBGMEvents()
    })

    function onChange(e: { detail: { source: string; x: number; y: number } }) {
      // 拖动
      if (e.detail.source == 'touch') {
        progressValue =
          (e.detail.x / (movableAreaWidth - movableViewWidth)) * 100
        movableDisValue = e.detail.x
        isMoving = true
      }
    }

    function onTouchEnd() {
      const currentTimeFmt = dateFormat(
        Math.floor(backgroundAudioManager.currentTime),
      )
      progress.value = progressValue
      movableDis.value = movableDisValue
      Object.assign(showTime, {
        currentTime: currentTimeFmt.min + ':' + currentTimeFmt.sec,
      })
      backgroundAudioManager.seek((duration * progressValue) / 100)
      isMoving = false
    }

    function getMovableDis() {
      const q = ctx.createSelectorQuery()
      q.select('.movable-area').boundingClientRect()
      q.select('.movable-view').boundingClientRect()
      q.exec((rect: { width: number }[]) => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    }

    function bindBGMEvents() {
      backgroundAudioManager.onPlay(() => {
        isMoving = false
      })

      backgroundAudioManager.onStop(() => {})

      backgroundAudioManager.onPause(() => {})

      backgroundAudioManager.onWaiting(() => {})

      backgroundAudioManager.onCanplay(() => {
        if (typeof backgroundAudioManager.duration != 'undefined') {
          setTime()
        } else {
          setTimeout(() => {
            setTime()
          }, 1000)
        }
      })

      backgroundAudioManager.onTimeUpdate(() => {
        if (!isMoving) {
          const currentTime = backgroundAudioManager.currentTime
          const duration = backgroundAudioManager.duration
          const sec = currentTime.toString().split('.')[0]

          // 优化：防止重复触发
          if (sec != currentSec) {
            const currentTimeFmt = dateFormat(currentTime)

            movableDis.value =
              ((movableAreaWidth - movableViewWidth) * currentTime) / duration
            progress.value = (currentTime / duration) * 100
            Object.assign(showTime, {
              currentTime: currentTimeFmt.min + ':' + currentTimeFmt.sec,
            })
            currentSec = sec
            // 联动歌词
            ctx.triggerEvent('timeUpdate', {
              currentTime,
            })
          }
        }
      })

      backgroundAudioManager.onEnded(() => {
        ctx.triggerEvent('musicEnd')
      })

      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg)
        void wx.showToast({
          title: '错误' + res.errMsg,
        })
      })
    }

    function setTime() {
      duration = backgroundAudioManager.duration
      const durationFmt = dateFormat(duration)
      Object.assign(showTime, {
        totalTime: durationFmt.min + ':' + durationFmt.sec,
      })
    }

    // 格式化时间
    function dateFormat(sec: number) {
      const min = Math.floor(sec / 60)
      sec = Math.floor(sec % 60)
      return {
        min: parse0(min),
        sec: parse0(sec),
      }
    }

    // 补零
    function parse0(sec: number) {
      return sec < 10 ? '0' + sec : sec.toString()
    }

    return {
      // data
      showTime,
      movableDis,
      progress,
      // methods
      onChange,
      onTouchEnd,
    }
  },
})
