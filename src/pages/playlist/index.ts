import {
  definePage,
  onPullDownRefresh,
  onReachBottom,
  onShow,
  ref,
} from "@vue-mini/core";

const MAX_LIMIT = 15;

definePage(() => {
  const swiperImgUrls = [
    {
      url: "http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg",
    },
    {
      url: "http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg",
    },
    {
      url: "http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg",
    },
  ];
  const playlists = ref<{ [key: string]: string | number }[]>([]);
  const playlistsCount = ref(0);

  // 获取歌单
  const getPlaylist = async () => {
    // 判断是否已经获取完毕
    if (playlists.value.length === playlistsCount.value) {
      return;
    }

    // 显示加载动画
    await wx.showLoading({
      title: "加载中",
    });
    // 调用云函数获取歌单
    const { result } = await wx.cloud.callFunction({
      name: "music",
      data: {
        start: playlists.value.length,
        count: MAX_LIMIT,
        $url: "playlist",
      },
    });
    if (result && typeof result !== "string" && Array.isArray(result.data)) {
      playlists.value = playlists.value.concat(result.data);
      // 停止下拉刷新
      await wx.stopPullDownRefresh();
    }
    // 隐藏加载动画
    await wx.hideLoading();
  };

  // 监听页面显示
  onShow(async () => {
    const { result } = await wx.cloud.callFunction({
      name: "music",
      data: {
        $url: "playlist_length",
      },
    });
    playlistsCount.value = parseInt(result as string);
    await getPlaylist();
  });

  // 下拉刷新
  onPullDownRefresh(async () => {
    playlists.value = [];
    await getPlaylist();
  });

  // 滚动条触底
  onReachBottom(async () => {
    await getPlaylist();
  });

  return {
    swiperImgUrls,
    playlists,
  };
});
