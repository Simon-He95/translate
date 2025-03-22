import { hasChineseCharacters } from './utils'

// eslint-disable-next-line perfectionist/sort-imports
const { translate } = require('bing-translate-api')

export function fanyi() {
  return async (text: string, to?: 'en' | 'zh'): Promise<string> => {
    const target = to
      ? to === 'en' ? 'en' : 'zh-Hans'
      : hasChineseCharacters(text) ? 'en' : 'zh-Hans'

    const result = (await translate(text, null, target)).translation

    return result
  }
}
