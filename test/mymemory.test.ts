/**
 * MyMemory Translation Service Tests
 * Tests the MyMemory free translation API
 */

import { describe, it, expect } from 'vitest'
import { fanyi as mymemoryFanyi } from '../src/mymemory'

describe('MyMemory Translation Service', () => {
  const mymemory = mymemoryFanyi()

  it('should translate English to Chinese', async () => {
    const result = await mymemory('Hello', 'zh', 'en')
    console.log('MyMemory EN->ZH:', result.text)
    
    expect(result).toBeDefined()
    expect(result.text).toBeDefined()
    expect(typeof result.text).toBe('string')
    expect(result.text.length).toBeGreaterThan(0)
  }, 10000)

  it('should translate Chinese to English', async () => {
    const result = await mymemory('你好', 'en', 'zh')
    console.log('MyMemory ZH->EN:', result.text)
    
    expect(result).toBeDefined()
    expect(result.text).toBeDefined()
    expect(typeof result.text).toBe('string')
    expect(result.text.length).toBeGreaterThan(0)
  }, 10000)

  it('should handle auto language detection', async () => {
    const result = await mymemory('Hello world', 'zh', 'auto')
    console.log('MyMemory Auto->ZH:', result.text)
    
    expect(result).toBeDefined()
    expect(result.text).toBeDefined()
    expect(typeof result.text).toBe('string')
    expect(result.text.length).toBeGreaterThan(0)
  }, 10000)

  it('should handle longer text', async () => {
    const longText = 'This is a longer text to test the translation service capabilities.'
    const result = await mymemory(longText, 'zh', 'en')
    console.log('MyMemory Long Text:', result.text)
    
    expect(result).toBeDefined()
    expect(result.text).toBeDefined()
    expect(typeof result.text).toBe('string')
    expect(result.text.length).toBeGreaterThan(0)
  }, 15000)

  it('should handle special characters', async () => {
    const specialText = 'Hello! How are you? 123 & @#$'
    const result = await mymemory(specialText, 'zh', 'en')
    console.log('MyMemory Special Chars:', result.text)
    
    expect(result).toBeDefined()
    expect(result.text).toBeDefined()
    expect(typeof result.text).toBe('string')
    expect(result.text.length).toBeGreaterThan(0)
  }, 10000)
})
