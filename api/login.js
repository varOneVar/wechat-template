/** 登录相关 */
const { settings, SKN } = require('../utils/settings')
const storage = require('../utils/storage')
const log = require('../utils/log')
const Message = require('../utils/message')

// 检查session，失败会调用登录
function checkSession(loginFailCallback) {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        log.success('检查session：登录状态正常！')
        resolve(1)
      },
      fail(e) {
        log.error('检查session：过期或未登录，重新执行登录！', e)
        loginHandler(loginFailCallback).then(isOk => {
          reject(isOk)
        })
      }
    })
  })
}

function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        resolve(res)
      },
      fail(e) {
        reject(e)
      }
    })
  })
}

// 登录函数
function loginHandler(loginFailCallback) {
  return new Promise((relsove) => {
    wxLogin().then((logRes) => {
      log.success('执行微信登录：登录成功！', logRes)
      if (logRes.code) {
        wx.request({
          url: `${settings.api}/auth/login`,
          timeout: 5 * 60 * 1000,
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            param: {
              appId: settings.appId,
              code: logRes.code, 
              state: 31
            }
          },
          success({ data: { code, result }}) {
            log.info('接口登录结果', code, result)
            if (code === settings.code) {
              log.success('执行接口登录：登录成功！', result)
              storage.set(SKN.userId, result.data.id)
              storage.set(SKN.token, result.data.token)
              storage.set(SKN.loginInfo, result.data)
              relsove(true)
            } else {
              typeof loginFailCallback === 'function' && loginFailCallback(settings.errorCodes.apiLoginErr)
              Message.toast('接口登录失败，请重新登录!!')
              relsove(false)
            }
          },
          fail(e) {
            log.error('【登录】', e)
            relsove(false)
          }
        })
      } else {
        typeof loginFailCallback === 'function' && loginFailCallback(settings.errorCodes.wxLoginErr)
        Message.toast('获取微信登录code失败!!')
        relsove(false)
      }
    }).catch(error => {
      log.error('执行微信登录：登录失败！', error)
      Message.toast('微信登录失败，请重新登录!!')
      relsove(false)
    })
  })
}

// 检查session是否过期，还会检查是否有userId
function checkSessionAndLogin(loginFailCallback) {
  return new Promise((resolve, reject) => {
    checkSession(loginFailCallback).then(() => {
      const userId = storage.get(SKN.userId)
      if (!userId) {
        loginHandler(loginFailCallback).then(isOk => {
          resolve(isOk)
        })
      }
      resolve(true)
    }).catch((error) => {
      log.error('【checkSessionAndLogin接口】', error)
      reject(error)
    })
  })
}

module.exports = {
  checkSession,
  checkSessionAndLogin,
  wxLogin,
  loginHandler
}