import { definePage, ref } from '@vue-mini/core'

definePage((options) => {
  console.log(options)
  const wordsNum = ref('0')
  const footerBottom = ref(0)
  const images = ref<WechatMiniprogram.MediaFile[]>([])
  const selectPhoto = ref(true)
  const MAX_WORDS = 140 // 微博140字限制
  const MAX_IMAGE_NUM = 9 // 微博图片最大数量

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

  function onChooseImage() {
    let max = MAX_IMAGE_NUM - images.value.length
    wx.chooseMedia({
      count: max,
      mediaType: ['image'],
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        images.value.push(...res.tempFiles) // 添加数组元素
        max = MAX_IMAGE_NUM - images.value.length
        selectPhoto.value = max <= 0 ? false : true
      },
    })
  }

  function onDeleteImage(e: { target: { dataset: { index: number } } }) {
    images.value.splice(e.target.dataset.index, 1) // 删除数组元素
    if (images.value.length < MAX_IMAGE_NUM) {
      selectPhoto.value = true
    }
  }

  function onPreviewImage(e: { target: { dataset: { imgsrc: string } } }) {
    void wx.previewImage({
      urls: images.value.map((item) => item.tempFilePath),
      current: e.target.dataset.imgsrc,
    })
  }

  function onBlur() {
    footerBottom.value = 0
  }

  return {
    wordsNum,
    footerBottom,
    selectPhoto,
    images,
    onDeleteImage,
    onPreviewImage,
    onInput,
    onFocus,
    onBlur,
    onChooseImage,
  }
})
