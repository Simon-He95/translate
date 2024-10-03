import { fanyi as bingFanyi } from './bing'
import { fanyi as deeplxFanyi } from './deeplx'
import { fanyi as googleFanyi } from './google'

const concurrentCounts = 3

function translateLoader(cacheMap = new Map()) {
  const google = googleFanyi(cacheMap)
  const bing = bingFanyi(cacheMap)
  const deeplx = deeplxFanyi(cacheMap)

  return (texts: string | string[], to?: 'en' | 'zh'): Promise<string[]> => new Promise((resolve, reject) => {
    if (typeof texts === 'string')
      texts = [texts]
    const results: string[] = []
    const status: { counts: number, status: boolean }[] = []
    let isBreak = false
    const resolver = (res: string, i: number) => {
      if (isBreak)
        return
      results[i] = res
      if (!status[i]) {
        status[i] = {
          counts: 0,
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
          counts: 1,
          status: false,
        }
      }
      else if (!status[i].status) {
        status[i] = {
          counts: status[i].counts + 1,
          status: false,
        }
      }
      else {
        return
      }

      if (status.some(s => s.counts === concurrentCounts && !s.status)) {
        reject(new Error('Request failed'))
        isBreak = true
      }
    }
    for (let i = 0; i < texts.length; i++) {
      if (isBreak)
        break
      const text = texts[i]
      Promise.any([
        google(text, to),
        bing(text, to),
        deeplx(text),
      ]).then(r => resolver(r, i)).catch(() => rejecter(i))
    }
  })
}

export default translateLoader
