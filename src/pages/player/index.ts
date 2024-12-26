import { definePage, onShow, ref } from "@vue-mini/core";

definePage((query) => {
  // 音乐封面图片url
  const picUrl = ref("");
  // 音乐是否正在播放
  const isPlaying = ref(false);

  const musicList: { [key: string]: unknown }[] =
    wx.getStorageSync("musicList");
  // 正在播放歌曲的index
  let currentIndex = parseInt(query.index as string);
  // 获取全局唯一的背景音频管理器
  const backgroundAudioManager = wx.getBackgroundAudioManager();

  onShow(async () => {
    await loadMusicDetail(query.musicId as string);
  });

  // 加载音乐详情
  async function loadMusicDetail(musicId: string) {
    backgroundAudioManager.stop();
    const music = musicList[currentIndex];
    await wx.setNavigationBarTitle({
      title: music.name as string,
    });

    picUrl.value = (music.al as { picUrl: string }).picUrl;
    isPlaying.value = false;

    // 加载音乐url
    await wx.showLoading({
      title: "加载中",
    });
    await wx.cloud
      .callFunction({
        name: "music",
        data: {
          musicId,
          $url: "musicUrl",
        },
      })
      .then(async (res) => {
        console.log(res);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = res.result as AnyObject;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (result.data[0].url == null) {
          await wx.showToast({
            title: "该歌曲暂无版权",
          });
          await wx.hideLoading();
          onNext();
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        backgroundAudioManager.src = result.data[0].url as string;
        backgroundAudioManager.title = music.name as string;
        backgroundAudioManager.coverImgUrl = (
          music.al as { picUrl: string }
        ).picUrl;
        backgroundAudioManager.singer = (
          music.ar as { [key: string]: string }[]
        )[0].name;
        backgroundAudioManager.epname = (music.al as { name: string }).name;

        isPlaying.value = true;
        await wx.hideLoading();
      });
  }

  function togglePlaying() {
    // 正在播放
    if (isPlaying.value) {
      backgroundAudioManager.pause();
    } else {
      backgroundAudioManager.play();
    }
    isPlaying.value = !isPlaying.value;
  }

  function onPrev() {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = musicList.length - 1;
    }
    void loadMusicDetail(musicList[currentIndex].id as string);
  }

  function onNext() {
    currentIndex++;
    if (currentIndex >= musicList.length) {
      currentIndex = 0;
    }
    void loadMusicDetail(musicList[currentIndex].id as string);
  }

  return {
    picUrl,
    isPlaying,
    togglePlaying,
    onPrev,
    onNext,
  };
});
