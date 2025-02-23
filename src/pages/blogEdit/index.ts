import { definePage, ref } from '@vue-mini/core'

definePage((options) => {
  console.log(options)
  const wordsNum = ref('0')
  const footerBottom = ref(0)
  const MAX_WORDS = 140 // 微博140字限制

  function onInput(e: { detail: { value: string } }) {
    const _wordsNum = e.detail.value.length
    if (_wordsNum >= MAX_WORDS) {
      wordsNum.value = `最大字数为${MAX_WORDS}`
      return
    }
    wordsNum.value = _wordsNum.toString()
  }

  function onFocus(e: { detail: { height: number } }) {
    footerBottom.value = e.detail.height
  }
  function onBlur() {
    footerBottom.value = 0
  }

  return {
    wordsNum,
    footerBottom,
    onInput,
    onFocus,
    onBlur,
  }
})
