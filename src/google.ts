import { hasChineseCharacters } from './utils'

// eslint-disable-next-line perfectionist/sort-imports
const translate = require('google-translate-api')

export function fanyi() {
  return async (text: string, to?: 'en' | 'zh'): Promise<string> => {
    // The target language
    const target = to
      ? to === 'en' ? 'en' : 'zh-CN'
      : hasChineseCharacters(text) ? 'en' : 'zh-CN'

    const result = await translate(text, { to: target })

    return result
  }
}
