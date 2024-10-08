import { definePage, ref } from "@vue-mini/core";

definePage(() => {
  const greeting = ref("欢迎使用 Vue Mini");

  return {
    greeting,
  };
});
