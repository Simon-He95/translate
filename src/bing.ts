import { hasChineseCharacters } from './utils'

const { translate } = require('bing-translate-api')

export function fanyi(cacheMap = new Map()) {
  return async (text: string, to?: 'en' | 'zh'): Promise<string> => {
    if (!text)
      return ''
    if (cacheMap.has(text))
      return cacheMap.get(text)

    const target = to
      ? to === 'en' ? 'en' : 'zh-Hans'
      : hasChineseCharacters(text) ? 'en' : 'zh-Hans'

    const result = (await translate(text, null, target)).translation
    cacheMap.set(text, result)

    return result
  }
}
