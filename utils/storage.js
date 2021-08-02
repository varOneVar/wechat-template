/** 缓存 */

const log = require('./log')
const { SKN } = require('./settings')

function storage() {
  const addPrefix = (KEY) => `integal_${KEY}`
  return {
    set(key, value) {
      try {
        wx.setStorageSync(addPrefix(key), value)
      } catch (error) {
        log.error(`添加缓存【${key}】失败`, error)
      }
    },
    get(key, def) {
      try {
        return wx.getStorageSync(addPrefix(key))
      } catch (error) {
        log.error(`获取缓存【${key}】失败，返回自定义默认返回值`, error)
        return def
      }
    },
    remove(key) {
      try {
        wx.removeStorageSync(addPrefix(key))
      } catch (error) {
        log.error(`删除缓存【${key}】失败`, error)
      }
    },
    clear() {
      try {
        // 将所有配置的Key的缓存清理，而不是全部缓存，免得影响主包的缓存
        Object.keys(SKN).forEach(KEY => {
          this.remove(KEY)
        })
      } catch (error) {
        log.error('清空缓存失败', error)
      }
    }
  }
}

module.exports = storage()