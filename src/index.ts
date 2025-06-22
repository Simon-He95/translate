import { fanyi as bingFanyi } from './bing'
import { fanyi as deeplxFanyi } from './deeplx'
import { fanyi as googleFanyi } from './google'

const concurrentCounts = 3

function createLimitedCache(maxSize = 1000) {
  const cache = new Map()
  return {
    get: (key: string) => cache.get(key),
    set: (key: string, value: string) => {
      if (cache.size >= maxSize) {
        const oldestKey = cache.keys().next().value
        cache.delete(oldestKey)
      }
      cache.set(key, value)
    },
    has: (key: string) => cache.has(key),
    size: () => cache.size,
  }
}

function translateLoader(cacheMap = createLimitedCache()) {
  const google = googleFanyi()
  const bing = bingFanyi()
  const deeplx = deeplxFanyi()

  return (texts: string | string[], to?: 'en' | 'zh'): Promise<string[]> => new Promise((resolve, reject) => {
    if (typeof texts === 'string')
      texts = [texts]
    // 过滤掉空字符串和只包含空白字符的字符串
    texts = texts.filter(text => text && text.trim().length > 0)

    // 如果过滤后没有有效文本，直接返回空数组
    if (texts.length === 0) {
      resolve([])
      return
    }

    const results: string[] = []
    const status: { fails: number, status: boolean }[] = []
    let isBreak = false

    // 初始化status数组
    for (let i = 0; i < texts.length; i++) {
      status[i] = { fails: 0, status: false }
    }

    const resolver = (res: string, i: number) => {
      if (isBreak)
        return
      results[i] = res
      const cacheKey = `${texts[i]}:${to || 'auto'}`
      cacheMap.set(cacheKey, res)

      status[i].status = true

      // 检查是否所有任务都完成了
      if (status.every(s => s.status)) {
        resolve(results)
      }
    }
    const rejecter = (i: number) => {
      if (isBreak)
        return

      status[i].fails += 1

      if (status[i].fails >= concurrentCounts) {
        status[i].status = false

        if (status.some(s => s.fails >= concurrentCounts && !s.status)) {
          reject(new Error('Request failed'))
          isBreak = true
        }
      }
    }
    for (let i = 0; i < texts.length; i++) {
      if (isBreak)
        return
      const text = texts[i]
      if (cacheMap.has(`${text}:${to || 'auto'}`)) {
        resolver(cacheMap.get(`${text}:${to || 'auto'}`), i)
        continue
      }
      // 添加超时处理和错误详情
      Promise.any([
        google(text, to),
        bing(text, to),
        deeplx(text, to),
      ]).then((r: any) => resolver(r, i)).catch(() => rejecter(i))
    }
  })
}

export default translateLoader
