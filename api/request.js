/** 请求 */
const { isExternal } = require('../validate')
const { settings, SKN } =  require('../settings')
const { jsonToUrl }  = require('../new-utils')
const cancelRequest = require('./cancel')
const storage = require('../storage')
const { loginHandler } = require('../../api/login')
const store = require('../store')
const { currentPath } = require('../wxapi')
const Message = require('../message')
const cancelRequestInstance = cancelRequest()


// 小程序参数都在data里，不管get还是post
function axios(options = {}) {
  const {
    baseUrl,
    timeout,
    requestHandler,
    responseHandler,
    ..._options
  } = options
  return function service(url, config) {
    // 这里做请求拦截
    return new Promise((resolve, reject) => {
      const requestUrl = isExternal(url) ? url : baseUrl + url
      const combo = {
        header: {
          'Content-Type': 'application/json'
        },
        url: requestUrl,
        ..._options, ...config
      }

      const realConfig = typeof requestHandler === 'function'
        ? requestHandler(combo)
        : combo;
      if (cancelRequestInstance.has(realConfig)) {
        console.log('有的')
        cancelRequestInstance.remove(realConfig)
        return
      }
      if (realConfig.noCancel) {
        delete realConfig.noCancel
      } else {
        cancelRequestInstance.add(realConfig, 1)
      }
      if (!realConfig.noLoading) {
        wx.showLoading({ 
          title: '加载中...',
          mask: true
        });
      } else {
        delete realConfig.noLoading
      }
 
      wx.request({
        url: requestUrl,
        timeout,
        ...realConfig,
        success: (result) => {
          cancelRequestInstance.remove(realConfig)
          if (typeof requestHandler === 'function') {
            const res = responseHandler(result, realConfig)
            resolve(res)
          } else {
            resolve(result)
          }
        },
        fail: (res) => {
          reject(res)
        },
        complete() {
          // 关闭弹窗
          wx.hideLoading()
        }
      })
      // if (realConfig.data && realConfig.noCancel) {
      //   delete realConfig.noCancel
      // } else {
      //   cancelRequestInstance.remove(realConfig)
      //   cancelRequestInstance.add(realConfig, realConfig.cancel)
      // }
    })
  }
}

const server = axios({
  baseUrl: settings.api,
  timeout: 5 * 60 * 1000,
  requestHandler(config) { // 请求拦截
    const token = storage.get(SKN.token)
    if (token) {
      config.header['token-himapi'] = token
      config.header['cookie'] = token
    }
    if (config.method.toUpperCase() === 'POST' && config.extraInfo) {
      delete config.extraInfo
      const data = config.data
      config.data = {
        "appName": settings.appName,
        "format": '',
        "sign": "",
        "param": data,
        "source": settings.appName,
        "timestamp": Date.now(),
        "version": settings.appVersion
      }
    }
    // 必须返回config
    return config
  },
  responseHandler(response, config) { // 响应拦截
    const { data: { code, message } } = response
    if (code !== settings.code && !config.noToast) {
      console.log('提示', config.url)
      if (['-10282', '-10283', '-10284', '-10285', '-10288'].includes(code)) {
        console.log('config.noRelogin', config.noRelogin)
        if (!config.noRelogin) {
          Message.toast('登录信息失效，请重新登录')
          storage.clear()
          store.clear()
          if (!currentPath().includes('index/index')) {
            wx.reLaunch({
              url: '../../pages/index/index'
            })
          } else {
            loginHandler()
          }
        }
      } else {
        const title = message && message.length > 16 ? '请求异常！' : message
        Message.toast(title)
      }
    }
    // 必须有返回值
    return response
  }
})
const __post = (url, data = {}, config) => server(url, { ...config, method: 'POST', data })
const __get = (url, data = {}, config) => server(url, { ...config, method: 'GET', data })
 // form表单请求
 const __postEncode = (url, data = {}, config) => {
  return server(url, {
    ...config,
    method: 'POST',
    data: jsonToUrl(data),
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

module.exports = {
  server,
  __post,
  __get,
  __postEncode
}