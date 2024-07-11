import { hasChineseCharacters } from './utils'

const translate = require('google-translate-api')

export function fanyi(cacheMap = new Map()) {
  return async (text: string, to?: 'en' | 'zh'): Promise<string> => {
    if (!text)
      return ''
    if (cacheMap.has(text))
      return cacheMap.get(text)

    // The target language
    const target = to
      ? to === 'en' ? 'en' : 'zh-CN'
      : hasChineseCharacters(text) ? 'en' : 'zh-CN'

    const result = await translate(text, { to: target })
    cacheMap.set(text, result.text)

    return result
  }
}
