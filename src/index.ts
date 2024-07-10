import { fanyi as bingFanyi } from './bing'
import { fanyi as deeplxFanyi } from './deeplx'
import { fanyi as googleFanyi } from './google'

function translateLoader(cacheMap = new Map()) {
  const google = googleFanyi(cacheMap)
  const bing = bingFanyi(cacheMap)
  const deeplx = deeplxFanyi(cacheMap)
  return (text: string) => new Promise((resolve, reject) => {
    let failCount = 0
    google(text).then(resolve).catch(() => {
      failCount++
      if (failCount === 3)
        reject(new Error('Request failed'))
    })
    bing(text).then(resolve).catch(() => {
      failCount++
      if (failCount === 3)
        reject(new Error('Request failed'))
    })
    deeplx(text).then(resolve).catch(() => {
      failCount++
      if (failCount === 3)
        reject(new Error('Request failed'))
    })
  })
}

export default translateLoader
