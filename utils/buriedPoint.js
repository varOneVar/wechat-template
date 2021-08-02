/** 埋点 */
const { settings, SKN } = require('./settings')
const { __post } = require('../api/request')
const storage = require('./storage')
const log = require('./log')
const { formatTimeNew } = require('./util')
const { currentPath } = require('./wxapi')

// 埋点系统，埋点数据比较多
function buriedPointSystem() {
  return {
    eventTraces: [],
    add (obj) {
      const userId = storage.get(SKN.userId) || ''
      // 固定参数
      const commonObj = {
        storeId: '',
        userId,
        page: currentPath(),
        time: formatTimeNew(new Date(), 'yyyy-MM-dd hh:mm:ss') + '.000'
      }
      // 去掉重复数据
      this.remove(obj.eventId)
      this.eventTraces.push({ ...commonObj, ...obj })
      return this.eventTraces
    },
    remove(eventId) {
      const idx = this.eventTraces.findIndex(v => v.eventId === eventId)
      if (idx > -1) {
        this.eventTraces.splice(idx, 1)
      }
      return this.eventTraces
    },
    clear() {
      this.eventTraces = []
      return this.eventTraces
    },
    get() {
      return this.eventTraces
    }
  }
}

// 埋点函数
function buriedPoint(eventTraces, successfn) {
  return new Promise((resolve, reject) => {
    __post(`${settings.apiPoint}/monitor-service/buriedPoint/insertParam`, {
      eventTraces
    }, {
      extraInfo: true,
      noToast: true,
      noLoading: true
    }).then(({ data: { code }}) => {
      if (code !== settings.code) {
        log.info('【数据上报不成功，不知道咋整】')
        reject('fail')
      } else {
        typeof successfn === 'function' && successfn()
        resolve('success')
      }
    }).catch(error => {
      log.error('【埋点接口】', error)
      reject('fail')
    })
  })
}

module.exports = {
  buriedPointSystem,
  buriedPoint
}