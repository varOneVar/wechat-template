function generateReqKey(config) {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

function cancelRequest() {
  return {
    add(config, requestTask) {
      const flag = generateReqKey(config)
      if (!this.requestPool) {
        this.requestPool = {}
      }
      this.requestPool[flag] = requestTask
    },
    has(config) {
      if (!this.requestPool) return false
      const flag = generateReqKey(config)
      return !!this.requestPool[flag]
    },
    remove(config) {
      const flag = generateReqKey(config)
      if (!this.requestPool) return
      const requestTask = this.requestPool[flag]
      if (requestTask) {
        // requestTask.abort && requestTask.abort()
        delete this.requestPool[flag]
      }
    }
  } 
}

module.exports = cancelRequest