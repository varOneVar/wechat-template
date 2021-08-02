/** 日志 */
// 可以加入wx.getRealtimeLogManager对输出日志上报
// 对日志统一处理，便于开发环境与测试环境一键开启/关闭日志输出，以便于以后数据上报
const { env } = require('./settings')
const { currentPath } = require('./wxapi')
function log() {
    return {
      log(...args) {
        if (env === 'vconsole' || env === 'trial') {
          console.log(args)
          return
        }
        if (env === 'release') return
        console.log('%c%s', 'background:#999;color:#fff;padding:4px 10px;border-radius:4px;', `【普通:${currentPath()}】`, ...args)
      },
      info(...args) {
        if (env === 'vconsole' || env === 'trial') {
          console.log(args)
          return
        }
        if (env === 'release') return
        this.log(...args)
      },
      error(...args) {
        if (env === 'vconsole' || env === 'trial') {
          console.log(args)
          return
        }
        if (env === 'release') return
        console.log('%c%s', 'background:#f44336;color:#fff;padding:4px 10px;border-radius:4px;', `【异常:${currentPath()}】`, ...args)
      },
      success(...args) {
        if (env === 'vconsole' || env === 'trial') {
          console.log(args)
          return
        }
        if (env === 'release') return
        console.log('%c%s', 'background:rgb(7,193,76);color:#fff;padding:4px 10px;', `【成功:${currentPath()}】`, ...args)
      },
      importance(...args) {
        if (env === 'vconsole' || env === 'trial') {
          console.log(args)
          return
        }
        if (env === 'release') return
        console.log('%c%s', 'background:#7710ce;color:#fff;padding:4px 10px;', `【重要:${currentPath()}】`, ...args)
      }
    }
}

module.exports = log()