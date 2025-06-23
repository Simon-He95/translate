/**
 * DeepL Translation Service Tests
 * Tests the DeepL unofficial API via deeplx
 * 
 * Note: DeepL API often has rate limiting (429 errors)
 * These tests may fail due to service limitations
 */

import { describe, it, expect } from 'vitest'
import { fanyi as deeplxFanyi } from '../src/deeplx'

describe('DeepL Translation Service', () => {
  const deeplx = deeplxFanyi()

  it('should translate English to Chinese or handle rate limiting', async () => {
    try {
      const result = await deeplx('Hello', 'zh')
      console.log('DeepL EN->ZH:', result)
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    } catch (error) {
      const err = error as Error
      console.log('DeepL Error (expected due to rate limiting):', err.message)
      // 验证是 429 错误（速率限制）
      expect(err.message).toMatch(/429|Too Many Requests|Response code 429/)
    }
  }, 15000)

  it('should translate Chinese to English or handle rate limiting', async () => {
    try {
      const result = await deeplx('你好', 'en')
      console.log('DeepL ZH->EN:', result)
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    } catch (error) {
      const err = error as Error
      console.log('DeepL Error (expected due to rate limiting):', err.message)
      expect(err.message).toMatch(/429|Too Many Requests|Response code 429/)
    }
  }, 15000)

  it('should handle longer text or rate limiting', async () => {
    const longText = 'This is a longer text to test the DeepL translation service quality.'
    try {
      const result = await deeplx(longText, 'zh')
      console.log('DeepL Long Text:', result)
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    } catch (error) {
      const err = error as Error
      console.log('DeepL Error (expected due to rate limiting):', err.message)
      expect(err.message).toMatch(/429|Too Many Requests|Response code 429/)
    }
  }, 20000)

  it('should handle professional text or rate limiting', async () => {
    const professionalText = 'We are pleased to announce the launch of our new product.'
    try {
      const result = await deeplx(professionalText, 'zh')
      console.log('DeepL Professional:', result)
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    } catch (error) {
      const err = error as Error
      console.log('DeepL Error (expected due to rate limiting):', err.message)
      expect(err.message).toMatch(/429|Too Many Requests|Response code 429/)
    }
  }, 15000)

  it('should handle technical terms or rate limiting', async () => {
    const technicalTexts = [
      'API documentation',
      'Database connection',
      'User interface design',
      'Software development'
    ]
    
    for (const text of technicalTexts) {
      try {
        const result = await deeplx(text, 'zh')
        console.log(`DeepL "${text}" ->`, result)
        
        expect(result).toBeDefined()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      } catch (error) {
        const err = error as Error
        console.log(`DeepL Error for "${text}" (expected due to rate limiting):`, err.message)
        expect(err.message).toMatch(/429|Too Many Requests|Response code 429/)
      }
    }
  }, 40000)
})
