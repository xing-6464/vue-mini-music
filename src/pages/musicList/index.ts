import { definePage, onShow, ref } from "@vue-mini/core";

definePage((query) => {
  const musicList = ref<{ [key: string]: unknown }[]>([]);
  const listInfo = ref<{ [key: string]: unknown }>({});

  onShow(async () => {
    await wx.showLoading({ title: "加载中" });
    const { result } = await wx.cloud.callFunction({
      name: "music",
      data: {
        playlistId: query.playlistId,
        $url: "musicList",
      },
    });

    const playlist = (result as AnyObject).playlist as AnyObject;
    musicList.value = playlist.tracks as AnyObject[];
    listInfo.value = {
      coverImgUrl: playlist.coverImgUrl as string,
      name: playlist.name as string,
    };

    await wx.hideLoading();
  });

  return {
    // data
    musicList,
    listInfo,
  };
});
