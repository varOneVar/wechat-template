Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    zIndex: {
      type: Number,
      value: '2000'
    },
    type: {
      type: String,
      value: 'small'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    stopHandler() {
      console.log('弹窗阻止滚动')
    },
    closeHandler() {
      this.triggerEvent('close')
    }
  }
})
