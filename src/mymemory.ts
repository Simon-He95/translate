/**
 * MyMemory Translated API
 * Free tier: 1000 requests/day
 * No API key required
 */

interface MyMemoryResponse {
  responseData: {
    translatedText: string
  }
  responseStatus: number
  responseDetails: string
}

export function fanyi() {
  return async (text: string, to: string = 'en', from: string = 'auto'): Promise<{ text: string }> => {
    try {
      // MyMemory doesn't support 'auto', so we need to detect or use a default
      const sourceLanguage = from === 'auto' ? 'en' : from
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${to}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TranslateBot/1.0)',
        },
      })

      if (!response.ok) {
        throw new Error(`MyMemory API error: ${response.status}`)
      }

      const data = await response.json() as MyMemoryResponse

      if (data.responseStatus !== 200) {
        throw new Error(`MyMemory translation failed: ${data.responseDetails}`)
      }

      return {
        text: data.responseData.translatedText,
      }
    }
    catch (error) {
      throw new Error(`MyMemory translation error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
