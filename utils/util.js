/** 工具函数 */

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 检查数据类型
function checkType(data) {
  return Object.prototype.toString.call(data).slice(8, -1)
}

/**
 * 判断数据的有值性
 * @param {any} data 
 */
function truth(data) {
  return data != null && data !== ''
}

/**
 * 数字千分位
 * @param {number} number 需要转化的数字,如4455
 * @return {string} 返回一个字符类型带千分位的数字,得到4,455
 */
function thousandNumber(number) {
    if (typeof number !== 'number') {
      throw Error('thousandNumber：请传入一个number类型数据')
    }
    try {
      return number.toLocaleString('en-US')
    } catch (error) {
      return number
    }
}

// 是否空数组
function isEmptyObject(obj) {
  return !!Object.keys(obj).length
}

// 地址参数转对象
function urlToJson(url) {
  const params = decodeURIComponent(url).split('?')[1]
  if (!params) return {}
  try {
    return params.split('&').reduce((t, c) => {
      const [key, val] = c.split('=')
      const tru = t[key]
      // 如果有重复的key，转成数组形式
      if (tru) {
        // 第一次还不是数组的时候，先转数组
        if (checkType(tru) !== 'Array') {
          t[key] = [tru]
        }
        t[key].push(val)
      } else {
        t[key] = val
      }
      return t
    }, {})
  } catch (error) {
    return {}
  }
}

// 对象转url参数
function jsonToUrl(obj, prefix = '', flag = '&') {
  return Object.keys(obj).reduce((t, c) => {
    const val = obj[c]
    if (checkType(val) === 'Array') {
      val.forEach(item => {
        t += `${c}=${item}${flag}`
      })
    } else {
      t += `${c}=${val}${flag}`
    }
  }, prefix).slice(0, -1)
}

// 简单深拷贝
function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = checkType(source) === 'Array' ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function getWecomeTip() {
  const hour = new Date().getHours()
  console.log(hour, '时间')
  let str = ''
  if (0 < hour && hour <= 5) {
    str = '凌晨了'
  } else if (5 < hour && hour <= 11) {
    str = '早上好'
  } else if (11 < hour && hour <= 13) {
    str = '中午好'
  } else if (13 < hour && hour <= 18) {
    str = '下午好'
  } else {
    str = '晚上好'
  }
  return str
}

module.exports = {
  formatTime,
  checkType,
  truth,
  getUUID,
  thousandNumber,
  isEmptyObject,
  urlToJson,
  jsonToUrl,
  getWecomeTip,
  deepClone
}

