import { translate } from 'deeplx'
import { hasChineseCharacters } from './utils'

export function fanyi(cacheMap = new Map()) {
  return async (text: string, to?: 'en' | 'zh'): Promise<string> => {
    if (!text)
      return ''
    if (cacheMap.has(text))
      return cacheMap.get(text)

    const target = to
      ? to === 'en' ? 'EN' : 'ZH'
      : hasChineseCharacters(text) ? 'EN' : 'ZH'

    const result = await translate(text, target)
    cacheMap.set(text, result)

    return result
  }
}
