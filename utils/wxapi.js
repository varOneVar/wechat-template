const utils = require('./new-utils')
const { checkType } = utils

// 更新版本
function updateWechat(str) {
  const updateManager = wx.getUpdateManager()
  updateManager.onCheckForUpdate(function(res) {
    // 请求完新版本信息的回调
    console.log("====>> onCheckForUpdate res: ")
    console.info(res)
  })
  updateManager.onUpdateReady(function() {
      wx.showModal({
          title: '更新提示',
          content: str || '有版本更新，请重启应用后使用',
          showCancel: false,
          success(res) {
              if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
              }
          }
      })
  })

  updateManager.onUpdateFailed(function() {
    // 新版本下载失败
    console.log('小程序更新失败')
  })
}

// 其实应该根据基础库版本来确定是不是要更新比较好
function caniuse(apiKeys, update = false) {
  const type = checkType(apiKeys)
  if (type !== 'String' && type !== 'Array') {
    throw Error('caniuse: 请传入字符串类型数据或者数组类型数据')
  }
  if (!apiKeys) return false

  let Arr = type === 'String' ? [apiKeys] : apiKeys
  try {
    // 如果有不支持的api，提示更新版本
    const nook = Arr.find(key => !wx.canIUse(key))
    if (nook) {
      console.log(`不支持api：${nook}`)
      if(update) {
        updateWechat()
      }
      return nook
    }
  } catch (error) {
    return false
  }
}

function currentPath() {
  // 获取路由栈，第一个是首页，最后一个是当前页
  const arr = getCurrentPages()
  const len = arr.length
  if (!len) return ''
  const item = arr[len -1]
  return item.route || item.__route__
}

module.exports = {
  updateWechat,
  currentPath,
  caniuse
}