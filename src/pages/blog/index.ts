import { definePage } from '@vue-mini/core'

definePage({
  data: {
    modalShow: false,
  },
  onPublish() {
    this.setData({
      modalShow: true,
    })
  },
})
