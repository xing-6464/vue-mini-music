import { definePage, ref } from "@vue-mini/core";

definePage((query) => {
  console.log(query);
  const greeting = ref("希望你会喜欢");

  return {
    greeting,
  };
});
