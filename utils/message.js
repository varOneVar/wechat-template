function message() {
  return {
    toast(config) {
      console.log('【config】', config)
      if (!config) return
      if (typeof config === 'string') {
        wx.showToast({
          title: config,
          icon: 'none',
          mask: true,
          duration: 2500
        })
        return
      } else {
        console.log(123, config)
        const { title, icon = 'none', duration = 2500, mask = true, ...options } = config
        wx.showToast({
          title: icon !== 'none' ? title && title.slice(0, 7) : title,
          icon,
          mask,
          duration,
          ...options
        })
        // 如果不自动关闭，返回关闭函数，手动关闭
        if (duration === 0) {
          return () => {
            wx.hideToast()
          }
        }
      }
    },
    modal({ confirmHandler, cancelHandler, ...options }) {
      wx.showModal({
        ...options,
        success (res) {
          if (res.confirm) {
            if (typeof confirmHandler === 'function') {
              confirmHandler()
            }
          } else if (res.cancel) {
            if (typeof cancelHandler === 'function') {
              cancelHandler()
            }
          }
        },
        fail(e) {
          if (e.errMsg === 'fail cancel') {
            if (typeof cancelHandler === 'function') {
              cancelHandler()
            }
          }
        }
      })
    },
    loading({ title = '加载中...', ...options}) {
      wx.showLoading({
        ...options,
        title
      })
      return () => {
        wx.hideLoading()
      }
    }
  }
}

module.exports = message()