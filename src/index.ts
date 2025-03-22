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
    texts = texts.filter(Boolean)
    const results: string[] = []
    const status: { fails: number, status: boolean }[] = []
    let isBreak = false
    const resolver = (res: string, i: number) => {
      if (isBreak)
        return
      results[i] = res
      const cacheKey = `${texts[i]}:${to || 'auto'}`
      cacheMap.set(cacheKey, res)
      if (!status[i]) {
        status[i] = {
          fails: 0,
          status: true,
        }
      }
      else if (!status[i].status) {
        status[i].status = true
      }
      else {
        return
      }

      if (status.every(s => s.status))
        resolve(results)
    }
    const rejecter = (i: number) => {
      if (!status[i]) {
        status[i] = {
          fails: 1,
          status: false,
        }
      }
      else if (!status[i].status) {
        status[i] = {
          fails: status[i].fails + 1,
          status: false,
        }
      }
      else {
        return
      }

      if (status.some(s => s.fails === concurrentCounts && !s.status)) {
        reject(new Error('Request failed'))
        isBreak = true
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
