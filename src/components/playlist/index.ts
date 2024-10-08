import { defineComponent } from "@vue-mini/core";

defineComponent({
  properties: {
    playlist: {
      type: Object,
    },
  },
  setup(props) {
    console.log(props.playlist);
  },
});
