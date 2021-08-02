Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnStyle: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    caniuseUserInfoProfile: false
  },
  lifetimes: {
    attached() {
      if (typeof wx.getUserProfile === 'function') {
        this.setData({
          caniuseUserInfoProfile: true
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfoCallBack(e) {
      console.log(e,111)
      if (e.detail.errMsg == 'getUserInfo:ok') {
        this.triggerEvent('getUserInfo', e)
      }
    },
    getUserInfoBtnNew() {
      console.log(111)
      wx.getUserProfile({
        lang: 'zh_CN',
        desc: '提供优质体验及服务',
        success: (e) => {
          this.triggerEvent('getUserInfo', e)
        },
        fail(e) {
          console.error(e)
        }
      })
    }
  }
})
