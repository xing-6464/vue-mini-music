import { defineComponent, ref } from "@vue-mini/core";

defineComponent({
  properties: {
    musicList: {
      type: Array,
    },
  },
  setup() {
    const playingId = ref(-1);

    async function onSelect(e: TouchEvent) {
      const musicid = (
        e.currentTarget! as unknown as { dataset: { musicid: number } }
      ).dataset.musicid;
      playingId.value = musicid;

      await wx.navigateTo({
        url: `../../pages/player/index?musicid=${musicid}`,
      });
    }

    return {
      //data
      playingId,
      // functions
      onSelect,
    };
  },
});
