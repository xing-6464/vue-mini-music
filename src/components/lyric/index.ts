import { defineComponent, ref, watchEffect } from "@vue-mini/core";

defineComponent({
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false,
    },
    lyric: String,
  },
  setup(props) {
    const lrcList = ref<{ lrc: string; time: number }[]>([]);

    watchEffect(() => {
      console.log(props.lyric);
      parseLyric(props.lyric);
    });

    function parseLyric(sLyric: string) {
      const lyricArr = sLyric.split("\n");
      const _lyricList: { lrc: string; time: number }[] = [];
      lyricArr.forEach((item) => {
        const time = item.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g);
        if (time != null) {
          const lrc = item.split(time[0])[1];
          const timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/);
          console.log(lrc);
          console.log(timeReg);
          if (timeReg == null) return;
          // 把时间转化为秒数
          const time2Seconds =
            parseInt(timeReg[1]) * 60 +
            parseInt(timeReg[2]) +
            parseInt(timeReg[3]) / 1000;
          _lyricList.push({
            lrc,
            time: time2Seconds,
          });
        }
      });
      lrcList.value = _lyricList;
    }

    return {
      lrcList,
    };
  },
});
