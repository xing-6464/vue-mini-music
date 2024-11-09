import { definePage, onShow, ref } from "@vue-mini/core";

definePage((query) => {
  const musicList = ref<{ [key: string]: unknown }[]>([]);
  const listInfo = ref<{ [key: string]: unknown }>({});

  // hook
  onShow(async () => {
    // 加载歌单歌曲列表
    await wx.showLoading({ title: "加载中" });
    const { result } = await wx.cloud.callFunction({
      name: "music",
      data: {
        playlistId: query.playlistId,
        $url: "musicList",
      },
    });
    await wx.hideLoading();

    // 获取歌单信息
    const playlist = (result as AnyObject).playlist as AnyObject;
    musicList.value = playlist.tracks as AnyObject[];
    listInfo.value = {
      coverImgUrl: playlist.coverImgUrl as string,
      name: playlist.name as string,
    };

    setMusicList();
  });

  // 持久化存储歌单列表
  function setMusicList() {
    wx.setStorageSync("musicList", musicList.value);
  }

  return {
    // data
    musicList,
    listInfo,
    // methods
    setMusicList,
  };
});
