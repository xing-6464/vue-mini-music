import { definePage, onShow, ref } from "@vue-mini/core";

definePage((query) => {
  const picUrl = ref("");

  const musicList: { [key: string]: unknown }[] =
    wx.getStorageSync("musicList");
  // 正在播放歌曲的index
  const currentIndex = parseInt(query.index as string);

  onShow(async () => {
    await loadMusicDetail();
  });

  async function loadMusicDetail() {
    const music = musicList[currentIndex];
    await wx.setNavigationBarTitle({
      title: music.name as string,
    });

    picUrl.value = (music.al as { picUrl: string }).picUrl;
  }

  return {
    picUrl,
  };
});
