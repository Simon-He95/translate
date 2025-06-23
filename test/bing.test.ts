/**
 * Bing Translate Service Tests
 * Tests the Bing Translate unofficial API
 */

import { describe, it, expect } from 'vitest'
import { fanyi as bingFanyi } from '../src/bing'

describe('Bing Translate Service', () => {
  const bing = bingFanyi()

  it('should translate English to Chinese', async () => {
    const result = await bing('Hello', 'zh')
    console.log('Bing EN->ZH:', result)
    
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  }, 10000)

  it('should translate Chinese to English', async () => {
    const result = await bing('你好', 'en')
    console.log('Bing ZH->EN:', result)
    
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  }, 10000)

  it('should handle longer text', async () => {
    const longText = 'This is a longer text to test the Bing translation service capabilities.'
    const result = await bing(longText, 'zh')
    console.log('Bing Long Text:', result)
    
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  }, 15000)

  it('should handle special characters', async () => {
    const specialText = 'Hello! How are you? @#$ 123'
    const result = await bing(specialText, 'zh')
    console.log('Bing Special Chars:', result)
    
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  }, 10000)

  it('should handle business phrases', async () => {
    const phrases = [
      'Welcome to our company',
      'Please contact us',
      'Thank you for your service',
      'Have a great day'
    ]
    
    for (const phrase of phrases) {
      const result = await bing(phrase, 'zh')
      console.log(`Bing "${phrase}" ->`, result)
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    }
  }, 30000)
})
