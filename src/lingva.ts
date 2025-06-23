/**
 * Lingva Translate API
 * Free Google Translate alternative
 * No API key required
 *
 * Note: lingva.ml often returns 403 errors
 * Try alternative instances if main one fails
 */

interface LingvaResponse {
  translation: string
}

// Alternative Lingva instances to try
const LINGVA_INSTANCES = [
  'https://lingva.garudalinux.org',
  'https://translate.plausibility.cloud',
  'https://lingva.lunar.icu',
  'https://lingva.ml', // Original (often blocked)
]

export function fanyi(apiUrl?: string) {
  return async (text: string, to: string = 'en', from: string = 'auto'): Promise<{ text: string }> => {
    const instancesToTry = apiUrl ? [apiUrl] : LINGVA_INSTANCES

    for (const instance of instancesToTry) {
      try {
        const url = `${instance}/api/v1/${from}/${to}/${encodeURIComponent(text)}`

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; TranslateBot/1.0)',
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout
        })

        if (!response.ok) {
          throw new Error(`Lingva API error: ${response.status} from ${instance}`)
        }

        const data = await response.json() as LingvaResponse

        if (!data.translation) {
          throw new Error('Empty translation response')
        }

        return {
          text: data.translation,
        }
      }
      catch (error) {
        console.warn(`Lingva instance ${instance} failed:`, error instanceof Error ? error.message : 'Unknown error')
        // Continue to next instance
        continue
      }
    }

    // If all instances failed
    throw new Error(`Lingva translation error: All instances failed. Tried: ${instancesToTry.join(', ')}`)
  }
}
