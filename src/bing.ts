import { hasChineseCharacters } from './utils'

const { translate } = require('bing-translate-api')

export function fanyi(cacheMap = new Map()) {
  return async (text: string): Promise<string> => {
    if (!text)
      return ''
    if (cacheMap.has(text))
      return cacheMap.get(text)

    const res = await translate(text, null, hasChineseCharacters(text) ? 'en' : 'zh-Hans')
    const result = res.translation
    cacheMap.set(text, result)
    return result
  }
}
