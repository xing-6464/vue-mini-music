import { defineComponent } from '@vue-mini/core'

defineComponent({
  properties: {
    modalShow: Boolean,
  },
  options: {
    styleIsolation: 'apply-shared',
    multipleSlots: true,
  },
  methods: {
    onClose() {
      this.setData({
        modalShow: false,
      })
    },
  },
})
