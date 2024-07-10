import { translate } from 'deeplx'
import { hasChineseCharacters } from './utils'

export function fanyi(cacheMap = new Map()) {
  return async (text: string): Promise<string> => {
    if (!text)
      return ''
    if (cacheMap.has(text))
      return cacheMap.get(text)

    // The target language
    const target = hasChineseCharacters(text) ? 'EN' : 'ZH'
    // Translates some text into Russian
    return await translate(text, target)
  }
}
