import { defineComponent, onReady, reactive, ref } from "@vue-mini/core";

defineComponent({
  setup() {
    // 音乐播放时间
    const showTime = reactive({
      currentTime: "00:00",
      totalTime: "00:00",
    });
    // 进度条可移动距离
    const movableDis = ref(0);
    // 进度条移动距离
    const progress = ref(0);

    return {
      // data
      showTime,
      movableDis,
      progress,
    };
  },
  lifetimes: {
    ready() {
      this._getMovableDis();
    },
  },
  methods: {
    _getMovableDis() {
      const query = this.createSelectorQuery();
      query.select(".movable-area").boundingClientRect();
      query.select(".movable-view").boundingClientRect();
      query.exec((res) => {
        console.log(res);
      });
    },
  },
});
