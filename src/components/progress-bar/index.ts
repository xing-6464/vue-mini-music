import { defineComponent, onReady, reactive, ref } from "@vue-mini/core";

defineComponent({
  setup(props, ctx) {
    let movableAreaWidth = 0;
    let movableViewWidth = 0;
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    // 音乐播放时间
    const showTime = reactive({
      currentTime: "00:00",
      totalTime: "00:00",
    });
    // 进度条可移动距离
    const movableDis = ref(0);
    // 进度条移动距离
    const progress = ref(0);

    onReady(() => {
      getMovableDis();
      bindBGMEvents();
    });

    function getMovableDis() {
      const q = ctx.createSelectorQuery();
      q.select(".movable-area").boundingClientRect();
      q.select(".movable-view").boundingClientRect();
      q.exec((rect: { width: number }[]) => {
        movableAreaWidth = rect[0].width;
        movableViewWidth = rect[1].width;
        console.log(movableAreaWidth, movableViewWidth);
      });
    }

    function bindBGMEvents() {
      backgroundAudioManager.onPlay(() => {});

      backgroundAudioManager.onStop(() => {});

      backgroundAudioManager.onPause(() => {});

      backgroundAudioManager.onWaiting(() => {});

      backgroundAudioManager.onCanplay(() => {
        console.log(backgroundAudioManager.duration);
        if (typeof backgroundAudioManager.duration != "undefined") {
          setTime();
        } else {
          setTimeout(() => {
            setTime();
          }, 1000);
        }
      });

      backgroundAudioManager.onTimeUpdate(() => {});

      backgroundAudioManager.onEnded(() => {});

      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg);
        void wx.showToast({
          title: "错误" + res.errMsg,
        });
      });
    }

    function setTime() {
      const duration = backgroundAudioManager.duration;
      const durationFmt = dateFormat(duration);
      console.log(durationFmt);
      Object.assign(showTime, {
        totalTime: durationFmt.min + ":" + durationFmt.sec,
      });
    }

    // 格式化时间
    function dateFormat(sec: number) {
      const min = Math.floor(sec / 60);
      sec = Math.floor(sec % 60);
      return {
        min: parse0(min),
        sec: parse0(sec),
      };
    }

    // 补零
    function parse0(sec: number) {
      return sec < 10 ? "0" + sec : sec;
    }

    return {
      // data
      showTime,
      movableDis,
      progress,
    };
  },
});
