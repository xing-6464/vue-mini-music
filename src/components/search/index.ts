import { defineComponent } from '@vue-mini/core'

defineComponent({
  properties: {
    placeholder: {
      type: String,
      value: '请输入关键字',
    },
  },
  externalClasses: ['iconfont', 'icon-sousuo'],
})
