import { defineComponent, watchEffect } from "@vue-mini/core";

defineComponent({
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false,
    },
    lyric: String,
  },
  setup(props) {
    watchEffect(() => {
      console.log(props.lyric);
    });
  },
});
