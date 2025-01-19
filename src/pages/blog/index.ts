import { definePage } from '@vue-mini/core'

definePage(() => {
  // 发布
  function onPublish() {
    console.log('publish')
  }

  return {
    onPublish,
  }
})
