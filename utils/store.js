/** 公共数据 */
// 数据仓库
const storage = require('./storage')
const { SKN } = require('./settings')

function dataStore(state) {
  const data = storage.get(SKN.dataStore)
  this.state = { ...state, ...data}
  this.list = []
}

dataStore.prototype.set = function(key, value) {
  this.state[key] = value
  storage.set(SKN.dataStore, this.state)
  this.public()
}

dataStore.prototype.get = function(key) {
  return this.state[key]
}

dataStore.prototype.remove = function(key) {
  delete this.state[key]
  storage.set(SKN.dataStore, this.state)
  this.public()
}

dataStore.prototype.forEach = function(fn) {
    if (typeof fn !== 'function') {
      throw Error('【dataStore的forEach】必须传入一个函数')
    }
    Object.keys(this.state).forEach((key, index) => {
      fn(this.state[key], key, index)
    })
}

dataStore.prototype.clear = function() {
  this.state = {}
  storage.set(SKN.dataStore, this.state)
  this.public()
}

dataStore.prototype.public = function() {
  this.list.forEach(item => {
    item && item(this.state)
  })
}
dataStore.prototype.subscribe  = function(fn) {
  if (typeof fn === 'function') {
    this.list.push(fn)
  }
}

// 初始化数据
const initState = {
  isLogin: false, // 是否登录
  isMember: false, // 是否会员
  isIos: false, // 是否ios
  wxVersion7: false, // 微信版本是否大于7.0.0，自定义导航兼容
  avatar: '', // 头像
  userName: '',  // 用户名
  navHeight: 0 // 顶部导航高度
}

module.exports = new dataStore(initState)