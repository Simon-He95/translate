import { translate } from 'deeplx'
import { hasChineseCharacters } from './utils'

export function fanyi() {
  return async (text: string, to?: 'en' | 'zh'): Promise<string> => {
    const target = to
      ? to === 'en' ? 'EN' : 'ZH'
      : hasChineseCharacters(text) ? 'EN' : 'ZH'

    const result = await translate(text, target)

    return result
  }
}
