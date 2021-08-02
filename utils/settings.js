/** 配置项 */
/**
 * 需要兼容基础库到2.3.2！！！
 */

// 修改环境
function getEnv() {
  // 开发 develop 体验 trial 正式 release, 在手机端调试vconsole，调试模式貌似对console样式不支持，而且很多信息会丢失。
  return 'develop'
}

function envSetting() {
  const env = getEnv()
  console.log(`---------------当前环境：【${env}】---------------`)

  let appId = 'wxb47fd461c3fd00f5'
  let api = 'https://bip-qa.walmartmobile.cn/himapi'
  let apiPoint = 'https://aloha-qa.walmartmobile.cn'
  if (env === 'trial') {
    appId = 'wx7a6de25bce74d9c5'
    apiPoint = 'https://aloha-qa.walmartmobile.cn'
    api = 'https://bip-qa.walmartmobile.cn/himapi'
  } else if (env === 'release') {
    appId = 'wx7a6de25bce74d9c5'
    api = 'https://him.walmartmobile.cn/himapi'
    apiPoint = 'https://aloha.walmartmobile.cn'
  }
  const setting = {
    code: '0',
    errorCodes: {
      wxLoginErr: 1, // 微信登录失败回调函数传值
      apiLoginErr: 2 // 接口登录失败回调函数传值
    },
    appId,
    imageUrl: '../assets/list_things.png',
    appName: 'HIMAPI',
    appVersion: '1.3.0',
    envVersion: env,
    api,
    apiPoint
  }
  console.log('---------------配置信息：---->', setting)
  return setting
}


// 缓存的key name，统一管理
function storageKeyName () {
  return {
    dataStore: 'DATA_STORE', // 公共数据仓库
    token: 'TOKEN', // token
    scene: 'SCENE', // 场景值
    region: 'REGION', // 地区信息
    ll: 'LL', // 经纬度
    creditInfo: 'CREDIT_INFO', // 积分信息, 包括了手机号会员卡号等
    memberCard: "MEMBER_CARD",
    mobile: "MOBILE",
    storeId: 'STORE_ID', // 门店号
    userInfo: 'USER_INFO', // 用户信息
    userId: 'USER_ID', // 用户id
    loginInfo: 'LOGIN_INFO', // 登录信息，openid，token啥的
    deviceInfo: 'DEVICE_INFO', // 设备信息
    indexPageStartTime: 'INDEX_PAGE_START_TIME', // 首页停留开始时间
    bannerSubInfoList: 'BANNER_SUB_INFO_LIST', // banner图类型为4时，跳转详情页，需要的数据
    seckillData: 'SEC_KILL_DATA' // 秒杀活动数据
  }
}


module.exports = {
  env: getEnv(),
  settings: envSetting(),
  SKN: storageKeyName()
}