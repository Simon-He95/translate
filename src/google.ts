import { hasChineseCharacters } from './utils'

const translate = require('google-translate-api')

export function fanyi(cacheMap = new Map()) {
  return async (text: string): Promise<string> => {
    if (!text)
      return ''
    if (cacheMap.has(text))
      return cacheMap.get(text)

    // The target language
    const target = hasChineseCharacters(text) ? 'en' : 'zh-CN'
    // Translates some text into Russian
    return await translate(text, { to: target })
  }
}
