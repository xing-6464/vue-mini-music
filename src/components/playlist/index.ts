import { defineComponent, computed } from "@vue-mini/core";

defineComponent({
  properties: {
    playlist: {
      type: Object,
    },
  },
  setup(props) {
    // 小数转化，保留两位小数
    const playCount = computed(() => {
      const num = props.playlist.playCount as number;
      const numStr = num.toString().split(".")[0];
      if (numStr.length < 6) {
        return numStr;
      } else if (numStr.length >= 6 && numStr.length <= 8) {
        const decimal = numStr.substring(
          numStr.length - 4,
          numStr.length - 4 + 2,
        );

        return parseFloat(((num / 10000) | 0) + "." + decimal) + "万";
      } else if (numStr.length > 8) {
        const decimal = numStr.substring(
          numStr.length - 8,
          numStr.length - 8 + 2,
        );

        return parseFloat(((num / 100000000) | 0) + "." + decimal) + "亿";
      }
    });

    async function goToMusicList() {
      await wx.navigateTo({
        url: `../../pages/musicList/index?playlistId=${props.playlist.id}`,
      });
    }

    return {
      // data
      playCount,

      // functions
      goToMusicList,
    };
  },
});
